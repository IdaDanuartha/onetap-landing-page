import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendPlanEmail } from '@/lib/email';
import { PLANS, PlanId } from '@/lib/plans';

/**
 * GET /api/payment/reminders
 * 
 * This endpoint checks for expiring plans and sends reminder emails.
 * Trigger this via a cron job (e.g. Vercel Cron, every day at 09:00 WIB).
 */
export async function GET(req: Request) {
  // Simple secret check to prevent unauthorized calls
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();
  const now = new Date();

  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const in1Day = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString();

  // Find users expiring in 7 days
  const { data: expiring7 } = await supabase
    .from('users_profile')
    .select('email, plan, plan_expires_at')
    .gt('plan_expires_at', now.toISOString())
    .lt('plan_expires_at', in7Days)
    .neq('plan', 'starter');

  // Find users expiring in 1 day
  const { data: expiring1 } = await supabase
    .from('users_profile')
    .select('email, plan, plan_expires_at')
    .gt('plan_expires_at', now.toISOString())
    .lt('plan_expires_at', in1Day)
    .neq('plan', 'starter');

  const results: string[] = [];

  // Send 7-day reminder emails
  for (const user of expiring7 ?? []) {
    if (!user.email) continue;
    const planName = PLANS[user.plan as PlanId]?.nameId || 'Premium';
    await sendPlanEmail({
      to: user.email,
      subject: `🔔 Plan ${planName} OneTap kamu berakhir dalam 7 hari`,
      planName,
      daysLeft: 7,
      type: 'reminder'
    });
    results.push(`7-day reminder → ${user.email}`);
  }

  // Send 1-day reminder emails
  for (const user of expiring1 ?? []) {
    if (!user.email) continue;
    const planName = PLANS[user.plan as PlanId]?.nameId || 'Premium';
    await sendPlanEmail({
      to: user.email,
      subject: `⏰ Hari terakhir plan ${planName} OneTap kamu!`,
      planName,
      daysLeft: 1,
      type: 'reminder'
    });
    results.push(`1-day reminder → ${user.email}`);
  }

  return NextResponse.json({ sent: results.length, details: results });
}

async function sendReminderEmail(email: string, plan: string, daysLeft: number) {
  const planLabel = plan === 'professional' ? 'Professional' : 'Education';
  const subject = daysLeft === 1
    ? `⏰ Hari terakhir plan ${planLabel} OneTap kamu!`
    : `🔔 Plan ${planLabel} OneTap kamu berakhir dalam ${daysLeft} hari`;

  const body = `
Halo!

Plan <strong>OneTap ${planLabel}</strong> kamu akan berakhir dalam <strong>${daysLeft} hari</strong>.

Untuk melanjutkan akses ke semua fitur, silakan perbarui langganan kamu di:
<a href="${process.env.NEXT_PUBLIC_APP_URL}/#pricing">${process.env.NEXT_PUBLIC_APP_URL}/#pricing</a>

Jika ada pertanyaan, hubungi kami via WhatsApp:
https://wa.me/6283114227745?text=Halo%20OneTap%2C%20saya%20ingin%20bertanya%20mengenai%20detail%20produk%20NFC%20OneTap%20yang%20tersedia.

Tim OneTap
  `.trim();

  // If you have Resend configured, use it here.
  // For now we use the Supabase email function as fallback (limited).
  // TODO: Replace with Resend SDK when RESEND_API_KEY is available.
  console.log(`[reminder] Sending ${daysLeft}-day reminder to ${email}`);
  console.log(`[reminder] Subject: ${subject}`);
  console.log(`[reminder] Body: ${body}`);

  // Placeholder: log only. Wire up Resend below when ready:
  //
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'OneTap <noreply@onetap-charm.com>',
  //   to: email,
  //   subject,
  //   html: body,
  // });
}
