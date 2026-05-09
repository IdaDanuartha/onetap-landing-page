import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminClient = createAdminClient();

    // 1. Delete associated data (defensive cleanup)
    // Supabase foreign keys might handle this if configured with CASCADE, 
    // but we do it explicitly to be sure.
    
    // Delete linktree related data
    const { data: pages } = await adminClient
      .from('linktree_pages')
      .select('id')
      .eq('user_id', user.id);
    
    if (pages && pages.length > 0) {
      const pageIds = pages.map(p => p.id);
      await adminClient.from('linktree_links').delete().in('page_id', pageIds);
      await adminClient.from('linktree_pages').delete().eq('user_id', user.id);
    }

    // Delete attendance related data
    await adminClient.from('attendance_logs').delete().eq('created_by', user.id);
    await adminClient.from('attendance_tags').delete().eq('created_by', user.id);

    // Delete profile
    await adminClient.from('users_profile').delete().eq('id', user.id);

    // 2. Delete the user from Supabase Auth
    const { error: authError } = await adminClient.auth.admin.deleteUser(user.id);

    if (authError) {
      console.error('[delete-account] Auth deletion error:', authError);
      return NextResponse.json({ error: 'Gagal menghapus akun autentikasi' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[delete-account] Global error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
