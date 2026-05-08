import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getMayarInvoice } from '@/lib/mayar';
import { getDaysForCycle, PLANS } from '@/lib/plans';
import { sendPlanEmail } from '@/lib/email';
import type { PlanId, BillingCycle } from '@/lib/plans';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let invoiceId = searchParams.get('invoiceId');
  const ref = searchParams.get('ref');

  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  // 1. If we have both, link them in the database (First time return from Mayar)
  if (invoiceId && ref) {
    await supabase
      .from('payment_invoices')
      .update({ invoice_id: invoiceId })
      .eq('reference_id', ref)
      .filter('invoice_id', 'is', null);
  }

  // 2. If we only have ref, try to find the invoiceId from our DB
  if (!invoiceId && ref) {
    const { data: dbInvoice } = await supabase
      .from('payment_invoices')
      .select('invoice_id')
      .eq('reference_id', ref)
      .maybeSingle();
    
    if (dbInvoice?.invoice_id) {
      invoiceId = dbInvoice.invoice_id;
    }
  }

  if (!invoiceId) {
    // If we have a ref but no invoiceId yet, it might be waiting for the first link
    if (ref) {
      const { data: dbInvoice, error: dbError } = await supabase
        .from('payment_invoices')
        .select('status, invoice_id')
        .eq('reference_id', ref)
        .maybeSingle();
      
      if (dbError) {
        console.error('[payment/status] Database error for ref:', ref, dbError);
      }
      
      if (dbInvoice) {
        return NextResponse.json({ 
          status: dbInvoice.status || 'pending',
          message: 'Waiting for invoice link from Mayar'
        });
      } else {
        console.warn('[payment/status] No record found in DB for ref:', ref);
      }
    }
    return NextResponse.json({ 
      error: 'invoiceId not found for this reference',
      debug: { ref, hasInvoiceId: !!invoiceId }
    }, { status: 400 });
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

        // Find user: Priority to logged in user, then by email
        let targetUserId = authUser?.id;
        
        if (!targetUserId) {
          const { data: userProfile } = await supabase
            .from('users_profile')
            .select('id')
            .eq('email', dbInvoice.email)
            .maybeSingle();
          targetUserId = userProfile?.id;
        }

        if (targetUserId) {
          const adminSupabase = createAdminClient();
          
          // Update profile using Admin Client to bypass RLS
          const { error: updateErr } = await adminSupabase
            .from('users_profile')
            .update({
              plan: planId,
              plan_expires_at: planExpiresAt,
              mayar_invoice_id: invoiceId,
              pending_plan: null,
              pending_billing_cycle: null,
              email: dbInvoice.email, // Sync email if it was missing
            })
            .eq('id', targetUserId);

          if (updateErr) {
            console.error('[payment/status] Failed to update user plan:', updateErr);
          }

          // Update invoice status in our DB using Admin Client
          await adminSupabase
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

