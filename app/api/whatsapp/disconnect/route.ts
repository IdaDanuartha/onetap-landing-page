import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    // 1. Verify user is logged in
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Akses ditolak', message: 'Silakan login terlebih dahulu.' }, { status: 401 });
    }

    // Read action from request body
    let action = 'logout';
    try {
      const body = await req.json();
      if (body && (body.action === 'clear' || body.action === 'logout')) {
        action = body.action;
      }
    } catch (_) {
      // Body might be empty
    }

    // Get current token from database to call Fonnte disconnect
    const { data: profile } = await supabaseAdmin
      .from('users_profile')
      .select('whatsapp_token')
      .eq('id', user.id)
      .single();

    if (profile && profile.whatsapp_token) {
      try {
        console.log('[WhatsApp Disconnect] Calling Fonnte disconnect API...');
        const fonnteRes = await fetch('https://api.fonnte.com/disconnect', {
          method: 'POST',
          headers: {
            'Authorization': profile.whatsapp_token
          }
        });
        const fonnteText = await fonnteRes.text();
        console.log('[WhatsApp Disconnect] Fonnte response:', fonnteText);
      } catch (err) {
        console.error('[WhatsApp Disconnect] Error calling Fonnte API:', err);
      }
    }

    if (action === 'clear') {
      // Clear token and phone in users_profile
      const { error: updateError } = await supabaseAdmin
        .from('users_profile')
        .update({
          whatsapp: null,
          whatsapp_token: null
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('[WhatsApp Disconnect] DB update error:', updateError);
        return NextResponse.json({ error: 'Gagal memperbarui data profil WhatsApp di database.' }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Data WhatsApp berhasil dihapus dari profil.' });
    }

    // Default logout action keeps the DB record intact, just unlinks WhatsApp session on Fonnte
    return NextResponse.json({ success: true, message: 'WhatsApp berhasil diputuskan.' });

  } catch (err: any) {
    console.error('[WhatsApp Disconnect] Catch:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
