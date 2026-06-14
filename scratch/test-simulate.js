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
  console.log('--- DETAILED ATTENDANCE LOGS ---');
  const { data: logs, error: logsError } = await supabase
    .from('attendance_logs')
    .select('*')
    .order('tapped_at', { ascending: false })
    .limit(20);

  if (logsError) {
    console.error('Error:', logsError);
    return;
  }

  logs.forEach(l => {
    console.log(`ID: ${l.id} | Name: ${l.student_name} | Class: ${l.class_name} | Tapped: ${l.tapped_at} | WA Sent: ${l.wa_sent} | WA Error: ${l.wa_error}`);
  });
}

main().catch(console.error);
