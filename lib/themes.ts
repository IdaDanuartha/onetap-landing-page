export interface Theme {
  id: string;
  name: string;
  previewBg: string;
  bg: string;
  card: string;
  text: string;
  bio: string;
  accent: string;
}

export interface Template extends Theme {
  layout?: 'classic' | 'compact' | 'grid';
  buttonStyle?: 'rounded-xl' | 'rounded-full' | 'rounded-none' | 'glass';
  isPro?: boolean;
}

export interface CustomThemeData {
  themeId: string;
  bgImage?: string;
  buttonStyle?: 'rounded-xl' | 'rounded-full' | 'rounded-none' | 'glass';
  layout?: 'classic' | 'compact' | 'grid';
  titleColor?: string;
  bioColor?: string;
  showBranding?: boolean;
  socialLinks?: { platform: string; url: string }[];
}

export const themes: Template[] = [
  // --- Basic / Free Themes (12) ---
  {
    id: 'pink',
    name: 'OneTap Pink',
    previewBg: 'bg-gradient-to-br from-pink-400 to-rose-500',
    bg: 'bg-gradient-to-br from-pink-50 to-rose-100',
    card: 'bg-white hover:bg-pink-50 border border-pink-100 text-gray-900',
    text: 'text-gray-900',
    bio: 'text-pink-500',
    accent: '#FF5FA2',
    isPro: false,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    previewBg: 'bg-white border border-gray-100',
    bg: 'bg-gray-50',
    card: 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-900',
    text: 'text-gray-900',
    bio: 'text-gray-500',
    accent: '#374151',
    isPro: false,
  },
  {
    id: 'dark',
    name: 'Dark',
    previewBg: 'bg-gray-900',
    bg: 'bg-gray-900',
    card: 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700',
    text: 'text-white',
    bio: 'text-gray-400',
    accent: '#ffffff',
    isPro: false,
  },
  {
    id: 'gradient',
    name: 'Gradient',
    previewBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
    bg: 'bg-gradient-to-br from-purple-600 to-pink-500',
    card: 'bg-white/20 hover:bg-white/30 backdrop-blur text-white border border-white/20',
    text: 'text-white',
    bio: 'text-white/70',
    accent: '#ffffff',
    isPro: false,
  },
  {
    id: 'forest',
    name: 'Forest Sage',
    previewBg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
    bg: 'bg-gradient-to-br from-emerald-50 to-teal-100',
    card: 'bg-white hover:bg-emerald-50 border border-emerald-100 text-emerald-950',
    text: 'text-emerald-950',
    bio: 'text-emerald-600',
    accent: '#10b981',
    isPro: false,
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    previewBg: 'bg-gradient-to-br from-orange-400 to-amber-500',
    bg: 'bg-gradient-to-br from-orange-50 to-amber-100',
    card: 'bg-white hover:bg-amber-50 border border-amber-100 text-amber-950',
    text: 'text-amber-950',
    bio: 'text-amber-600',
    accent: '#f59e0b',
    isPro: false,
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    previewBg: 'bg-gradient-to-br from-sky-400 to-blue-500',
    bg: 'bg-gradient-to-br from-sky-50 to-blue-100',
    card: 'bg-white hover:bg-blue-50 border border-blue-100 text-blue-950',
    text: 'text-blue-950',
    bio: 'text-blue-600',
    accent: '#3b82f6',
    isPro: false,
  },
  {
    id: 'lavender',
    name: 'Lavender Mist',
    previewBg: 'bg-gradient-to-br from-purple-400 to-indigo-500',
    bg: 'bg-gradient-to-br from-purple-50 to-indigo-100',
    card: 'bg-white hover:bg-purple-50 border border-purple-100 text-purple-950',
    text: 'text-purple-950',
    bio: 'text-purple-600',
    accent: '#8b5cf6',
    isPro: false,
  },
  {
    id: 'slate',
    name: 'Slate Clean',
    previewBg: 'bg-slate-500',
    bg: 'bg-[#F1F5F9]',
    card: 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-900',
    text: 'text-slate-900',
    bio: 'text-slate-500',
    accent: '#64748b',
    isPro: false,
  },
  {
    id: 'vintage-rose',
    name: 'Vintage Rose',
    previewBg: 'bg-gradient-to-br from-[#E8A7A1] to-[#C57B73]',
    bg: 'bg-[#FAF5F5]',
    card: 'bg-white hover:bg-rose-50 border border-rose-100 text-rose-950',
    text: 'text-rose-950',
    bio: 'text-rose-600',
    accent: '#c57b73',
    isPro: false,
  },
  {
    id: 'avocado',
    name: 'Earthy Avocado',
    previewBg: 'bg-[#8F9E8B]',
    bg: 'bg-[#F4F7F4]',
    card: 'bg-white hover:bg-emerald-50/50 border border-emerald-900/10 text-emerald-900',
    text: 'text-emerald-900',
    bio: 'text-emerald-700',
    accent: '#8f9e8b',
    isPro: false,
  },
  {
    id: 'coffee',
    name: 'Warm Espresso',
    previewBg: 'bg-[#8B7355]',
    bg: 'bg-[#FAF6F0]',
    card: 'bg-white hover:bg-[#F3EFE9] border border-[#E6DFD5] text-[#4A3B32]',
    text: 'text-[#4A3B32]',
    bio: 'text-[#6F5B4E]',
    accent: '#8b7355',
    isPro: false,
  },

  // --- Premium / Pro Templates (12) ---
  {
    id: 'glass-pro',
    name: 'Frosted Glass',
    previewBg: 'bg-gradient-to-br from-blue-400/30 to-purple-500/30 backdrop-blur',
    bg: 'bg-gradient-to-tr from-[#0F2027] via-[#203A43] to-[#2C5364]',
    card: 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-xl',
    text: 'text-white',
    bio: 'text-blue-200/80',
    accent: '#60a5fa',
    buttonStyle: 'glass',
    isPro: true,
  },
  {
    id: 'neo-brutalism',
    name: 'Neo Brutal',
    previewBg: 'bg-yellow-400 border-4 border-black',
    bg: 'bg-[#FFDE03]',
    card: 'bg-white hover:-translate-x-1 hover:-translate-y-1 border-4 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all',
    text: 'text-black font-black',
    bio: 'text-black/70 font-bold',
    accent: '#000000',
    buttonStyle: 'rounded-none',
    isPro: true,
  },
  {
    id: 'cyber-pro',
    name: 'Cyberpunk',
    previewBg: 'bg-black border border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]',
    bg: 'bg-[#0a0a0c]',
    card: 'bg-black/50 hover:bg-cyan-500/10 border-2 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] font-mono',
    text: 'text-cyan-400',
    bio: 'text-fuchsia-400/80',
    accent: '#06b6d4',
    buttonStyle: 'rounded-xl',
    isPro: true,
  },
  {
    id: 'sunset-pro',
    name: 'Soft Sunset',
    previewBg: 'bg-gradient-to-br from-orange-400 to-pink-500',
    bg: 'bg-gradient-to-b from-[#ffafbd] to-[#ffc3a0]',
    card: 'bg-white/80 hover:bg-white border-0 text-gray-800 shadow-lg shadow-orange-200/50',
    text: 'text-gray-900',
    bio: 'text-orange-700/70',
    accent: '#f97316',
    buttonStyle: 'rounded-full',
    isPro: true,
  },
  {
    id: 'artemis-pro',
    name: 'Artemis',
    previewBg: "bg-[url('https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=300')] bg-cover bg-center",
    bg: "bg-[url('https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center bg-no-repeat",
    card: 'bg-white/90 hover:bg-white text-[#4A5340] border border-white/20 shadow-lg',
    text: 'text-[#4A5340] font-black',
    bio: 'text-[#4A5340]/80 font-medium',
    accent: '#4A5340',
    buttonStyle: 'rounded-xl',
    isPro: true,
  },
  {
    id: 'balcombe-pro',
    name: 'Balcombe',
    previewBg: "bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=300')] bg-cover bg-center",
    bg: "bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center bg-no-repeat",
    card: 'bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-200/50 shadow-md',
    text: 'text-neutral-900 font-bold',
    bio: 'text-neutral-600 font-medium',
    accent: '#0ea5e9',
    buttonStyle: 'rounded-full',
    isPro: true,
  },
  {
    id: 'boultont-pro',
    name: 'Boultont',
    previewBg: "bg-[url('https://images.unsplash.com/photo-1505245208761-ba872912fac0?auto=format&fit=crop&q=80&w=300')] bg-cover bg-center",
    bg: "bg-[url('https://images.unsplash.com/photo-1505245208761-ba872912fac0?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center bg-no-repeat",
    card: 'bg-[#FAF0E6]/95 hover:bg-[#FAF0E6] text-[#8B4513] border border-[#8B4513]/20 shadow-xl',
    text: 'text-[#8B4513] font-black',
    bio: 'text-[#8B4513]/70 font-semibold',
    accent: '#8B4513',
    buttonStyle: 'rounded-xl',
    isPro: true,
  },
  {
    id: 'crombie-pro',
    name: 'Crombie',
    previewBg: "bg-[url('https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=300')] bg-cover bg-center",
    bg: "bg-[url('https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center bg-no-repeat",
    card: 'bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.03)]',
    text: 'text-neutral-900 font-bold',
    bio: 'text-neutral-500 font-medium',
    accent: '#525252',
    buttonStyle: 'rounded-xl',
    isPro: true,
  },
  {
    id: 'gordon-pro',
    name: 'Gordon',
    previewBg: "bg-[url('https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=300')] bg-cover bg-center",
    bg: "bg-[url('https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center bg-no-repeat",
    card: 'bg-white/95 hover:bg-white text-orange-950 shadow-lg border border-orange-100/50',
    text: 'text-orange-950 font-bold',
    bio: 'text-orange-900/80',
    accent: '#ea580c',
    buttonStyle: 'rounded-full',
    isPro: true,
  },
  {
    id: 'guildford-pro',
    name: 'Guildford Sport',
    previewBg: "bg-[url('https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=300')] bg-cover bg-center",
    bg: "bg-[url('https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center bg-no-repeat",
    card: 'bg-white/80 hover:bg-white/90 backdrop-blur-sm text-cyan-950 border border-white/20 shadow-2xl',
    text: 'text-cyan-950 font-black',
    bio: 'text-cyan-900/80 font-medium',
    accent: '#06b6d4',
    buttonStyle: 'rounded-xl',
    isPro: true,
  },
  {
    id: 'louden-pro',
    name: 'Louden',
    previewBg: "bg-[url('https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=300')] bg-cover bg-center",
    bg: "bg-[url('https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center bg-no-repeat",
    card: 'bg-[#FAF0E6]/90 hover:bg-[#FAF0E6] text-amber-950 border border-amber-900/10 shadow-lg',
    text: 'text-amber-950 font-bold',
    bio: 'text-amber-800/80',
    accent: '#78350f',
    buttonStyle: 'rounded-full',
    isPro: true,
  },
  {
    id: 'merlin-biz-pro',
    name: 'Merlin Biz',
    previewBg: "bg-[url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=300')] bg-cover bg-center",
    bg: "bg-[url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center bg-no-repeat",
    card: 'bg-[#1C1613]/85 hover:bg-[#1C1613]/95 text-amber-50 border border-[#8B5A2B]/30 shadow-2xl backdrop-blur-md',
    text: 'text-white font-bold',
    bio: 'text-[#D2B48C]/80 font-medium',
    accent: '#8B5A2B',
    buttonStyle: 'rounded-xl',
    isPro: true,
  },
];

export const templates: Template[] = themes.filter(t => t.isPro);

export function parseCustomTheme(id: string): CustomThemeData | null {
  if (id && id.startsWith('custom:')) {
    try {
      return JSON.parse(id.substring(7));
    } catch (e) {
      console.error('Failed to parse custom theme JSON:', e);
      return null;
    }
  }
  return null;
}

export function getTheme(id: string): Template {
  const customData = parseCustomTheme(id);
  if (customData) {
    const baseTheme = themes.find((t) => t.id === customData.themeId) ?? themes[0];
    const customized: Template = {
      ...baseTheme,
      id, // Preserve custom serialized string as theme ID
      layout: customData.layout ?? baseTheme.layout,
      buttonStyle: customData.buttonStyle ?? baseTheme.buttonStyle,
    };
    if (customData.bgImage) {
      customized.bg = 'bg-cover bg-center bg-no-repeat';
      customized.previewBg = 'bg-cover bg-center';
    }
    return customized;
  }
  return themes.find((t) => t.id === id) ?? themes[0];
}
