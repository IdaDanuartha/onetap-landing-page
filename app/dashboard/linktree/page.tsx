'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Save, Check, ArrowLeft, ExternalLink, Loader2, LogOut, Camera, Trash2, Zap, Layout, Globe, Copy, Share2, Smartphone, Lock, X, Eye, EyeOff, Layers, AlertCircle } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { createClient } from '@/lib/supabase/client';
import { themes, templates } from '@/lib/themes';
import { SortableLinkCard } from '@/app/components/linktree/SortableLinkCard';
import type { LinkItem } from '@/app/components/linktree/SortableLinkCard';
import { OneTapPreview } from '@/app/components/linktree/OneTapPreview';
import Toast from '@/app/components/Toast';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { dict } from '@/lib/i18n/dict';
import { canAccess, isExpired, getPlan } from '@/lib/plans';
import type { PlanId } from '@/lib/plans';

export const dynamic = 'force-dynamic';

export default function OneTapBuilderPage() {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState('');
  const [slug, setSlug] = useState('');
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [profile, setProfile] = useState({ title: '', bio: '', avatar: '' });
  const [selectedTheme, setSelectedTheme] = useState('pink');
  const [isPro, setIsPro] = useState(false);
  const [plan, setPlan] = useState<PlanId>('starter');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const { locale: language } = useLanguage();
  const d = dict[language].dashboard.builder;
  
  // Multi-page state
  const [pages, setPages] = useState<any[]>([]);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);

  const planExpired = isExpired(expiresAt);
  const activePlan = getPlan(plan, expiresAt);
  const maxProfiles = activePlan.features.maxProfiles;

  // Load existing data
  const loadData = useCallback(async (pageId?: string) => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth/login'); return; }

    const url = pageId ? `/api/linktree/save?pageId=${pageId}` : '/api/linktree/save';
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      
      // Handle list of pages for Pro users
      if (data.pages) {
        setPages(data.pages);
      }

      if (data.profile) {
        setUsername(data.profile.username ?? '');
        const userPlan = (data.profile.plan as PlanId) ?? 'starter';
        setPlan(userPlan);
        setExpiresAt(data.profile.plan_expires_at);
        setIsPro(userPlan === 'professional' || userPlan === 'education');
      }
      
      if (data.page) {
        setCurrentPageId(data.page.id);
        setSlug(data.page.slug ?? '');
        setIsPublished(data.page.is_published ?? true);
        setProfile({
          title: data.page.title ?? '',
          bio: data.page.bio ?? '',
          avatar: data.profile?.avatar_url ?? '',
        });
        setSelectedTheme(data.page.theme_id ?? 'pink');
      } else {
        // If no page exists yet, set slug to username as default
        setSlug(data.profile?.username ?? '');
        setIsPublished(true);
      }
      
      if (data.links) {
        setLinks(
          data.links.map((l: any) => ({
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
  }, [router]);

  useEffect(() => {
    // Check for persisted page ID
    const savedPageId = typeof window !== 'undefined' ? localStorage.getItem('onetap_last_active_page_id') : null;
    loadData(savedPageId || undefined);
  }, [loadData]);

  // Update storage when currentPageId changes
  useEffect(() => {
    if (currentPageId) {
      localStorage.setItem('onetap_last_active_page_id', currentPageId);
    }
  }, [currentPageId]);

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
    // Check if current page is disabled due to plan
    const pageIndex = pages.findIndex(p => p.id === currentPageId);
    if (pageIndex !== -1 && pageIndex >= maxProfiles) {
      setToastMsg(t('dashboard.profileLimit.disabledDesc'));
      setToastType('error');
      setShowToast(true);
      return;
    }

    // Check if user is trying to save a Pro template without being Pro
    const selectedTemplate = templates.find(t => t.id === selectedTheme);
    const hasPremiumAccess = canAccess(plan, 'customBranding', expiresAt);

    if (selectedTemplate?.isPro && !hasPremiumAccess) {
      setToastMsg(d.profile.premiumTemplateError);
      setToastType('warning');
      setShowToast(true);
      return;
    }

    if (!slug || slug.length < 3) {
      setToastMsg(d.profile.slugError);
      setToastType('error');
      setShowToast(true);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/linktree/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          profile, 
          links, 
          theme: selectedTheme,
          pageId: currentPageId,
          slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
          isPublished
        }),
      });
      
      const result = await res.json();
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        setToastMsg(d.profile.saveSuccess);
        setToastType('success');
        setShowToast(true);
        // Refresh page list if new page was created or slug changed
        loadData(result.pageId);
      } else {
        setToastMsg(result.error || d.profile.saveFailed);
        setToastType('error');
        setShowToast(true);
      }
    } catch (err) {
      console.error(err);
      setToastMsg(d.profile.saveError);
      setToastType('error');
      setShowToast(true);
    }
    setSaving(false);
  };

  const createNewPage = async () => {
    if (pages.length >= maxProfiles) {
      const planName = locale === 'id' ? activePlan.nameId : activePlan.nameEn;
      setToastMsg(t('dashboard.profileLimit.reachedDesc').replace('{plan}', planName).replace('{limit}', maxProfiles.toString()));
      setToastType('warning');
      setShowToast(true);
      return;
    }

    // Reset editor for new page
    setCurrentPageId(null);
    setProfile({ title: d.profile.newProfile, bio: '', avatar: profile.avatar });
    setLinks([]);
    setSelectedTheme('pink');
    setSlug(''); // User will need to enter a new slug
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
      if (!publicUrl) {
        setToastMsg(d.profile.avatar.failed);
        setToastType('error');
        setShowToast(true);
        return;
      }
      setProfile((prev) => ({ ...prev, avatar: publicUrl }));
      
      await supabase
        .from('users_profile')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
        
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setToastMsg(d.profile.avatar.failed);
      setToastType('error');
      setShowToast(true);
    } finally {
      setUploading(false);
    }
  };

  const isPageDisabled = (id: string) => {
    const idx = pages.findIndex(p => p.id === id);
    return idx !== -1 && idx >= maxProfiles;
  };

  const currentIsDisabled = !!(currentPageId && isPageDisabled(currentPageId));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#FF5FA2] animate-spin" />
          <p className="text-sm font-black text-[#FF5FA2] uppercase tracking-widest">{d.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F2] selection:bg-[#FF5FA2]/20 selection:text-[#FF5FA2] pb-24 lg:pb-0">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#F6B7C8]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="p-2.5 rounded-xl hover:bg-[#FFF8F2] text-gray-500 hover:text-[#FF5FA2] transition-all">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-black text-[#18080F] hidden sm:block">{d.title}</h1>
              <h1 className="text-lg font-black text-[#18080F] sm:hidden">OneTap Builder</h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving || currentIsDisabled}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 ${
                  currentIsDisabled
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : saved 
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                      : 'bg-[#18080F] text-white hover:bg-[#FF5FA2] shadow-lg shadow-[#18080F]/10'
                }`}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : saved ? (
                  <><Check className="w-4 h-4" /> {d.saved}</>
                ) : (
                  <><Save className="w-4 h-4" /> {d.save}</>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {currentIsDisabled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-4 text-red-600"
          >
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-black text-sm uppercase tracking-wider">{t('dashboard.profileLimit.disabled')}</p>
              <p className="text-xs font-medium opacity-80">{t('dashboard.profileLimit.disabledDesc')}</p>
            </div>
            <Link href="/#pricing" className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all">
              {t('dashboard.planInfo.upgrade')}
            </Link>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-[1fr_360px] gap-12">

          {/* ===== LEFT: Editor ===== */}
          <div className={`space-y-10 ${currentIsDisabled ? 'opacity-60 pointer-events-none grayscale-[0.5]' : ''}`}>
            
            {/* Header info & Multi-page switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-black text-[#18080F] tracking-tight">{d.customization.title}</h2>
                <p className="text-sm font-medium text-gray-400 mt-1">{d.customization.desc}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black shadow-lg uppercase tracking-widest ${activePlan.id === 'starter' ? 'bg-gray-100 text-gray-400' : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-amber-500/20'}`}>
                  <Zap className="w-3.5 h-3.5" fill="currentColor" />
                  {locale === 'id' ? activePlan.nameId : activePlan.nameEn} PLAN
                </div>
                
                <div className="relative group">
                  <button 
                    onClick={createNewPage}
                    disabled={pages.length >= maxProfiles}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      pages.length >= maxProfiles
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        : 'bg-white border border-[#F6B7C8]/20 text-[#18080F] hover:bg-[#FF5FA2] hover:text-white'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    {d.addProfile}
                  </button>
                </div>
              </div>
            </div>

            {/* Page List (For Pro Users) */}
            {pages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {pages.map((p: any, idx: number) => {
                  const isDisabled = idx >= maxProfiles;
                  return (
                    <button
                      key={p.id}
                      onClick={() => loadData(p.id)}
                      className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        currentPageId === p.id 
                          ? 'bg-[#FF5FA2] text-white shadow-md' 
                          : 'bg-white text-gray-500 border border-[#F6B7C8]/10 hover:border-[#FF5FA2]/30'
                      } ${isDisabled ? 'opacity-50' : ''}`}
                    >
                      {p.title || d.untitled}
                      {isDisabled && <Lock className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Profile section */}
            <div className="p-6 sm:p-8 bg-white border border-[#F6B7C8]/10 rounded-[32px] shadow-sm space-y-8">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-[32px] bg-[#FFF8F2] border-2 border-dashed border-[#F6B7C8]/30 flex items-center justify-center overflow-hidden relative shadow-inner">
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-[#FF5FA2] animate-spin" />
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
                  <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                </div>

                <div className="flex-1 w-full space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#FF5FA2] uppercase tracking-widest ml-1">{d.profile.name}</label>
                      <input
                        type="text"
                        placeholder={d.profile.namePlaceholder}
                        value={profile.title}
                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                        className="w-full h-12 px-5 rounded-2xl border border-[#F6B7C8]/10 bg-[#FFF8F2]/50 focus:bg-white focus:border-[#FF5FA2]/40 outline-none transition-all font-bold text-[#18080F]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#FF5FA2] uppercase tracking-widest ml-1">{d.profile.slug}</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">/l/</span>
                        <input
                          type="text"
                          placeholder={d.profile.slugPlaceholder}
                          value={slug}
                          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                          className="w-full h-12 pl-8 pr-5 rounded-2xl border border-[#F6B7C8]/10 bg-[#FFF8F2]/50 focus:bg-white focus:border-[#FF5FA2]/40 outline-none transition-all font-bold text-[#18080F]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-xs font-black text-[#FF5FA2] uppercase tracking-widest ml-1">{d.profile.bio}</label>
                      <textarea
                        placeholder={d.profile.bioPlaceholder}
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={2}
                        className="w-full px-5 py-4 rounded-2xl border border-[#F6B7C8]/10 bg-[#FFF8F2]/50 focus:bg-white focus:border-[#FF5FA2]/40 outline-none transition-all font-medium text-gray-600 resize-none"
                      />
                    </div>
                    <div className="sm:w-48 flex flex-col justify-center">
                      <label className="text-[10px] font-black text-[#FF5FA2] uppercase tracking-[0.2em] mb-3 ml-1 block">{d.profile.status}</label>
                      <div 
                        onClick={() => setIsPublished(!isPublished)}
                        className={`group relative w-full h-[64px] rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center px-4 gap-3 ${
                          isPublished 
                            ? 'bg-green-50/50 border-green-200/50' 
                            : 'bg-gray-50 border-gray-200/60'
                        }`}
                      >
                        {/* Toggle Track */}
                        <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${isPublished ? 'bg-green-500' : 'bg-gray-300'}`}>
                          <motion.div 
                            animate={{ x: isPublished ? 22 : 2 }}
                            initial={false}
                            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </div>
                        
                        {/* Label */}
                        <div className="flex flex-col">
                          <span className={`text-xs font-black uppercase tracking-wider ${isPublished ? 'text-green-600' : 'text-gray-500'}`}>
                            {isPublished ? 'Live' : 'Draft'}
                          </span>
                          <span className="text-[9px] font-bold text-gray-400 leading-none">
                            {isPublished ? d.profile.public : d.profile.private}
                          </span>
                        </div>

                        {/* Decoration Icon */}
                        <div className={`ml-auto w-8 h-8 rounded-full flex items-center justify-center transition-all ${isPublished ? 'bg-green-500/10 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                          {isPublished ? <Check className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {(username || slug) && (
                <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Public URL</p>
                      <p className="text-sm font-bold text-[#18080F]">onetap-charm.com/l/{slug || username}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`https://onetap-charm.com/l/${slug || username}`);
                      setToastMsg(t('dashboard.copyLink'));
                      setToastType('success');
                      setShowToast(true);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-[#FF5FA2] hover:bg-[#FF5FA2]/5 transition-all text-xs font-bold"
                  >
                    <Copy className="w-4 h-4" />
                    {d.profile.copyLink}
                  </button>
                </div>
              )}
            </div>

            {/* Links section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-[#18080F] tracking-tight">{d.links.title}</h2>
                <button
                  onClick={addLink}
                  className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#FF5FA2] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#FF5FA2]/20 hover:-translate-y-0.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  {d.links.add}
                </button>
              </div>

              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                  <AnimatePresence mode="popLayout">
                    {links.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-16 sm:py-20 text-center bg-white/50 border-2 border-dashed border-[#F6B7C8]/20 rounded-[40px]"
                      >
                        <div className="w-20 h-20 rounded-3xl bg-white shadow-xl mx-auto flex items-center justify-center mb-6">
                          <Share2 className="w-10 h-10 text-gray-200" />
                        </div>
                        <p className="text-lg font-black text-[#18080F]">{d.links.empty}</p>
                        <p className="text-sm font-medium text-gray-400 mt-1">{d.links.emptyDesc}</p>
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
                <h2 className="text-xl font-black text-[#18080F] tracking-tight">{d.appearance.theme}</h2>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">Standard</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`group relative p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-2 sm:gap-3 ${
                      selectedTheme === theme.id 
                        ? 'border-[#FF5FA2] bg-white shadow-xl shadow-[#FF5FA2]/10 -translate-y-1' 
                        : 'border-[#F6B7C8]/10 bg-white hover:border-[#FF5FA2]/30'
                    }`}
                  >
                    <div className={`w-full h-12 sm:h-16 rounded-xl sm:rounded-2xl shadow-inner ${theme.previewBg}`} />
                    <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${selectedTheme === theme.id ? 'text-[#FF5FA2]' : 'text-gray-400'}`}>
                      {theme.name}
                    </span>
                    {selectedTheme === theme.id && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FF5FA2] text-white flex items-center justify-center shadow-lg">
                        <Check className="w-2.5 h-2.5" strokeWidth={5} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Template picker */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-[#18080F] tracking-tight">{d.appearance.template}</h2>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                  <Zap className="w-3 h-3" fill="currentColor" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Premium</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTheme(template.id)}
                    className={`group relative p-3 sm:p-4 rounded-[28px] sm:rounded-[32px] border-2 transition-all duration-300 flex flex-col items-center gap-3 sm:gap-4 ${
                      selectedTheme === template.id 
                        ? 'border-[#FF5FA2] bg-white shadow-2xl shadow-[#FF5FA2]/20 -translate-y-2' 
                        : 'border-[#F6B7C8]/10 bg-white hover:border-[#FF5FA2]/30'
                    }`}
                  >
                    <div className={`w-full aspect-[4/5] rounded-xl sm:rounded-2xl shadow-inner overflow-hidden relative ${template.previewBg}`}>
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/20" />
                        <div className="w-full h-2 rounded-full bg-white/20" />
                        <div className="w-full h-2 rounded-full bg-white/20" />
                      </div>
                      {!canAccess(plan, 'customBranding', expiresAt) && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="bg-white rounded-full p-2">
                             <Lock className="w-4 h-4 text-[#18080F]" />
                           </div>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <p className={`text-[10px] font-black uppercase tracking-widest ${selectedTheme === template.id ? 'text-[#FF5FA2]' : 'text-gray-400'}`}>
                        {template.name}
                      </p>
                    </div>
                    {selectedTheme === template.id && (
                      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#FF5FA2] text-white flex items-center justify-center shadow-xl z-10">
                        <Check className="w-3.5 h-3.5" strokeWidth={5} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {!canAccess(plan, 'customBranding', expiresAt) && (
                <p className="text-xs font-medium text-amber-600 bg-amber-50 p-4 rounded-2xl border border-amber-100">
                  <strong>💡 Info:</strong> {d.appearance.premiumInfo}
                </p>
              )}
            </div>

            {/* Pro Feature Multi-page Placeholder */}
            {pages.length >= maxProfiles && (
              <div className="p-8 rounded-[40px] bg-gradient-to-br from-[#18080F] to-[#2D1622] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5FA2]/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-black flex items-center justify-center sm:justify-start gap-2">
                      <Zap className="w-5 h-5 text-amber-400" fill="currentColor" />
                      {d.premiumLimit.title.replace('{limit}', maxProfiles.toString())}
                    </h3>
                    <p className="text-gray-400 mt-2 text-sm font-medium">
                      {d.premiumLimit.desc}
                    </p>
                  </div>
                  <Link 
                    href="/#pricing"
                    className="px-8 py-3 rounded-2xl bg-white text-[#18080F] font-black hover:bg-[#FF5FA2] hover:text-white transition-all shadow-xl"
                  >
                    {t('dashboard.planInfo.upgrade')}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ===== RIGHT: Live Preview (Desktop) ===== */}
          <div className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black text-[#18080F] uppercase tracking-widest flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#FF5FA2]" />
                  {d.preview.title}
                </h3>
              </div>

              {/* Phone mockup */}
              <div className="relative mx-auto w-[320px] h-[640px] bg-[#18080F] rounded-[56px] p-4 shadow-[0_40px_100px_-20px_rgba(24,8,15,0.3)] ring-1 ring-gray-800">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#18080F] rounded-b-3xl z-20" />
                <div className="w-full h-full rounded-[42px] overflow-hidden bg-white relative">
                <OneTapPreview profile={profile} links={links} theme={selectedTheme} />
                </div>
                <div className="absolute top-32 -left-1 w-1 h-12 bg-gray-800 rounded-r-lg" />
                <div className="absolute top-48 -left-1 w-1 h-12 bg-gray-800 rounded-r-lg" />
                <div className="absolute top-40 -right-1 w-1 h-16 bg-gray-800 rounded-l-lg" />
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={`/l/${slug || username}`}
                  target="_blank"
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white border border-[#F6B7C8]/20 text-[#18080F] font-bold shadow-sm hover:shadow-md transition-all group"
                >
                  <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  {d.preview.open}
                </a>
                <p className="text-[10px] text-center font-black text-gray-400 uppercase tracking-widest">
                  onetap-charm.com/l/{slug || username}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
        {isPublished && (
          <div className="bg-white/90 backdrop-blur-md border border-green-100 px-4 py-2 rounded-2xl shadow-xl animate-bounce-slow">
            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live Online
            </p>
          </div>
        )}
        <button
          onClick={() => setShowMobilePreview(true)}
          className="group flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#18080F] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">View Live</span>
            <span className="text-xs font-bold text-[#FF5FA2]">Mobile Preview</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FF5FA2] flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {showMobilePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#18080F]/90 backdrop-blur-sm lg:hidden flex items-center justify-center p-4"
          >
            <button 
              onClick={() => setShowMobilePreview(false)}
              className="absolute top-6 right-6 p-3 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="relative w-full max-w-[320px] h-[80vh] bg-[#18080F] rounded-[56px] p-4 shadow-2xl"
            >
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#18080F] rounded-b-2xl z-20" />
              <div className="w-full h-full rounded-[42px] overflow-hidden bg-white relative">
                <OneTapPreview profile={profile} links={links} theme={selectedTheme} />
              </div>
              
              <div className="absolute -bottom-16 left-0 right-0 flex flex-col items-center gap-2">
                 <a
                  href={`/l/${slug || username}`}
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#FF5FA2] text-white font-bold shadow-lg"
                >
                  <ExternalLink className="w-4 h-4" />
                  {d.preview.open}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-10px) rotate(10deg); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
        ::-webkit-scrollbar {
          width: 6px;
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
      <Toast 
        isVisible={showToast} 
        message={toastMsg} 
        type={toastType} 
        onClose={() => setShowToast(false)} 
      />
    </div>
  );
}

