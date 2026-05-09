'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { BarChart2, ExternalLink, Layout, LogOut, Settings, Wifi, Zap, User, ChevronRight, Share2, CheckCircle2, X, Loader2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { canAccess, PLANS, PLAN_BADGE_COLORS } from '@/lib/plans';
import type { PlanId } from '@/lib/plans';
import Toast from '@/app/components/Toast';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; username: string; slug: string } | null>(null);
  const [plan, setPlan] = useState<PlanId>('starter');
  const [stats, setStats] = useState({ links: 0, totalClicks: 0 });
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { router.push('/auth/login'); return; }

      const { data: profile } = await supabase
        .from('users_profile')
        .select('display_name, username, plan')
        .eq('id', authUser.id)
        .single();

      // Get the latest page for the dashboard link
      const { data: pages } = await supabase
        .from('linktree_pages')
        .select('id, slug')
        .eq('user_id', authUser.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      const page = pages?.[0];

      if (profile) {
        setUser({
          name: profile.display_name ?? authUser.email ?? '',
          email: authUser.email ?? '',
          username: profile.username,
          slug: page?.slug || profile.username
        });
        setNewUsername(page?.slug || profile.username);
        setPlan((profile.plan as PlanId) ?? 'starter');
      }

      // Aggregate stats across all pages
      const { data: allPages } = await supabase
        .from('linktree_pages')
        .select('id')
        .eq('user_id', authUser.id);
      
      if (allPages && allPages.length > 0) {
        const pageIds = allPages.map(p => p.id);
        
        // Count published profiles
        const { count: activeProfilesCount } = await supabase
          .from('linktree_pages')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', authUser.id)
          .eq('is_published', true);

        // Sum click counts across all pages
        const { data: linkStats } = await supabase
          .from('linktree_links')
          .select('click_count')
          .in('page_id', pageIds);

        if (linkStats) {
          setStats({
            links: activeProfilesCount || 0,
            totalClicks: linkStats.reduce((sum, l) => sum + (l.click_count || 0), 0),
          });
        }
      }

      setLoading(false);
    }
    load();
  }, [router]);

  const handleUpdateUsername = async () => {
    if (!newUsername || newUsername === user?.slug) {
      setIsEditingUsername(false);
      return;
    }

    // Basic validation: only letters, numbers, hyphens, and underscores
    if (!/^[a-zA-Z0-9_-]+$/.test(newUsername)) {
      setUsernameError('URL hanya boleh berisi huruf, angka, - dan _');
      return;
    }

    setIsUpdating(true);
    setUsernameError('');
    const supabase = createClient();

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      // Check if slug is already taken by someone else
      const { data: existing } = await supabase
        .from('linktree_pages')
        .select('id, user_id')
        .eq('slug', newUsername)
        .maybeSingle();

      if (existing && existing.user_id !== authUser.id) {
        setUsernameError('URL sudah digunakan orang lain');
        setIsUpdating(false);
        return;
      }

      // Find the first page to update its slug
      const { data: firstPage } = await supabase
        .from('linktree_pages')
        .select('id')
        .eq('user_id', authUser.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (firstPage) {
        const { error } = await supabase
          .from('linktree_pages')
          .update({ slug: newUsername })
          .eq('id', firstPage.id);
        if (error) throw error;
      } else {
        // If no page, we might want to update username in profile instead
        const { error } = await supabase
          .from('users_profile')
          .update({ username: newUsername })
          .eq('id', authUser.id);
        if (error) throw error;
      }

      setUser(prev => prev ? { ...prev, slug: newUsername } : null);
      setIsEditingUsername(false);
    } catch (err) {
      console.error(err);
      setUsernameError('Gagal memperbarui URL');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleShare = async () => {
    const shareUrl = `https://onetap-charm.com/l/${user?.slug || user?.username}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'OneTap - My Digital Card',
          text: `Cek kartu digital saya di OneTap!`,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setToastMsg('Link disalin ke clipboard!');
      setShowToast(true);
    }
  };

  // Calculate dynamic conversion rate (mock logic: clicks / 10 views as base if no view data)
  const conversionRate = stats.totalClicks > 0
    ? ((stats.totalClicks / (stats.totalClicks + 15)) * 100).toFixed(1)
    : '0';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F2]">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#F6B7C8]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gray-200 animate-pulse" />
                <div className="w-24 h-6 bg-gray-200 rounded-lg animate-pulse hidden sm:block" />
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="mb-14">
            <div className="w-64 h-10 bg-gray-200 rounded-2xl animate-pulse mb-4" />
            <div className="w-96 h-6 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="w-12 h-8 bg-gray-100 rounded-lg animate-pulse" />
                  <div className="w-24 h-4 bg-gray-100 rounded-md animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm h-64">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 animate-pulse mb-6" />
                <div className="w-40 h-6 bg-gray-100 rounded-lg animate-pulse mb-4" />
                <div className="w-full h-4 bg-gray-100 rounded-md animate-pulse mb-2" />
                <div className="w-2/3 h-4 bg-gray-100 rounded-md animate-pulse" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F2] selection:bg-[#FF5FA2]/20 selection:text-[#FF5FA2]">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#FF5FA2]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#F6B7C8]/10 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#F6B7C8]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF5FA2] to-[#E8457E] flex items-center justify-center shadow-lg shadow-[#FF5FA2]/20 group-hover:scale-105 transition-transform duration-200">
                <Image src="/images/logo_simple.png" alt="OneTap" width={20} height={20} className="brightness-0 invert" />
              </div>
              <span className="text-xl font-extrabold text-[#18080F] tracking-tight hidden sm:block">OneTap</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/dashboard/settings"
                className="p-2.5 rounded-xl text-gray-500 hover:text-[#FF5FA2] hover:bg-[#FF5FA2]/5 transition-all duration-200 group"
                title="Settings"
              >
                <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              </Link>

              <div className="h-8 w-px bg-gray-200 hidden sm:block mx-1" />

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-bold text-[#18080F]">{user?.name}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${PLAN_BADGE_COLORS[plan] || PLAN_BADGE_COLORS.starter}`}>
                    {PLANS[plan]?.nameId || PLANS.starter.nameId}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200 group"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 sm:mb-14"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#18080F] tracking-tight flex items-center gap-3">
                Halo, {(user?.name || '').split(' ')[0]}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF5FA2] to-[#E8457E] flex items-center justify-center shadow-lg shadow-[#FF5FA2]/20">
                    <Image
                      src="/images/logo_simple.png"
                      alt="OneTap"
                      width={24}
                      height={24}
                      className="brightness-0 invert object-contain"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#FFF8F2] animate-pulse" />
                </motion.div>
              </h1>
              <div className="text-base sm:text-lg text-gray-500 mt-2 font-medium flex flex-wrap items-center gap-2">
                Kelola kartu digitalmu di
                <div className="flex items-center gap-2">
                  {isEditingUsername ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[#FF5FA2] font-bold">onetap-charm.com/l/</span>
                        <input
                          type="text"
                          value={newUsername}
                          onChange={(e) => {
                            setNewUsername(e.target.value.toLowerCase());
                            setUsernameError('');
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateUsername();
                            if (e.key === 'Escape') {
                              setIsEditingUsername(false);
                              setNewUsername(user?.slug || user?.username || '');
                              setUsernameError('');
                            }
                          }}
                          className="bg-white border-2 border-[#FF5FA2] rounded-lg px-2 py-0.5 text-sm font-bold text-[#FF5FA2] outline-none w-32 focus:ring-2 focus:ring-[#FF5FA2]/20 transition-all"
                          placeholder="username"
                          autoFocus
                        />
                        <button
                          onClick={handleUpdateUsername}
                          disabled={isUpdating}
                          className="p-1.5 rounded-lg bg-[#FF5FA2] text-white hover:bg-[#E8457E] disabled:opacity-50 transition-all"
                          title="Simpan"
                        >
                          {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingUsername(false);
                            setNewUsername(user?.username || '');
                            setUsernameError('');
                          }}
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
                          title="Batal"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {usernameError && <p className="text-[10px] text-red-500 font-bold">{usernameError}</p>}
                    </div>
                  ) : (
                    <>
                      <Link
                        href={`/l/${user?.slug || user?.username}`}
                        target="_blank"
                        className="text-[#FF5FA2] font-bold hover:underline transition-all"
                      >
                        onetap-charm.com/l/{user?.slug || user?.username}
                      </Link>
                      <button
                        onClick={() => setIsEditingUsername(true)}
                        className="p-1.5 rounded-lg hover:bg-[#FF5FA2]/5 text-gray-400 hover:text-[#FF5FA2] transition-all"
                        title="Ubah URL"
                      >
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl bg-white border border-gray-200 hover:border-[#FF5FA2] text-gray-400 hover:text-[#FF5FA2] transition-all shadow-sm hover:shadow-md ml-auto sm:ml-0"
                  title="Share link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <Link
              href="/dashboard/linktree"
              className="flex md:hidden items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white font-bold shadow-lg shadow-[#FF5FA2]/20"
            >
              <Layout className="w-5 h-5" />
              Edit Halaman
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 sm:mb-16"
        >
          {[
            { label: 'Profil Aktif', value: stats.links, icon: Layout, color: '#FF5FA2', bg: 'from-[#FFF1F7] to-[#FFF1F7]/50', border: 'border-[#FF5FA2]/10' },
            { label: 'Total Klik', value: stats.totalClicks, icon: BarChart2, color: '#8b5cf6', bg: 'from-[#f5f3ff] to-[#f5f3ff]/50', border: 'border-[#8b5cf6]/10' },
            { label: 'Conversion Rate', value: `${conversionRate}%`, icon: Zap, color: '#f59e0b', bg: 'from-[#fffbeb] to-[#fffbeb]/50', border: 'border-[#f59e0b]/10' },
          ].map((s, idx) => (
            <div
              key={s.label}
              className={`p-6 rounded-3xl bg-white border ${s.border} shadow-sm flex items-center gap-6 group hover:shadow-md transition-all duration-300`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <s.icon className="w-8 h-8" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-3xl font-black text-[#18080F]">{s.value}</p>
                <p className="text-sm font-bold text-gray-400 tracking-wide uppercase">{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Quick Actions Header */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-[#18080F] tracking-tight uppercase tracking-widest text-xs font-bold text-[#FF5FA2]">Menu Utama</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-[#FF5FA2]/20 to-transparent" />
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              href: '/dashboard/linktree',
              icon: Layout,
              title: 'Edit OneTap Card',
              desc: 'Sesuaikan link, profil, dan tema kartu digitalmu secara real-time.',
              color: '#FF5FA2',
              bg: 'bg-[#FFF1F7]',
              iconColor: 'text-[#FF5FA2]'
            },
            {
              href: '/dashboard/nfc/connect',
              icon: Wifi,
              title: 'Connect NFC Tag',
              desc: 'Hubungkan OneTap-mu ke NFC Keychain OneTap hanya dengan sekali tempel.',
              color: '#0ea5e9',
              bg: 'bg-[#f0f9ff]',
              iconColor: 'text-[#0ea5e9]'
            },
            {
              href: '/dashboard/analytics',
              icon: BarChart2,
              title: 'Insight & Statistik',
              desc: 'Analisa performa linkmu dengan data klik dan demografi pengunjung.',
              color: '#8b5cf6',
              bg: 'bg-[#f5f3ff]',
              iconColor: 'text-[#8b5cf6]',
            },
            {
              href: '/dashboard/attendance',
              icon: User,
              title: 'Attendance (Absensi)',
              desc: 'Kelola data kehadiran dan setup notifikasi WhatsApp otomatis.',
              color: '#22c55e',
              bg: 'bg-[#f0fdf4]',
              iconColor: 'text-[#22c55e]',
              locked: !canAccess(plan, 'attendance'),
              requiredPlan: 'Education',
            },
            {
              href: '/dashboard/settings',
              icon: Settings,
              title: 'Pengaturan Akun',
              desc: 'Update profil, ganti password, dan kelola keamanan akun kamu.',
              color: '#475569',
              bg: 'bg-gray-100',
              iconColor: 'text-gray-600',
            },

          ].map((item, idx) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className=""
            >
              {item.locked ? (
                <div className="group relative block p-8 rounded-[32px] bg-white border border-[#F6B7C8]/10 shadow-sm overflow-hidden h-full opacity-70">
                  <div className={`absolute top-0 right-0 w-32 h-32 ${item.bg}/30 rounded-full -mr-16 -mt-16 blur-3xl`} />
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF5FA2]/10 text-[#FF5FA2] text-xs font-bold">
                      <Lock className="w-3 h-3" />
                      {item.requiredPlan}
                    </div>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-6`}>
                    <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-black text-[#18080F] mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium mb-6">{item.desc}</p>
                  <a
                    href="/#pricing"
                    className="inline-flex items-center gap-2 text-[#FF5FA2] font-bold text-sm uppercase tracking-wider cursor-pointer"
                  >
                    Upgrade Plan
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <Link
                href={item.href}
                className="group relative block p-8 rounded-[32px] bg-white border border-[#F6B7C8]/10 shadow-sm hover:shadow-xl hover:shadow-[#FF5FA2]/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${item.bg}/30 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-500`} />

                <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300`}>
                  <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                </div>

                <h3 className="text-xl font-black text-[#18080F] mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium mb-6">
                  {item.desc}
                </p>

                <div className="flex items-center gap-2 text-[#FF5FA2] font-bold text-sm uppercase tracking-wider group-hover:gap-4 transition-all">
                  Kelola Sekarang
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 p-8 sm:p-12 rounded-[40px] bg-[#18080F] relative overflow-hidden text-center sm:text-left"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5FA2]/10 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">Butuh bantuan?</h3>
              <p className="text-gray-400 mt-2 font-medium max-w-md text-base">Tim support kami siap membantumu kapan saja jika ada kendala setting NFC atau OneTap Card.</p>
            </div>
            <a
              href="https://wa.me/6283114227745"
              target="_blank"
              className="px-8 py-4 rounded-2xl bg-[#FF5FA2] text-white font-black hover:bg-[#E8457E] transition-all duration-300 shadow-xl shadow-[#FF5FA2]/20 flex items-center gap-3"
            >
              Hubungi Kami
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-12 text-center text-sm font-bold text-gray-400 tracking-wide uppercase">
        © 2026 OneTap. All rights reserved.
      </footer>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-10px) rotate(10deg); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
      <Toast 
        isVisible={showToast} 
        message={toastMsg} 
        onClose={() => setShowToast(false)} 
      />
    </div>
  );
}

