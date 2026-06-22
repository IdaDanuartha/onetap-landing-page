import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Akses ditolak. Silakan login.' }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from('users_profile')
      .select('plan, whatsapp_token')
      .eq('id', user.id)
      .single();

    if (!profile || profile.plan !== 'education') {
      return NextResponse.json({ success: false, error: 'Akses ditolak. Fitur khusus paket Education.' }, { status: 403 });
    }

    const token = profile.whatsapp_token?.trim();
    if (!token) {
      return NextResponse.json({ success: false, error: 'WhatsApp Token belum dikonfigurasi.' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const refresh = searchParams.get('refresh') === 'true';

    if (refresh) {
      // Sync groups from phone via Fonnte fetch-group
      try {
        const fetchRes = await fetch('https://api.fonnte.com/fetch-group', {
          method: 'POST',
          headers: { Authorization: token },
        });
        if (!fetchRes.ok) {
          console.error('[WhatsApp Groups] fetch-group failed:', fetchRes.status, await fetchRes.text());
        }
      } catch (fetchErr) {
        console.error('[WhatsApp Groups] Error calling fetch-group:', fetchErr);
      }
    }

    // Get group list from Fonnte
    const listRes = await fetch('https://api.fonnte.com/get-whatsapp-group', {
      method: 'POST',
      headers: { Authorization: token },
    });

    const text = await listRes.text();
    if (!listRes.ok) {
      return NextResponse.json({ success: false, error: `Fonnte HTTP ${listRes.status}: ${text}` }, { status: 400 });
    }

    const data = JSON.parse(text);
    if (data.status !== true) {
      return NextResponse.json({ success: false, error: data.reason || 'Gagal mengambil daftar grup dari Fonnte.' });
    }

    const groups = (data.data || []).map((g: any) => ({
      id: g.id,
      name: g.name,
    }));

    return NextResponse.json({ success: true, groups });
  } catch (err: any) {
    console.error('[WhatsApp Groups] Error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal server error' }, { status: 500 });
  }
}
