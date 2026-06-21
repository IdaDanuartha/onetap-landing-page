import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { sendWhatsApp, getWhatsAppStatus } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { logId } = await req.json();

    if (!logId) {
      return NextResponse.json({ error: 'Missing logId' }, { status: 400 });
    }

    // 1. Verify user is logged in
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        error: 'Akses ditolak',
        message: 'Hanya Guru/Admin yang sudah login yang dapat mengakses fitur ini.'
      }, { status: 401 });
    }

    // 2. Fetch the attendance log and verify ownership
    const { data: log, error: logError } = await supabaseAdmin
      .from('attendance_logs')
      .select('*')
      .eq('id', logId)
      .single();

    if (logError || !log) {
      console.error('[attendance/resend] log fetch error:', logError);
      return NextResponse.json({ error: 'Log tidak ditemukan' }, { status: 404 });
    }

    if (log.created_by !== user.id) {
      return NextResponse.json({ error: 'Akses ditolak', message: 'Anda tidak memiliki akses ke log ini.' }, { status: 403 });
    }

    // 3. Fetch the associated tag to retrieve teacher_phone, whatsapp_token, and template
    const { data: tag, error: tagError } = await supabaseAdmin
      .from('attendance_tags')
      .select('*')
      .eq('token', log.token)
      .maybeSingle();

    if (tagError || !tag) {
      console.error('[attendance/resend] tag fetch error:', tagError);
      return NextResponse.json({ error: 'Data siswa/tag tidak ditemukan untuk log ini' }, { status: 404 });
    }

    // Fetch the tag creator's custom WhatsApp token and template from users_profile
    const { data: creatorProfile, error: creatorProfileError } = await supabaseAdmin
      .from('users_profile')
      .select('whatsapp_token, whatsapp_template')
      .eq('id', log.created_by)
      .maybeSingle();

    if (creatorProfileError) {
      console.warn('[attendance/resend] Warning: Failed to fetch tag creator profile:', creatorProfileError);
    }

    // 4. Format the message with the original tapped_at timestamp
    const tappedAt = new Date(log.tapped_at);
    const date = tappedAt.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Makassar',
    });
    const time = tappedAt.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Makassar',
    });

    const defaultTemplate = '✅ *Presensi Kehadiran*\n\nSiswa *{student_name}* hadir dalam kelas *{class_name}*\n📅 {date}\n🕒 {time} WITA';
    const template = creatorProfile?.whatsapp_template || tag.message_template || defaultTemplate;

    const message = template
      .replace(/{student_name}/g, log.student_name || 'Siswa')
      .replace(/{class_name}/g, log.class_name || '-')
      .replace(/{subject}/g, log.subject ?? '-')
      .replace(/{school_name}/g, tag.school_name || 'OneTap School')
      .replace(/{date}/g, date)
      .replace(/{time}/g, time);

    // 5. Send WhatsApp
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
            token: customToken,
            delay: '2'
          });
        }
      } catch (waErr: any) {
        console.error('[attendance/resend] WhatsApp resend error:', waErr);
        waResult = { success: false, error: waErr.message || String(waErr) };
      }
    }

    // 6. Update log
    const { error: updateError } = await supabaseAdmin
      .from('attendance_logs')
      .update({
        wa_sent: waResult.success,
        wa_error: waResult.success ? null : waResult.error
      })
      .eq('id', logId);

    if (updateError) {
      console.error('[attendance/resend] log update error:', updateError);
    }

    if (!waResult.success) {
      return NextResponse.json({
        success: false,
        error: waResult.error || 'Gagal mengirim pesan WhatsApp'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'WhatsApp berhasil dikirim ulang.'
    });

  } catch (err: any) {
    console.error('[attendance/resend] Final catch:', err);
    return NextResponse.json({
      error: 'Internal error',
      message: err.message || String(err)
    }, { status: 500 });
  }
}
