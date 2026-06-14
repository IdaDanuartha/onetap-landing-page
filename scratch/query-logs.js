const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Read env variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`${name}\\s*=\\s*(.+)`));
  return match ? match[1].trim().replace(/['"]/g, '') : null;
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY') || getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('--- LATEST 10 ATTENDANCE LOGS ---');
  const { data: logs, error: logsError } = await supabase
    .from('attendance_logs')
    .select('*')
    .order('tapped_at', { ascending: false })
    .limit(10);

  if (logsError) {
    console.error('Error fetching logs:', logsError);
  } else {
    console.table(logs.map(l => ({
      id: l.id,
      token: l.token,
      student_name: l.student_name,
      class_name: l.class_name,
      tapped_at: l.tapped_at,
      wa_sent: l.wa_sent,
      wa_error: l.wa_error
    })));
  }

  console.log('\n--- ACTIVE TAGS IN DB ---');
  const { data: tags, error: tagsError } = await supabase
    .from('attendance_tags')
    .select('*');

  if (tagsError) {
    console.error('Error fetching tags:', tagsError);
  } else {
    console.table(tags.map(t => ({
      id: t.id,
      token: t.token,
      student_name: t.student_name,
      class_name: t.class_name,
      is_active: t.is_active,
      created_by: t.created_by
    })));
  }
}

main().catch(console.error);
