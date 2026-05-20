import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createClient } from '@/lib/supabase/server';

// POST /api/links/unlock/[token]
// Verify password and return the original URL if correct, or resolve dynamic keychains.
// Body: { password: string }
export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const cleanToken = token.trim().toLowerCase();
    const supabase = await createClient();

    // 1. Check if token belongs to a dynamic keychain
    const { data: keychain } = await supabase
      .from('user_keychains')
      .select('*')
      .eq('token', cleanToken)
      .maybeSingle();

    if (keychain) {
      const mode = keychain.active_mode;
      const payload = keychain.payload_data || {};

      // Direct Redirect Modes
      if (['url', 'profile', 'whatsapp', 'phone', 'sms', 'email', 'location', 'navigation', 'streetview', 'app'].includes(mode)) {
        let redirectUrl = '';

        switch (mode) {
          case 'url':
            redirectUrl = payload.url || '';
            if (redirectUrl && !redirectUrl.startsWith('http')) {
              redirectUrl = `https://${redirectUrl}`;
            }
            break;
          case 'profile':
            redirectUrl = `/l/${payload.slug || ''}`;
            break;
          case 'whatsapp': {
            const cleanNum = (payload.phone || '').replace(/[^0-9]/g, '');
            const msg = payload.message ? `?text=${encodeURIComponent(payload.message)}` : '';
            redirectUrl = `https://wa.me/${cleanNum}${msg}`;
            break;
          }
          case 'phone':
            redirectUrl = `tel:${(payload.phone || '').replace(/[^0-9+]/g, '')}`;
            break;
          case 'sms': {
            const cleanNum = (payload.phone || '').replace(/[^0-9+]/g, '');
            const body = payload.message ? `?body=${encodeURIComponent(payload.message)}` : '';
            redirectUrl = `sms:${cleanNum}${body}`;
            break;
          }
          case 'email': {
            const subject = payload.subject ? `?subject=${encodeURIComponent(payload.subject)}` : '';
            redirectUrl = `mailto:${payload.email || ''}${subject}`;
            break;
          }
          case 'location':
            redirectUrl = `geo:${payload.lat || ''},${payload.lng || ''}`;
            break;
          case 'navigation':
            redirectUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(payload.address || '')}`;
            break;
          case 'streetview':
            redirectUrl = `google.streetview:cbll=${payload.lat || ''},${payload.lng || ''}`;
            break;
          case 'app':
            redirectUrl = `intent://#Intent;package=${payload.package || ''};end`;
            break;
        }

        return NextResponse.json({
          is_keychain: true,
          active_mode: mode,
          url: redirectUrl
        });
      }

      // Interactive Modes (Wi-Fi, vCard)
      return NextResponse.json({
        is_keychain: true,
        active_mode: mode,
        payload_data: payload
      });
    }

    // 2. Fallback to original protected_links table
    const { data: link } = await supabase
      .from('protected_links')
      .select('original_url, is_protected, password_hash')
      .eq('token', token)
      .maybeSingle();

    if (!link) {
      return NextResponse.json({ error: 'Link tidak ditemukan' }, { status: 404 });
    }

    // Not password protected — return URL directly
    if (!link.is_protected) {
      return NextResponse.json({ url: link.original_url });
    }

    let body: { password?: string } = {};
    try {
      body = await req.json();
    } catch {
      // empty body probe — return 401 so client knows it's protected
      return NextResponse.json({ error: 'Password diperlukan' }, { status: 401 });
    }

    if (!body.password) {
      return NextResponse.json({ error: 'Password diperlukan' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(body.password, link.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Password salah' }, { status: 401 });
    }

    return NextResponse.json({ url: link.original_url });
  } catch (err) {
    console.error('[links/unlock]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

