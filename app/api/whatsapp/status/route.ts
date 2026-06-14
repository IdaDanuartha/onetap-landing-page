import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { getWhatsAppStatus } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Global in-memory cache for WhatsApp status to prevent hitting Fonnte rate limits
const globalForCache = globalThis as unknown as { 
  waStatusCache: Map<string, { timestamp: number; data: { isConnected: boolean; deviceStatus: string } }> 
};
if (!globalForCache.waStatusCache) {
  globalForCache.waStatusCache = new Map();
}
const CACHE_TTL_MS = 20_000; // 20 seconds cache TTL

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

    const token = profile.whatsapp_token?.trim();
    if (!token) {
      return NextResponse.json({ isConnected: false, deviceStatus: 'unconfigured' });
    }

    // Check cache
    const cached = globalForCache.waStatusCache.get(token);
    const now = Date.now();
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.data);
    }

    const status = await getWhatsAppStatus(token);
    
    // Save to cache
    globalForCache.waStatusCache.set(token, {
      timestamp: now,
      data: status
    });

    return NextResponse.json(status);
  } catch (err) {
    console.error('[WhatsApp Status Route] Error:', err);
    return NextResponse.json({ isConnected: false, deviceStatus: 'error' }, { status: 500 });
  }
}
