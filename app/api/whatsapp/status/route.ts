import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { getWhatsAppStatus } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ isConnected: false, deviceStatus: 'unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from('users_profile')
      .select('plan, whatsapp_token')
      .eq('id', user.id)
      .single();

    if (!profile || profile.plan !== 'education') {
      return NextResponse.json({ isConnected: false, deviceStatus: 'forbidden' }, { status: 403 });
    }

    if (!profile.whatsapp_token) {
      return NextResponse.json({ isConnected: false, deviceStatus: 'unconfigured' });
    }

    const status = await getWhatsAppStatus(profile.whatsapp_token);
    return NextResponse.json(status);
  } catch (err) {
    console.error('[WhatsApp Status Route] Error:', err);
    return NextResponse.json({ isConnected: false, deviceStatus: 'error' }, { status: 500 });
  }
}
