'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, BarChart2, TrendingUp, MousePointer, Loader2, Zap, Layout, Share2, Activity, ChevronRight, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { iconMap } from '@/app/components/linktree/IconPicker';

interface LinkStat {
  id: string;
  label: string;
  url: string;
  icon: string;
  click_count: number;
  is_active: boolean;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<LinkStat[]>([]);
  const [totalClicks, setTotalClicks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }

      const { data: page } = await supabase
        .from('linktree_pages')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (page) {
        const { data: links } = await supabase
          .from('linktree_links')
          .select('id, label, url, icon, click_count, is_active')
          .eq('page_id', page.id)
          .order('click_count', { ascending: false });

        if (links) {
          setStats(links);
          setTotalClicks(links.reduce((sum, l) => sum + l.click_count, 0));
        }
      }
      setLoading(false);
    }
    load();
  }, [router]);

  const topStat = stats[0];
  const maxClicks = topStat?.click_count || 1;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F2]">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#F6B7C8]/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
            <div className="w-40 h-6 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-48 h-8 bg-gray-200 rounded-lg animate-pulse" />
            </div>
            <div className="w-32 h-8 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="p-8 bg-white border border-gray-100 rounded-[40px] flex items-center gap-6">
                <div className="w-20 h-20 rounded-[32px] bg-gray-100 animate-pulse" />
                <div className="space-y-2">
                  <div className="w-16 h-8 bg-gray-100 rounded animate-pulse" />
                  <div className="w-24 h-4 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          <div className="p-8 bg-white border border-gray-100 rounded-[48px] space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl animate-pulse" />
              <div className="w-40 h-6 bg-gray-100 rounded animate-pulse" />
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl animate-pulse" />
                    <div className="w-32 h-6 bg-gray-100 rounded animate-pulse" />
                  </div>
                  <div className="w-12 h-8 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="w-full h-2.5 bg-gray-50 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F2] selection:bg-[#FF5FA2]/20 selection:text-[#FF5FA2]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#F6B7C8]/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center gap-4">
          <Link href="/dashboard" className="p-2.5 rounded-xl hover:bg-[#FFF8F2] text-gray-500 hover:text-[#FF5FA2] transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-black text-[#18080F]">Statistik Performa</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black text-[#FF5FA2] uppercase tracking-[0.2em] mb-2">Real-time Data</p>
            <h2 className="text-3xl font-black text-[#18080F] tracking-tight">Overview Klik</h2>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#F6B7C8]/20 text-xs font-bold text-gray-500 shadow-sm">
            <Activity className="w-4 h-4 text-green-500" />
            Monitoring Aktif
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-white border border-[#F6B7C8]/10 rounded-[40px] shadow-sm flex items-center gap-6"
          >
            <div className="w-20 h-20 rounded-[32px] bg-[#FF5FA2]/5 flex items-center justify-center shadow-inner">
              <MousePointer className="w-10 h-10 text-[#FF5FA2]" />
            </div>
            <div>
              <p className="text-4xl font-black text-[#18080F] tracking-tighter">{totalClicks}</p>
              <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Total Interaksi</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 bg-white border border-[#F6B7C8]/10 rounded-[40px] shadow-sm flex items-center gap-6"
          >
            <div className="w-20 h-20 rounded-[32px] bg-indigo-50 flex items-center justify-center shadow-inner">
              <TrendingUp className="w-10 h-10 text-indigo-500" />
            </div>
            <div>
              <p className="text-4xl font-black text-[#18080F] tracking-tighter">{stats.filter(s => s.is_active).length}</p>
              <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Link Aktif</p>
            </div>
          </motion.div>
        </div>

        {/* Link breakdown */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 sm:p-10 bg-white border border-[#F6B7C8]/10 rounded-[48px] shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5FA2]/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF8F2] flex items-center justify-center">
                <BarChart2 className="w-6 h-6 text-[#FF5FA2]" />
              </div>
              <h3 className="text-xl font-black text-[#18080F]">Detail Klik per Link</h3>
            </div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Urutan Terpopuler</div>
          </div>

          {stats.length === 0 ? (
            <div className="py-20 text-center bg-[#FFF8F2]/50 border-2 border-dashed border-[#F6B7C8]/20 rounded-[40px]">
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-[2.5rem] bg-gray-50 flex items-center justify-center text-gray-300">
                  <Layout className="w-10 h-10" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-[#18080F] mb-2">Belum Ada OneTap Card</p>
                  <p className="text-gray-400 text-sm font-medium mb-6">Kamu belum membuat halaman OneTap Card apapun.</p>
                </div>
                <Link href="/dashboard/linktree" className="px-8 py-3.5 rounded-2xl bg-[#FF5FA2] text-white font-black hover:bg-[#E8457E] transition-all shadow-lg shadow-[#FF5FA2]/20 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Buat OneTap Pertama
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-8 relative z-10">
              {stats.map((link, idx) => {
                const Icon = iconMap[link.icon];
                return (
                  <motion.div 
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (idx * 0.05) }}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                          link.is_active ? 'bg-white border border-[#F6B7C8]/20 shadow-sm group-hover:border-[#FF5FA2]/40' : 'bg-gray-50 grayscale'
                        }`}>
                          {Icon ? <Icon className="w-5 h-5 text-[#18080F]" /> : <Layout className="w-5 h-5 text-gray-300" />}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-base font-black truncate ${link.is_active ? 'text-[#18080F]' : 'text-gray-400'}`}>
                            {link.label || 'Tanpa Label'}
                          </p>
                          <p className="text-xs font-medium text-gray-400 truncate">{link.url}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xl font-black text-[#FF5FA2] tracking-tight">{link.click_count}</p>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Klik</p>
                      </div>
                    </div>
                    {/* Progress bar container */}
                    <div className="h-2.5 bg-gray-50 rounded-full overflow-hidden p-0.5 border border-gray-100/50">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(2, (link.click_count / maxClicks) * 100)}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                        className={`h-full rounded-full ${
                          link.is_active 
                            ? 'bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] shadow-[0_0_10px_rgba(255,95,162,0.3)]' 
                            : 'bg-gray-300'
                        }`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Tip section */}
        <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-[#18080F] to-[#2D1622] rounded-[32px] text-white">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-amber-400" fill="currentColor" />
          </div>
          <div>
            <p className="text-sm font-bold">Tips Pro:</p>
            <p className="text-xs text-gray-400 mt-1 font-medium">Link dengan ikon yang relevan dan label yang menarik memiliki conversion rate 30% lebih tinggi!</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #F6B7C8;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #FF5FA2;
        }
      `}</style>
    </div>
  );
}

