import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLANS, getChargeAmount, PlanId, BillingCycle } from '@/lib/plans';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const planId = (body.planId as PlanId) || 'starter';
    const billingCycle = (body.billingCycle as BillingCycle) || 'monthly';
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
        // Starter is valid for 30 days or indefinitely? Let's say 30 days for consistency
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        await supabase
          .from('users_profile')
          .update({
            plan_id: 'starter',
            plan_expiry: expiryDate.toISOString(),
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

    const amount = getChargeAmount(planId, billingCycle);
    const planConfig = PLANS[planId];
    
    if (!planConfig || !planConfig.mayarLink) {
      return NextResponse.json({ error: 'Plan not found or missing payment link' }, { status: 404 });
    }

    // Build Mayar link with user details for pre-filling
    const paymentUrl = new URL(planConfig.mayarLink);
    paymentUrl.searchParams.append('name', name);
    paymentUrl.searchParams.append('email', email);
    if (validMobile) paymentUrl.searchParams.append('mobile', validMobile);
    paymentUrl.searchParams.append('ref', referenceId); // For tracking

    // If user is logged in, save reference for tracking
    const supabase = await createClient();
    // If user is logged in, link this reference to their profile
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error: profileError } = await supabase
        .from('users_profile')
        .update({
          pending_plan: planId,
          pending_billing_cycle: billingCycle,
          last_payment_ref: referenceId,
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('[payment/create] Profile update error:', profileError);
      }
    }

    // ALWAYS store invoice metadata for tracking (even for guests)
    const { error: invoiceError } = await supabase.from('payment_invoices').insert({
      reference_id: referenceId,
      plan_id: planId,
      billing_cycle: billingCycle,
      email,
      amount,
      status: 'pending',
    });

    if (invoiceError) {
      console.error('[payment/create] Invoice insert error:', invoiceError);
    }

    return NextResponse.json({
      success: true,
      paymentUrl: paymentUrl.toString(),
      referenceId,
    });
  } catch (err: any) {
    console.error('[payment/create]', err);
    return NextResponse.json({ 
      error: err.message || 'Internal server error',
      details: err.toString()
    }, { status: 500 });
  }
}
