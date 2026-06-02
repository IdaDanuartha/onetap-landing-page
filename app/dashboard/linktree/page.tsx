'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Save, Check, ArrowLeft, ExternalLink, Loader2, LogOut, Camera, Trash2, Zap, Layout, Globe, Copy, Share2, Smartphone, Lock, X, Eye, EyeOff, Layers, AlertCircle, Radio, BookOpen, Search, SlidersHorizontal } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { createClient } from '@/lib/supabase/client';
import { themes, templates } from '@/lib/themes';
import { SortableLinkCard } from '@/app/components/linktree/SortableLinkCard';
import type { LinkItem } from '@/app/components/linktree/SortableLinkCard';
import { OneTapPreview } from '@/app/components/linktree/OneTapPreview';
import { iconMap } from '@/app/components/linktree/IconPicker';
import Toast from '@/app/components/Toast';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { dict } from '@/lib/i18n/dict';
import { canAccess, isExpired, getPlan } from '@/lib/plans';
import type { PlanId } from '@/lib/plans';
import nextDynamic from 'next/dynamic';
const GuidedTour = nextDynamic(() => import('@/app/components/GuidedTour'), { ssr: false });

export const dynamic = 'force-dynamic';

const SOCIAL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', placeholder: '@username atau URL' },
  { id: 'whatsapp', label: 'WhatsApp', placeholder: 'Nomor WhatsApp (mis: 62812...)' },
  { id: 'tiktok', label: 'TikTok', placeholder: '@username atau URL' },
  { id: 'youtube', label: 'YouTube', placeholder: '@username atau URL' },
  { id: 'twitter', label: 'Twitter/X', placeholder: '@username atau URL' },
  { id: 'linkedin', label: 'LinkedIn', placeholder: 'username atau URL' },
  { id: 'facebook', label: 'Facebook', placeholder: 'username atau URL' },
  { id: 'github', label: 'GitHub', placeholder: 'username atau URL' },
  { id: 'email', label: 'Email', placeholder: 'alamat email' },
  { id: 'phone', label: 'Telepon', placeholder: 'Nomor telepon' },
  { id: 'website', label: 'Website', placeholder: 'https://example.com' },
];

