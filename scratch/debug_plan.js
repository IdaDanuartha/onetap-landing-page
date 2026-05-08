
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Checking latest invoices...');
  const { data: invoices, error } = await supabase
    .from('payment_invoices')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching invoices:', error);
    // return;
  }

  if (invoices) {
    console.table(invoices.map(i => ({
      id: i.id,
      ref: i.reference_id,
      inv: i.invoice_id,
      plan: i.plan_id,
      status: i.status,
      email: i.email
    })));
  }

  console.log('\nChecking user profiles...');
  const { data: profiles } = await supabase
    .from('users_profile')
    .select('id, username, display_name, email, plan, updated_at')
    .order('updated_at', { ascending: false })
    .limit(10);
  
  if (profiles) {
    console.table(profiles);
  } else {
    console.log('No profiles found or error');
  }
}

check();
