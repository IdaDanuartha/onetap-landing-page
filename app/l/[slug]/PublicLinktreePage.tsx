'use client';

import { useState } from 'react';
import { getTheme, parseCustomTheme } from '@/lib/themes';
import Link from 'next/link';
import { User, Lock } from 'lucide-react';
import { iconMap } from '@/app/components/linktree/IconPicker';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface OneTapBioProps {
  username: string;
  profile: {
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
  };
  page: {
    id: string;
    title: string | null;
    bio: string | null;
    theme_id: string;
    hasPassword?: boolean;
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
  const { dict } = useLanguage();
  const [isUnlocked, setIsUnlocked] = useState(!page.hasPassword);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  const theme = getTheme(page.theme_id);
  const customData = parseCustomTheme(page.theme_id);

  const isGrid = theme.layout === 'grid';
  const isCompact = theme.layout === 'compact';

  const handleLinkClick = async (linkId: string) => {
    // Track click in background — non-blocking
    fetch(`/api/linktree/click/${linkId}`, { method: 'POST' }).catch(() => {});
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput) return;
    
    setError('');
    const res = await fetch('/api/linktree/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId: page.id, password: passwordInput })
    });

    if (res.ok) {
      setIsUnlocked(true);
      setError('');
    } else {
      setError(dict.protection.error);
    }
  };

  const getButtonStyle = () => {
    switch (theme.buttonStyle) {
      case 'rounded-full': return 'rounded-full shadow-sm';
      case 'rounded-none': return 'rounded-none';
      case 'glass': return 'backdrop-blur-md shadow-xl border-white/20';
      default: return 'rounded-2xl shadow-sm';
    }
  };

  const bgStyle = customData?.bgImage ? {
    backgroundImage: `url("${customData.bgImage}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  } : undefined;

  if (!isUnlocked) {
    return (
      <div 
        className={`min-h-screen flex flex-col items-center justify-center py-12 px-4 ${theme.bg}`}
        style={bgStyle}
      >
        <div className={`w-full max-w-sm p-8 rounded-3xl ${theme.card} text-center shadow-xl border border-white/20`}>
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-black/5">
            <Lock className="w-8 h-8 opacity-40" />
          </div>
          <h2 className={`text-xl font-black mb-2 ${theme.text}`}>{dict.protection.title}</h2>
          <p className={`text-sm mb-8 opacity-60 ${theme.bio}`}>{dict.protection.desc}</p>
          
          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder={dict.protection.placeholder}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className={`w-full px-6 py-4 rounded-2xl bg-black/5 border-2 ${error ? 'border-red-400' : 'border-transparent focus:border-black/10'} outline-none transition-all text-center font-bold tracking-widest`}
                autoFocus
              />
              {error && <p className="text-xs font-bold text-red-500 mt-2">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-black text-white font-black text-sm active:scale-95 transition-all shadow-lg shadow-black/10"
            >
              {dict.protection.button}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen flex flex-col items-center py-12 px-4 ${theme.bg}`}
      style={bgStyle}
    >
      {/* Profile */}
      <div className="text-center mb-8">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name ?? username}
            className="w-24 h-24 rounded-full mx-auto mb-4 ring-4 ring-white shadow-xl object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-black/10 flex items-center justify-center ring-4 ring-white shadow-xl">
            <User className="w-12 h-12 opacity-20" />
          </div>
        )}
        <h1 className={`text-2xl font-black mb-1 ${theme.text}`}>{profile.display_name ?? username}</h1>
        {profile.bio && <p className={`text-sm opacity-60 ${theme.bio}`}>{profile.bio}</p>}
      </div>

      {/* Links */}
      <div className={`w-full max-w-xl ${isGrid ? 'grid grid-cols-2 gap-4' : isCompact ? 'space-y-2.5' : 'space-y-4'}`}>
        {links.map((link) => {
          const IconComponent = link.icon ? (iconMap[link.icon as keyof typeof iconMap] || iconMap.Globe) : iconMap.Globe;
          
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link.id)}
              className={`w-full ${isCompact ? 'p-3' : 'p-4'} ${theme.card} flex ${isGrid ? 'flex-col justify-center text-center py-6 px-4 gap-3' : 'items-center justify-between'} active:scale-[0.98] transition-all group ${getButtonStyle()}`}
            >
              <div className={`flex ${isGrid ? 'flex-col items-center' : 'items-center'} gap-4 w-full`}>
                <div className={`w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center ${theme.text} opacity-80 group-hover:opacity-100 transition-opacity`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className={`font-bold ${theme.text} ${isGrid ? 'text-xs truncate w-full text-center' : ''}`}>{link.label}</span>
              </div>
              {!isGrid && (
                <div className={`w-8 h-8 rounded-full bg-black/5 flex items-center justify-center opacity-30 group-hover:opacity-100 transition-all`}>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </a>
          );
        })}
      </div>

      {/* Branding */}
      <div className="mt-auto pt-12 text-center opacity-40">
        <Link href="/" className={`text-[10px] font-black tracking-[0.2em] uppercase ${theme.text}`}>
          Powered by OneTap
        </Link>
      </div>
    </div>
  );
}

// Local helper to avoid missing import
function ArrowRight(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
}
