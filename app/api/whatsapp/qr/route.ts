import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ status: false, message: 'Akses ditolak. Silakan login.' }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from('users_profile')
      .select('plan, whatsapp_token')
      .eq('id', user.id)
      .single();

    if (!profile || profile.plan !== 'education') {
      return NextResponse.json({ status: false, message: 'Akses ditolak. Fitur khusus paket Education.' }, { status: 403 });
    }

    const token = profile.whatsapp_token;
    if (!token) {
      return NextResponse.json({ status: false, message: 'WhatsApp Token belum didaftarkan.' }, { status: 400 });
    }

    const res = await fetch('https://api.fonnte.com/qr', {
      method: 'POST',
      headers: { Authorization: token },
    });

    const text = await res.text();
    if (!res.ok) {
      return NextResponse.json({ status: false, message: `Fonnte HTTP ${res.status}: ${text}` }, { status: 400 });
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err) {
    console.error('[WhatsApp QR] Error:', err);
    return NextResponse.json({ status: false, message: 'Internal server error' }, { status: 500 });
  }
}
