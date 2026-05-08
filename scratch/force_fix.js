
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function forceUpdate(ref) {
  console.log(`Forcing update for ref: ${ref}`);
  
  // 1. Get invoice
  const { data: dbInvoice } = await supabase
    .from('payment_invoices')
    .select('*')
    .eq('reference_id', ref)
    .single();

  if (!dbInvoice) {
    console.error('Invoice not found');
    return;
  }

  console.log('Found invoice:', dbInvoice);

  // 2. Find user by email (since we know it now)
  const { data: userProfile } = await supabase
    .from('users_profile')
    .select('*')
    .eq('display_name', 'Sample Akun3') // Temporary hack to find the user from the screenshot
    .single();

  if (!userProfile) {
    console.error('User profile not found');
    return;
  }

  console.log('Found user profile:', userProfile);

  // 3. Update profile
  const planId = dbInvoice.plan_id;
  const planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const { error: upErr } = await supabase
    .from('users_profile')
    .update({
      plan: planId,
      plan_expires_at: planExpiresAt,
      email: dbInvoice.email // Fix the missing email too!
    })
    .eq('id', userProfile.id);

  if (upErr) {
    console.error('Update failed:', upErr);
  } else {
    console.log('Update successful! Plan set to:', planId);
  }
}

forceUpdate('OT-1778232911507-2U306');
