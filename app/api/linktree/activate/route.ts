import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPlan } from '@/lib/plans';

export const dynamic = 'force-dynamic';

/**
 * POST /api/linktree/activate
 * Instantly activates a specific profile page for free/expired plan users.
 * Publishes the target page and unpublishes all others.
 *
 * Body: { pageId: string }
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { pageId } = await req.json();
    if (!pageId) return NextResponse.json({ error: 'pageId required' }, { status: 400 });

    // Verify the page belongs to this user
    const { data: targetPage, error: fetchError } = await supabase
      .from('linktree_pages')
      .select('id')
      .eq('id', pageId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !targetPage) {
      return NextResponse.json({ error: 'Page not found or unauthorized' }, { status: 404 });
    }

    // Get plan to check if user is on free/expired (maxProfiles === 1)
    const { data: userProfile } = await supabase
      .from('users_profile')
      .select('plan, plan_expires_at')
      .eq('id', user.id)
      .single();

    const userPlan = userProfile?.plan || 'starter';
    const expiresAt = userProfile?.plan_expires_at || null;
    const activePlan = getPlan(userPlan, expiresAt);
    const maxPages = activePlan.features.maxProfiles;

    if (maxPages === 1) {
      // Unpublish ALL other pages first
      await supabase
        .from('linktree_pages')
        .update({ is_published: false })
        .eq('user_id', user.id)
        .neq('id', pageId);
    }

    // Publish the target page
    await supabase
      .from('linktree_pages')
      .update({ is_published: true })
      .eq('id', pageId)
      .eq('user_id', user.id);

    return NextResponse.json({ success: true, activatedPageId: pageId });
  } catch (err) {
    console.error('[linktree/activate POST]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
