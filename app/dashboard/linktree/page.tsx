'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Save, Check, ArrowLeft, ExternalLink, Loader2, LogOut, Camera, Trash2, Zap, Layout, Globe, Copy, Share2, Smartphone, Lock } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { createClient } from '@/lib/supabase/client';
import { themes, templates } from '@/lib/themes';
import { SortableLinkCard } from '@/app/components/linktree/SortableLinkCard';
import type { LinkItem } from '@/app/components/linktree/SortableLinkCard';
import { LinktreePreview } from '@/app/components/linktree/LinktreePreview';

export default function LinktreeBuilderPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState('');
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [profile, setProfile] = useState({ title: '', bio: '', avatar: '' });
  const [selectedTheme, setSelectedTheme] = useState('pink');
  const [isPro, setIsPro] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load existing data
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }

      const res = await fetch('/api/linktree/save');
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setUsername(data.profile.username ?? '');
          setIsPro(data.profile.is_pro ?? false);
        }
        if (data.page) {
          setProfile({
            title: data.page.title ?? '',
            bio: data.page.bio ?? '',
            avatar: data.profile?.avatar_url ?? '',
          });
          setSelectedTheme(data.page.theme_id ?? 'pink');
        }
        if (data.links) {
          setLinks(
            data.links.map((l: { id: string; label: string; url: string; icon: string; is_active: boolean; click_count: number }) => ({
              id: l.id,
              label: l.label,
              url: l.url,
              icon: l.icon ?? 'link',
              isActive: l.is_active,
              clickCount: l.click_count,
            }))
          );
        }
      }
      setLoading(false);
    }
    load();
  }, [router]);

  const addLink = () => {
    setLinks((prev) => [
      ...prev,
      { id: uuid(), label: '', url: '', icon: 'link', isActive: true, clickCount: 0 },
    ]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = async () => {
    // Check if user is trying to save a Pro template without being Pro
    const selectedTemplate = templates.find(t => t.id === selectedTheme);
    if (selectedTemplate?.isPro && !isPro) {
      alert('Maaf, Anda perlu upgrade ke Pro Plan untuk menggunakan dan menyimpan template premium ini! Silakan gunakan tema standard atau upgrade sekarang.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/linktree/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, links, theme: selectedTheme }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      console.error(err);
    }
    setSaving(true); // Small delay
    setTimeout(() => setSaving(false), 800);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { uploadAvatar } = await import('@/lib/supabase/storage');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const publicUrl = await uploadAvatar(user.id, file);
      setProfile((prev) => ({ ...prev, avatar: publicUrl }));
      
      // Update users_profile immediately
      await supabase
        .from('users_profile')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
        
    } catch (err) {
      console.error('Error uploading avatar:', err);
      alert('Gagal mengunggah foto. Pastikan Supabase Storage sudah disetup sesuai panduan.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F2]">
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-[#FF5FA2]/20 blur-2xl"
          />
          <Image
            src="/images/logo_simple.png"
            alt="OneTap"
            width={64}
            height={64}
            className="relative object-contain animate-pulse"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F2] selection:bg-[#FF5FA2]/20 selection:text-[#FF5FA2]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#F6B7C8]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="p-2.5 rounded-xl hover:bg-[#FFF8F2] text-gray-500 hover:text-[#FF5FA2] transition-all">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-black text-[#18080F] hidden sm:block">Edit Linktree</h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                  saved 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                    : 'bg-[#18080F] text-white hover:bg-[#FF5FA2] shadow-lg shadow-[#18080F]/10'
                }`}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : saved ? (
                  <><Check className="w-4 h-4" /> Tersimpan</>
                ) : (
                  <><Save className="w-4 h-4" /> Simpan Perubahan</>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <div className="grid lg:grid-cols-[1fr_360px] gap-12">

          {/* ===== LEFT: Editor ===== */}
          <div className="space-y-10">
            
            {/* Header info */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-[#18080F] tracking-tight">Profil Digital</h2>
                <p className="text-sm font-medium text-gray-400 mt-1">Kustomisasi bagaimana dunia melihatmu.</p>
              </div>
              {isPro && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-black shadow-lg shadow-amber-500/20">
                  <Zap className="w-3.5 h-3.5" fill="white" />
                  PRO PLAN
                </div>
              )}
            </div>

            {/* Profile section */}
            <div className="p-8 bg-white border border-[#F6B7C8]/10 rounded-[32px] shadow-sm space-y-8">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-[32px] bg-[#FFF8F2] border-2 border-dashed border-[#F6B7C8]/30 flex items-center justify-center overflow-hidden relative shadow-inner">
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-[#FF5FA2] animate-spin" />
                        <span className="text-[10px] font-black text-[#FF5FA2] uppercase">Uploading...</span>
                      </div>
                    ) : profile.avatar ? (
                      <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-300" />
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className={`absolute -bottom-2 -right-2 p-2.5 rounded-xl text-white shadow-lg transition-all ${
                      uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF5FA2] hover:scale-110 shadow-[#FF5FA2]/20'
                    }`}
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarUpload} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>

                <div className="flex-1 w-full space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-[#FF5FA2] uppercase tracking-widest ml-1">Nama / Brand</label>
                    <input
                      type="text"
                      placeholder="Contoh: Budi Santoso"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      className="w-full h-12 px-5 rounded-2xl border border-[#F6B7C8]/10 bg-[#FFF8F2]/50 focus:bg-white focus:border-[#FF5FA2]/40 outline-none transition-all font-bold text-[#18080F]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-[#FF5FA2] uppercase tracking-widest ml-1">Bio Singkat</label>
                    <textarea
                      placeholder="Ceritakan tentang dirimu..."
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows={2}
                      className="w-full px-5 py-4 rounded-2xl border border-[#F6B7C8]/10 bg-[#FFF8F2]/50 focus:bg-white focus:border-[#FF5FA2]/40 outline-none transition-all font-medium text-gray-600 resize-none"
                    />
                  </div>
                </div>
              </div>

              {username && (
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Public URL</p>
                      <p className="text-sm font-bold text-[#18080F]">onetap-charm.com/l/{username}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(`https://onetap-charm.com/l/${username}`)}
                    className="p-3 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-[#FF5FA2] transition-all"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Links section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-[#18080F] tracking-tight">Koleksi Link</h2>
                <button
                  onClick={addLink}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF5FA2] text-white text-sm font-bold shadow-lg shadow-[#FF5FA2]/20 hover:-translate-y-0.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Link Baru
                </button>
              </div>

              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                  <AnimatePresence mode="popLayout">
                    {links.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-20 text-center bg-white/50 border-2 border-dashed border-[#F6B7C8]/20 rounded-[40px]"
                      >
                        <div className="w-20 h-20 rounded-3xl bg-white shadow-xl mx-auto flex items-center justify-center mb-6">
                          <Share2 className="w-10 h-10 text-gray-200" />
                        </div>
                        <p className="text-lg font-black text-[#18080F]">Belum ada link</p>
                        <p className="text-sm font-medium text-gray-400 mt-1">Mulai tambahkan link sosial media atau websitemu.</p>
                      </motion.div>
                    ) : (
                      <div className="grid gap-4">
                        {links.map((link) => (
                          <motion.div
                            key={link.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                          >
                            <SortableLinkCard
                              link={link}
                              onUpdate={(updated) =>
                                setLinks((prev) => prev.map((l) => (l.id === link.id ? updated : l)))
                              }
                              onDelete={() =>
                                setLinks((prev) => prev.filter((l) => l.id !== link.id))
                              }
                            />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </SortableContext>
              </DndContext>
            </div>

            {/* Theme picker */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-[#18080F] tracking-tight">Warna & Tema</h2>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">Standard</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`group relative p-3 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
                      selectedTheme === theme.id 
                        ? 'border-[#FF5FA2] bg-white shadow-xl shadow-[#FF5FA2]/10 -translate-y-1' 
                        : 'border-[#F6B7C8]/10 bg-white hover:border-[#FF5FA2]/30'
                    }`}
                  >
                    <div className={`w-full h-16 rounded-2xl shadow-inner ${theme.previewBg}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedTheme === theme.id ? 'text-[#FF5FA2]' : 'text-gray-400'}`}>
                      {theme.name}
                    </span>
                    {selectedTheme === theme.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#FF5FA2] text-white flex items-center justify-center shadow-lg">
                        <Check className="w-3 h-3" strokeWidth={4} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Template picker */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-[#18080F] tracking-tight">Template Layout</h2>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                  <Zap className="w-3 h-3" fill="currentColor" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Premium</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTheme(template.id)}
                    className={`group relative p-4 rounded-[32px] border-2 transition-all duration-300 flex flex-col items-center gap-4 ${
                      selectedTheme === template.id 
                        ? 'border-[#FF5FA2] bg-white shadow-2xl shadow-[#FF5FA2]/20 -translate-y-2' 
                        : 'border-[#F6B7C8]/10 bg-white hover:border-[#FF5FA2]/30'
                    }`}
                  >
                    <div className={`w-full aspect-[4/5] rounded-2xl shadow-inner overflow-hidden relative ${template.previewBg}`}>
                      {/* Mock layout inside preview */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/20" />
                        <div className="w-full h-2 rounded-full bg-white/20" />
                        <div className="w-full h-2 rounded-full bg-white/20" />
                        <div className="w-full h-2 rounded-full bg-white/20" />
                      </div>
                      
                      {!isPro && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="bg-white rounded-full p-2">
                             <Lock className="w-4 h-4 text-[#18080F]" />
                           </div>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-black uppercase tracking-widest ${selectedTheme === template.id ? 'text-[#FF5FA2]' : 'text-gray-400'}`}>
                        {template.name}
                      </p>
                    </div>
                    {selectedTheme === template.id && (
                      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#FF5FA2] text-white flex items-center justify-center shadow-xl z-10">
                        <Check className="w-4 h-4" strokeWidth={4} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {!isPro && (
                <p className="text-xs font-medium text-amber-600 bg-amber-50 p-4 rounded-2xl border border-amber-100">
                  <strong>💡 Info:</strong> Kamu bisa mencoba preview template di atas, tapi kamu perlu upgrade ke <strong>Pro Plan</strong> untuk menyimpan perubahan dengan template premium.
                </p>
              )}
            </div>

            {/* Pro Feature Multi-page Placeholder */}
            {!isPro && (
              <div className="p-8 rounded-[40px] bg-gradient-to-br from-[#18080F] to-[#2D1622] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5FA2]/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-black flex items-center justify-center sm:justify-start gap-2">
                      <Zap className="w-5 h-5 text-amber-400" fill="currentColor" />
                      Butuh Lebih Dari Satu Halaman?
                    </h3>
                    <p className="text-gray-400 mt-2 text-sm font-medium">Upgrade ke Pro Plan untuk membuat hingga 5 halaman Linktree berbeda.</p>
                  </div>
                  <button className="px-8 py-3 rounded-2xl bg-white text-[#18080F] font-black hover:bg-[#FF5FA2] hover:text-white transition-all shadow-xl">
                    Upgrade Sekarang
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ===== RIGHT: Live Preview ===== */}
          <div className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black text-[#18080F] uppercase tracking-widest flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#FF5FA2]" />
                  Live Preview
                </h3>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div className="w-2 h-2 rounded-full bg-green-500/30" />
                </div>
              </div>

              {/* Phone mockup */}
              <div className="relative mx-auto w-[320px] h-[640px] bg-[#18080F] rounded-[56px] p-4 shadow-[0_40px_100px_-20px_rgba(24,8,15,0.3)] ring-1 ring-gray-800">
                {/* Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#18080F] rounded-b-3xl z-20" />
                
                {/* Inner Content */}
                <div className="w-full h-full rounded-[42px] overflow-hidden bg-white relative">
                  <LinktreePreview
                    profile={profile}
                    links={links}
                    theme={selectedTheme}
                  />
                </div>

                {/* Side buttons */}
                <div className="absolute top-32 -left-1 w-1 h-12 bg-gray-800 rounded-r-lg" />
                <div className="absolute top-48 -left-1 w-1 h-12 bg-gray-800 rounded-r-lg" />
                <div className="absolute top-40 -right-1 w-1 h-16 bg-gray-800 rounded-l-lg" />
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={`/l/${username}`}
                  target="_blank"
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white border border-[#F6B7C8]/20 text-[#18080F] font-bold shadow-sm hover:shadow-md transition-all group"
                >
                  <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  Buka Halaman Penuh
                </a>
                <p className="text-[10px] text-center font-black text-gray-400 uppercase tracking-widest">
                  onetap-charm.com/l/{username}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-10px) rotate(10deg); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
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

