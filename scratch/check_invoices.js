
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const ref = 'OT-1778232911507-2U306';
  console.log('Checking reference:', ref);
  
  const { data: invoice, error } = await supabase
    .from('payment_invoices')
    .select('*')
    .eq('reference_id', ref)
    .maybeSingle();
    
  if (error) {
    console.error('Error fetching invoice:', error);
    return;
  }
  
  console.log('Invoice Data in DB:');
  console.log(JSON.stringify(invoice, null, 2));

  if (invoice && invoice.email) {
    const { data: profile } = await supabase
        .from('users_profile')
        .select('*')
        .eq('email', invoice.email)
        .maybeSingle();
    
    console.log('\nUser Profile with that email:');
    console.log(JSON.stringify(profile, null, 2));
  }
}

check();
