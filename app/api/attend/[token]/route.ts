import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/attend/[token] - Public endpoint: fetch student keychain info + attendance stats
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Fetch the tag / keychain info
    const { data: tag, error: tagError } = await supabaseAdmin
      .from('attendance_tags')
      .select('student_name, class_name, subject, school_name, is_active, created_at')
      .eq('token', token)
      .maybeSingle();

    if (tagError) {
      return NextResponse.json({ error: 'Database error', message: tagError.message }, { status: 500 });
    }

    if (!tag) {
      return NextResponse.json({ error: 'Tag tidak ditemukan' }, { status: 404 });
    }

    // Compute "today" in Asia/Makassar timezone
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Makassar',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = formatter.formatToParts(new Date());
    const year = parts.find(p => p.type === 'year')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const day = parts.find(p => p.type === 'day')?.value;
    const todayMakassar = `${year}-${month}-${day}`;
    const gte = `${todayMakassar}T00:00:00+08:00`;
    const lte = `${todayMakassar}T23:59:59+08:00`;

    // Check if present today
    const { data: todayLogs, error: todayError } = await supabaseAdmin
      .from('attendance_logs')
      .select('id, tapped_at')
      .eq('token', token)
      .gte('tapped_at', gte)
      .lte('tapped_at', lte)
      .limit(1);

    const presentToday = !todayError && todayLogs && todayLogs.length > 0;
    const lastTappedAt = presentToday ? todayLogs![0].tapped_at : null;

    // Count total attendance
    const { count: totalAttendance, error: countError } = await supabaseAdmin
      .from('attendance_logs')
      .select('id', { count: 'exact', head: true })
      .eq('token', token);

    // Count this month's attendance
    const firstOfMonth = `${year}-${month}-01T00:00:00+08:00`;
    const { count: monthAttendance } = await supabaseAdmin
      .from('attendance_logs')
      .select('id', { count: 'exact', head: true })
      .eq('token', token)
      .gte('tapped_at', firstOfMonth);

    return NextResponse.json({
      studentName: tag.student_name,
      className: tag.class_name,
      subject: tag.subject ?? null,
      schoolName: tag.school_name ?? null,
      isActive: tag.is_active,
      presentToday,
      lastTappedAt,
      totalAttendance: !countError ? (totalAttendance ?? 0) : 0,
      monthAttendance: monthAttendance ?? 0,
      today: todayMakassar,
    });
  } catch (err: any) {
    console.error('[attend/token] Error:', err);
    return NextResponse.json({ error: 'Internal error', message: err.message }, { status: 500 });
  }
}
