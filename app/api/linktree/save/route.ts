import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPlan } from '@/lib/plans';

export const dynamic = 'force-dynamic';

// POST /api/linktree/save
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { profile, links, theme, pageId, slug: requestedSlug, isPublished } = await req.json();

    // Check user plan — IMPORTANT: must include plan_expires_at to correctly enforce expiry
    const { data: userProfile } = await supabase
      .from('users_profile')
      .select('plan, plan_expires_at')
      .eq('id', user.id)
      .single();

    const userPlan = userProfile?.plan || 'starter';
    const expiresAt = userProfile?.plan_expires_at || null;

    // Use getPlan() which falls back to 'starter' when plan is expired
    const activePlan = getPlan(userPlan, expiresAt);
    const maxPages = activePlan.features.maxProfiles;

    // Check current pages count
    const { count } = await supabase
      .from('linktree_pages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    let page;

    if (pageId) {
      // Update existing page
      const { data: existingPage, error: fetchError } = await supabase
        .from('linktree_pages')
        .select('id')
        .eq('id', pageId)
        .eq('user_id', user.id)
        .single();

      if (fetchError || !existingPage) {
        return NextResponse.json({ error: 'Page not found or unauthorized' }, { status: 404 });
      }

      const { data: updatedPage, error: updateError } = await supabase
        .from('linktree_pages')
        .update({
          title: profile.title,
          bio: profile.bio,
          theme_id: theme,
          slug: requestedSlug,
          is_published: isPublished !== false,
          updated_at: new Date().toISOString()
        })
        .eq('id', pageId)
        .select()
        .single();

      if (updateError) throw updateError;
      page = updatedPage;
    } else {
      // Create new page — enforce plan limit with expiry-aware check
      if ((count ?? 0) >= maxPages) {
        const planName = activePlan.nameId;
        const limitStr = maxPages >= 9999 ? 'Tak Terbatas' : maxPages.toString();
        return NextResponse.json({
          error: `Batas maksimal halaman untuk paket ${planName} tercapai. Paket ${planName} dibatasi maksimal ${limitStr} halaman.`
        }, { status: 403 });
      }

      const { data: newPage, error: insertError } = await supabase
        .from('linktree_pages')
        .insert({
          user_id: user.id,
          title: profile.title || 'Profil Baru',
          bio: profile.bio,
          theme_id: theme || 'pink',
          slug: requestedSlug,
          is_published: isPublished !== false
        })
        .select()
        .single();

      if (insertError) throw insertError;
      page = newPage;
    }

    // === FREE/EXPIRED PLAN: enforce 1 active profile ===
    // If maxPages === 1, auto-unpublish all OTHER pages so only this one is live
    if (maxPages === 1 && page.is_published) {
      await supabase
        .from('linktree_pages')
        .update({ is_published: false })
        .eq('user_id', user.id)
        .neq('id', page.id);
    }

    // Delete all existing links for THIS page and re-insert
    await supabase.from('linktree_links').delete().eq('page_id', page.id);

    if (links && links.length > 0) {
      const insertLinks = links.map((l: any, i: number) => ({
        page_id: page.id,
        label: l.label,
        url: l.url,
        icon: l.icon,
        sort_order: i,
        is_active: l.isActive !== false,
      }));
      await supabase.from('linktree_links').insert(insertLinks);
    }

    return NextResponse.json({ success: true, pageId: page.id });
  } catch (err) {
    console.error('[linktree/save POST]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// GET /api/linktree/save
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedPageId = searchParams.get('pageId');

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 1. Get all pages for this user to show in switcher
    const { data: pages } = await supabase
      .from('linktree_pages')
      .select('id, title, slug, is_published, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    // 2. Determine which page to load
    let targetPageId = requestedPageId;
    if (!targetPageId && pages && pages.length > 0) {
      // Prefer the first published page, fallback to first page
      const firstPublished = pages.find(p => p.is_published);
      targetPageId = (firstPublished ?? pages[0]).id;
    }

    if (!targetPageId) {
      // No pages yet
      const { data: profile } = await supabase
        .from('users_profile')
        .select('username, display_name, avatar_url, plan, plan_expires_at')
        .eq('id', user.id)
        .single();
      return NextResponse.json({ page: null, links: [], profile, pages: [] });
    }

    // 3. Load full data for the target page
    const { data: page, error: pageError } = await supabase
      .from('linktree_pages')
      .select('*')
      .eq('id', targetPageId)
      .eq('user_id', user.id)
      .single();

    if (pageError || !page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const { data: links } = await supabase
      .from('linktree_links')
      .select('*')
      .eq('page_id', page.id)
      .order('sort_order', { ascending: true });

    const { data: profile } = await supabase
      .from('users_profile')
      .select('username, display_name, avatar_url, plan, plan_expires_at')
      .eq('id', user.id)
      .single();

    return NextResponse.json({
      page,
      links: links ?? [],
      profile,
      pages: pages ?? []
    });
  } catch (err) {
    console.error('[linktree/save GET]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
