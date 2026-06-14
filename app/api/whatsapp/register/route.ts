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
    const { phoneNumber } = await req.json();
    if (!phoneNumber) {
      return NextResponse.json({ error: 'Nomor WhatsApp wajib diisi.' }, { status: 400 });
    }

    // 1. Verify user is logged in
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Akses ditolak', message: 'Silakan login terlebih dahulu.' }, { status: 401 });
    }

    // 2. Fetch user profile and check plan
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users_profile')
      .select('plan, plan_expires_at, display_name, username')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('[WhatsApp Register] Profile fetch error:', profileError);
      return NextResponse.json({ error: 'Gagal mengambil data profil.' }, { status: 500 });
    }

    if (profile.plan !== 'education') {
      return NextResponse.json({ error: 'Akses ditolak', message: 'Fitur ini hanya tersedia untuk paket Education.' }, { status: 403 });
    }

    // 3. Normalize phone number (08xxx -> 628xxx)
    let normalizedPhone = phoneNumber.trim().replace(/[^0-9]/g, '');
    if (normalizedPhone.startsWith('0')) {
      normalizedPhone = '62' + normalizedPhone.substring(1);
    }

    if (normalizedPhone.length < 9 || normalizedPhone.length > 15) {
      return NextResponse.json({ error: 'Format nomor WhatsApp tidak valid.' }, { status: 400 });
    }

    // 4. Get Account Token from environment (fallback to API token)
    const accountToken = (process.env.FONNTE_ACCOUNT_TOKEN || process.env.FONNTE_API_TOKEN)?.trim();
    if (!accountToken) {
      console.error('[WhatsApp Register] Fonnte account token is missing in environment variables');
      return NextResponse.json({ error: 'Fonnte Account Token tidak dikonfigurasi di server.' }, { status: 500 });
    }

    // 5. Call Fonnte add-device API (Form URL Encoded)
    const formData = new URLSearchParams();
    formData.append('name', `OneTap - ${profile.display_name || profile.username || 'User'}`.substring(0, 30));
    formData.append('device', normalizedPhone);

    const fonnteRes = await fetch('https://api.fonnte.com/add-device', {
      method: 'POST',
      headers: {
        'Authorization': accountToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    const text = await fonnteRes.text();
    if (!fonnteRes.ok) {
      console.error('[WhatsApp Register] Fonnte HTTP error:', fonnteRes.status, text);
      return NextResponse.json({ error: `Fonnte Error HTTP ${fonnteRes.status}: ${text}` }, { status: 400 });
    }

    const fonnteData = JSON.parse(text);
    if (fonnteData.status !== true) {
      console.error('[WhatsApp Register] Fonnte API failed:', fonnteData);
      return NextResponse.json({ 
        error: fonnteData.reason || 'Gagal mendaftarkan perangkat di Fonnte. Pastikan nomor belum terdaftar dan slot perangkat Anda masih tersedia.' 
      }, { status: 400 });
    }

    const deviceToken = fonnteData.token;

    // 6. Save token and phone to users_profile in database
    const { error: updateError } = await supabaseAdmin
      .from('users_profile')
      .update({
        whatsapp: normalizedPhone,
        whatsapp_token: deviceToken
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('[WhatsApp Register] DB update error:', updateError);
      return NextResponse.json({ error: 'Gagal memperbarui data profil WhatsApp di database.' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      token: deviceToken, 
      device: normalizedPhone 
    });

  } catch (err: any) {
    console.error('[WhatsApp Register] Catch:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
