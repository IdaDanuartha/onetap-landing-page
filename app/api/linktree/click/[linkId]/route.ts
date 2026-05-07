import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/linktree/click/[linkId]
// Increments the click_count for a link. Public endpoint (no auth needed).
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ linkId: string }> }
) {
  try {
    const { linkId } = await params;
    const supabase = await createClient();

    await supabase.rpc('increment_link_click', { link_id: linkId });

    return NextResponse.json({ success: true });
  } catch (err) {
    // Silently fail — click tracking is not critical
    console.error('[linktree/click]', err);
    return NextResponse.json({ success: false });
  }
}
