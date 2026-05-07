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

export const themes: Theme[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    previewBg: 'bg-white border border-gray-100',
    bg: 'bg-gray-50',
    card: 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-900',
    text: 'text-gray-900',
    bio: 'text-gray-500',
    accent: '#374151',
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
  },
  {
    id: 'pink',
    name: 'OneTap Pink',
    previewBg: 'bg-gradient-to-br from-pink-400 to-rose-500',
    bg: 'bg-gradient-to-br from-pink-50 to-rose-100',
    card: 'bg-white hover:bg-pink-50 border border-pink-100 text-gray-900',
    text: 'text-gray-900',
    bio: 'text-pink-500',
    accent: '#FF5FA2',
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
  },
  {
    id: 'nature',
    name: 'Nature',
    previewBg: 'bg-gradient-to-br from-green-400 to-emerald-500',
    bg: 'bg-gradient-to-br from-green-50 to-emerald-100',
    card: 'bg-white hover:bg-green-50 text-gray-900 border border-green-100',
    text: 'text-gray-900',
    bio: 'text-green-600',
    accent: '#059669',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    previewBg: 'bg-gradient-to-br from-blue-400 to-cyan-500',
    bg: 'bg-gradient-to-br from-blue-50 to-cyan-100',
    card: 'bg-white hover:bg-blue-50 text-gray-900 border border-blue-100',
    text: 'text-gray-900',
    bio: 'text-blue-500',
    accent: '#0ea5e9',
  },
];

export const templates: Template[] = [
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
    bio: 'text-magenta-400/80',
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
];

export function getTheme(id: string): Template {
  const allStyles = [...themes, ...templates];
  return allStyles.find((t) => t.id === id) ?? (themes[2] as Template);
}
