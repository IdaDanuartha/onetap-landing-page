import { NextResponse, after } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { sendWhatsApp, getWhatsAppStatus } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Use a global lock map to prevent identical concurrent requests across the same worker
const globalForLocks = globalThis as unknown as { attendanceLocks: Map<string, number> };
if (!globalForLocks.attendanceLocks) {
  globalForLocks.attendanceLocks = new Map<string, number>();
}
const RATE_LIMIT_MS = 60_000;

// GET /api/attendance/[token] - Health check
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  return NextResponse.json({ message: `Token ${token} is active and ready for POST.` });
}

// POST /api/attendance/[token]
export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Verify user is logged in
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        error: 'Akses ditolak',
        message: 'Hanya Guru/Admin yang sudah login yang dapat mencatat kehadiran.'
      }, { status: 401 });
    }

    // Rate limiting
    const now = Date.now();
    const lastTappedTime = globalForLocks.attendanceLocks.get(token);
    if (lastTappedTime && now - lastTappedTime < RATE_LIMIT_MS) {
      return NextResponse.json(
        { error: 'Terlalu cepat. Tunggu sebentar sebelum tap lagi.' },
        { status: 429 }
      );
    }
    globalForLocks.attendanceLocks.set(token, now);


    const { data: tag, error: tagSelectError } = await supabaseAdmin
      .from('attendance_tags')
      .select('*')
      .eq('token', token)
      .maybeSingle();

    if (tagSelectError) {
      console.error('[attendance/token] tag selection error:', tagSelectError);
      return NextResponse.json({
        error: 'Database error (Selection)',
        message: tagSelectError.message,
        code: tagSelectError.code
      }, { status: 500 });
    }

    if (!tag) {
      return NextResponse.json({ error: 'Tag Tidak Terdaftar' }, { status: 404 });
    }

    if (!tag.is_active) {
      return NextResponse.json({
        error: 'Siswa Nonaktif',
        message: 'Kartu/Siswa ini dinonaktifkan.',
        studentName: tag.student_name,
        className: tag.class_name,
        inactive: true
      }, { status: 403 });
    }

    // Fetch the tag creator's custom WhatsApp token and template from users_profile
    const { data: creatorProfile, error: creatorProfileError } = await supabaseAdmin
      .from('users_profile')
      .select('whatsapp_token, whatsapp_template')
      .eq('id', tag.created_by)
      .maybeSingle();

    if (creatorProfileError) {
      console.warn('[attendance/token] Warning: Failed to fetch tag creator profile:', creatorProfileError);
    }

    // Check if student already attended today (prevent duplicates)
    // Use Asia/Jakarta timezone for "today" boundaries
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const parts = formatter.formatToParts(new Date());
    const year = parts.find(p => p.type === 'year')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const day = parts.find(p => p.type === 'day')?.value;

    const todayJakarta = `${year}-${month}-${day}`;
    const gte = `${todayJakarta}T00:00:00+07:00`;
    const lte = `${todayJakarta}T23:59:59+07:00`;

    const { data: existingLogs, error: checkError } = await supabaseAdmin
      .from('attendance_logs')
      .select('id, tapped_at')
      .eq('token', token)
      .gte('tapped_at', gte)
      .lte('tapped_at', lte)
      .limit(1);

    if (checkError) {
      console.error('[attendance/token] duplicate check error:', checkError);
    }

    if (existingLogs && existingLogs.length > 0) {
      return NextResponse.json({
        error: 'Sudah Absen',
        message: 'Siswa sudah tercatat hadir hari ini.',
        studentName: tag.student_name,
        className: tag.class_name,
        alreadyLogged: true
      }, { status: 400 });
    }

    const tappedAt = new Date();

    // Insert attendance log
    const { data: log, error: logError } = await supabaseAdmin
      .from('attendance_logs')
      .insert({
        token,
        student_name: tag.student_name,
        class_name: tag.class_name,
        subject: tag.subject,
        created_by: tag.created_by,
        tapped_at: tappedAt.toISOString(),
        wa_sent: false,
      })
      .select('id')
      .maybeSingle();

    if (logError) {
      console.error('[attendance/token] log insertion error:', logError);
      return NextResponse.json({
        error: 'Database error (Insertion)',
        message: logError.message,
        code: logError.code
      }, { status: 500 });
    }

    if (!log) {
      console.error('[attendance/token] Failed to create log - no data returned');
      throw new Error('Gagal mencatat log kehadiran');
    }

    // Format date/time in Indonesian locale
    const date = tappedAt.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    });
    const time = tappedAt.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    });

    const defaultTemplate = '✅ *Presensi Kehadiran*\n\nSiswa *{student_name}* hadir dalam kelas *{class_name}*\n📅 {date}\n🕒 {time} WIB';
    const template = creatorProfile?.whatsapp_template || (tag.message_template as string) || defaultTemplate;

    const message = template
      .replace(/{student_name}/g, tag.student_name || 'Siswa')
      .replace(/{class_name}/g, tag.class_name || '-')
      .replace(/{subject}/g, tag.subject ?? '-')
      .replace(/{school_name}/g, tag.school_name || 'OneTap School')
      .replace(/{date}/g, date)
      .replace(/{time}/g, time);

    // Send WA via configured gateway in the background (non-blocking)
    const sendWABackground = async () => {
      let waResult: { success: boolean; error?: string } = { success: false, error: 'Not attempted' };
      const customToken = creatorProfile?.whatsapp_token?.trim();

      if (!customToken) {
        waResult = { success: false, error: 'WhatsApp belum dikonfigurasi di Pengaturan' };
      } else {
        try {
          // Check if device is connected first
          const status = await getWhatsAppStatus(customToken);
          if (!status.isConnected) {
            waResult = { success: false, error: `WhatsApp tidak terhubung (Status: ${status.deviceStatus})` };
          } else {
            waResult = await sendWhatsApp({
              target: tag.teacher_phone,
              message,
              token: customToken
            });
          }
        } catch (waErr: any) {
          console.error('[attendance/token] WhatsApp send error in background:', waErr);
          waResult = { success: false, error: waErr.message || String(waErr) };
        }
      }

      // Update log with WA send status
      const { error: updateError } = await supabaseAdmin
        .from('attendance_logs')
        .update({
          wa_sent: waResult.success,
          wa_error: waResult.success ? null : waResult.error,
        })
        .eq('id', log.id);

      if (updateError) {
        console.error('[attendance/token] log update error in background:', updateError);
      }
    };

    // Trigger in the background reliably using next/server after()
    after(async () => {
      try {
        await sendWABackground();
      } catch (err) {
        console.error('[attendance/token] Background task error:', err);
      }
    });


    return NextResponse.json({
      success: true,
      studentName: tag.student_name,
      className: tag.class_name,
      subject: tag.subject ?? null,
      date,
      time,
      waSent: true,
      waError: null,
    });
  } catch (err: any) {
    console.error('[attendance/token] Final catch:', err);
    return NextResponse.json({
      error: 'Internal error',
      message: err.message || String(err),
      details: err.details || null
    }, { status: 500 });
  }
}
