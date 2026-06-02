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

      // Check if password protected
      if (payload.link_password_hash) {
        let body: { password?: string } = {};
        try {
          body = await req.json();
        } catch {
          // empty body probe — return 401 so client knows it's protected
          return NextResponse.json({ error: 'Password diperlukan', is_protected: true }, { status: 401 });
        }

        if (!body.password) {
          return NextResponse.json({ error: 'Password diperlukan', is_protected: true }, { status: 401 });
        }

        const isValid = await bcrypt.compare(body.password, payload.link_password_hash);
        if (!isValid) {
          return NextResponse.json({ error: 'Password salah' }, { status: 401 });
        }
      }

      // Direct Redirect Modes
      if (['url', 'profile', 'whatsapp', 'phone', 'sms', 'email', 'location', 'navigation', 'streetview', 'app', 'instagram', 'facebook', 'linkedin', 'twitter', 'youtube', 'tiktok', 'telegram', 'github', 'spotify'].includes(mode)) {
        let redirectUrl = '';

        switch (mode) {
          case 'github':
            redirectUrl = payload.username || '';
            if (redirectUrl && !redirectUrl.startsWith('http')) {
              redirectUrl = `https://github.com/${redirectUrl}`;
            }
            break;
          case 'tiktok':
            redirectUrl = payload.username || '';
            if (redirectUrl && !redirectUrl.startsWith('http')) {
              redirectUrl = `https://tiktok.com/@${redirectUrl.replace('@', '')}`;
            }
            break;
          case 'telegram':
            redirectUrl = payload.username || '';
            if (redirectUrl && !redirectUrl.startsWith('http')) {
              redirectUrl = `https://t.me/${redirectUrl.replace('@', '')}`;
            }
            break;
          case 'instagram':
            redirectUrl = payload.username || '';
            if (redirectUrl && !redirectUrl.startsWith('http')) {
              redirectUrl = `https://instagram.com/${redirectUrl.replace('@', '')}`;
            }
            break;
          case 'spotify':
            redirectUrl = payload.username || '';
            if (redirectUrl && !redirectUrl.startsWith('http')) {
              if (redirectUrl.startsWith('spotify:')) {
                // Keep as is
              } else if (redirectUrl.includes('spotify.com')) {
                redirectUrl = `https://${redirectUrl}`;
              } else {
                redirectUrl = `https://open.spotify.com/${redirectUrl}`;
              }
            }
            break;
          case 'facebook':
            redirectUrl = payload.username || '';
            if (redirectUrl && !redirectUrl.startsWith('http')) {
              redirectUrl = `https://facebook.com/${redirectUrl}`;
            }
            break;
          case 'linkedin':
            redirectUrl = payload.username || '';
            if (redirectUrl && !redirectUrl.startsWith('http')) {
              redirectUrl = `https://linkedin.com/in/${redirectUrl}`;
            }
            break;
          case 'twitter':
            redirectUrl = payload.username || '';
            if (redirectUrl && !redirectUrl.startsWith('http')) {
              redirectUrl = `https://x.com/${redirectUrl.replace('@', '')}`;
            }
            break;
          case 'youtube':
            redirectUrl = payload.username || '';
            if (redirectUrl && !redirectUrl.startsWith('http')) {
              const cleaned = redirectUrl.startsWith('@') ? redirectUrl : `@${redirectUrl}`;
              redirectUrl = `https://youtube.com/${cleaned}`;
            }
            break;
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
            redirectUrl = `https://www.google.com/maps/search/?api=1&query=${payload.lat || ''},${payload.lng || ''}`;
            break;
          case 'navigation':
            redirectUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(payload.address || '')}`;
            break;
          case 'streetview':
            redirectUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${payload.lat || ''},${payload.lng || ''}`;
            break;
          case 'app': {
            const ua = req.headers.get('user-agent') || '';
            const isIos = /iPhone|iPad|iPod/i.test(ua);
            if (isIos && payload.iosUrl) {
              redirectUrl = payload.iosUrl;
            } else {
              let pkg = payload.package || '';
              if (pkg === 'com.zhiliaoapp.musically') {
                pkg = 'com.ss.android.ugc.trill';
              }
              redirectUrl = `intent://#Intent;package=${pkg};end`;
            }
            break;
          }
        }

        // Check if redirectUrl is empty or placeholder (no data)
        const isEmptyUrl = 
          !redirectUrl ||
          redirectUrl === '/l/' || 
          redirectUrl === 'https://wa.me/' || 
          redirectUrl === 'tel:' || 
          redirectUrl === 'sms:' || 
          redirectUrl === 'mailto:' || 
          redirectUrl === 'geo:,' || 
          redirectUrl === 'https://www.google.com/maps/search/?api=1&query=,' ||
          redirectUrl === 'https://www.google.com/maps/dir/?api=1&destination=' || 
          redirectUrl === 'google.streetview:cbll=,' || 
          redirectUrl === 'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=,' ||
          redirectUrl === 'intent://#Intent;package=;end';

        if (isEmptyUrl) {
          redirectUrl = '';
        }

        return NextResponse.json({
          is_keychain: true,
          active_mode: mode,
          url: redirectUrl,
          is_claimed: keychain.user_id !== null
        });
      }

      // Interactive Modes (Wi-Fi, vCard)
      return NextResponse.json({
        is_keychain: true,
        active_mode: mode,
        payload_data: payload,
        is_claimed: keychain.user_id !== null
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

