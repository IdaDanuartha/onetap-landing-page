import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getMayarInvoice } from '@/lib/mayar';
import { getDaysForCycle, PLANS } from '@/lib/plans';
import { sendPlanEmail } from '@/lib/email';
import type { PlanId, BillingCycle } from '@/lib/plans';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let invoiceId = searchParams.get('invoiceId');
    const ref = searchParams.get('ref');

    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    // Check for required ENV variables
    const requiredEnv = {
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      MAYAR_API_KEY: !!process.env.MAYAR_API_KEY,
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    };

    if (!requiredEnv.SUPABASE_SERVICE_ROLE_KEY || !requiredEnv.MAYAR_API_KEY) {
      return NextResponse.json({ 
        error: 'Configuration Error', 
        message: 'Missing required environment variables on server',
        debug: requiredEnv
      }, { status: 500 });
    }

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

    // 2. Try to find the invoice record in our DB first
    let dbInvoice = null;
    if (ref || invoiceId) {
      const query = adminSupabase.from('payment_invoices').select('*');
      if (ref && invoiceId) {
        query.or(`invoice_id.eq.${invoiceId},reference_id.eq.${ref}`);
      } else if (ref) {
        query.eq('reference_id', ref);
      } else {
        query.eq('invoice_id', invoiceId);
      }
      
      const { data } = await query.maybeSingle();
      dbInvoice = data;
    }

    // 3. If we don't have invoiceId yet, try to get it from dbInvoice
    if (!invoiceId && dbInvoice?.invoice_id) {
      invoiceId = dbInvoice.invoice_id;
    }

    // 4. If we STILL don't have invoiceId, we can't check Mayar
    if (!invoiceId) {
      if (dbInvoice) {
        return NextResponse.json({ 
          status: dbInvoice.status || 'pending',
          message: 'Waiting for invoice link from Mayar'
        });
      }
      return NextResponse.json({ 
        error: 'Transaction record not found',
        debug: { ref, hasInvoiceId: !!invoiceId }
      }, { status: 404 });
    }

    // 5. Determine current status
    let currentStatus = dbInvoice?.status || 'pending';
    let finalInvoiceData = null;

    if (invoiceId) {
      try {
        const invoice = await getMayarInvoice(invoiceId);
        currentStatus = invoice.status;
        finalInvoiceData = {
          id: invoice.id,
          amount: invoice.amount
        };
      } catch (mayarErr) {
        console.error('[payment/status] Mayar API Error:', mayarErr);
        // Fallback to DB status if API fails
      }
    }

    // 6. SYNC LOGIC: If paid, ensure user profile and invoice record are updated
    if (currentStatus === 'paid' && dbInvoice) {
      const planId = dbInvoice.plan_id as PlanId;
      const billingCycle = dbInvoice.billing_cycle as BillingCycle;
      
      // Calculate expiry
      const days = getDaysForCycle(billingCycle);
      const planExpiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

      // Find user: Priority to logged in user, then by email, then by reference_id
      let targetUserId = authUser?.id;
      
      if (!targetUserId) {
        const { data: userProfileByEmail } = await adminSupabase
          .from('users_profile')
          .select('id')
          .eq('email', dbInvoice.email)
          .maybeSingle();
        targetUserId = userProfileByEmail?.id;
      }

      if (!targetUserId) {
        // Fallback: Find by reference_id in last_payment_ref
        const { data: userProfileByRef } = await adminSupabase
          .from('users_profile')
          .select('id')
          .eq('last_payment_ref', dbInvoice.reference_id)
          .maybeSingle();
        targetUserId = userProfileByRef?.id;
      }

      if (targetUserId) {
        // Update profile using Admin Client
        const { error: updateErr } = await adminSupabase
          .from('users_profile')
          .update({
            plan: planId,
            plan_expires_at: planExpiresAt,
            mayar_invoice_id: invoiceId || dbInvoice.invoice_id,
            pending_plan: null,
            pending_billing_cycle: null,
            email: dbInvoice.email,
          })
          .eq('id', targetUserId);

        if (updateErr) {
          console.error('[payment/status] Failed to update user plan:', updateErr);
        }

        // Update invoice status in our DB
        await adminSupabase
          .from('payment_invoices')
          .update({ 
            status: 'paid',
            invoice_id: invoiceId || dbInvoice.invoice_id
          })
          .eq('reference_id', dbInvoice.reference_id);
        
        // Send success email (optional)
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

    // 7. Return final response
    if (!invoiceId && currentStatus !== 'paid') {
      return NextResponse.json({ 
        status: currentStatus,
        message: 'Waiting for invoice link from Mayar'
      });
    }

    return NextResponse.json({ 
      status: currentStatus,
      invoice: finalInvoiceData || (invoiceId ? { id: invoiceId } : null)
    });
  } catch (error) {
    console.error('[payment/status] Global API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to check payment status',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
