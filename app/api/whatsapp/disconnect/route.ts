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
    // 1. Verify user is logged in
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Akses ditolak', message: 'Silakan login terlebih dahulu.' }, { status: 401 });
    }

    // 2. Clear token and phone in users_profile
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

    return NextResponse.json({ success: true, message: 'WhatsApp berhasil diputuskan.' });

  } catch (err: any) {
    console.error('[WhatsApp Disconnect] Catch:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
