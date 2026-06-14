const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`${name}\\s*=\\s*(.+)`));
  return match ? match[1].trim().replace(/['"]/g, '') : null;
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('--- KEYS FOR users_profile ---');
  const { data: profile, error: pError } = await supabase
    .from('users_profile')
    .select('*')
    .limit(1)
    .single();
    
  if (pError) console.error('Profile error:', pError);
  else console.log(Object.keys(profile));

  console.log('\n--- KEYS FOR attendance_tags ---');
  const { data: tag, error: tError } = await supabase
    .from('attendance_tags')
    .select('*')
    .limit(1)
    .single();

  if (tError) console.error('Tag error:', tError);
  else console.log(Object.keys(tag));
}

main().catch(console.error);
