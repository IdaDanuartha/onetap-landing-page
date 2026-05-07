import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data: { user: authUser }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && authUser) {
      // Check if user is admin
      const { data: profileCheck } = await supabase
        .from('users_profile')
        .select('role')
        .eq('id', authUser.id)
        .maybeSingle();
      
      if (profileCheck?.role === 'admin') {
        await supabase.auth.signOut();
        return NextResponse.redirect(`${origin}/auth/login?error=admin_not_allowed`);
      }

      // Check if profile exists, if not create it (for first-time Google logins)
      const { data: profile } = await supabase
        .from('users_profile')
        .select('id')
        .eq('id', authUser.id)
        .maybeSingle();

      if (!profile) {
        const email = authUser.email || '';
        // Generate a basic username from email + random suffix
        const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const username = `${baseUsername}${randomSuffix}`;

        // 1. Create Profile
        await supabase.from('users_profile').insert({
          id: authUser.id,
          username,
          display_name: authUser.user_metadata.full_name || authUser.user_metadata.name || email.split('@')[0],
        });

        // 2. Create Default Linktree Page
        await supabase.from('linktree_pages').insert({
          user_id: authUser.id,
          title: authUser.user_metadata.full_name || authUser.user_metadata.name || email.split('@')[0],
          slug: username, // Set initial slug to username
          theme_id: 'pink',
        });
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Fallback to home if error
  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