export default function OneTapBuilderPage() {
  const router = useRouter();
  const { t, locale, setLocale } = useLanguage();
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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const language = locale;
  const d = dict[language].dashboard.builder;

  const selectedTemplate = useMemo(() => templates.find(t => t.id === selectedTheme), [selectedTheme]);
  const hasPremiumAccess = useMemo(() => canAccess(plan, 'customBranding', expiresAt), [plan, expiresAt]);
  const isPremiumThemeSelected = useMemo(() => !!(selectedTemplate?.isPro && !hasPremiumAccess), [selectedTemplate, hasPremiumAccess]);

  // Themes Explorer Modal State
  const [showThemesModal, setShowThemesModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'free' | 'pro'>('all');

  // Premium Customizations
  const [customBgImage, setCustomBgImage] = useState('');
  const [customButtonStyle, setCustomButtonStyle] = useState<'rounded-xl' | 'rounded-full' | 'rounded-none' | 'glass' | ''>('');
  const [customLayout, setCustomLayout] = useState<'classic' | 'compact' | 'grid' | ''>('');
  const [customTitleColor, setCustomTitleColor] = useState('');
  const [customBioColor, setCustomBioColor] = useState('');
  const [showBranding, setShowBranding] = useState(true);
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([]);
  const [activeSocialTab, setActiveSocialTab] = useState<string>('instagram');

  const setSocialUrl = (platform: string, value: string) => {
    setSocialLinks(prev => {
      const filtered = prev.filter(s => s.platform !== platform);
      if (!value.trim()) return filtered;
      let url = value.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        if (platform === 'instagram') url = `https://instagram.com/${url.replace('@', '')}`;
        else if (platform === 'twitter') url = `https://x.com/${url.replace('@', '')}`;
        else if (platform === 'tiktok') url = `https://tiktok.com/@${url.replace('@', '')}`;
        else if (platform === 'youtube') url = `https://youtube.com/@${url.replace('@', '')}`;
        else if (platform === 'github') url = `https://github.com/${url.replace('@', '')}`;
        else if (platform === 'facebook') url = `https://facebook.com/${url}`;
        else if (platform === 'linkedin') url = `https://linkedin.com/in/${url}`;
        else if (platform === 'whatsapp') {
          const cleanNum = url.replace(/\D/g, '');
          url = `https://wa.me/${cleanNum}`;
        }
        else if (platform === 'email') url = `mailto:${url}`;
        else if (platform === 'phone') url = `tel:${url}`;
      }
      return [...filtered, { platform, url }];
    });
  };
  const [uploadingBg, setUploadingBg] = useState(false);
  const fileInputBgRef = useRef<HTMLInputElement>(null);

  // Dynamic theme ID serialization for save body & previews
  const resolvedThemeId = useMemo(() => {
    if (!hasPremiumAccess) {
      return selectedTheme;
    }
    if (customBgImage || customButtonStyle || customLayout || customTitleColor || customBioColor || !showBranding || (socialLinks && socialLinks.length > 0)) {
      return `custom:${JSON.stringify({
        themeId: selectedTheme,
        bgImage: customBgImage || undefined,
        buttonStyle: customButtonStyle || undefined,
        layout: customLayout || undefined,
        titleColor: customTitleColor || undefined,
        bioColor: customBioColor || undefined,
        showBranding: showBranding,
        socialLinks: socialLinks.length > 0 ? socialLinks : undefined,
      })}`;
    }
    return selectedTheme;
  }, [selectedTheme, customBgImage, customButtonStyle, customLayout, customTitleColor, customBioColor, showBranding, socialLinks, hasPremiumAccess]);

  // Filter exactly 4 basic and exactly 4 premium themes for dashboard main display
  const displayedThemes = useMemo(() => {
    const basicThemes = themes.filter(t => !t.isPro).slice(0, 4);
    const premiumThemes = themes.filter(t => t.isPro).slice(0, 4);
    return [...basicThemes, ...premiumThemes];
  }, []);

  // Guided Tour State
  const [runTour, setRunTour] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const [tourKey, setTourKey] = useState(0);

  // Diagnostic logs
  useEffect(() => {
    if (!loading) {
      console.log('[OneTap Builder] Plan status initialized:', {
        plan,
        expiresAt,
        hasPremiumAccess,
        isPro
      });
    }
  }, [loading, plan, expiresAt, hasPremiumAccess, isPro]);

  useEffect(() => {
    if (!loading) {
      const searchParams = new URLSearchParams(window.location.search);
      const isTourParam = searchParams.get('tour') === 'true';
      const completed = localStorage.getItem('onetap_tour_builder_completed');
      if (isTourParam) {
        // Clear parameter immediately
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        
        setTourStepIndex(0);
        setRunTour(true);
      } else if (!completed) {
        localStorage.setItem('onetap_tour_builder_completed', 'true');
        setTourStepIndex(0);
        setRunTour(true);
      }
    }
  }, [loading]);

  const handleTourClose = () => {
    setRunTour(false);
    localStorage.setItem('onetap_tour_builder_completed', 'true');
  };

  const handleTourRestart = () => {
    setTourStepIndex(0);
    setTourKey(prev => prev + 1);
    setRunTour(true);
  };

  const handleTourCallback = (data: any) => {
    const { action, index, status, type } = data;
    if (type === "step:after") {
      setTourStepIndex(index + (action === "prev" ? -1 : 1));
    } else if (["finished", "skipped"].includes(status) || type === "tour:end") {
      handleTourClose();
    }
  };

  const tourSteps = useMemo(() => [
    {
      target: '#tour-profile-section',
      title: t('dashboard.tour.builder.profile.title'),
      content: t('dashboard.tour.builder.profile.desc'),
      placement: 'bottom' as const,
      data: { id: 'profile' },
      disableBeacon: true,
      spotlightClicks: true,
    },
    {
      target: '#tour-add-link',
      title: t('dashboard.tour.builder.addLink.title'),
      content: t('dashboard.tour.builder.addLink.desc'),
      placement: 'bottom' as const,
      data: { id: 'addLink' },
      disableBeacon: true,
      spotlightClicks: true,
    },
    {
      target: '#tour-links-list',
      title: t('dashboard.tour.builder.linksList.title'),
      content: t('dashboard.tour.builder.linksList.desc'),
      placement: 'top' as const,
      data: { id: 'linksList' },
      disableBeacon: true,
      spotlightClicks: true,
    },
    {
      target: '#tour-theme-picker',
      title: t('dashboard.tour.builder.themes.title'),
      content: t('dashboard.tour.builder.themes.desc'),
      placement: 'top' as const,
      data: { id: 'themes' },
      disableBeacon: true,
      spotlightClicks: true,
    },
    {
      target: '#tour-save-btn',
      title: t('dashboard.tour.builder.save.title'),
      content: t('dashboard.tour.builder.save.desc'),
      placement: 'bottom' as const,
      data: { id: 'save' },
      disableBeacon: true,
      spotlightClicks: true,
    },
  ], [t]);
  
  // Multi-page state
  const [pages, setPages] = useState<any[]>([]);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [activating, setActivating] = useState<string | null>(null);
  const [deletingPageId, setDeletingPageId] = useState<string | null>(null);
  const [deleteConfirmPage, setDeleteConfirmPage] = useState<any | null>(null);

  const planExpired = isExpired(expiresAt);
  const activePlan = getPlan(plan, expiresAt);
  const maxProfiles = activePlan.features.maxProfiles;
  // Whether user is on a restricted plan (only 1 active profile)
  const isFreePlan = maxProfiles === 1;

  // Load existing data
  const loadData = useCallback(async (pageId?: string) => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth/login'); return; }

    const url = pageId 
      ? `/api/linktree/save?pageId=${pageId}&_t=${Date.now()}` 
      : `/api/linktree/save?_t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      
      // Handle list of pages for Pro users
      if (data.pages) {
        setPages(data.pages);
      }

      if (data.profile) {
        console.log('[loadData] Loaded profile plan details:', {
          plan: data.profile.plan,
          expires_at: data.profile.plan_expires_at,
          email: data.profile.email
        });
        setUsername(data.profile.username ?? '');
        const dbPlan = data.profile.plan;
        const userPlan = dbPlan === 'free' ? 'starter' : (dbPlan as PlanId) ?? 'starter';
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
        
        const dbThemeId = data.page.theme_id ?? 'pink';
        if (dbThemeId.startsWith('custom:')) {
          try {
            const customData = JSON.parse(dbThemeId.substring(7));
            setSelectedTheme(customData.themeId || 'pink');
            setCustomBgImage(customData.bgImage ?? '');
            setCustomButtonStyle(customData.buttonStyle ?? '');
            setCustomLayout(customData.layout ?? '');
            setCustomTitleColor(customData.titleColor ?? '');
            setCustomBioColor(customData.bioColor ?? '');
            setShowBranding(customData.showBranding !== false);
            setSocialLinks(customData.socialLinks ?? []);
          } catch (e) {
            console.error('Failed to parse loaded custom theme:', e);
            setSelectedTheme(dbThemeId);
          }
        } else {
          setSelectedTheme(dbThemeId);
          setCustomBgImage('');
          setCustomButtonStyle('');
          setCustomLayout('');
          setCustomTitleColor('');
          setCustomBioColor('');
          setShowBranding(true);
          setSocialLinks([]);
        }
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
    } else if (res.status === 404) {
      if (pageId) {
        localStorage.removeItem('onetap_last_active_page_id');
        loadData();
        return;
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
    if (runTour && tourStepIndex === 1) {
      setTourStepIndex(2);
    }
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
    if (isPremiumThemeSelected) {
      setShowUpgradeModal(true);
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
          theme: resolvedThemeId,
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
        if (runTour && tourStepIndex === 4) {
          handleTourClose();
        }
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
    setCustomBgImage('');
    setCustomButtonStyle('');
    setCustomLayout('');
    setCustomTitleColor('');
    setCustomBioColor('');
    setShowBranding(true);
    setSocialLinks([]);
    setSlug(''); // User will need to enter a new slug
  };

  // Instantly activate a profile (free/expired plan: only 1 can be published)
  const activateProfile = async (pageId: string) => {
    setActivating(pageId);
    try {
      const res = await fetch('/api/linktree/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId }),
      });
      if (res.ok) {
        setToastMsg('Profil berhasil diaktifkan! Profil lain telah dinonaktifkan.');
        setToastType('success');
        setShowToast(true);
        // Refresh page list to reflect updated is_published states
        await loadData(pageId);
      } else {
        const err = await res.json();
        setToastMsg(err.error || 'Gagal mengaktifkan profil.');
        setToastType('error');
        setShowToast(true);
      }
    } catch (e) {
      setToastMsg('Gagal mengaktifkan profil.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setActivating(null);
    }
  };

  // Delete a profile page permanently
  const deleteProfile = async (pageId: string) => {
    setDeletingPageId(pageId);
    try {
      // Clear custom premium background from storage before deleting the page data
      try {
        const detailRes = await fetch(`/api/linktree/save?pageId=${pageId}`);
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          const dbThemeId = detailData.page?.theme_id;
          if (dbThemeId && dbThemeId.startsWith('custom:')) {
            const customData = JSON.parse(dbThemeId.substring(7));
            if (customData.bgImage) {
              const { deleteStorageFile } = await import('@/lib/supabase/storage');
              await deleteStorageFile(customData.bgImage);
            }
          }
        }
      } catch (e) {
        console.error('Failed to clean up page custom bg on delete:', e);
      }

      const res = await fetch(`/api/linktree/save?pageId=${pageId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeleteConfirmPage(null);
        setToastMsg('Profil berhasil dihapus.');
        setToastType('success');
        setShowToast(true);
        // If we deleted the currently open page, switch to another or reset
        const remaining = pages.filter(p => p.id !== pageId);
        if (currentPageId === pageId) {
          if (remaining.length > 0) {
            await loadData(remaining[0].id);
          } else {
            // No pages left — reset to empty state
            setCurrentPageId(null);
            setProfile({ title: '', bio: '', avatar: profile.avatar });
            setLinks([]);
            setSlug('');
            setPages([]);
            setLoading(false);
          }
        } else {
          await loadData(currentPageId || undefined);
        }
      } else {
        const err = await res.json();
        setDeleteConfirmPage(null);
        setToastMsg(err.error || 'Gagal menghapus profil.');
        setToastType('error');
        setShowToast(true);
      }
    } catch (e) {
      setDeleteConfirmPage(null);
      setToastMsg('Gagal menghapus profil.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setDeletingPageId(null);
    }
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

      // Delete old avatar from storage to save space
      if (profile.avatar) {
        try {
          const { deleteStorageFile } = await import('@/lib/supabase/storage');
          await deleteStorageFile(profile.avatar);
        } catch (e) {
          console.error('Failed to delete old avatar:', e);
        }
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

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBg(true);
    try {
      const { uploadBg } = await import('@/lib/supabase/storage');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const publicUrl = await uploadBg(user.id, file);
      if (!publicUrl) {
        setToastMsg('Gagal mengunggah latar belakang.');
        setToastType('error');
        setShowToast(true);
        return;
      }
      
      // Delete old background image from storage to save space
      if (customBgImage) {
        try {
          const { deleteStorageFile } = await import('@/lib/supabase/storage');
          await deleteStorageFile(customBgImage);
        } catch (e) {
          console.error('Failed to delete old background:', e);
        }
      }

      setCustomBgImage(publicUrl);
      setToastMsg('Latar belakang berhasil diunggah!');
      setToastType('success');
      setShowToast(true);
    } catch (err) {
      console.error('Error uploading custom bg:', err);
      setToastMsg('Gagal mengunggah latar belakang.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setUploadingBg(false);
    }
  };

  // Find the single active page ID for free plan users
  // (the first page in the pages list that has is_published === true)
  const activePageIdOnFreePlan = isFreePlan 
    ? pages.find(p => p.is_published)?.id 
    : null;

  // currentPageIsInactive: true when viewing a profile that is not currently published
  // (free/expired plan users can have multiple profiles, but only 1 is live)
  const currentPageIsInactive = isFreePlan && currentPageId
    ? (activePageIdOnFreePlan ? currentPageId !== activePageIdOnFreePlan : true)
    : currentPageId
      ? (pages.find(p => p.id === currentPageId)?.is_published === false)
      : false;

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
            <div className="flex items-center gap-2 sm:gap-4 max-w-[50%] min-w-0">
              <Link href="/dashboard" className="p-2 sm:p-2.5 rounded-xl hover:bg-[#FFF8F2] text-gray-500 hover:text-[#FF5FA2] transition-all flex-shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-black text-[#18080F] hidden sm:block truncate">{d.title}</h1>
              <h1 className="text-base sm:text-lg font-black text-[#18080F] sm:hidden truncate whitespace-nowrap">OneTap Builder</h1>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              <button
                onClick={handleTourRestart}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl text-gray-500 hover:text-[#FF5FA2] hover:bg-[#FF5FA2]/5 transition-all duration-300 text-[10px] sm:text-xs font-bold uppercase cursor-pointer whitespace-nowrap animate-pulse"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">{t('dashboard.tour.restart')}</span>
              </button>

              <div className="h-6 w-px bg-gray-100 mx-0.5 sm:mx-1 hidden sm:block" />

              <button
                onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl text-gray-500 hover:text-[#FF5FA2] hover:bg-[#FF5FA2]/5 transition-all duration-300 text-[10px] sm:text-xs font-bold uppercase whitespace-nowrap"
              >
                <Globe className="w-4 h-4" />
                <span>{locale.toUpperCase()}</span>
              </button>

              <div className="h-6 w-px bg-gray-100 mx-0.5 sm:mx-1 hidden sm:block" />

              <button
                id="tour-save-btn"
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-base transition-all duration-300 whitespace-nowrap ${
                  saved 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                    : isPremiumThemeSelected
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20'
                      : 'bg-[#18080F] text-white hover:bg-[#FF5FA2] shadow-lg shadow-[#18080F]/10'
                }`}
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 sm:w-4 h-4 animate-spin" />
                ) : saved ? (
                  <><Check className="w-3.5 h-3.5 sm:w-4 h-4" /> {d.saved}</>
                ) : isPremiumThemeSelected ? (
                  <><Lock className="w-3.5 h-3.5 sm:w-4 h-4" /> {locale === 'id' ? 'Upgrade Paket' : 'Upgrade Plan'}</>
                ) : (
                  <><Save className="w-3.5 h-3.5 sm:w-4 h-4" /> {d.save}</>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Inactive profile banner: shown when viewing a non-published profile on free plan */}
        {currentPageIsInactive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-4"
          >
            <Radio className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-black text-sm text-amber-700 uppercase tracking-wider">Profil Tidak Aktif</p>
              <p className="text-xs font-medium text-amber-600 mt-0.5">
                Profil ini tidak ditampilkan secara publik. Klik <strong>"Aktifkan"</strong> di tab atas untuk mempublikasikannya.
              </p>
            </div>
            <button
              onClick={() => currentPageId && activateProfile(currentPageId)}
              disabled={activating === currentPageId}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-black hover:bg-amber-600 transition-all whitespace-nowrap disabled:opacity-60"
            >
              {activating === currentPageId
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Radio className="w-3.5 h-3.5" />
              }
              Aktifkan Profil
            </button>
          </motion.div>
        )}

        {/* Free/Expired plan: show info banner when user has multiple profiles (and current is active) */}
        {isFreePlan && pages.length > 1 && !currentPageIsInactive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-4"
          >
            <Radio className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-black text-sm text-amber-700 uppercase tracking-wider">1 Profil Aktif</p>
              <p className="text-xs font-medium text-amber-600 mt-1 leading-relaxed">
                Paket {locale === 'id' ? activePlan.nameId : activePlan.nameEn} hanya mendukung <strong>1 profil aktif</strong> sekaligus.
                Klik <strong>"Aktifkan"</strong> pada profil yang ingin dipublikasikan. Profil lain akan otomatis dinonaktifkan.
              </p>
            </div>
            <Link href="/pricing" className="px-3 py-2 rounded-xl bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all whitespace-nowrap">
              Upgrade
            </Link>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-[1fr_360px] gap-12">

          {/* ===== LEFT: Editor ===== */}
          <div className="space-y-10">
            
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

            {/* Page List (tabs — all plans) */}
            {pages.length > 0 && (
              <div className="flex flex-wrap gap-2.5 p-2 bg-white/60 border border-[#F6B7C8]/15 rounded-[24px] shadow-sm shadow-[#18080F]/2 backdrop-blur-md">
                {pages.map((p: any, idx: number) => {
                  // On free/expired plan, only 1 page can be active (the first published one in the list).
                  // All other pages are considered inactive.
                  const isInactive = isFreePlan
                    ? (activePageIdOnFreePlan ? p.id !== activePageIdOnFreePlan : true)
                    : !p.is_published;
                  const isActivePage = currentPageId === p.id;
                  return (
                    <div key={p.id} className="flex items-center gap-1.5 group/tab">
                      <button
                        onClick={() => loadData(p.id)}
                        className={`relative px-4 py-2.5 rounded-2xl text-xs font-black tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer border select-none ${
                          isActivePage
                            ? 'text-white border-transparent'
                            : isInactive
                              ? 'bg-amber-50/40 text-amber-600 border-amber-100/50 hover:bg-amber-50 hover:border-amber-200'
                              : 'bg-white text-gray-500 border-[#F6B7C8]/10 hover:border-[#FF5FA2]/20 hover:text-[#FF5FA2]'
                        }`}
                      >
                        {isActivePage && (
                          <motion.span
                            layoutId="activeTabBackground"
                            className="absolute inset-0 bg-gradient-to-r from-[#FF5FA2] to-[#FF8EBE] rounded-2xl shadow-md shadow-[#FF5FA2]/15"
                            transition={{ type: "spring", stiffness: 350, damping: 28 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                          {/* Live dot / inactive indicator */}
                          {!isInactive ? (
                            <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                              isActivePage 
                                ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]' 
                                : 'bg-green-400 animate-pulse'
                            }`} />
                          ) : (
                            <EyeOff className={`w-3.5 h-3.5 ${isActivePage ? 'text-white' : 'text-amber-500'}`} />
                          )}
                          {p.title || d.untitled}
                        </span>
                      </button>

                      {/* Activate button — shown for inactive pages on free plan */}
                      {isFreePlan && isInactive && (
                        <button
                          onClick={() => activateProfile(p.id)}
                          disabled={activating === p.id}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/10 hover:bg-amber-500 hover:text-white hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                        >
                          {activating === p.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Radio className="w-3.5 h-3.5" />
                          )}
                          Aktifkan
                        </button>
                      )}

                      {/* Delete button — always visible on desktop and mobile */}
                      <button
                        onClick={() => setDeleteConfirmPage(p)}
                        disabled={deletingPageId === p.id}
                        className="flex items-center justify-center w-8 h-8 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50/80 border border-transparent hover:border-red-100 hover:shadow-sm transition-all duration-300 disabled:opacity-50 cursor-pointer"
                        title="Hapus profil"
                      >
                        {deletingPageId === p.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Profile section */}
            <div id="tour-profile-section" className="p-6 sm:p-8 bg-white border border-[#F6B7C8]/10 rounded-[32px] shadow-sm space-y-8">
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
                    <div className="sm:w-56 flex flex-col justify-center">
                      <label className="text-[10px] font-black text-[#FF5FA2] uppercase tracking-[0.2em] mb-3 ml-1 block">{d.profile.status}</label>
                      <div 
                        onClick={() => {
                          if (isFreePlan && currentPageIsInactive) {
                            setToastMsg('Aktifkan profil ini melalui tombol "Aktifkan" di atas untuk mempublikasikannya.');
                            setToastType('info');
                            setShowToast(true);
                            return;
                          }
                          setIsPublished(!isPublished);
                        }}
                        className={`group relative w-full h-[64px] rounded-2xl border-2 transition-all duration-300 flex items-center px-4 gap-3 select-none ${
                          isFreePlan && currentPageIsInactive
                            ? 'bg-amber-50/30 border-amber-200/40 cursor-not-allowed opacity-80'
                            : isPublished 
                              ? 'bg-green-50/50 border-green-200/50 cursor-pointer' 
                              : 'bg-gray-50 border-gray-200/60 cursor-pointer'
                        }`}
                      >
                        {/* Toggle Track */}
                        <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                          isFreePlan && currentPageIsInactive
                            ? 'bg-amber-200'
                            : isPublished ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          <motion.div 
                            animate={{ x: (isFreePlan && currentPageIsInactive) ? 2 : isPublished ? 22 : 2 }}
                            initial={false}
                            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </div>
                        
                        {/* Label */}
                        <div className="flex flex-col">
                          <span className={`text-xs font-black uppercase tracking-wider ${
                            isFreePlan && currentPageIsInactive
                              ? 'text-amber-600'
                              : isPublished ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {isFreePlan && currentPageIsInactive ? 'Tidak Aktif' : isPublished ? 'Live' : 'Draft'}
                          </span>
                          <span className="text-[9px] font-bold text-gray-400 leading-none">
                            {isFreePlan && currentPageIsInactive ? 'Profil dinonaktifkan' : isPublished ? d.profile.public : d.profile.private}
                          </span>
                        </div>

                        {/* Decoration Icon */}
                        <div className={`ml-auto w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isFreePlan && currentPageIsInactive
                            ? 'bg-amber-500/10 text-amber-600'
                            : isPublished ? 'bg-green-500/10 text-green-600' : 'bg-gray-200 text-gray-400'
                        }`}>
                          {isFreePlan && currentPageIsInactive ? <EyeOff className="w-4 h-4" /> : isPublished ? <Check className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
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
                  id="tour-add-link"
                  onClick={addLink}
                  className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#FF5FA2] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#FF5FA2]/20 hover:-translate-y-0.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  {d.links.add}
                </button>
              </div>

              <div id="tour-links-list">
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
            </div>

            {/* Theme picker */}
            <div id="tour-theme-picker" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-[#18080F] tracking-tight">{d.appearance.theme}</h2>
                <button
                  onClick={() => setShowThemesModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FF5FA2]/5 hover:bg-[#FF5FA2]/10 border border-[#FF5FA2]/10 text-xs font-black text-[#FF5FA2] transition-all duration-300 cursor-pointer shadow-sm hover:shadow active:scale-95 animate-pulse"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{locale === 'id' ? 'Lihat Semua' : 'Explore All'}</span>
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                {displayedThemes.map((theme) => {
                  const isSelected = selectedTheme === theme.id;
                  const isThemePro = theme.isPro;
                  const isPreviewMode = isThemePro && !hasPremiumAccess;
                  
                  return (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setSelectedTheme(theme.id);
                        if (runTour && tourStepIndex === 3) {
                          setTourStepIndex(4);
                        }
                      }}
                      className={`group relative p-3 sm:p-4 rounded-[28px] sm:rounded-[32px] border-2 transition-all duration-300 flex flex-col items-center gap-3 sm:gap-4 ${
                        isSelected 
                          ? isPreviewMode 
                            ? 'border-amber-500 bg-white shadow-2xl shadow-amber-500/10 -translate-y-2'
                            : 'border-[#FF5FA2] bg-white shadow-2xl shadow-[#FF5FA2]/15 -translate-y-2' 
                          : 'border-[#F6B7C8]/10 bg-white hover:border-[#FF5FA2]/30 hover:-translate-y-1'
                      }`}
                    >
                      {/* PRO Badge */}
                      {isThemePro && (
                        <div className="absolute top-5 left-5 z-10 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest shadow-sm">
                          PRO
                        </div>
                      )}

                      <div className={`w-full aspect-[4/5] rounded-xl sm:rounded-2xl shadow-inner overflow-hidden relative ${theme.previewBg}`}>
                        {/* Inner mockup look */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 gap-2">
                          <div className="w-6 h-6 rounded-full bg-white/20" />
                          <div className="w-full h-2 rounded-full bg-white/20" />
                          <div className="w-full h-2 rounded-full bg-white/20" />
                        </div>

                        {/* Lock Overlay for non-premium accounts when viewing/hovering pro themes */}
                        {isPreviewMode && (
                          <div className="absolute inset-0 bg-[#18080F]/45 backdrop-blur-[1px] flex items-center justify-center transition-all duration-300 opacity-100">
                            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg">
                              <Lock className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-center">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${
                          isSelected 
                            ? isPreviewMode ? 'text-amber-600' : 'text-[#FF5FA2]' 
                            : 'text-gray-400'
                        }`}>
                          {theme.name}
                        </p>
                      </div>

                      {/* Selected Indicator */}
                      {isSelected && (
                        isPreviewMode ? (
                          <div className="absolute -top-2.5 -right-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-xl z-10 flex items-center gap-1">
                            <Eye className="w-2.5 h-2.5" />
                            <span>{locale === 'id' ? 'Pratinjau' : 'Preview'}</span>
                          </div>
                        ) : (
                          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#FF5FA2] text-white flex items-center justify-center shadow-xl z-10">
                            <Check className="w-3.5 h-3.5" strokeWidth={5} />
                          </div>
                        )
                      )}
                    </button>
                  );
                })}
              </div>

              {!canAccess(plan, 'customBranding', expiresAt) ? (
                <div className="text-xs font-medium text-amber-600 bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Info:</strong> {d.appearance.premiumInfo}
                  </div>
                </div>
              ) : (
                /* Premium Customizer UI Panel */
                <div className="p-6 sm:p-8 bg-white/60 border border-[#F6B7C8]/15 rounded-[32px] shadow-sm backdrop-blur-md space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-[#18080F] flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" fill="currentColor" />
                      {locale === 'id' ? 'Kustomisasi Tampilan Premium' : 'Premium Layout Customization'}
                    </h3>
                    <p className="text-xs font-medium text-gray-400 mt-0.5">
                      {locale === 'id' 
                        ? 'Sesuaikan latar belakang, bentuk tombol, dan tata letak sesukamu' 
                        : 'Customize the background, button shapes, and overall layout as you like'}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Background Customization */}
                    <div className="space-y-3">
                      <label className="text-xs font-black text-[#FF5FA2] uppercase tracking-widest">
                        {locale === 'id' ? 'Latar Belakang Kustom (Gambar)' : 'Custom Background (Image)'}
                      </label>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          placeholder="https://example.com/image.jpg"
                          value={customBgImage}
                          onChange={(e) => setCustomBgImage(e.target.value)}
                          className="flex-1 h-11 px-4 rounded-xl border border-[#F6B7C8]/10 bg-[#FFF8F2]/30 focus:bg-white focus:border-[#FF5FA2]/40 outline-none text-xs font-bold text-[#18080F]"
                        />
                        
                        <button
                          onClick={() => fileInputBgRef.current?.click()}
                          disabled={uploadingBg}
                          className="h-11 px-4 rounded-xl bg-gray-50 hover:bg-[#FF5FA2]/5 border border-gray-100 hover:border-[#FF5FA2]/20 text-xs font-bold text-gray-600 hover:text-[#FF5FA2] flex items-center justify-center gap-1.5 transition-all shrink-0"
                        >
                          {uploadingBg ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Camera className="w-4 h-4" />
                          )}
                          <span>{locale === 'id' ? 'Unggah' : 'Upload'}</span>
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputBgRef} 
                          onChange={handleBgUpload} 
                          className="hidden" 
                          accept="image/*" 
                        />
                      </div>
                      
                      {customBgImage && (
                        <div className="flex items-center justify-between p-2 rounded-xl bg-[#FFF8F2]/20 border border-[#F6B7C8]/10">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-10 h-10 rounded-lg bg-cover bg-center border border-gray-100 shrink-0"
                              style={{ backgroundImage: `url("${customBgImage}")` }}
                            />
                            <span className="text-[10px] font-bold text-gray-400 truncate max-w-[150px]">Latar kustom aktif</span>
                            <button 
                              onClick={async () => {
                                if (customBgImage) {
                                  try {
                                    const { deleteStorageFile } = await import('@/lib/supabase/storage');
                                    await deleteStorageFile(customBgImage);
                                  } catch (e) {
                                    console.error('Failed to delete background:', e);
                                  }
                                }
                                setCustomBgImage('');
                              }}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Layout Styles */}
                    <div className="space-y-4">
                      {/* Button style selector */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-[#FF5FA2] uppercase tracking-widest">
                          {locale === 'id' ? 'Gaya & Bentuk Tombol' : 'Button Style Shape'}
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {(['rounded-xl', 'rounded-full', 'rounded-none', 'glass'] as const).map((style) => (
                            <button
                              key={style}
                              onClick={() => setCustomButtonStyle(customButtonStyle === style ? '' : style)}
                              className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all cursor-pointer ${
                                customButtonStyle === style 
                                  ? 'border-[#FF5FA2] bg-[#FF5FA2]/5 text-[#FF5FA2]' 
                                  : 'border-gray-100 bg-white hover:border-[#FF5FA2]/20 text-gray-400'
                              }`}
                            >
                              {style === 'rounded-xl' ? 'Square' : style === 'rounded-full' ? 'Pill' : style === 'rounded-none' ? 'Flat' : 'Glass'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Layout Orientation */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-[#FF5FA2] uppercase tracking-widest">
                          {locale === 'id' ? 'Tata Letak & Tata Ruang' : 'Layout Structure'}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['classic', 'compact', 'grid'] as const).map((layout) => (
                            <button
                              key={layout}
                              onClick={() => setCustomLayout(customLayout === layout ? '' : layout)}
                              className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all cursor-pointer ${
                                customLayout === layout 
                                  ? 'border-[#FF5FA2] bg-[#FF5FA2]/5 text-[#FF5FA2]' 
                                  : 'border-gray-100 bg-white hover:border-[#FF5FA2]/20 text-gray-400'
                              }`}
                            >
                              {layout === 'classic' ? 'Classic' : layout === 'compact' ? 'Compact' : 'Grid 2x2'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 my-6" />

                  {/* Colors & Branding Toggle */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Text Colors */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Title Text Color */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-[#FF5FA2] uppercase tracking-widest">
                            {locale === 'id' ? 'Warna Judul' : 'Title Text Color'}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={customTitleColor || '#18080F'}
                              onChange={(e) => setCustomTitleColor(e.target.value)}
                              className="w-9 h-9 rounded-xl border border-[#F6B7C8]/25 cursor-pointer shrink-0 overflow-hidden"
                            />
                            <input
                              type="text"
                              placeholder="Default"
                              value={customTitleColor}
                              onChange={(e) => setCustomTitleColor(e.target.value)}
                              className="flex-1 h-9 px-3 rounded-lg border border-[#F6B7C8]/10 bg-[#FFF8F2]/30 focus:bg-white text-xs font-bold font-mono text-[#18080F]"
                            />
                          </div>
                        </div>

                        {/* Bio Text Color */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-[#FF5FA2] uppercase tracking-widest">
                            {locale === 'id' ? 'Warna Bio' : 'Bio Text Color'}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={customBioColor || '#666666'}
                              onChange={(e) => setCustomBioColor(e.target.value)}
                              className="w-9 h-9 rounded-xl border border-[#F6B7C8]/25 cursor-pointer shrink-0 overflow-hidden"
                            />
                            <input
                              type="text"
                              placeholder="Default"
                              value={customBioColor}
                              onChange={(e) => setCustomBioColor(e.target.value)}
                              className="flex-1 h-9 px-3 rounded-lg border border-[#F6B7C8]/10 bg-[#FFF8F2]/30 focus:bg-white text-xs font-bold font-mono text-[#18080F]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Branding Copyright Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#F6B7C8]/10 shadow-sm shrink-0 self-center">
                      <div className="flex flex-col gap-0.5 max-w-[70%]">
                        <span className="text-xs font-black text-[#18080F] uppercase tracking-wider">
                          {locale === 'id' ? 'Branding OneTap' : 'OneTap Branding'}
                        </span>
                        <span className="text-[9px] font-medium text-gray-400 leading-tight">
                          {locale === 'id' ? 'Tampilkan "Powered by OneTap" di bawah' : 'Show "Powered by OneTap" at bottom'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowBranding(!showBranding)}
                        className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none shrink-0 cursor-pointer ${
                          showBranding ? 'bg-[#FF5FA2]' : 'bg-gray-200'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                            showBranding ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 my-6" />

                  {/* Social Links Configurator */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-[#FF5FA2] uppercase tracking-widest">
                      {locale === 'id' ? 'Tautan Sosial Media Bawah' : 'Bottom Social Media Links'}
                    </label>
                    <p className="text-[10px] font-medium text-gray-400">
                      {locale === 'id' 
                        ? 'Aktifkan ikon sosial media horizontal di bawah tombol tautan utama' 
                        : 'Enable horizontal social media icons below the main link buttons'}
                    </p>
                    
                    {/* Platform Selection Row */}
                    <div className="flex flex-wrap gap-2.5 p-2 bg-gray-50 border border-gray-100 rounded-2xl">
                      {SOCIAL_PLATFORMS.map((platform) => {
                        const IconComponent = iconMap[platform.id];
                        const hasValue = socialLinks.some(s => s.platform === platform.id);
                        const isSelected = activeSocialTab === platform.id;
                        return (
                          <button
                            key={platform.id}
                            type="button"
                            onClick={() => setActiveSocialTab(platform.id)}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                              isSelected 
                                ? 'border-[#FF5FA2] bg-[#FF5FA2] text-white shadow-md shadow-[#FF5FA2]/20'
                                : hasValue
                                  ? 'border-green-400 bg-green-50 text-green-600'
                                  : 'border-gray-200 bg-white hover:border-[#FF5FA2]/25 text-gray-400 hover:text-gray-600'
                            }`}
                            title={platform.label}
                          >
                            {IconComponent && <IconComponent className="w-4 h-4" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Platform Input */}
                    {activeSocialTab && (
                      <div className="p-4 rounded-2xl bg-[#FFF8F2]/30 border border-[#F6B7C8]/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-[#FF5FA2] uppercase tracking-widest flex items-center gap-1.5">
                            {(() => {
                              const IconComponent = iconMap[activeSocialTab];
                              return IconComponent ? <IconComponent className="w-3.5 h-3.5" /> : null;
                            })()}
                            Tautan {SOCIAL_PLATFORMS.find(p => p.id === activeSocialTab)?.label}
                          </span>
                          {socialLinks.some(s => s.platform === activeSocialTab) && (
                            <button
                              type="button"
                              onClick={() => setSocialUrl(activeSocialTab, '')}
                              className="text-[9px] font-bold text-red-500 hover:underline uppercase cursor-pointer"
                            >
                              {locale === 'id' ? 'Hapus Tautan' : 'Remove Link'}
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder={SOCIAL_PLATFORMS.find(p => p.id === activeSocialTab)?.placeholder}
                          value={socialLinks.find(s => s.platform === activeSocialTab)?.url || ''}
                          onChange={(e) => setSocialUrl(activeSocialTab, e.target.value)}
                          className="w-full h-10 px-3.5 rounded-xl border border-[#F6B7C8]/10 bg-white focus:bg-white focus:border-[#FF5FA2]/40 outline-none text-xs font-semibold text-[#18080F]"
                        />
                      </div>
                    )}
                  </div>

                  {(customBgImage || customButtonStyle || customLayout || customTitleColor || customBioColor || !showBranding || socialLinks.length > 0) && (
                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-lg">
                        Kustomisasi premium diterapkan
                      </span>
                      <button
                        onClick={() => {
                          setCustomBgImage('');
                          setCustomButtonStyle('');
                          setCustomLayout('');
                          setCustomTitleColor('');
                          setCustomBioColor('');
                          setShowBranding(true);
                          setSocialLinks([]);
                          setToastMsg('Pilihan kustomisasi premium direset.');
                          setToastType('info');
                          setShowToast(true);
                        }}
                        className="text-xs font-black text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wider"
                      >
                        Hapus Kustomisasi
                      </button>
                    </div>
                  )}
                </div>
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
                    href="/pricing"
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
                <OneTapPreview profile={profile} links={links} theme={resolvedThemeId} />
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
                <OneTapPreview profile={profile} links={links} theme={resolvedThemeId} />
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

      <GuidedTour
        key={`builder-${tourKey}`}
        pageKey="builder"
        steps={tourSteps}
        run={runTour}
        onClose={handleTourClose}
        stepIndex={tourStepIndex}
        callback={handleTourCallback}
      />

      {/* ===== DELETE CONFIRMATION MODAL ===== */}
      <AnimatePresence>
        {deleteConfirmPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirmPage(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 space-y-6"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>

              {/* Text */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black text-[#18080F]">Hapus Profil?</h3>
                <p className="text-sm font-medium text-gray-400 leading-relaxed">
                  Profil <strong className="text-[#18080F]">&quot;{deleteConfirmPage.title || 'Tanpa Judul'}&quot;</strong> dan semua link di dalamnya akan dihapus permanen dan tidak bisa dikembalikan.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmPage(null)}
                  disabled={deletingPageId === deleteConfirmPage.id}
                  className="flex-1 px-5 py-3 rounded-2xl border border-gray-100 text-sm font-black text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={() => deleteProfile(deleteConfirmPage.id)}
                  disabled={deletingPageId === deleteConfirmPage.id}
                  className="flex-1 px-5 py-3 rounded-2xl bg-red-500 text-white text-sm font-black hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {deletingPageId === deleteConfirmPage.id
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Menghapus...</>
                    : <><Trash2 className="w-4 h-4" /> Hapus Sekarang</>
                  }
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== PREMIUM UPGRADE MODAL ===== */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowUpgradeModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-8 space-y-6 relative overflow-hidden"
            >
              {/* Premium Gradient Background Accent */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-[#FF5FA2] to-[#E8457E]" />

              {/* Icon */}
              <div className="w-16 h-16 rounded-[24px] bg-[#FFF1F7] flex items-center justify-center mx-auto shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FF5FA2]/10 to-amber-500/10 animate-pulse" />
                <Zap className="w-8 h-8 text-[#FF5FA2]" fill="currentColor" />
              </div>

              {/* Text */}
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-black text-[#18080F] tracking-tight">
                  {locale === 'id' ? 'Template Premium Terkunci' : 'Premium Template Locked'}
                </h3>
                <p className="text-sm font-medium text-gray-500 leading-relaxed">
                  {locale === 'id' 
                    ? 'Anda sedang dalam mode pratinjau untuk template premium ini. Upgrade ke paket Professional atau Education untuk mempublikasikan dan menyimpan perubahan menggunakan template ini.'
                    : 'You are currently previewing this premium template. Upgrade to Professional or Education plan to publish and save changes using this template.'
                  }
                </p>
                {selectedTemplate && (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 font-bold text-xs uppercase tracking-wide">
                    <Layout className="w-3.5 h-3.5" />
                    {selectedTemplate.name}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href="/pricing"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white text-center font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#FF5FA2]/20 flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-currentColor" />
                  {locale === 'id' ? 'Upgrade Sekarang' : 'Upgrade Now'}
                </Link>
                <button
                  onClick={() => {
                    // Reset to a standard free theme (e.g. pink theme)
                    setSelectedTheme('pink');
                    setShowUpgradeModal(false);
                    setToastMsg(locale === 'id' ? 'Kembali ke tema standard.' : 'Reverted to standard theme.');
                    setToastType('info');
                    setShowToast(true);
                  }}
                  className="w-full py-4 rounded-2xl border border-gray-100 text-xs font-black text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {locale === 'id' ? 'Gunakan Tema Standard' : 'Use Standard Theme'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== THEMES EXPLORER MODAL ===== */}
      <AnimatePresence>
        {showThemesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
            onClick={(e) => { if (e.target === e.currentTarget) { setShowThemesModal(false); setSearchQuery(''); setFilterTab('all'); } }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-100"
            >
              {/* Header */}
              <div className="p-6 sm:p-8 border-b border-gray-100 flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-black text-[#18080F] tracking-tight">
                    {locale === 'id' ? 'Pilih Tema & Tampilan' : 'Select Theme & Layout'}
                  </h3>
                  <p className="text-sm font-medium text-gray-400 mt-1">
                    {locale === 'id' 
                      ? 'Temukan gaya visual yang cocok untuk OneTap Card Anda' 
                      : 'Find the perfect visual style for your OneTap Card'}
                  </p>
                </div>
                <button
                  onClick={() => { setShowThemesModal(false); setSearchQuery(''); setFilterTab('all'); }}
                  className="p-2.5 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-red-50 hover:border-red-100 hover:text-red-500 transition-all duration-300 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search & Filters */}
              <div className="p-6 sm:px-8 sm:py-4 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={locale === 'id' ? 'Cari tema...' : 'Search themes...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-gray-200 outline-none text-sm font-bold text-gray-700 focus:border-[#FF5FA2]/50 shadow-inner"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-2xl w-full sm:w-auto border border-gray-200">
                  {(['all', 'free', 'pro'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilterTab(tab)}
                      className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                        filterTab === tab 
                          ? 'bg-white text-[#FF5FA2] shadow-sm' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {tab === 'all' 
                        ? (locale === 'id' ? 'Semua' : 'All')
                        : tab === 'free'
                          ? (locale === 'id' ? 'Dasar' : 'Basic')
                          : 'Premium'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                {/* Grid */}
                {(() => {
                  const filtered = themes.filter((theme) => {
                    const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesFilter = filterTab === 'all' 
                      ? true 
                      : filterTab === 'free' 
                        ? !theme.isPro 
                        : theme.isPro;
                    return matchesSearch && matchesFilter;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <SlidersHorizontal className="w-12 h-12 text-gray-300 mb-4 stroke-1 animate-pulse" />
                        <p className="text-base font-black text-gray-500">
                          {locale === 'id' ? 'Tema tidak ditemukan' : 'Theme not found'}
                        </p>
                        <p className="text-xs font-medium text-gray-400 mt-1">
                          {locale === 'id' 
                            ? 'Coba gunakan kata kunci pencarian yang lain.' 
                            : 'Try using a different search keyword.'}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                      {filtered.map((theme) => {
                        const isSelected = selectedTheme === theme.id;
                        const isThemePro = theme.isPro;
                        const isPreviewMode = isThemePro && !hasPremiumAccess;
                        
                        return (
                          <button
                            key={theme.id}
                            onClick={() => {
                              setSelectedTheme(theme.id);
                              if (runTour && tourStepIndex === 3) {
                                setTourStepIndex(4);
                              }
                            }}
                            className={`group relative p-3 sm:p-4 rounded-[28px] sm:rounded-[32px] border-2 transition-all duration-300 flex flex-col items-center gap-3 sm:gap-4 ${
                              isSelected 
                                ? isPreviewMode
                                  ? 'border-amber-500 bg-white shadow-2xl shadow-amber-500/10 -translate-y-2'
                                  : 'border-[#FF5FA2] bg-white shadow-2xl shadow-[#FF5FA2]/15 -translate-y-2' 
                                : 'border-[#F6B7C8]/10 bg-white hover:border-[#FF5FA2]/30 hover:-translate-y-1'
                            }`}
                          >
                            {/* PRO Badge */}
                            {isThemePro && (
                              <div className="absolute top-5 left-5 z-10 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest shadow-sm">
                                PRO
                              </div>
                            )}

                            <div className={`w-full aspect-[4/5] rounded-xl sm:rounded-2xl shadow-inner overflow-hidden relative ${theme.previewBg}`}>
                              {/* Inner mockup look */}
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 gap-2">
                                <div className="w-6 h-6 rounded-full bg-white/20" />
                                <div className="w-full h-2 rounded-full bg-white/20" />
                                <div className="w-full h-2 rounded-full bg-white/20" />
                              </div>

                              {/* Lock Overlay for non-premium accounts when viewing/hovering pro themes */}
                              {isPreviewMode && (
                                <div className="absolute inset-0 bg-[#18080F]/45 backdrop-blur-[1px] flex items-center justify-center transition-all duration-300 opacity-100">
                                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg">
                                    <Lock className="w-3.5 h-3.5" />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="text-center">
                              <p className={`text-[10px] font-black uppercase tracking-widest ${
                                isSelected 
                                  ? isPreviewMode ? 'text-amber-600' : 'text-[#FF5FA2]' 
                                  : 'text-gray-400'
                              }`}>
                                {theme.name}
                              </p>
                            </div>

                            {/* Selected Indicator */}
                            {isSelected && (
                              isPreviewMode ? (
                                <div className="absolute -top-2.5 -right-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-xl z-10 flex items-center gap-1">
                                  <Eye className="w-2.5 h-2.5" />
                                  <span>{locale === 'id' ? 'Pratinjau' : 'Preview'}</span>
                                </div>
                              ) : (
                                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#FF5FA2] text-white flex items-center justify-center shadow-xl z-10">
                                  <Check className="w-3.5 h-3.5" strokeWidth={5} />
                                </div>
                              )
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 flex items-center justify-end bg-gray-50/50">
                <button
                  onClick={() => { setShowThemesModal(false); setSearchQuery(''); setFilterTab('all'); }}
                  className="px-6 py-3 rounded-2xl bg-[#18080F] hover:bg-[#18080F]/90 text-white text-xs font-black uppercase tracking-widest cursor-pointer shadow-lg active:scale-95 transition-all duration-300"
                >
                  {locale === 'id' ? 'Selesai' : 'Done'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  );
}

