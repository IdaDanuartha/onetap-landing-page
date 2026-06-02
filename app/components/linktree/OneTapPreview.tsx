import { User } from 'lucide-react';
import { getTheme, parseCustomTheme } from '@/lib/themes';
import type { LinkItem } from './SortableLinkCard';
import { iconMap } from './IconPicker';

interface OneTapPreviewProps {
  profile: { title: string; bio: string; avatar?: string };
  links: LinkItem[];
  theme: string;
}

export function OneTapPreview({ profile, links, theme }: OneTapPreviewProps) {
  const t = getTheme(theme);
  const customData = parseCustomTheme(theme);
  
  const isGrid = t.layout === 'grid';
  const isCompact = t.layout === 'compact';
  
  const activeLinks = links.filter((l) => l.isActive);

  const getButtonStyle = () => {
    switch (t.buttonStyle) {
      case 'rounded-full': return 'rounded-full';
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

  return (
    <div 
      className={`min-h-full flex flex-col items-center py-10 px-4 transition-all duration-500 overflow-y-auto ${t.bg}`}
      style={bgStyle}
    >
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
        <p 
          className={`font-bold text-sm text-center ${customData?.titleColor ? '' : t.text}`}
          style={customData?.titleColor ? { color: customData.titleColor } : undefined}
        >
          {profile.title}
        </p>
      ) : (
        <p className="font-bold text-sm text-center text-gray-300">Nama Kamu</p>
      )}

      {/* Bio */}
      {profile.bio && (
        <p 
          className={`text-xs text-center mt-1 max-w-[200px] leading-relaxed ${customData?.bioColor ? '' : t.bio}`}
          style={customData?.bioColor ? { color: customData.bioColor } : undefined}
        >
          {profile.bio}
        </p>
      )}

      {/* Links */}
      <div className={`w-full ${isGrid ? 'max-w-[260px] grid grid-cols-2 gap-2.5' : 'max-w-[240px]'} mt-6 ${isGrid ? '' : isCompact ? 'space-y-2' : 'space-y-3'}`}>
        {activeLinks.length === 0 ? (
          <p className="text-center text-xs text-gray-400 mt-4 italic col-span-2">Belum ada link</p>
        ) : (
          activeLinks.map((link) => {
            const Icon = iconMap[link.icon];
            return (
              <div
                key={link.id}
                className={`flex ${isGrid ? 'flex-col justify-center text-center py-4 px-2 gap-1.5' : 'items-center justify-between gap-2 py-3 px-4'} text-[10px] font-bold transition-all duration-300 hover:scale-[1.02] cursor-pointer ${t.card} ${getButtonStyle()}`}
              >
                <div className={`flex ${isGrid ? 'flex-col items-center' : 'items-center'} gap-2 min-w-0 w-full`}>
                  {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                  <span className="truncate w-full text-center">{link.label || 'Link saya'}</span>
                </div>
                {!isGrid && (
                  <div className="w-4 h-4 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Social Links */}
      {customData?.socialLinks && customData.socialLinks.length > 0 && (
        <div className="flex items-center justify-center gap-3 mt-6 flex-wrap max-w-[240px]">
          {customData.socialLinks.map((social: { platform: string; url: string }, index: number) => {
            const IconComponent = iconMap[social.platform];
            if (!IconComponent) return null;
            return (
              <div
                key={index}
                className={`opacity-70 hover:opacity-100 transition-opacity ${customData?.titleColor ? '' : t.text}`}
                style={customData?.titleColor ? { color: customData.titleColor } : undefined}
              >
                <IconComponent className="w-4 h-4" />
              </div>
            );
          })}
        </div>
      )}

      {/* Branding */}
      {customData?.showBranding !== false && (
        <p 
          className={`mt-auto pt-6 text-[10px] ${customData?.titleColor ? '' : t.text} opacity-40`}
          style={customData?.titleColor ? { color: customData.titleColor } : undefined}
        >
          Powered by OneTap
        </p>
      )}
    </div>
  );
}
