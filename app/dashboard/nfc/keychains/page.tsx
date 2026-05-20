'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Wifi, User, Phone, Mail, Building2, 
  ExternalLink, Key, Plus, Trash2, Edit2, Save, 
  Loader2, Check, AlertCircle, Copy, HelpCircle, 
  ChevronRight, Smartphone, Eye, EyeOff, Globe
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Keychain {
  id: string;
  token: string;
  label: string;
  active_mode: 'profile' | 'vcard' | 'whatsapp' | 'wifi' | 'url';
  payload_data: any;
  created_at: string;
  updated_at: string;
}

interface ProfilePage {
  id: string;
  title: string;
  slug: string;
  updated_at: string;
}

export default function KeychainsManagerPage() {
  const { locale } = useLanguage();
  const router = useRouter();

  // Core loading states
  const [loading, setLoading] = useState(true);
  const [keychains, setKeychains] = useState<Keychain[]>([]);
  const [profiles, setProfiles] = useState<ProfilePage[]>([]);
  
  // Modals & Action states
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimToken, setClaimToken] = useState('');
  const [claimLabel, setClaimLabel] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState('');

  // Editing state
  const [selectedKeychain, setSelectedKeychain] = useState<Keychain | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editMode, setEditMode] = useState<Keychain['active_mode']>('profile');
  const [editPayload, setEditPayload] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Delete/Unclaim state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // UI Helpers
  const [showWifiPassword, setShowWifiPassword] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Translations
  const t = (id: string, en: string) => (locale === 'id' ? id : en);

  // 1. Fetch Keychains and Profile pages
  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch keychains
      const keychainsRes = await fetch('/api/keychains');
      if (keychainsRes.ok) {
        const keyData = await keychainsRes.json();
        setKeychains(keyData.keychains || []);
      }

      // Fetch user profile pages for Profile Dropdown
      const profilesRes = await fetch('/api/linktree/save');
      if (profilesRes.ok) {
        const profData = await profilesRes.json();
        setProfiles(profData.pages || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 2. Claim Keychain handler
  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimToken.trim()) return;

    setClaiming(true);
    setClaimError('');

    try {
      const res = await fetch('/api/keychains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'claim',
          token: claimToken.trim(),
          label: claimLabel.trim() || undefined
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setClaimToken('');
        setClaimLabel('');
        setShowClaimModal(false);
        await loadData();
        // Automatically select the newly claimed keychain
        if (data.keychain) {
          handleSelectKeychain(data.keychain);
        }
      } else {
        setClaimError(data.error || t('Gagal mendaftarkan keychain.', 'Failed to claim keychain.'));
      }
    } catch (err) {
      setClaimError(t('Terjadi kesalahan koneksi.', 'Connection error occurred.'));
    } finally {
      setClaiming(false);
    }
  };

  // 3. Selection handler
  const handleSelectKeychain = (kc: Keychain) => {
    setSelectedKeychain(kc);
    setEditLabel(kc.label);
    setEditMode(kc.active_mode);
    setEditPayload(kc.payload_data || {});
    setSaveSuccess(false);
    setSaveError('');
    
    // Auto-fill some defaults if blank
    if (kc.active_mode === 'profile' && !kc.payload_data?.slug && profiles.length > 0) {
      setEditPayload({ slug: profiles[0].slug });
    }
  };

  // 4. Save updates handler
  const handleSaveConfig = async () => {
    if (!selectedKeychain) return;

    setSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      const res = await fetch('/api/keychains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id: selectedKeychain.id,
          label: editLabel.trim(),
          active_mode: editMode,
          payload_data: editPayload
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSaveSuccess(true);
        // Update local list
        setKeychains(prev => 
          prev.map(item => item.id === selectedKeychain.id ? data.keychain : item)
        );
        setSelectedKeychain(data.keychain);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(data.error || t('Gagal memperbarui konfigurasi.', 'Failed to update configuration.'));
      }
    } catch (err) {
      setSaveError(t('Terjadi kesalahan koneksi.', 'Connection error occurred.'));
    } finally {
      setSaving(false);
    }
  };

  // 5. Delete/Unclaim handler
  const handleDeleteKeychain = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch('/api/keychains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          id
        })
      });

      if (res.ok) {
        setKeychains(prev => prev.filter(item => item.id !== id));
        if (selectedKeychain?.id === id) {
          setSelectedKeychain(null);
        }
        setDeletingId(null);
      }
    } catch (err) {
      console.error('Error deleting keychain:', err);
    } finally {
      setDeleting(false);
    }
  };

  // Helper: Copy QR Code URL
  const handleCopyLink = (token: string) => {
    const fullUrl = `${window.location.origin}/r/${token}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  // Helper: Render active mode icon
  const getModeBadge = (mode: Keychain['active_mode']) => {
    switch (mode) {
      case 'url':
        return {
          bg: 'bg-[#FFF1F7]', border: 'border-[#FF5FA2]/15', text: 'text-[#FF5FA2]', label: t('Link Kustom', 'Custom Link'),
          icon: <ExternalLink className="w-3.5 h-3.5" />
        };
      case 'profile':
        return {
          bg: 'bg-[#f5f3ff]', border: 'border-[#8b5cf6]/15', text: 'text-[#8b5cf6]', label: t('Profil Digital', 'Digital Profile'),
          icon: <User className="w-3.5 h-3.5" />
        };
      case 'whatsapp':
        return {
          bg: 'bg-[#ecfdf5]', border: 'border-[#10b981]/15', text: 'text-[#10b981]', label: 'WhatsApp',
          icon: <Phone className="w-3.5 h-3.5" />
        };
      case 'wifi':
        return {
          bg: 'bg-[#eef2ff]', border: 'border-[#6366f1]/15', text: 'text-[#6366f1]', label: 'Wi-Fi',
          icon: <Wifi className="w-3.5 h-3.5" />
        };
      case 'vcard':
        return {
          bg: 'bg-[#fffbeb]', border: 'border-[#f59e0b]/15', text: 'text-[#f59e0b]', label: t('Kartu Nama', 'Business Card'),
          icon: <Building2 className="w-3.5 h-3.5" />
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F2] selection:bg-[#FF5FA2]/20 selection:text-[#FF5FA2] pb-16">
      
      {/* Navbar Navigation */}
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-[#F6B7C8]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/nfc" className="p-2.5 rounded-xl hover:bg-[#FFF8F2] text-gray-500 hover:text-[#FF5FA2] transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-[#18080F] tracking-tight">
                {t('Gantungan Kunci Dinamis', 'Dynamic Keychains')}
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
                NFC Dynamic Redirect Manager
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowClaimModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#FF5FA2] hover:bg-[#E8457E] text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            {t('Daftarkan Keychain', 'Register Keychain')}
          </button>
        </div>
      </nav>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: KEYCHAIN LIST (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Header */}
            <div className="bg-white rounded-3xl border border-[#F6B7C8]/10 p-6 shadow-sm">
              <h3 className="text-sm font-black text-[#18080F] tracking-wide mb-2 flex items-center gap-2">
                <Key className="w-4 h-4 text-[#FF5FA2]" />
                {t('Gantungan Kunci Anda', 'Your Keychains')}
                <span className="bg-[#FF5FA2]/10 text-[#FF5FA2] px-2 py-0.5 rounded-full text-[10px] font-black">
                  {keychains.length}
                </span>
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                {t(
                  'Daftar gantungan kunci OneTap yang terhubung dengan akun Anda. Klik gantungan untuk mengubah redirectnya.',
                  'List of OneTap keychains linked to your account. Select any keychain to instantly configure its redirection behaviour.'
                )}
              </p>
            </div>

            {/* Skeletons Loading */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-28 bg-white border border-[#F6B7C8]/10 rounded-3xl animate-pulse p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-5 bg-gray-200 rounded-full w-20" />
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-6 bg-gray-100 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : keychains.length === 0 ? (
              /* EMPTY STATE */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2rem] border border-dashed border-[#F6B7C8]/30 p-12 text-center flex flex-col items-center justify-center space-y-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#FFF8F2] flex items-center justify-center text-[#FF5FA2]">
                  <Key className="w-8 h-8 animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-[#18080F]">
                    {t('Belum Ada Keychain Terdaftar', 'No Keychains Registered')}
                  </h4>
                  <p className="text-xs text-gray-400 font-medium max-w-[240px] leading-relaxed">
                    {t(
                      'Masukkan kode gantungan kunci fisik OneTap Anda untuk memulai kustomisasi redirect.',
                      'Claim your physical OneTap NFC keychain code to customize its smart redirection.'
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setShowClaimModal(true)}
                  className="px-6 h-11 bg-white hover:bg-slate-50 text-slate-700 font-black rounded-xl border border-slate-200 text-xs transition-all flex items-center gap-2 active:scale-95 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  {t('Daftarkan Sekarang', 'Register Now')}
                </button>
              </motion.div>
            ) : (
              /* KEYCHAIN CARDS */
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {keychains.map(kc => {
                    const isSelected = selectedKeychain?.id === kc.id;
                    const badge = getModeBadge(kc.active_mode);

                    return (
                      <motion.div
                        key={kc.id}
                        layoutId={`kc-card-${kc.id}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`group rounded-3xl bg-white border p-6 transition-all duration-300 relative overflow-hidden flex flex-col justify-between cursor-pointer select-none ${
                          isSelected
                            ? 'border-[#FF5FA2] shadow-xl shadow-[#FF5FA2]/5 ring-2 ring-[#FF5FA2]/10'
                            : 'border-[#F6B7C8]/10 hover:border-[#FF5FA2]/40 hover:shadow-lg hover:shadow-black/5'
                        }`}
                        onClick={() => handleSelectKeychain(kc)}
                      >
                        
                        {/* Token Tag Accent */}
                        <div className="absolute right-0 top-0 bg-[#FFF8F2] border-bl border-[#F6B7C8]/10 text-gray-400 font-mono text-[9px] px-3.5 py-1.5 rounded-bl-2xl uppercase tracking-wider font-bold">
                          {kc.token}
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-black text-[#18080F] group-hover:text-[#FF5FA2] transition-colors pr-20">
                                {kc.label}
                              </h4>
                              <p className="text-[10px] text-gray-400 font-medium tracking-wide mt-1">
                                {t('Ditambahkan pada ', 'Added on ')} {new Date(kc.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Info Display Badge */}
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${badge.bg} ${badge.border} ${badge.text}`}>
                              {badge.icon}
                              {badge.label}
                            </span>
                          </div>
                        </div>

                        {/* Interactive CTA buttons in card footer */}
                        <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyLink(kc.token);
                            }}
                            className={`flex items-center gap-1 text-[10px] font-black transition-colors ${
                              copiedToken === kc.token 
                                ? 'text-green-600' 
                                : 'text-gray-400 hover:text-[#FF5FA2]'
                            }`}
                          >
                            {copiedToken === kc.token ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                {t('Tautan Disalin!', 'Link Copied!')}
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                {t('Salin Tautan', 'Copy Link')}
                              </>
                            )}
                          </button>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectKeychain(kc);
                              }}
                              className="p-2 rounded-lg bg-gray-50 hover:bg-[#FF5FA2]/10 hover:text-[#FF5FA2] text-gray-500 transition-all active:scale-95"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingId(kc.id);
                              }}
                              className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 hover:text-red-500 text-gray-500 transition-all active:scale-95"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* RIGHT PANEL: CONFIGURATION PANEL (lg:col-span-7) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {selectedKeychain ? (
                <motion.div
                  key={`editor-${selectedKeychain.id}`}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  className="bg-white rounded-[2.5rem] border border-[#F6B7C8]/10 p-8 shadow-sm space-y-8"
                >
                  
                  {/* Editor Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                    <div>
                      <span className="text-[9px] font-black uppercase text-[#FF5FA2] bg-[#FF5FA2]/5 border border-[#FF5FA2]/10 px-3 py-1 rounded-full tracking-wider inline-block mb-2">
                        Keychain Configuration
                      </span>
                      <h3 className="text-xl font-black text-[#18080F]">
                        {t('Kustomisasi Redirect', 'Redirection Settings')}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                        Token: <span className="font-mono bg-gray-50 border border-gray-100 px-2 py-0.5 rounded text-[#FF5FA2] font-bold text-[10px] uppercase">{selectedKeychain.token}</span>
                      </p>
                    </div>
                    
                    {/* Live Preview Button */}
                    <a
                      href={`/r/${selectedKeychain.token}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-slate-200 hover:border-[#FF5FA2] text-slate-700 hover:text-[#FF5FA2] text-xs font-black transition-all active:scale-95"
                    >
                      {t('Pratinjau Live', 'Live Preview')}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Keychain Alias Label */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#18080F] uppercase tracking-wider block">
                      {t('Nama / Label Gantungan', 'Keychain Name / Label')}
                    </label>
                    <input
                      type="text"
                      className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-slate-200 focus:border-[#FF5FA2]/20 focus:bg-white outline-none transition-all text-sm font-bold text-[#18080F]"
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      placeholder={t('Misal: Gantungan Kunci Kunci Mobil', 'e.g. Car Keychain')}
                    />
                  </div>

                  {/* Mode Grid Select */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-[#18080F] uppercase tracking-wider block">
                      {t('Pilih Mode Pengalihan', 'Select Redirection Mode')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { mode: 'profile', icon: <User className="w-5 h-5" />, title: t('Profil', 'Profile'), activeColor: 'bg-[#f5f3ff] text-[#8b5cf6] border-[#8b5cf6]/40' },
                        { mode: 'url', icon: <Globe className="w-5 h-5" />, title: t('Link', 'Link'), activeColor: 'bg-[#FFF1F7] text-[#FF5FA2] border-[#FF5FA2]/40' },
                        { mode: 'whatsapp', icon: <Phone className="w-5 h-5" />, title: 'WhatsApp', activeColor: 'bg-[#ecfdf5] text-[#10b981] border-[#10b981]/40' },
                        { mode: 'wifi', icon: <Wifi className="w-5 h-5" />, title: 'Wi-Fi', activeColor: 'bg-[#eef2ff] text-[#6366f1] border-[#6366f1]/40' },
                        { mode: 'vcard', icon: <Building2 className="w-5 h-5" />, title: t('Kontak', 'Contact'), activeColor: 'bg-[#fffbeb] text-[#f59e0b] border-[#f59e0b]/40' },
                      ].map(btn => {
                        const isModeActive = editMode === btn.mode;

                        return (
                          <button
                            key={btn.mode}
                            type="button"
                            onClick={() => {
                              setEditMode(btn.mode as any);
                              // Reset payload template for type if completely blank
                              if (!editPayload || Object.keys(editPayload).length === 0) {
                                setEditPayload({});
                              }
                            }}
                            className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border text-center transition-all active:scale-95 ${
                              isModeActive
                                ? btn.activeColor + ' font-black shadow-sm'
                                : 'bg-white hover:bg-slate-50 border-[#F6B7C8]/10 text-gray-400 font-medium'
                            }`}
                          >
                            <div className={`mb-2 ${isModeActive ? 'scale-110' : ''} transition-transform`}>
                              {btn.icon}
                            </div>
                            <span className="text-[10px] tracking-wide uppercase font-bold">
                              {btn.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mode-Specific Input Forms */}
                  <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 min-h-[160px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      
                      {/* 1. DIGITAL PROFILE MODE */}
                      {editMode === 'profile' && (
                        <motion.div
                          key="form-profile"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#8b5cf6]">
                            <User className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">{t('Sambungkan ke Profil Digital', 'Link to Digital Profile')}</h4>
                          </div>
                          
                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Saat gantungan kunci Anda di-tap, pengguna akan otomatis diarahkan ke profil digital yang telah Anda buat di OneTap.',
                              'When your keychain is tapped, the device will automatically open your curated OneTap digital bio profile.'
                            )}
                          </p>

                          {profiles.length === 0 ? (
                            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-2xl space-y-3">
                              <p className="text-xs font-semibold text-yellow-700 leading-relaxed">
                                {t(
                                  'Anda belum membuat halaman Profil Digital (Linktree). Buat dulu halaman profil Anda untuk menyambungkannya!',
                                  'You haven\'t created any digital profile page yet. Create one in the Linktree Manager to start linking.'
                                )}
                              </p>
                              <Link 
                                href="/dashboard/linktree" 
                                className="inline-flex items-center gap-1.5 text-xs font-black text-yellow-800 hover:text-[#FF5FA2] transition-colors"
                              >
                                {t('Buat Halaman Profil Sekarang', 'Create Profile Page Now')} →
                              </Link>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 block">{t('Pilih Halaman Profil', 'Select Profile Page')}</label>
                              <select
                                className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                                value={editPayload.slug || ''}
                                onChange={(e) => setEditPayload({ slug: e.target.value })}
                              >
                                <option value="" disabled>{t('-- Pilih Halaman Profil --', '-- Select Profile --')}</option>
                                {profiles.map(p => (
                                  <option key={p.id} value={p.slug}>
                                    {p.title} ({`/l/${p.slug}`})
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* 2. CUSTOM URL MODE */}
                      {editMode === 'url' && (
                        <motion.div
                          key="form-url"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#FF5FA2]">
                            <Globe className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">{t('Link Kustom / Redirect Langsung', 'Custom URL / Direct Redirect')}</h4>
                          </div>

                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Arahkan pemindai langsung ke website eksternal mana pun secara instan. Contoh: Portofolio Anda, Menu Restoran, TripAdvisor, dll.',
                              'Redirect users directly to any external website instantly. Perfect for portfolios, restaurant menus, TripAdvisor links, etc.'
                            )}
                          </p>

                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 block">{t('URL / Link Website', 'Website URL / Link')}</label>
                            <div className="relative">
                              <input
                                type="url"
                                className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 focus:border-[#FF5FA2]/20 outline-none transition-all text-sm font-bold text-[#18080F]"
                                value={editPayload.url || ''}
                                onChange={(e) => setEditPayload({ url: e.target.value })}
                                placeholder="https://portofolio-anda.com"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* 3. WHATSAPP REDIRECT MODE */}
                      {editMode === 'whatsapp' && (
                        <motion.div
                          key="form-whatsapp"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#10b981]">
                            <Phone className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">WhatsApp Redirect</h4>
                          </div>

                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Tempelkan gantungan kunci untuk membuka WhatsApp dan otomatis mengirimi Anda pesan kustom preset.',
                              'Tap the keychain to automatically launch WhatsApp and draft a custom message to your number.'
                            )}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 block">{t('Nomor WA', 'WA Number')}</label>
                              <input
                                type="text"
                                className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                                value={editPayload.phone || ''}
                                onChange={(e) => setEditPayload({ ...editPayload, phone: e.target.value })}
                                placeholder="628123456789"
                              />
                              <span className="text-[9px] text-gray-400 font-semibold italic">
                                {t('Gunakan kode negara (62). Contoh: 62812...', 'Use country code (e.g. 62812...)')}
                              </span>
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 block">{t('Pesan Otomatis (Opsional)', 'Auto Message (Optional)')}</label>
                              <textarea
                                rows={2}
                                className="w-full p-3 rounded-xl bg-white border border-slate-200 outline-none text-xs font-bold text-[#18080F] resize-none"
                                value={editPayload.message || ''}
                                onChange={(e) => setEditPayload({ ...editPayload, message: e.target.value })}
                                placeholder={t('Halo, saya tertarik dengan layanan Anda...', 'Hi, I am interested in your services...')}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* 4. WI-FI CREDENTIALS INTERACTIVE */}
                      {editMode === 'wifi' && (
                        <motion.div
                          key="form-wifi"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#6366f1]">
                            <Wifi className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">{t('Kredensial Wi-Fi Pintar', 'Smart Wi-Fi Credentials')}</h4>
                          </div>

                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Menampilkan halaman dengan nama Wi-Fi dan salin password 1-klik untuk tamu di rumah atau kantor Anda. Kompatibel penuh dengan iOS.',
                              'Displays a beautiful card containing the network name and 1-click password copy. Fully iOS-compatible.'
                            )}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 block">{t('Nama Wi-Fi (SSID)', 'Wi-Fi Name (SSID)')}</label>
                              <input
                                type="text"
                                className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                                value={editPayload.ssid || ''}
                                onChange={(e) => setEditPayload({ ...editPayload, ssid: e.target.value })}
                                placeholder="Wifi Rumah / Kantor"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 block">{t('Password Wi-Fi', 'Wi-Fi Password')}</label>
                              <div className="relative">
                                <input
                                  type={showWifiPassword ? 'text' : 'password'}
                                  className="w-full h-12 px-4 pr-10 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                                  value={editPayload.password || ''}
                                  onChange={(e) => setEditPayload({ ...editPayload, password: e.target.value })}
                                  placeholder="Password..."
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowWifiPassword(!showWifiPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF5FA2] transition-colors"
                                >
                                  {showWifiPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* 5. vCARD BUSINESS CONTACT MODE */}
                      {editMode === 'vcard' && (
                        <motion.div
                          key="form-vcard"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#f59e0b]">
                            <Building2 className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">{t('Kartu Nama Digital (vCard)', 'Digital Business Card (vCard)')}</h4>
                          </div>

                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Menampilkan halaman dengan profil kontak lengkap dan tombol unduh file vCard (.vcf) instan untuk menyimpan langsung ke buku telepon HP.',
                              'Presents a digital business card with full contact details and a one-tap .vcf download button to save to contacts.'
                            )}
                          </p>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 block">{t('Nama Depan', 'First Name')}</label>
                              <input
                                type="text"
                                className="w-full h-11 px-4 rounded-xl bg-white border border-slate-200 outline-none text-xs font-bold text-[#18080F]"
                                value={editPayload.firstName || ''}
                                onChange={(e) => setEditPayload({ ...editPayload, firstName: e.target.value })}
                                placeholder="Budi"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 block">{t('Nama Belakang', 'Last Name')}</label>
                              <input
                                type="text"
                                className="w-full h-11 px-4 rounded-xl bg-white border border-slate-200 outline-none text-xs font-bold text-[#18080F]"
                                value={editPayload.lastName || ''}
                                onChange={(e) => setEditPayload({ ...editPayload, lastName: e.target.value })}
                                placeholder="Santoso"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 block">{t('Nomor Telepon', 'Phone Number')}</label>
                              <input
                                type="tel"
                                className="w-full h-11 px-4 rounded-xl bg-white border border-slate-200 outline-none text-xs font-bold text-[#18080F]"
                                value={editPayload.phone || ''}
                                onChange={(e) => setEditPayload({ ...editPayload, phone: e.target.value })}
                                placeholder="081234567890"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 block">Email</label>
                              <input
                                type="email"
                                className="w-full h-11 px-4 rounded-xl bg-white border border-slate-200 outline-none text-xs font-bold text-[#18080F]"
                                value={editPayload.email || ''}
                                onChange={(e) => setEditPayload({ ...editPayload, email: e.target.value })}
                                placeholder="budi@email.com"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 block">{t('Perusahaan / Organisasi', 'Company / Org')}</label>
                              <input
                                type="text"
                                className="w-full h-11 px-4 rounded-xl bg-white border border-slate-200 outline-none text-xs font-bold text-[#18080F]"
                                value={editPayload.org || ''}
                                onChange={(e) => setEditPayload({ ...editPayload, org: e.target.value })}
                                placeholder="OneTap Inc."
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                    </AnimatePresence>
                  </div>

                  {/* Errors and Success indicator */}
                  {saveError && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-xs font-bold text-red-600">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{saveError}</span>
                    </div>
                  )}

                  {saveSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-xs font-bold text-green-600"
                    >
                      <Check className="w-5 h-5 shrink-0" />
                      <span>{t('Konfigurasi redirect berhasil diperbarui!', 'Redirect configuration updated successfully!')}</span>
                    </motion.div>
                  )}

                  {/* Save CTA */}
                  <button
                    onClick={handleSaveConfig}
                    disabled={saving}
                    className="w-full h-14 bg-[#0F172A] hover:bg-slate-800 text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {t('Simpan Konfigurasi', 'Save Configuration')}
                      </>
                    )}
                  </button>

                </motion.div>
              ) : (
                /* SKELETON PLACEHOLDER FOR NO SELECTED KEYCHAIN */
                <div className="bg-white rounded-[2.5rem] border border-[#F6B7C8]/10 p-12 shadow-sm text-center flex flex-col items-center justify-center space-y-6 h-full min-h-[500px]">
                  <div className="w-20 h-20 rounded-full bg-[#FFF1F7] flex items-center justify-center text-[#FF5FA2] shadow-inner mb-2">
                    <Smartphone className="w-10 h-10 animate-pulse text-[#FF5FA2]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-[#18080F]">
                      {t('Pengelola Gantungan Kunci NFC', 'NFC Keychain Manager')}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium max-w-[280px] mx-auto leading-relaxed">
                      {t(
                        'Pilih gantungan kunci di sebelah kiri untuk mengonfigurasi data pengalihan digital Anda, atau daftarkan gantungan kunci baru.',
                        'Select a keychain on the left side to edit its redirection behavior or configure details.'
                      )}
                    </p>
                  </div>
                  {keychains.length > 0 && (
                    <span className="text-[10px] font-black text-[#FF5FA2] uppercase tracking-[0.2em] bg-[#FF5FA2]/5 px-4 py-1.5 rounded-full inline-block">
                      {t('Menunggu Seleksi...', 'Awaiting Selection...')}
                    </span>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* --- MODAL: CLAIM NEW KEYCHAIN --- */}
      <AnimatePresence>
        {showClaimModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#18080F]/45 backdrop-blur-sm"
              onClick={() => setShowClaimModal(false)}
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[2rem] w-full max-w-md border border-[#F6B7C8]/10 p-8 shadow-2xl relative z-10 overflow-hidden"
            >
              
              {/* Corner Glowing Accent */}
              <div className="absolute -right-20 -top-20 w-44 h-44 rounded-full bg-[#FF5FA2]/10 blur-3xl" />

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-[#18080F]">
                    {t('Daftarkan Gantungan Kunci Baru', 'Register New Keychain')}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-1">
                    {t(
                      'Masukkan token gantungan kunci Anda untuk mengklaim kepemilikannya.',
                      'Enter your unique keychain token code to claim ownership.'
                    )}
                  </p>
                </div>

                <form onSubmit={handleClaim} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#18080F] uppercase tracking-wider block">
                      {t('Kode Keychain (Token)', 'Keychain Code (Token)')}
                    </label>
                    <input
                      type="text"
                      required
                      value={claimToken}
                      onChange={(e) => setClaimToken(e.target.value)}
                      placeholder="e.g. key-budi123"
                      className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-slate-200 focus:border-[#FF5FA2]/20 focus:bg-white outline-none transition-all text-sm font-bold text-[#18080F] font-mono uppercase tracking-widest"
                    />
                    <span className="text-[10px] text-gray-400 font-semibold leading-relaxed block italic">
                      {t(
                        'Bebas daftarkan kode apa saja! Jika token belum ada di sistem, kami akan membuatnya otomatis.',
                        'Enter any custom code! If the token is new, we will register it for you automatically.'
                      )}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#18080F] uppercase tracking-wider block">
                      {t('Label Gantungan (Alias)', 'Keychain Label (Alias)')}
                    </label>
                    <input
                      type="text"
                      value={claimLabel}
                      onChange={(e) => setClaimLabel(e.target.value)}
                      placeholder="e.g. Gantungan Kunci Utama"
                      className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-slate-200 focus:border-[#FF5FA2]/20 focus:bg-white outline-none transition-all text-sm font-bold text-[#18080F]"
                    />
                  </div>

                  {claimError && (
                    <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-xs font-bold text-red-500">
                      <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                      <span>{claimError}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowClaimModal(false)}
                      className="flex-1 h-12 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-black text-xs transition-all active:scale-95"
                    >
                      {t('Batal', 'Cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={claiming || !claimToken.trim()}
                      className="flex-1 h-12 rounded-xl bg-[#FF5FA2] hover:bg-[#E8457E] text-white font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-[#FF5FA2]/10"
                    >
                      {claiming ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          {t('Klaim & Simpan', 'Claim & Save')}
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CONFIRM DIALOG: DELETE / UNCLAIM KEYCHAIN --- */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#18080F]/45 backdrop-blur-sm"
              onClick={() => setDeletingId(null)}
            />

            {/* Dialog Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-sm border border-[#F6B7C8]/10 p-6 shadow-2xl relative z-10 text-center space-y-5"
            >
              <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-inner">
                <Trash2 className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-black text-[#18080F]">
                  {t('Hapus Gantungan Kunci?', 'Delete Keychain?')}
                </h3>
                <p className="text-xs text-gray-400 font-medium leading-relaxed px-4">
                  {t(
                    'Apakah Anda yakin ingin menghapus gantungan kunci ini dari akun Anda? Konfigurasi redirect gantungan kunci ini akan dihapus secara permanen.',
                    'Are you sure you want to delete this keychain? Its redirection configuration will be permanently wiped.'
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  className="flex-1 h-11 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-black text-xs transition-all active:scale-95"
                >
                  {t('Batal', 'Cancel')}
                </button>
                <button
                  onClick={() => handleDeleteKeychain(deletingId)}
                  disabled={deleting}
                  className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-red-600/10"
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      {t('Ya, Hapus', 'Yes, Delete')}
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
