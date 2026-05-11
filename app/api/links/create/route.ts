
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Restricted to logged in users
    if (!user) {
      console.warn('[links/create] Unauthorized attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url, password } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Generate a short-ish token (8 chars) from UUID
    const token = uuidv4().split('-')[0];

    let passwordHash = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
    }

    // Use Admin Client to bypass RLS for this specific creation
    const adminSupabase = createAdminClient();

    // We use a simplified insert first to see if it works
    const { data, error } = await adminSupabase
      .from('protected_links')
      .insert({
        token,
        original_url: url,
        is_protected: !!password,
        password_hash: passwordHash,
        user_id: user.id
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('[links/create] DB Error Detail:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return NextResponse.json({ 
        error: 'Gagal membuat link terproteksi', 
        debug: error.message 
      }, { status: 500 });
    }

    if (!data) {
      console.error('[links/create] No data returned after insert');
      return NextResponse.json({ error: 'Gagal membuat link terproteksi (no data)' }, { status: 500 });
    }

    return NextResponse.json({ success: true, token: data.token });
  } catch (err: any) {
    console.error('[links/create] Exception:', err);
    return NextResponse.json({ error: 'Internal server error', debug: err.message }, { status: 500 });
  }
}
