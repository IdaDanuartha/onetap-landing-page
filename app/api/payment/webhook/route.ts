import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getDaysForCycle, PLANS } from '@/lib/plans';
import { sendPlanEmail } from '@/lib/email';
import type { PlanId, BillingCycle } from '@/lib/plans';

// Mayar sends a webhook payload when invoice status changes
interface MayarWebhookPayload {
  id: string;            // invoice ID
  status: 'paid' | 'unpaid' | 'expired' | 'canceled';
  amount: number;
  customer: {
    email: string;
    name: string;
    mobile?: string;
  };
  // additional fields from Mayar
  [key: string]: unknown;
}

export async function POST(req: Request) {
  try {
    const payload: MayarWebhookPayload = await req.json();

    console.log('[webhook/mayar] received:', JSON.stringify(payload, null, 2));

    // Only process paid invoices
    if (payload.status !== 'paid') {
      return NextResponse.json({ received: true, skipped: true });
    }

    const supabase = await createClient();

    // 1. Try to find by invoice_id
    let { data: invoice, error: invoiceErr } = await supabase
      .from('payment_invoices')
      .select('*')
      .eq('invoice_id', payload.id)
      .maybeSingle();

    // 2. If not found, try by reference_id (Mayar often sends this in extraData or description)
    if (!invoice) {
      // Try to extract reference_id from payload
      const transactions = payload.transactions as any[];
      const referenceId = 
        (payload.extraData as any)?.referenceId || 
        (transactions?.[0]?.extraData?.referenceId) || 
        (payload.description as string)?.match(/REF (OT-[\w-]+)/)?.[1];

      if (referenceId) {
        const { data: refInvoice } = await supabase
          .from('payment_invoices')
          .select('*')
          .eq('reference_id', referenceId)
          .maybeSingle();
        invoice = refInvoice;
      }
    }

    // 3. Fallback: Try by Email + Amount + Pending status
    if (!invoice) {
      const { data: emailInvoice } = await supabase
        .from('payment_invoices')
        .select('*')
        .eq('email', payload.customer.email)
        .eq('amount', payload.amount)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      invoice = emailInvoice;
    }

    if (!invoice) {
      console.error('[webhook/mayar] Invoice not found for payload:', payload.id, payload.customer.email);
      // Still return 200 to stop Mayar retrying
      return NextResponse.json({ received: true, error: 'Invoice not found' });
    }

    // Mark invoice as paid and link the invoice_id
    await supabase
      .from('payment_invoices')
      .update({ 
        status: 'paid', 
        paid_at: new Date().toISOString(),
        invoice_id: payload.id // Always ensure this is set now
      })
      .eq('id', invoice.id); // Use internal UUID for precise update

    const planId = invoice.plan_id as PlanId;
    const billingCycle = invoice.billing_cycle as BillingCycle;
    const daysToAdd = getDaysForCycle(billingCycle);
    const planExpiresAt = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();

    // Find user by email
    const { data: authUsers } = await supabase
      .from('users_profile')
      .select('id, display_name')
      .eq('email', payload.customer.email)
      .maybeSingle();

    if (authUsers) {
      // Update their plan
      await supabase
        .from('users_profile')
        .update({
          plan: planId,
          plan_expires_at: planExpiresAt,
          mayar_invoice_id: payload.id,
          pending_plan: null,
          pending_billing_cycle: null,
        })
        .eq('id', authUsers.id);
    }

    // Send confirmation email via Resend
    try {
      await sendPlanEmail({
        to: payload.customer.email,
        subject: `Pembayaran OneTap ${PLANS[planId as PlanId]?.nameId || 'Premium'} Berhasil!`,
        planName: PLANS[planId as PlanId]?.nameId || 'Premium',
        type: 'confirmation'
      });
    } catch (emailErr) {
      console.error('[webhook/mayar] Failed to send confirmation email:', emailErr);
    }

    console.log(`[webhook/mayar] Plan updated for ${payload.customer.email}: ${planId} until ${planExpiresAt}`);

    return NextResponse.json({ received: true, planUpdated: true });
  } catch (err) {
    console.error('[webhook/mayar] Error:', err);
    // Return 200 to prevent Mayar from retrying for server errors
    return NextResponse.json({ received: true, error: 'Processing error' });
  }
}
