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
    const { logIds } = await req.json();

    if (!logIds || !Array.isArray(logIds) || logIds.length === 0) {
      return NextResponse.json({ error: 'Missing logIds array' }, { status: 400 });
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

    // 2. Fetch the attendance logs and verify ownership
    const { data: logs, error: logsError } = await supabaseAdmin
      .from('attendance_logs')
      .select('*')
      .in('id', logIds);

    if (logsError || !logs) {
      console.error('[attendance/resend-bulk] logs fetch error:', logsError);
      return NextResponse.json({ error: 'Logs tidak ditemukan atau gagal dimuat' }, { status: 404 });
    }

    // Ensure all logs belong to the authenticated user
    const unauthorizedLogs = logs.filter(log => log.created_by !== user.id);
    if (unauthorizedLogs.length > 0) {
      return NextResponse.json({ error: 'Akses ditolak', message: 'Anda tidak memiliki akses ke beberapa log ini.' }, { status: 403 });
    }

    // 3. Fetch user's profile for custom token & template
    const { data: creatorProfile, error: creatorProfileError } = await supabaseAdmin
      .from('users_profile')
      .select('whatsapp_token, whatsapp_template')
      .eq('id', user.id)
      .maybeSingle();

    if (creatorProfileError) {
      console.error('[attendance/resend-bulk] profile fetch error:', creatorProfileError);
    }

    const customToken = creatorProfile?.whatsapp_token?.trim();
    if (!customToken) {
      return NextResponse.json({
        error: 'WhatsApp belum dikonfigurasi',
        message: 'Silakan konfigurasi Token WhatsApp di menu Pengaturan terlebih dahulu.'
      }, { status: 400 });
    }

    // 4. Verify WhatsApp status is connected before attempting bulk send
    const status = await getWhatsAppStatus(customToken);
    if (!status.isConnected) {
      return NextResponse.json({
        error: 'WhatsApp tidak terhubung',
        message: `Nomor WhatsApp Anda sedang tidak aktif (Status: ${status.deviceStatus}). Hubungkan kembali di Pengaturan WhatsApp.`
      }, { status: 400 });
    }

    // 5. Fetch all associated tags to format school_name, etc.
    const tokens = Array.from(new Set(logs.map(l => l.token)));
    const { data: tags, error: tagsError } = await supabaseAdmin
      .from('attendance_tags')
      .select('*')
      .in('token', tokens);

    if (tagsError) {
      console.warn('[attendance/resend-bulk] Warning: Failed to fetch tags:', tagsError);
    }

    const tagsMap = new Map<string, any>();
    if (tags) {
      tags.forEach(t => tagsMap.set(t.token, t));
    }

    const defaultTemplate = '✅ *Presensi Kehadiran*\n\nSiswa *{student_name}* hadir dalam kelas *{class_name}*\n📅 {date}\n🕒 {time} WITA';
    const template = creatorProfile?.whatsapp_template || defaultTemplate;

    let successCount = 0;
    let failCount = 0;

    // 6. Process and send in sequence (to avoid hitting rate limits too harshly)
    for (const log of logs) {
      const associatedTag = tagsMap.get(log.token) || {};
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

      // Use specific tag message template if defined, fallback to user profile template
      const msgTemplate = associatedTag.message_template || template;
      const message = msgTemplate
        .replace(/{student_name}/g, log.student_name || 'Siswa')
        .replace(/{class_name}/g, log.class_name || '-')
        .replace(/{subject}/g, log.subject ?? '-')
        .replace(/{school_name}/g, associatedTag.school_name || 'OneTap School')
        .replace(/{date}/g, date)
        .replace(/{time}/g, time);

      let waResult: { success: boolean; error?: string } = { success: false, error: 'Not attempted' };
      try {
        waResult = await sendWhatsApp({
          target: associatedTag.teacher_phone || log.teacher_phone || '', // fallback to log phone if stored
          message,
          token: customToken
        });
      } catch (waErr: any) {
        waResult = { success: false, error: waErr.message || String(waErr) };
      }

      if (waResult.success) {
        successCount++;
      } else {
        failCount++;
      }

      // Update individual log status
      await supabaseAdmin
        .from('attendance_logs')
        .update({
          wa_sent: waResult.success,
          wa_error: waResult.success ? null : waResult.error
        })
        .eq('id', log.id);

      // Brief delay (e.g. 200ms) between sends to prevent rate limits
      await new Promise(r => setTimeout(r, 200));
    }

    return NextResponse.json({
      success: true,
      processedCount: logs.length,
      successCount,
      failCount
    });

  } catch (err: any) {
    console.error('[attendance/resend-bulk] Final catch:', err);
    return NextResponse.json({
      error: 'Internal error',
      message: err.message || String(err)
    }, { status: 500 });
  }
}
