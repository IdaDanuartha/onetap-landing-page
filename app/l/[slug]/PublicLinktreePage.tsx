'use client';

import { getTheme } from '@/lib/themes';
import Image from 'next/image';
import Link from 'next/link';
import { iconMap } from '@/app/components/linktree/IconPicker';

interface OneTapBioProps {
  username: string;
  profile: {
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
  };
  page: {
    title: string | null;
    bio: string | null;
    theme_id: string;
  };
  links: {
    id: string;
    label: string;
    url: string;
    icon: string | null;
    sort_order: number;
  }[];
}

export default function OneTapBio({ username, profile, page, links }: OneTapBioProps) {
  const theme = getTheme(page.theme_id);

  const handleLinkClick = async (linkId: string) => {
    // Track click in background — non-blocking
    fetch(`/api/linktree/click/${linkId}`, { method: 'POST' }).catch(() => {});
  };

  return (
    <div className={`min-h-screen flex flex-col items-center py-12 px-4 ${theme.bg}`}>
      {/* Profile */}
      <div className="text-center mb-8">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name ?? username}
            className="w-24 h-24 rounded-full mx-auto mb-4 ring-4 ring-white shadow-xl object-cover"
          />
        ) : (
          <div
            className="w-24 h-24 rounded-full mx-auto mb-4 ring-4 ring-white shadow-xl flex items-center justify-center text-3xl font-black text-white"
            style={{ background: theme.accent }}
          >
            {(page.title || profile.display_name || username).charAt(0).toUpperCase()}
          </div>
        )}

        <h1 className={`text-2xl font-black ${theme.text}`}>
          {page.title || profile.display_name || username}
        </h1>

        {(page.bio || profile.bio) && (
          <p className={`mt-2 text-sm max-w-xs mx-auto leading-relaxed ${theme.bio}`}>
            {page.bio || profile.bio}
          </p>
        )}
      </div>

      {/* Links */}
      <div className="w-full max-w-sm space-y-3">
        {links.length === 0 && (
          <p className="text-center text-sm opacity-60 py-8">
            Belum ada link yang ditambahkan.
          </p>
        )}
        {links.map((link) => {
          const Icon = iconMap[link.icon || 'link'];
          return (
            <a
              key={link.id}
              href={link.url}
              onClick={() => handleLinkClick(link.id)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between gap-2.5 w-full py-4 px-6 rounded-2xl font-semibold text-sm transition-all active:scale-95 ${theme.card} relative group overflow-hidden`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
                <span className="truncate">{link.label}</span>
              </div>
              <div className="w-5 h-5 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
              </div>
            </a>
          );
        })}
      </div>

      {/* OneTap branding footer */}
      <div className="mt-16 text-center">
        <Link
          href="/"
          className="text-[10px] font-bold text-gray-400/80 uppercase tracking-widest hover:text-[#FF5FA2] transition-colors flex items-center gap-2"
        >
          Dibuat dengan <span className="text-[#FF5FA2]">❤️</span> <span className="font-black text-gray-500">OneTap</span>
        </Link>
      </div>
    </div>
  );
}
