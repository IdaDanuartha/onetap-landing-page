import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLANS, getChargeAmount, PlanId, BillingCycle } from '@/lib/plans';
import { createMayarInvoice } from '@/lib/mayar';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const planId = (body.planId as PlanId) || 'starter';
    const billingCycle = (body.billingCycle as BillingCycle) || 'monthly';
    const promoCode = body.promoCode as string | undefined;
    const { name, email, mobile } = body as {
      name: string;
      email: string;
      mobile?: string;
    };
    const plan = PLANS[planId] || PLANS.starter;

    // Validate mobile (Mayar requires min 10 chars if provided)
    const validMobile = mobile && mobile.length >= 10 ? mobile : undefined;

    // Validate
    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://onetap-charm.com';
    const referenceId = `OT-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`.toUpperCase();

    // Handle Starter plan directly (Free)
    if (planId === 'starter') {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Starter is valid for 30 days
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        await supabase
          .from('users_profile')
          .update({
            plan: 'starter',
            plan_expires_at: expiryDate.toISOString(),
            pending_plan: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        return NextResponse.json({
          success: true,
          message: 'Starter plan activated successfully',
          paymentUrl: `${appUrl}/payment/success?ref=${referenceId}`,
        });
      }
    }

    let amount = getChargeAmount(planId, billingCycle);
    
    // Apply Promo Code via Database
    if (promoCode) {
      const supabase = await createClient();
      const { data: voucher } = await supabase
        .from('vouchers')
        .select('discount_percent')
        .eq('code', promoCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (voucher) {
        amount = Math.round(amount * (1 - voucher.discount_percent / 100));
      }
    }
    const planConfig = PLANS[planId];
    
    if (!planConfig) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Dynamic Invoice Expiry (24 hours)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);

    // Create a dynamic invoice instead of using static link
    // This bypasses the variant selection screen (Auto-Select)
    const { paymentUrl } = await createMayarInvoice({
      name,
      email,
      mobile: validMobile,
      amount,
      description: `OneTap ${planConfig.nameId} Plan (${billingCycle})`,
      redirectUrl: `${appUrl}/payment/success?ref=${referenceId}`,
      expiredAt: expiryDate.toISOString(),
      planId,
      billingCycle,
      referenceId,
    });

    // If user is logged in, save reference for tracking
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('users_profile')
        .update({
          display_name: name,
          whatsapp: mobile,
          pending_plan: planId,
          pending_billing_cycle: billingCycle,
          last_payment_ref: referenceId,
        })
        .eq('id', user.id);
    }

    // Store invoice metadata for tracking
    await supabase.from('payment_invoices').insert({
      reference_id: referenceId,
      plan_id: planId,
      billing_cycle: billingCycle,
      email,
      amount,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      paymentUrl,
      referenceId,
    });
  } catch (err: any) {
    console.error('[payment/create]', err);
    return NextResponse.json({ 
      error: err.message || 'Internal server error',
    }, { status: 500 });
  }
}
