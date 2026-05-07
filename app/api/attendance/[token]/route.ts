import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { sendWhatsApp } from '@/lib/whatsapp';

const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Simple in-memory rate limiter: max 1 attendance per token per 60s
const lastTapped: Record<string, number> = {};
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

    // Rate limiting
    const now = Date.now();
    if (lastTapped[token] && now - lastTapped[token] < RATE_LIMIT_MS) {
      return NextResponse.json(
        { error: 'Terlalu cepat. Tunggu sebentar sebelum tap lagi.' },
        { status: 429 }
      );
    }
    lastTapped[token] = now;


    const { data: tag, error: tagSelectError } = await supabase
      .from('attendance_tags')
      .select('*')
      .eq('token', token)
      .eq('is_active', true)
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
      return NextResponse.json({ error: 'Tag tidak valid atau tidak aktif' }, { status: 404 });
    }

    // Check if student already attended today (prevent duplicates)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const { data: existingLogs, error: checkError } = await supabase
      .from('attendance_logs')
      .select('id, tapped_at')
      .eq('token', token)
      .gte('tapped_at', startOfToday.toISOString())
      .lte('tapped_at', endOfToday.toISOString())
      .limit(1);

    if (checkError) {
        console.error('[attendance/token] duplicate check error:', checkError);
    }

    if (existingLogs && existingLogs.length > 0) {
      return NextResponse.json({ 
        error: 'Sudah Absen', 
        message: 'Siswa sudah tercatat hadir hari ini.',
        studentName: tag.student_name,
        alreadyLogged: true
      }, { status: 400 });
    }

    const tappedAt = new Date();

    // Insert attendance log
    const { data: log, error: logError } = await supabase
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

    const defaultTemplate = 'Halo Orang Tua {student_name}, ananda telah hadir di sekolah pada {date} pukul {time}.';
    const template = (tag.message_template as string) || defaultTemplate;

    const message = template
      .replace(/{student_name}/g, tag.student_name || 'Siswa')
      .replace(/{class_name}/g, tag.class_name || '-')
      .replace(/{subject}/g, tag.subject ?? '-')
      .replace(/{date}/g, date)
      .replace(/{time}/g, time);

    // Send WA via configured gateway (fully automatic)
    let waResult = { success: false, error: 'Not attempted' };
    try {
        waResult = await sendWhatsApp({ 
          target: tag.teacher_phone, 
          message,
          token: tag.whatsapp_token 
        });
    } catch (waErr: any) {
        console.error('[attendance/token] WhatsApp send error:', waErr);
        waResult = { success: false, error: waErr.message || String(waErr) };
    }

    // Update log with WA send status
    const { error: updateError } = await supabase
      .from('attendance_logs')
      .update({
        wa_sent: waResult.success,
        wa_error: waResult.success ? null : waResult.error,
      })
      .eq('id', log.id);

    if (updateError) {
      console.error('[attendance/token] log update error:', updateError);
    }

    return NextResponse.json({
      success: true,
      studentName: tag.student_name,
      className: tag.class_name,
      subject: tag.subject ?? null,
      date,
      time,
      waSent: waResult.success,
      waError: waResult.success ? null : waResult.error,
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
