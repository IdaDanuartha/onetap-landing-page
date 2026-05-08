import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getMayarInvoice } from '@/lib/mayar';
import { getDaysForCycle, PLANS } from '@/lib/plans';
import { sendPlanEmail } from '@/lib/email';
import type { PlanId, BillingCycle } from '@/lib/plans';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let invoiceId = searchParams.get('invoiceId');
  const ref = searchParams.get('ref');

  const supabase = await createClient();

  if (!invoiceId && ref) {
    // Look up invoiceId by reference
    const { data: dbInvoice } = await supabase
      .from('payment_invoices')
      .select('invoice_id')
      .eq('reference_id', ref)
      .single();
    
    if (dbInvoice) {
      invoiceId = dbInvoice.invoice_id;
    }
  }

  if (!invoiceId) {
    return NextResponse.json({ error: 'invoiceId or ref is required' }, { status: 400 });
  }

  try {
    const invoice = await getMayarInvoice(invoiceId);
    
    // If paid, update the database manually (since webhook is disabled)
    if (invoice.status === 'paid') {
      // 1. Check if we have an invoice record to get the plan details
      const { data: dbInvoice } = await supabase
        .from('payment_invoices')
        .select('*')
        .eq('invoice_id', invoiceId)
        .single();

      if (dbInvoice && dbInvoice.status !== 'paid') {
        const planId = dbInvoice.plan_id as PlanId;
        const billingCycle = dbInvoice.billing_cycle as BillingCycle;
        
        // Calculate expiry
        const days = getDaysForCycle(billingCycle);
        const planExpiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

        // Find user by email
        const { data: userProfile } = await supabase
          .from('users_profile')
          .select('id')
          .eq('email', dbInvoice.email)
          .maybeSingle();

        if (userProfile) {
          // Update profile
          await supabase
            .from('users_profile')
            .update({
              plan: planId,
              plan_expires_at: planExpiresAt,
              mayar_invoice_id: invoiceId,
              pending_plan: null,
              pending_billing_cycle: null,
            })
            .eq('id', userProfile.id);

          // Update invoice status in our DB
          await supabase
            .from('payment_invoices')
            .update({ status: 'paid' })
            .eq('invoice_id', invoiceId);

          // Send confirmation email
          try {
            await sendPlanEmail({
              to: dbInvoice.email,
              subject: `Pembayaran OneTap ${PLANS[planId as PlanId]?.nameId || 'Premium'} Berhasil!`,
              planName: PLANS[planId as PlanId]?.nameId || 'Premium',
              type: 'confirmation'
            });
          } catch (emailErr) {
            console.error('[status/sync] Email error:', emailErr);
          }

          console.log(`[status/sync] Database updated for ${dbInvoice.email} (Manual Sync)`);
        }
      }
    }

    return NextResponse.json({
      status: invoice.status,
      amount: invoice.amount,
      paymentUrl: invoice.paymentUrl,
    });
  } catch (err) {
    console.error('[payment/status]', err);
    return NextResponse.json({ error: 'Failed to fetch invoice status' }, { status: 500 });
  }
}

