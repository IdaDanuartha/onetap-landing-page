import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getTheme } from '@/lib/themes';
import { getPlan } from '@/lib/plans';
import type { Metadata } from 'next';
import OneTapBio from './PublicLinktreePage';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Get Page by Slug
  const { data: page } = await supabase
    .from('linktree_pages')
    .select('id, user_id, title, bio, is_published')
    .eq('slug', slug)
    .maybeSingle();

  if (!page) {
    return { title: 'Halaman Tidak Ditemukan | OneTap' };
  }

  // If page is unpublished (inactive due to free plan), reflect that in metadata
  if (!page.is_published) {
    return { title: 'Profil Tidak Aktif | OneTap' };
  }

  // 2. Get Profile
  const { data: profile } = await supabase
    .from('users_profile')
    .select('id, display_name, bio, avatar_url, plan, plan_expires_at')
    .eq('id', page.user_id)
    .maybeSingle();

  if (!profile) {
    return { title: 'Profil Tidak Ditemukan | OneTap' };
  }

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
    .select('id, user_id, title, bio, theme_id, is_published, password')
    .eq('slug', slug)
    .maybeSingle();

  if (!page) return notFound();

  // If profile is not published, show graceful inactive page
  if (!page.is_published) {
    // Try to find the user's active (published) profile to redirect
    const { data: activeProfile } = await supabase
      .from('linktree_pages')
      .select('slug, title')
      .eq('user_id', page.user_id)
      .eq('is_published', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return (
      <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6 py-16">
          {/* OneTap Logo */}
          <div className="w-20 h-20 rounded-[28px] bg-white shadow-xl mx-auto flex items-center justify-center">
            <img src="/images/logo_simple.png" alt="OneTap" className="w-12 h-12 object-contain" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-black uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Profil Tidak Aktif
            </div>
            <h1 className="text-2xl font-black text-[#18080F]">
              Profil ini sedang tidak aktif
            </h1>
            <p className="text-sm font-medium text-gray-400 leading-relaxed">
              Pemilik profil ini saat ini menggunakan paket gratis dan hanya dapat mengaktifkan satu profil sekaligus.
            </p>
          </div>

          {activeProfile ? (
            <Link
              href={`/l/${activeProfile.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#FF5FA2] text-white font-black shadow-lg shadow-[#FF5FA2]/20 hover:bg-[#E8457E] transition-all"
            >
              Lihat Profil Aktif →
            </Link>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#18080F] text-white font-black hover:bg-[#FF5FA2] transition-all"
            >
              Kembali ke OneTap
            </Link>
          )}

          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            Powered by OneTap
          </p>
        </div>
      </div>
    );
  }

  // 2. Fetch profile
  const { data: profile } = await supabase
    .from('users_profile')
    .select('id, display_name, bio, avatar_url, username, plan, plan_expires_at')
    .eq('id', page.user_id)
    .maybeSingle();

  if (!profile) return notFound();

  // Note: plan-limit enforcement is now handled via is_published.
  // The save/activate API auto-unpublishes extra profiles when plan is free/expired.

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

      page={{
        id: page.id,
        title: page.title,
        bio: page.bio,
        theme_id: page.theme_id,
        hasPassword: !!page.password
      }}
      links={links ?? []}
    />
  );
}
