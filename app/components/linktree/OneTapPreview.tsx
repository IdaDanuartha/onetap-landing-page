import { User } from 'lucide-react';
import { getTheme } from '@/lib/themes';
import type { LinkItem } from './SortableLinkCard';
import { iconMap } from './IconPicker';

interface OneTapPreviewProps {
  profile: { title: string; bio: string; avatar?: string };
  links: LinkItem[];
  theme: string;
}

export function OneTapPreview({ profile, links, theme }: OneTapPreviewProps) {
  const t = getTheme(theme);
  const activeLinks = links.filter((l) => l.isActive);

  const getButtonStyle = () => {
    switch (t.buttonStyle) {
      case 'rounded-full': return 'rounded-full';
      case 'rounded-none': return 'rounded-none';
      case 'glass': return 'backdrop-blur-md shadow-xl border-white/20';
      default: return 'rounded-2xl shadow-sm';
    }
  };

  return (
    <div className={`min-h-full flex flex-col items-center py-10 px-4 transition-colors duration-500 ${t.bg}`}>
      {/* Avatar placeholder */}
      {profile.avatar ? (
        <img
          src={profile.avatar}
          alt={profile.title}
          className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-lg mb-3"
        />
      ) : (
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white mb-3 shadow-lg"
          style={{ background: t.accent || '#FF5FA2' }}
        >
          <User className="w-8 h-8" />
        </div>
      )}

      {/* Name */}
      {profile.title ? (
        <p className={`font-bold text-sm text-center ${t.text}`}>{profile.title}</p>
      ) : (
        <p className="font-bold text-sm text-center text-gray-300">Nama Kamu</p>
      )}

      {/* Bio */}
      {profile.bio && (
        <p className={`text-xs text-center mt-1 max-w-[200px] leading-relaxed ${t.bio}`}>{profile.bio}</p>
      )}

      {/* Links */}
      <div className="w-full max-w-[240px] mt-6 space-y-3">
        {activeLinks.length === 0 ? (
          <p className="text-center text-xs text-gray-400 mt-4 italic">Belum ada link</p>
        ) : (
          activeLinks.map((link) => {
            const Icon = iconMap[link.icon];
            return (
              <div
                key={link.id}
                className={`flex items-center justify-between gap-2 py-3 px-4 text-[10px] font-bold transition-all duration-300 hover:scale-[1.02] cursor-pointer ${t.card} ${getButtonStyle()}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                  <span className="truncate">{link.label || 'Link saya'}</span>
                </div>
                <div className="w-4 h-4 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Branding */}
      <p className="mt-6 text-[10px] text-gray-400">Powered by OneTap</p>
    </div>
  );
}

