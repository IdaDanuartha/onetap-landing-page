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

    const { data: tag } = await supabase
      .from('attendance_tags')
      .select('*')
      .eq('token', token)
      .eq('is_active', true)
      .maybeSingle();

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
      .single();

    if (logError) throw logError;

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

    // Render the message template
    const message = (tag.message_template as string)
      .replace('{student_name}', tag.student_name)
      .replace('{class_name}', tag.class_name)
      .replace('{subject}', tag.subject ?? '-')
      .replace('{date}', date)
      .replace('{time}', time);

    // Send WA via configured gateway (fully automatic)
    const waSent = await sendWhatsApp({ 
      target: tag.teacher_phone, 
      message,
      token: tag.whatsapp_token // Uses user's token if available, otherwise falls back to global
    });

    // Update log with WA send status
    await supabase
      .from('attendance_logs')
      .update({
        wa_sent: waSent,
        wa_error: waSent ? null : 'WhatsApp gateway failed to deliver',
      })
      .eq('id', log.id);

    return NextResponse.json({
      success: true,
      studentName: tag.student_name,
      className: tag.class_name,
      subject: tag.subject ?? null,
      date,
      time,
      waSent,
    });
  } catch (err) {
    console.error('[attendance/token]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
