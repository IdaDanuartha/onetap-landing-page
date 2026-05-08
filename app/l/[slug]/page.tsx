import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getTheme } from '@/lib/themes';
import type { Metadata } from 'next';
import OneTapBio from './PublicLinktreePage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Get Page by Slug
  const { data: page } = await supabase
    .from('linktree_pages')
    .select('user_id, title, bio')
    .eq('slug', slug)
    .maybeSingle();

  if (!page) {
    return { title: 'Halaman Tidak Ditemukan | OneTap' };
  }

  // 2. Get Profile
  const { data: profile } = await supabase
    .from('users_profile')
    .select('display_name, bio, avatar_url')
    .eq('id', page.user_id)
    .maybeSingle();

  const title = profile?.display_name || page.title || slug;

  return {
    title: `${title} | OneTap Profile`,
    description: profile?.bio ?? `Kunjungi profil OneTap ${title} untuk melihat semua link dan media sosialnya.`,
    icons: {
      icon: "/images/logo_simple.png",
      apple: "/images/logo_simple.png",
    },
    openGraph: {
      title: `${title} di OneTap`,
      description: profile?.bio ?? `Everything connected in one place.`,
      images: profile?.avatar_url ? [profile.avatar_url] : ["/images/logo_simple.png"],
      type: 'profile',
    },
    twitter: {
      card: "summary",
      title: `${title} | OneTap`,
      images: profile?.avatar_url ? [profile.avatar_url] : ["/images/logo_simple.png"],
    }
  };
}

export default async function OneTapPublicPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Fetch page by slug
  const { data: page } = await supabase
    .from('linktree_pages')
    .select('id, user_id, title, bio, theme_id, is_published')
    .eq('slug', slug)
    .maybeSingle();

  if (!page || !page.is_published) return notFound();

  // 2. Fetch profile
  const { data: profile } = await supabase
    .from('users_profile')
    .select('id, display_name, bio, avatar_url, username')
    .eq('id', page.user_id)
    .maybeSingle();

  if (!profile) return notFound();

  // 3. Fetch active links
  const { data: links } = await supabase
    .from('linktree_links')
    .select('id, label, url, icon, sort_order')
    .eq('page_id', page.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  return (
    <OneTapBio
      username={profile.username}
      profile={profile}
      page={page}
      links={links ?? []}
    />
  );
}
