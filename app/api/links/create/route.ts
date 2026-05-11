import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Optional: Allow anonymous creation for specific flows, but usually dashboard is auth
    // For now, let's keep it restricted to logged in users
    if (!user) {
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

    const { data, error } = await supabase
      .from('protected_links')
      .insert({
        token,
        original_url: url,
        is_protected: !!password,
        password_hash: passwordHash,
        user_id: user.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('[links/create] DB Error:', error);
      return NextResponse.json({ error: 'Gagal membuat link terproteksi' }, { status: 500 });
    }

    return NextResponse.json({ success: true, token: data.token });
  } catch (err) {
    console.error('[links/create]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
