import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendWhatsApp } from '@/lib/whatsapp';

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

    const supabase = await createClient();

    const { data: tag, error: tagSelectError } = await supabase
      .from('attendance_tags')
      .select('*')
      .eq('token', token)
      .eq('is_active', true)
      .maybeSingle();

    if (tagSelectError) {
      console.error('[attendance/token] tag selection error:', tagSelectError);
      throw tagSelectError;
    }

    if (!tag) {
      return NextResponse.json({ error: 'Tag tidak valid atau tidak aktif' }, { status: 404 });
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
      throw logError;
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
    let waSent = false;
    try {
        waSent = await sendWhatsApp({ 
          target: tag.teacher_phone, 
          message,
          token: tag.whatsapp_token 
        });
    } catch (waErr) {
        console.error('[attendance/token] WhatsApp send error:', waErr);
    }

    // Update log with WA send status
    const { error: updateError } = await supabase
      .from('attendance_logs')
      .update({
        wa_sent: waSent,
        wa_error: waSent ? null : 'WhatsApp gateway failed to deliver',
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
      waSent,
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
