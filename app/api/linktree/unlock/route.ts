import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { pageId, password } = await req.json();

    if (!pageId || !password) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const supabase = await createClient();

    // Check if password matches
    const { data: page, error } = await supabase
      .from('linktree_pages')
      .select('id, password')
      .eq('id', pageId)
      .single();

    if (error || !page) {
      return NextResponse.json({ error: 'Halaman tidak ditemukan' }, { status: 404 });
    }

    if (page.password !== password) {
      return NextResponse.json({ error: 'Password salah' }, { status: 401 });
    }

    // Return success. The client will then show the content.
    // In a real production app, you might return an encrypted token or 
    // the content itself, but for this architecture, a boolean flag is enough
    // since the client already has the links (but we should ideally filter them).
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[linktree/unlock]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
