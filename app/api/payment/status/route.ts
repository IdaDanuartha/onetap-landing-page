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
  
  // Use Admin Client for all DB operations to bypass RLS
  const adminSupabase = createAdminClient();

  // 1. If we have both, link them in the database (First time return from Mayar)
  if (invoiceId && ref) {
    await adminSupabase
      .from('payment_invoices')
      .update({ invoice_id: invoiceId })
      .eq('reference_id', ref)
      .filter('invoice_id', 'is', null);
  }

  // 2. If we only have ref, try to find the invoiceId from our DB
  if (!invoiceId && ref) {
    const { data: dbInvoice } = await adminSupabase
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
      const { data: dbInvoice, error: dbError } = await adminSupabase
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
      // Search by both to be extra safe
      const { data: dbInvoice } = await adminSupabase
        .from('payment_invoices')
        .select('*')
        .or(`invoice_id.eq.${invoiceId},reference_id.eq.${ref}`)
        .maybeSingle();

      if (dbInvoice) {
        const planId = dbInvoice.plan_id as PlanId;
        const billingCycle = dbInvoice.billing_cycle as BillingCycle;
        
        // Calculate expiry
        const days = getDaysForCycle(billingCycle);
        const planExpiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

        // Find user: Priority to logged in user, then by email
        let targetUserId = authUser?.id;
        
        if (!targetUserId) {
          const { data: userProfile } = await adminSupabase
            .from('users_profile')
            .select('id')
            .eq('email', dbInvoice.email)
            .maybeSingle();
          targetUserId = userProfile?.id;
        }

        if (targetUserId) {
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
          // Also make sure invoice_id is linked here if it was found via ref
          await adminSupabase
            .from('payment_invoices')
            .update({ 
              status: 'paid',
              invoice_id: invoiceId 
            })
            .or(`invoice_id.eq.${invoiceId},reference_id.eq.${ref}`);
          
          // Send success email (optional, based on your logic)
          try {
            await sendPlanEmail({
              to: dbInvoice.email,
              subject: 'Pembayaran Berhasil - OneTap',
              planName: PLANS[planId].nameId,
              type: 'confirmation'
            });
          } catch (emailErr) {
            console.error('[payment/status] Email error:', emailErr);
          }
        }
      }
    }

    return NextResponse.json({ 
      status: invoice.status,
      invoice: {
        id: invoice.id,
        amount: invoice.amount,
        paidAt: invoice.paidAt
      }
    });
  } catch (error) {
    console.error('[payment/status] API Error:', error);
    return NextResponse.json({ error: 'Failed to check payment status' }, { status: 500 });
  }
}
