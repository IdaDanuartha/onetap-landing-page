import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/linktree/save
// Saves profile + links + theme for the current user's linktree page.
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { profile, links, theme } = await req.json();

    // Get or create the user's linktree page
    let { data: page } = await supabase
      .from('linktree_pages')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!page) {
      const { data: newPage, error } = await supabase
        .from('linktree_pages')
        .insert({ user_id: user.id, title: profile.title, bio: profile.bio, theme_id: theme })
        .select('id')
        .single();
      if (error) throw error;
      page = newPage;
    } else {
      // Update page metadata
      await supabase
        .from('linktree_pages')
        .update({ title: profile.title, bio: profile.bio, theme_id: theme })
        .eq('id', page.id);
    }

    // Delete all existing links and re-insert (simpler than diff sync)
    await supabase.from('linktree_links').delete().eq('page_id', page.id);

    if (links && links.length > 0) {
      const insertLinks = links.map((l: { id: string; label: string; url: string; icon: string; isActive: boolean }, i: number) => ({
        page_id: page!.id,
        label: l.label,
        url: l.url,
        icon: l.icon,
        sort_order: i,
        is_active: l.isActive,
      }));
      await supabase.from('linktree_links').insert(insertLinks);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[linktree/save]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// GET /api/linktree/save — load the current user's linktree data
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: page } = await supabase
      .from('linktree_pages')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!page) return NextResponse.json({ page: null, links: [] });

    const { data: links } = await supabase
      .from('linktree_links')
      .select('*')
      .eq('page_id', page.id)
      .order('sort_order', { ascending: true });

    const { data: profile } = await supabase
      .from('users_profile')
      .select('username, display_name, avatar_url')
      .eq('id', user.id)
      .single();

    return NextResponse.json({ page, links: links ?? [], profile });
  } catch (err) {
    console.error('[linktree/save GET]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
