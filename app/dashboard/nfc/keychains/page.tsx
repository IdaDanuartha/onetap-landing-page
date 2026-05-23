'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import jsQR from 'jsqr';
import { 
  ArrowLeft, Wifi, User, Phone, Mail, Building2, 
  ExternalLink, Key, Plus, Trash2, Edit2, Save, X,
  Loader2, Check, AlertCircle, Copy, HelpCircle, 
  ChevronRight, Smartphone, Eye, EyeOff, Globe,
  MessageCircle, Contact2, Bluetooth, AppWindow, MapPin, 
  Navigation, Map, Type, MessageSquare, Link2, CheckCircle2, Lock, Info,
  QrCode, Camera, Github
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { InstagramIcon, FacebookIcon, LinkedinIcon, XIcon, YoutubeIcon, TiktokIcon, TelegramIcon, SpotifyIcon } from '@/app/components/BrandIcons';

interface Keychain {
  id: string;
  token: string;
  label: string;
  active_mode: any;
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

const MODE_CATEGORIES = [
  { id: 'networking', label: 'Networking', icon: User },
  { id: 'social_media', label: 'Sosial', icon: Globe },
  { id: 'connectivity', label: 'Konektivitas', icon: Wifi },
  { id: 'maps', label: 'Maps', icon: MapPin },
  { id: 'other', label: 'Lainnya', icon: Plus },
];

const MODE_OPTIONS = [
  // Networking
  { id: 'profile', category: 'networking', label: 'Profil Digital', icon: User, placeholder: 'onetap-charm.com/l/...' },
  { id: 'vcard', category: 'networking', label: 'Kontak (vCard)', icon: Contact2, placeholder: 'Nama & No HP' },
  
  // Sosial (formerly Communication + new brand socials)
  { id: 'whatsapp', category: 'social_media', label: 'WhatsApp', icon: MessageCircle, placeholder: '62812... (Pesan)' },
  { id: 'instagram', category: 'social_media', label: 'Instagram', icon: InstagramIcon, placeholder: 'username' },
  { id: 'spotify', category: 'social_media', label: 'Spotify', icon: SpotifyIcon, placeholder: 'link/ID' },
  { id: 'tiktok', category: 'social_media', label: 'TikTok', icon: TiktokIcon, placeholder: 'username' },
  { id: 'telegram', category: 'social_media', label: 'Telegram', icon: TelegramIcon, placeholder: 'username' },
  { id: 'github', category: 'social_media', label: 'GitHub', icon: Github, placeholder: 'username' },
  { id: 'facebook', category: 'social_media', label: 'Facebook', icon: FacebookIcon, placeholder: 'username' },
  { id: 'linkedin', category: 'social_media', label: 'LinkedIn', icon: LinkedinIcon, placeholder: 'username' },
  { id: 'twitter', category: 'social_media', label: 'Twitter / X', icon: XIcon, placeholder: 'username' },
  { id: 'youtube', category: 'social_media', label: 'YouTube', icon: YoutubeIcon, placeholder: 'username' },
  { id: 'phone', category: 'social_media', label: 'Telepon', icon: Phone, placeholder: '+62812...' },
  { id: 'email', category: 'social_media', label: 'Kirim Email', icon: Mail, placeholder: 'nama@email.com' },

  // Connectivity
  { id: 'wifi', category: 'connectivity', label: 'Wi-Fi Network', icon: Wifi, placeholder: 'SSID & Password' },
  { id: 'bluetooth', category: 'connectivity', label: 'Bluetooth', icon: Bluetooth, placeholder: 'Mac Address' },
  { id: 'app', category: 'connectivity', label: 'Open App', icon: AppWindow, placeholder: 'com.package.name' },

  // Maps
  { id: 'location', category: 'maps', label: 'Lokasi (Geo)', icon: MapPin, placeholder: 'Lat, Lng' },
  { id: 'navigation', category: 'maps', label: 'Navigasi', icon: Navigation, placeholder: 'Alamat Tujuan' },
  { id: 'streetview', category: 'maps', label: 'Street View', icon: Map, placeholder: 'Lat, Lng' },

  // Lainnya (formerly Sosial)
  { id: 'url', category: 'other', label: 'Link Kustom', icon: Link2, placeholder: 'https://...' },
  { id: 'text', category: 'other', label: 'Pesan Teks', icon: Type, placeholder: 'Halo, ini keychain saya!' },
];

const POPULAR_APPS = [
  { name: 'WhatsApp', package: 'com.whatsapp', iosUrl: 'https://wa.me' },
  { name: 'Instagram', package: 'com.instagram.android', iosUrl: 'https://instagram.com' },
  { name: 'TikTok', package: 'com.zhiliaoapp.musically', iosUrl: 'https://tiktok.com' },
  { name: 'YouTube', package: 'com.google.android.youtube', iosUrl: 'https://youtube.com' },
  { name: 'Facebook', package: 'com.facebook.katana', iosUrl: 'https://facebook.com' },
  { name: 'Spotify', package: 'com.spotify.music', iosUrl: 'https://open.spotify.com' },
  { name: 'Telegram', package: 'org.telegram.messenger', iosUrl: 'https://t.me' },
  { name: 'Twitter / X', package: 'com.twitter.android', iosUrl: 'https://x.com' },
  { name: 'DANA', package: 'id.dana', iosUrl: 'https://dana.id' },
  { name: 'GoPay / Gojek', package: 'com.gojek.app', iosUrl: 'https://gojek.com' },
  { name: 'OVO', package: 'id.ovo.android', iosUrl: 'https://ovo.id' },
  { name: 'Shopee', package: 'com.shopee.id', iosUrl: 'https://shopee.co.id' },
  { name: 'Mobile Legends', package: 'com.mobile.legends', iosUrl: 'https://www.mobilelegends.com' },
  { name: 'Netflix', package: 'com.netflix.mediaclient', iosUrl: 'https://netflix.com' },
  { name: 'Google Maps', package: 'com.google.android.apps.maps', iosUrl: 'https://maps.google.com' }
];

export default function KeychainsManagerPage() {
  const { locale } = useLanguage();
  const router = useRouter();

  // Core loading states
  const [loading, setLoading] = useState(true);
  const [keychains, setKeychains] = useState<Keychain[]>([]);
  const [profiles, setProfiles] = useState<ProfilePage[]>([]);
  
  // Advanced Security states
  const [showSecurity, setShowSecurity] = useState(false);
  const [linkPassword, setLinkPassword] = useState('');
  const [tagPassword, setTagPassword] = useState('');
  const [showNfcPass, setShowNfcPass] = useState(false);

  // QR Scanner states & refs
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

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
  const [selectedApp, setSelectedApp] = useState('com.whatsapp');
  const [targetPlatform, setTargetPlatform] = useState<'both' | 'android' | 'ios'>('both');
  const [activeCategory, setActiveCategory] = useState('networking');

  // Delete/Unclaim state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // UI Helpers
  const [showWifiPassword, setShowWifiPassword] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // NFC Writing states
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [writingKeychain, setWritingKeychain] = useState<Keychain | null>(null);
  const [nfcWriteStatus, setNfcWriteStatus] = useState<'idle' | 'scanning' | 'writing' | 'success' | 'error'>('idle');
  const [nfcWriteError, setNfcWriteError] = useState('');
  const [nfcUnlockPassword, setNfcUnlockPassword] = useState('');
  const [showUnlockInput, setShowUnlockInput] = useState(false);
  const nfcWriteReaderRef = useRef<any>(null);

  // Custom Tag Unlock Prompt State
  const [tagPrompt, setTagPrompt] = useState<{
    isOpen: boolean;
    resolve: ((val: string | null) => void) | null;
    error: string;
  }>({ isOpen: false, resolve: null, error: '' });
  const [tagPromptInput, setTagPromptInput] = useState('');
  const [showTagPromptPass, setShowTagPromptPass] = useState(false);

  const requestTagPassword = () => {
    setTagPromptInput('');
    setShowTagPromptPass(false);
    return new Promise<string | null>((resolve) => {
      setTagPrompt({
        isOpen: true,
        resolve,
        error: ''
      });
    });
  };

  const handleTagPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tagPrompt.resolve) {
      tagPrompt.resolve(tagPromptInput);
    }
  };

  const handleTagPromptCancel = () => {
    if (tagPrompt.resolve) {
      tagPrompt.resolve(null);
    }
    setTagPrompt({ isOpen: false, resolve: null, error: '' });
  };

  const handleForceFormat = async () => {
    const confirmMsg = locale === 'id'
      ? "Apakah Anda yakin ingin memformat paksa tag ini? Seluruh data dan password di dalam tag akan dihapus permanen."
      : "Are you sure you want to force format this tag? All data and password inside the tag will be permanently erased.";
    if (!confirm(confirmMsg)) return;

    if (tagPrompt.resolve) {
      tagPrompt.resolve('force_format_bypass');
    }
  };

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

  // QR Code camera scanning logic
  const startScanner = async () => {
    setScanError('');
    setScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS
        videoRef.current.play();
        animationFrameIdRef.current = requestAnimationFrame(tickScan);
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      setScanError(t(
        'Gagal mengakses kamera. Pastikan izin kamera telah diberikan.',
        'Failed to access camera. Please make sure camera permissions are granted.'
      ));
      setScanning(false);
    }
  };

  const stopScanner = () => {
    setScanning(false);
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const tickScan = () => {
    const video = videoRef.current;
    if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code) {
          // Robust token extraction
          const match = code.data.match(/\/r\/([a-zA-Z0-9_-]+)/i);
          const detectedToken = match ? match[1] : code.data.trim();
          
          if (detectedToken) {
            setClaimToken(detectedToken);
            stopScanner();
            return;
          }
        }
      }
    }
    // We only loop if still scanning
    if (streamRef.current) {
      animationFrameIdRef.current = requestAnimationFrame(tickScan);
    }
  };

  // Safe camera stream release on close
  useEffect(() => {
    if (!showClaimModal) {
      stopScanner();
    }
    return () => {
      stopScanner();
    };
  }, [showClaimModal]);

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
    const payload = kc.payload_data || {};
    setEditPayload(payload);
    setSaveSuccess(false);
    setSaveError('');

    // Pre-populate Advanced Security states
    setLinkPassword(payload.link_password_hash ? '••••••••' : '');
    setTagPassword(payload.tag_password || '');
    setShowSecurity(false);

    if (kc.active_mode === 'app') {
      const pkg = payload.package || '';
      const isPopular = pkg ? POPULAR_APPS.some(app => app.package === pkg) : false;
      setSelectedApp(isPopular ? pkg : (pkg ? 'custom' : 'com.whatsapp'));
      setTargetPlatform(payload.targetPlatform || 'both');
      // If no package set yet, initialize with defaults
      if (!pkg) {
        setEditPayload({
          package: 'com.whatsapp',
          iosUrl: 'https://wa.me',
          targetPlatform: 'both',
        });
      }
    }

    // Find category for kc.active_mode
    const option = MODE_OPTIONS.find(o => o.id === kc.active_mode);
    if (option) {
      setActiveCategory(option.category);
    }
    
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
          payload_data: editPayload,
          link_password: linkPassword,
          tag_password: tagPassword
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
        
        // Sync security fields in state
        setLinkPassword(data.keychain.payload_data?.link_password_hash ? '••••••••' : '');
        setTagPassword(data.keychain.payload_data?.tag_password || '');
        
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

  // NFC Write: Hash password
  const hashTagPassword = async (pass: string) => {
    const msgUint8 = new TextEncoder().encode(pass + 'onetap_salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // NFC Write: Open modal and start scanning/writing
  const handleOpenWriteNfc = (kc: Keychain) => {
    if (!('NDEFReader' in window)) {
      setWritingKeychain(kc);
      setNfcWriteStatus('error');
      setNfcWriteError(t(
        'Web NFC tidak didukung di browser ini. Gunakan Chrome di Android dengan NFC aktif.',
        'Web NFC is not supported in this browser. Use Chrome on Android with NFC enabled.'
      ));
      setShowWriteModal(true);
      return;
    }
    setWritingKeychain(kc);
    setNfcWriteStatus('idle');
    setNfcWriteError('');
    setNfcUnlockPassword('');
    setShowUnlockInput(false);
    setShowWriteModal(true);
  };

  const handleStartNfcWrite = async (kc: Keychain, unlockPass?: string) => {
    setNfcWriteStatus('scanning');
    setNfcWriteError('');
    try {
      const ndef = new (window as any).NDEFReader();
      nfcWriteReaderRef.current = ndef;
      await ndef.scan();

      ndef.onreading = async (event: any) => {
        const message = event.message;
        let isProtected = false;
        let existingPassHash = '';
        let isLegacyProtection = false;
        let legacyPass = '';

        for (const record of message.records) {
          try {
            const decoder = new TextDecoder();
            const rawData = decoder.decode(record.data);
            const otIndex = rawData.indexOf('ot_p:');
            if (otIndex !== -1) {
              isProtected = true;
              existingPassHash = rawData.substring(otIndex + 5).replace(/[^a-fA-F0-9]/g, '').toLowerCase().substring(0, 64);
              break;
            }
            const pMatch = rawData.match(/[?&]p=([^& \n\r\t]+)/);
            if (pMatch) {
              isProtected = true;
              isLegacyProtection = true;
              legacyPass = decodeURIComponent(pMatch[1]);
            }
          } catch { /* ignore */ }
        }

        // SECURITY CHECK: If the tag is protected, prompt immediately using our premium custom modal!
        let promptValue: string | null = null;
        if (isProtected) {
          let isValid = false;
          while (!isValid) {
            promptValue = await requestTagPassword();
            if (promptValue === null) {
              setNfcWriteStatus('error');
              setNfcWriteError(t('Penulisan dibatalkan.', 'Writing cancelled.'));
              return;
            }

            if (promptValue === 'force_format_bypass') {
              setNfcWriteStatus('writing');
              try {
                await ndef.write({ records: [{ recordType: 'empty' }] });
                setNfcWriteStatus('success');
                setTagPrompt({ isOpen: false, resolve: null, error: '' });
                return;
              } catch {
                setNfcWriteStatus('error');
                setNfcWriteError(t('Gagal memformat paksa tag.', 'Failed to force format tag.'));
                setTagPrompt({ isOpen: false, resolve: null, error: '' });
                return;
              }
            }

            if (isLegacyProtection) {
              isValid = (legacyPass === promptValue);
            } else {
              const inputHash = await hashTagPassword(promptValue);
              isValid = (existingPassHash === inputHash);
            }

            if (!isValid) {
              setTagPrompt(prev => ({
                ...prev,
                error: t('Password Tag salah! Coba lagi.', 'Wrong tag password! Try again.')
              }));
            } else {
              setTagPrompt({ isOpen: false, resolve: null, error: '' });
            }
          }
        }

        setNfcWriteStatus('writing');
        try {
          const writeUrl = `https://onetap-charm.com/r/${kc.token}`;
          const records: any[] = [{ recordType: 'url', data: writeUrl }];

          const savedTagPass = kc.payload_data?.tag_password;
          if (savedTagPass) {
            const passHash = await hashTagPassword(savedTagPass);
            records.push({ recordType: 'text', data: `ot_p:${passHash}` });
          } else if (isProtected && promptValue) {
            // Preserve the existing password lock
            const passHash = await hashTagPassword(promptValue);
            records.push({ recordType: 'text', data: `ot_p:${passHash}` });
          }

          await ndef.write({ records });
          setNfcWriteStatus('success');
        } catch {
          setNfcWriteStatus('error');
          setNfcWriteError(t(
            'Gagal menulis ke tag. Tahan tag tetap menempel.',
            'Failed to write to tag. Keep tag close to the device.'
          ));
        }
      };

      ndef.onerror = () => {
        setNfcWriteStatus('error');
        setNfcWriteError(t('Kesalahan NFC. Coba lagi.', 'NFC error. Please try again.'));
      };
    } catch (err: any) {
      setNfcWriteStatus('error');
      if (err.name === 'NotAllowedError') {
        setNfcWriteError(t('Izin NFC ditolak.', 'NFC permission denied.'));
      } else if (err.name === 'NotSupportedError') {
        setNfcWriteError(t('NFC tidak didukung perangkat ini.', 'NFC not supported on this device.'));
      } else {
        setNfcWriteError(t('Gagal menginisialisasi NFC.', 'Failed to initialize NFC.'));
      }
    }
  };

  const handleCloseWriteModal = () => {
    setShowWriteModal(false);
    setWritingKeychain(null);
    setNfcWriteStatus('idle');
    setNfcWriteError('');
    setNfcUnlockPassword('');
    setShowUnlockInput(false);
    nfcWriteReaderRef.current = null;
  };

  // Helper: Render active mode icon
  // Helper: Render active mode icon
  const getModeBadge = (mode: Keychain['active_mode']) => {
    switch (mode) {
      case 'instagram':
        return {
          bg: 'bg-[#fff5f5]', border: 'border-[#e1306c]/15', text: 'text-[#e1306c]', label: 'Instagram',
          icon: <InstagramIcon className="w-3.5 h-3.5" />
        };
      case 'spotify':
        return {
          bg: 'bg-[#f0fdf4]', border: 'border-[#1ed760]/15', text: 'text-[#1db954]', label: 'Spotify',
          icon: <SpotifyIcon className="w-3.5 h-3.5" />
        };
      case 'facebook':
        return {
          bg: 'bg-[#eff6ff]', border: 'border-[#1877f2]/15', text: 'text-[#1877f2]', label: 'Facebook',
          icon: <FacebookIcon className="w-3.5 h-3.5" />
        };
      case 'linkedin':
        return {
          bg: 'bg-[#f0f9ff]', border: 'border-[#0077b5]/15', text: 'text-[#0077b5]', label: 'LinkedIn',
          icon: <LinkedinIcon className="w-3.5 h-3.5" />
        };
      case 'twitter':
        return {
          bg: 'bg-[#f8fafc]', border: 'border-[#0f1419]/15', text: 'text-[#0f1419]', label: 'Twitter / X',
          icon: <XIcon className="w-3.5 h-3.5" fill="currentColor" />
        };
      case 'youtube':
        return {
          bg: 'bg-[#fff5f5]', border: 'border-[#ff0000]/15', text: 'text-[#ff0000]', label: 'YouTube',
          icon: <YoutubeIcon className="w-3.5 h-3.5" />
        };
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
          icon: <MessageCircle className="w-3.5 h-3.5" />
        };
      case 'phone':
        return {
          bg: 'bg-[#faf5ff]', border: 'border-[#d8b4fe]/15', text: 'text-[#a855f7]', label: t('Telepon', 'Phone Call'),
          icon: <Phone className="w-3.5 h-3.5" />
        };
      case 'sms':
        return {
          bg: 'bg-[#f0fdf4]', border: 'border-[#bbf7d0]/15', text: 'text-[#22c55e]', label: t('Kirim SMS', 'Send SMS'),
          icon: <MessageSquare className="w-3.5 h-3.5" />
        };
      case 'email':
        return {
          bg: 'bg-[#f0f9ff]', border: 'border-[#bae6fd]/15', text: 'text-[#0284c7]', label: t('Kirim Email', 'Send Email'),
          icon: <Mail className="w-3.5 h-3.5" />
        };
      case 'wifi':
        return {
          bg: 'bg-[#eef2ff]', border: 'border-[#6366f1]/15', text: 'text-[#6366f1]', label: 'Wi-Fi',
          icon: <Wifi className="w-3.5 h-3.5" />
        };
      case 'bluetooth':
        return {
          bg: 'bg-[#f5f3ff]', border: 'border-[#c084fc]/15', text: 'text-[#7c3aed]', label: 'Bluetooth',
          icon: <Bluetooth className="w-3.5 h-3.5" />
        };
      case 'app':
        return {
          bg: 'bg-[#fff1f2]', border: 'border-[#fecdd3]/15', text: 'text-[#f43f5e]', label: 'Open App',
          icon: <AppWindow className="w-3.5 h-3.5" />
        };
      case 'location':
        return {
          bg: 'bg-[#fff7ed]', border: 'border-[#ffedd5]/15', text: 'text-[#ea580c]', label: t('Lokasi Geo', 'Geo Location'),
          icon: <MapPin className="w-3.5 h-3.5" />
        };
      case 'navigation':
        return {
          bg: 'bg-[#fffbeb]', border: 'border-[#fef3c7]/15', text: 'text-[#d97706]', label: t('Navigasi', 'Navigation'),
          icon: <Navigation className="w-3.5 h-3.5" />
        };
      case 'streetview':
        return {
          bg: 'bg-[#fff1f2]', border: 'border-[#ffe4e6]/15', text: 'text-[#e11d48]', label: 'Street View',
          icon: <Map className="w-3.5 h-3.5" />
        };
      case 'vcard':
        return {
          bg: 'bg-[#fffbeb]', border: 'border-[#f59e0b]/15', text: 'text-[#f59e0b]', label: t('Kartu Nama', 'Business Card'),
          icon: <Contact2 className="w-3.5 h-3.5" />
        };
      case 'text':
        return {
          bg: 'bg-[#f8fafc]', border: 'border-[#e2e8f0]/15', text: 'text-[#475569]', label: t('Pesan Teks', 'Text Message'),
          icon: <Type className="w-3.5 h-3.5" />
        };
      default:
        return {
          bg: 'bg-gray-50', border: 'border-gray-200/50', text: 'text-gray-400', label: String(mode),
          icon: <HelpCircle className="w-3.5 h-3.5" />
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F2] selection:bg-[#FF5FA2]/20 selection:text-[#FF5FA2] pb-16">
      
      {/* Navbar Navigation */}
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-[#F6B7C8]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Link href="/dashboard/nfc" className="p-2 sm:p-2.5 rounded-xl hover:bg-[#FFF8F2] text-gray-500 hover:text-[#FF5FA2] transition-all shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg md:text-xl font-black text-[#18080F] tracking-tight truncate">
                {t('Gantungan Kunci Dinamis', 'Dynamic Keychains')}
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
                NFC Dynamic Redirect Manager
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowClaimModal(true)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#FF5FA2] hover:bg-[#E8457E] text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-md active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="inline sm:hidden">{t('Daftar', 'Register')}</span>
            <span className="hidden sm:inline">{t('Daftarkan Keychain', 'Register Keychain')}</span>
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
                          <div className="flex items-center gap-3">
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
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenWriteNfc(kc);
                              }}
                              className="flex items-center gap-1 text-[10px] font-black text-gray-400 hover:text-indigo-500 transition-colors"
                            >
                              <Wifi className="w-3.5 h-3.5 rotate-90" />
                              {t('Tulis NFC', 'Write NFC')}
                            </button>
                          </div>

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

                  {/* Category Selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-[#18080F] uppercase tracking-wider block">
                      {t('Pilih Kategori Aksi', 'Select Action Category')}
                    </label>
                    <div className="relative">
                      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-1 px-1 touch-pan-x">
                        {MODE_CATEGORIES.map((cat) => {
                          const IconComponent = cat.icon;
                          const isCatActive = activeCategory === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setActiveCategory(cat.id)}
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border whitespace-nowrap transition-all text-xs font-bold ${
                                isCatActive
                                  ? 'bg-[#FF5FA2] border-[#FF5FA2] text-white shadow-md'
                                  : 'bg-white border-[#F6B7C8]/20 text-gray-500 hover:border-[#FF5FA2]/30'
                              }`}
                            >
                              <IconComponent className="w-3.5 h-3.5" />
                              {cat.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Mode Card Grid Selection (Filtered by Category) */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-[#18080F] uppercase tracking-wider block">
                      {t('Pilih Aksi / Mode Pengalihan', 'Select Action / Redirect Mode')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {MODE_OPTIONS.filter(m => m.category === activeCategory).map((m) => {
                        const IconComponent = m.icon;
                        const isModeActive = editMode === m.id;
                        
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              setEditMode(m.id as any);
                              if (m.id === 'app') {
                                // Initialize Open App defaults when switching to app mode
                                const defaultPkg = 'com.whatsapp';
                                const defaultIos = 'https://wa.me';
                                const defaultPlatform = 'both';
                                setSelectedApp(defaultPkg);
                                setTargetPlatform(defaultPlatform);
                                setEditPayload({
                                  package: defaultPkg,
                                  iosUrl: defaultIos,
                                  targetPlatform: defaultPlatform,
                                });
                              } else if (!editPayload || typeof editPayload !== 'object') {
                                setEditPayload({});
                              }
                            }}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all active:scale-[0.97] ${
                              isModeActive
                                ? 'bg-[#FF5FA2] border-[#FF5FA2] text-white shadow-lg shadow-[#FF5FA2]/20 font-black'
                                : 'bg-white hover:bg-slate-50 border-[#F6B7C8]/10 text-gray-400 font-medium'
                            }`}
                          >
                            <div className={`mb-2 ${isModeActive ? 'scale-110 text-white' : 'text-gray-400'} transition-transform`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] tracking-wide uppercase font-bold">
                              {m.label}
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

                      {/* INSTAGRAM MODE */}
                      {editMode === 'instagram' && (
                        <motion.div
                          key="form-instagram"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#e1306c]">
                            <InstagramIcon className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">Instagram</h4>
                          </div>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Tempelkan gantungan kunci untuk langsung membuka profil Instagram Anda.',
                              'Tap the keychain to automatically open your Instagram profile.'
                            )}
                          </p>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 block">{t('Username Instagram', 'Instagram Username')}</label>
                            <input
                              type="text"
                              className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                              value={editPayload.username || ''}
                              onChange={(e) => setEditPayload({ username: e.target.value })}
                              placeholder="username"
                            />
                            <span className="text-[10px] text-gray-400 font-semibold italic block">
                              {t('Tulis username atau link profil penuh.', 'Enter username or full profile link.')}
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {/* TIKTOK MODE */}
                      {editMode === 'tiktok' && (
                        <motion.div
                          key="form-tiktok"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#010101]">
                            <TiktokIcon className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">TikTok</h4>
                          </div>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Tempelkan gantungan kunci untuk langsung membuka profil TikTok Anda.',
                              'Tap the keychain to automatically open your TikTok profile.'
                            )}
                          </p>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 block">{t('Username TikTok', 'TikTok Username')}</label>
                            <input
                              type="text"
                              className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                              value={editPayload.username || ''}
                              onChange={(e) => setEditPayload({ username: e.target.value })}
                              placeholder="username"
                            />
                            <span className="text-[10px] text-gray-400 font-semibold italic block">
                              {t('Tulis username tanpa @.', 'Enter username without @.')}
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {/* TELEGRAM MODE */}
                      {editMode === 'telegram' && (
                        <motion.div
                          key="form-telegram"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#0088cc]">
                            <TelegramIcon className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">Telegram</h4>
                          </div>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Tempelkan gantungan kunci untuk langsung membuka profil/chat Telegram Anda.',
                              'Tap the keychain to automatically open your Telegram profile or chat.'
                            )}
                          </p>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 block">{t('Username Telegram', 'Telegram Username')}</label>
                            <input
                              type="text"
                              className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                              value={editPayload.username || ''}
                              onChange={(e) => setEditPayload({ username: e.target.value })}
                              placeholder="username"
                            />
                            <span className="text-[10px] text-gray-400 font-semibold italic block">
                              {t('Tulis username tanpa @.', 'Enter username without @.')}
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {/* GITHUB MODE */}
                      {editMode === 'github' && (
                        <motion.div
                          key="form-github"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#24292e]">
                            <Github className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">GitHub</h4>
                          </div>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Tempelkan gantungan kunci untuk langsung membuka profil GitHub Anda.',
                              'Tap the keychain to automatically open your GitHub profile.'
                            )}
                          </p>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 block">{t('Username GitHub', 'GitHub Username')}</label>
                            <input
                              type="text"
                              className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                              value={editPayload.username || ''}
                              onChange={(e) => setEditPayload({ username: e.target.value })}
                              placeholder="username"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* SPOTIFY MODE */}
                      {editMode === 'spotify' && (
                        <motion.div
                          key="form-spotify"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#1db954]">
                            <SpotifyIcon className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">Spotify</h4>
                          </div>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Tempelkan gantungan kunci untuk langsung membuka lagu, playlist, atau profil Spotify Anda.',
                              'Tap the keychain to automatically open your Spotify track, playlist, or profile.'
                            )}
                          </p>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 block">{t('Tautan Spotify / ID', 'Spotify Link / ID')}</label>
                            <input
                              type="text"
                              className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                              value={editPayload.username || ''}
                              onChange={(e) => setEditPayload({ username: e.target.value })}
                              placeholder="playlist/37i9dQZF1DXcBWIGx254er atau link lengkap"
                            />
                            <span className="text-[10px] text-gray-400 font-semibold italic block">
                              {t('Tulis link lengkap atau ID (misal: playlist/ID, track/ID, dll.)', 'Enter full link or ID (e.g. playlist/ID, track/ID, etc.)')}
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {/* FACEBOOK MODE */}
                      {editMode === 'facebook' && (
                        <motion.div
                          key="form-facebook"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#1877f2]">
                            <FacebookIcon className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">Facebook</h4>
                          </div>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Tempelkan gantungan kunci untuk langsung membuka profil Facebook Anda.',
                              'Tap the keychain to automatically open your Facebook profile.'
                            )}
                          </p>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 block">{t('Username / Link Profil Facebook', 'Facebook Profile / Username')}</label>
                            <input
                              type="text"
                              className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                              value={editPayload.username || ''}
                              onChange={(e) => setEditPayload({ username: e.target.value })}
                              placeholder="username"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* LINKEDIN MODE */}
                      {editMode === 'linkedin' && (
                        <motion.div
                          key="form-linkedin"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#0077b5]">
                            <LinkedinIcon className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">LinkedIn</h4>
                          </div>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Tempelkan gantungan kunci untuk langsung membuka profil LinkedIn Anda.',
                              'Tap the keychain to automatically open your LinkedIn profile.'
                            )}
                          </p>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 block">{t('Username / Link Profil LinkedIn', 'LinkedIn Profile / Username')}</label>
                            <input
                              type="text"
                              className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                              value={editPayload.username || ''}
                              onChange={(e) => setEditPayload({ username: e.target.value })}
                              placeholder="username"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* TWITTER / X MODE */}
                      {editMode === 'twitter' && (
                        <motion.div
                          key="form-twitter"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#0f1419]">
                            <XIcon className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">Twitter / X</h4>
                          </div>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Tempelkan gantungan kunci untuk langsung membuka profil Twitter / X Anda.',
                              'Tap the keychain to automatically open your Twitter / X profile.'
                            )}
                          </p>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 block">{t('Username Twitter / X', 'Twitter / X Username')}</label>
                            <input
                              type="text"
                              className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                              value={editPayload.username || ''}
                              onChange={(e) => setEditPayload({ username: e.target.value })}
                              placeholder="username"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* YOUTUBE MODE */}
                      {editMode === 'youtube' && (
                        <motion.div
                          key="form-youtube"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#ff0000]">
                            <YoutubeIcon className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">YouTube</h4>
                          </div>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Tempelkan gantungan kunci untuk langsung membuka channel YouTube Anda.',
                              'Tap the keychain to automatically open your YouTube channel.'
                            )}
                          </p>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 block">{t('Username / Link Channel YouTube', 'YouTube Channel / Username')}</label>
                            <input
                              type="text"
                              className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                              value={editPayload.username || ''}
                              onChange={(e) => setEditPayload({ username: e.target.value })}
                              placeholder="@channelname"
                            />
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

                            <div className="space-y-2 col-span-1 sm:col-span-2">
                              <label className="text-xs font-bold text-gray-500 block">{t('Keamanan (Enkripsi)', 'Security (Encryption)')}</label>
                              <select
                                className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                                value={editPayload.encryption || 'WPA'}
                                onChange={(e) => setEditPayload({ ...editPayload, encryption: e.target.value })}
                              >
                                <option value="WPA">WPA / WPA2</option>
                                <option value="WEP">WEP</option>
                                <option value="None">{t('Tanpa Password', 'None (No Password)')}</option>
                              </select>
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

                      {/* 6. TELEPON MODE */}
                      {editMode === 'phone' && (
                        <motion.div
                          key="form-phone"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#0ea5e9]">
                            <Phone className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">{t('Panggilan Telepon', 'Phone Call')}</h4>
                          </div>

                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Tempelkan gantungan kunci untuk membuka dialer telepon dan otomatis memanggil nomor yang ditentukan.',
                              'Tap the keychain to automatically open the phone dialer and call the specified number.'
                            )}
                          </p>

                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 block">{t('Nomor Telepon', 'Phone Number')}</label>
                            <input
                              type="tel"
                              className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                              value={editPayload.phone || ''}
                              onChange={(e) => setEditPayload({ phone: e.target.value })}
                              placeholder="081234567890"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* 7. KIRIM SMS MODE */}
                      {editMode === 'sms' && (
                        <motion.div
                          key="form-sms"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#ec4899]">
                            <MessageSquare className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">{t('Kirim SMS', 'Send SMS')}</h4>
                          </div>

                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Tempelkan gantungan kunci untuk membuka aplikasi SMS dan memicu draf SMS ke nomor tujuan dengan pesan kustom.',
                              'Tap the keychain to automatically launch the SMS application with a preset drafted message.'
                            )}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 block">{t('Nomor Telepon Penerima', 'Recipient Phone Number')}</label>
                              <input
                                type="tel"
                                className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                                value={editPayload.phone || ''}
                                onChange={(e) => setEditPayload({ ...editPayload, phone: e.target.value })}
                                placeholder="081234567890"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 block">{t('Pesan SMS', 'SMS Message')}</label>
                              <textarea
                                rows={2}
                                className="w-full p-3 rounded-xl bg-white border border-slate-200 outline-none text-xs font-bold text-[#18080F] resize-none"
                                value={editPayload.message || ''}
                                onChange={(e) => setEditPayload({ ...editPayload, message: e.target.value })}
                                placeholder={t('Halo, ini pesan otomatis...', 'Hello, this is an auto-generated message...')}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* 8. EMAIL MODE */}
                      {editMode === 'email' && (
                        <motion.div
                          key="form-email"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#ef4444]">
                            <Mail className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">{t('Kirim Email', 'Send Email')}</h4>
                          </div>

                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Tempelkan gantungan kunci untuk membuka klien email default dengan draf surat ke alamat tujuan.',
                              'Tap the keychain to automatically open the default mail client with a draft prepared for the recipient.'
                            )}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 block">{t('Alamat Email Tujuan', 'Recipient Email Address')}</label>
                              <input
                                type="email"
                                className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                                value={editPayload.email || ''}
                                onChange={(e) => setEditPayload({ ...editPayload, email: e.target.value })}
                                placeholder="nama@email.com"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 block">{t('Subjek / Judul Email', 'Email Subject')}</label>
                              <input
                                type="text"
                                className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                                value={editPayload.subject || ''}
                                onChange={(e) => setEditPayload({ ...editPayload, subject: e.target.value })}
                                placeholder={t('Halo OneTap', 'Hello OneTap')}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* 9. BLUETOOTH MODE */}
                      {editMode === 'bluetooth' && (
                        <motion.div
                          key="form-bluetooth"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#3b82f6]">
                            <Bluetooth className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">{t('Koneksi Bluetooth', 'Bluetooth Connection')}</h4>
                          </div>

                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Menampilkan halaman dengan alamat MAC perangkat Bluetooth Anda untuk memudahkan penyalinan satu klik.',
                              'Presents a page showing your Bluetooth MAC address for quick one-click clipboard copying.'
                            )}
                          </p>

                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 block">{t('Alamat MAC Perangkat', 'Device MAC Address')}</label>
                            <input
                              type="text"
                              className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                              value={editPayload.mac || ''}
                              onChange={(e) => setEditPayload({ mac: e.target.value })}
                              placeholder="00:11:22:33:FF:EE"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* 10. OPEN APP MODE */}
                      {editMode === 'app' && (
                        <motion.div
                          key="form-app"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#8b5cf6]">
                            <AppWindow className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">{t('Buka Aplikasi (Multi-Platform)', 'Open App (Multi-Platform)')}</h4>
                          </div>

                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Buka otomatis aplikasi native baik di Android maupun iOS (iPhone) secara instan saat keychain di-tap!',
                              'Instantly launch native applications on tap across both Android and iOS devices!'
                            )}
                          </p>

                          {/* Platform Selector */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 block">{t('Platform Target', 'Target Platform')}</label>
                            <div className="flex bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl p-1 w-full">
                              {[
                                { id: 'both', label: t('Semua (Android & iOS)', 'Both (Android & iOS)') },
                                { id: 'android', label: 'Android' },
                                { id: 'ios', label: 'iOS (Apple)' }
                              ].map((platform) => (
                                <button
                                  key={platform.id}
                                  type="button"
                                  onClick={() => {
                                    setTargetPlatform(platform.id as any);
                                    setEditPayload({
                                      ...editPayload,
                                      targetPlatform: platform.id
                                    });
                                  }}
                                  className={`flex-1 py-2 text-[10px] sm:text-xs font-black rounded-lg transition-all uppercase tracking-wider ${
                                    targetPlatform === platform.id
                                      ? 'bg-white text-[#FF5FA2] shadow-sm border border-gray-100'
                                      : 'text-gray-400 hover:text-gray-600'
                                  }`}
                                >
                                  {platform.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* App Dropdown Select */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 block">{t('Pilih Aplikasi', 'Select Application')}</label>
                            <div className="relative">
                              <select 
                                value={selectedApp}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setSelectedApp(val);
                                  if (val !== 'custom') {
                                    const app = POPULAR_APPS.find(a => a.package === val);
                                    setEditPayload({
                                      ...editPayload,
                                      package: val,
                                      iosUrl: app ? app.iosUrl : '',
                                      targetPlatform: targetPlatform
                                    });
                                  } else {
                                    setEditPayload({
                                      ...editPayload,
                                      package: '',
                                      iosUrl: '',
                                      targetPlatform: targetPlatform
                                    });
                                  }
                                }}
                                className="text-sm font-bold text-[#18080F] bg-white border border-slate-200 rounded-xl w-full h-12 px-4 pr-10 outline-none focus:border-[#FF5FA2]/20 transition-all appearance-none cursor-pointer"
                              >
                                {POPULAR_APPS.map(app => (
                                  <option key={app.package} value={app.package}>{app.name}</option>
                                ))}
                                <option value="custom">Kustom (Ketik Sendiri)</option>
                              </select>
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <ChevronRight className="w-4 h-4 rotate-90" />
                              </div>
                            </div>
                          </div>

                          <AnimatePresence>
                            {selectedApp === 'custom' && (
                              <motion.div
                                initial={{ opacity: 0, height: 0, y: -5 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -5 }}
                                className="overflow-hidden space-y-4"
                              >
                                {(targetPlatform === 'both' || targetPlatform === 'android') && (
                                  <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 block">{t('Nama Paket Aplikasi (Android)', 'Application Package Name (Android)')}</label>
                                    <input 
                                      type="text"
                                      value={editPayload.package || ''}
                                      onChange={(e) => setEditPayload({
                                        ...editPayload,
                                        package: e.target.value
                                      })}
                                      placeholder="Contoh: com.whatsapp"
                                      className="text-sm font-bold text-[#18080F] bg-white border border-slate-200 rounded-xl w-full h-12 px-4 outline-none focus:border-[#FF5FA2]/20 transition-all"
                                    />
                                  </div>
                                )}
                                {(targetPlatform === 'both' || targetPlatform === 'ios') && (
                                  <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 block">{t('Link / Universal URL (iOS)', 'Link / Universal URL (iOS)')}</label>
                                    <input 
                                      type="text"
                                      value={editPayload.iosUrl || ''}
                                      onChange={(e) => setEditPayload({
                                        ...editPayload,
                                        iosUrl: e.target.value
                                      })}
                                      placeholder="Contoh: https://wa.me"
                                      className="text-sm font-bold text-[#18080F] bg-white border border-slate-200 rounded-xl w-full h-12 px-4 outline-none focus:border-[#FF5FA2]/20 transition-all"
                                    />
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <p className="text-[10px] text-gray-400 px-1 italic leading-relaxed">
                            {targetPlatform === 'android' ? t('Membuka aplikasi otomatis di Android jika terinstal.', 'Automatically opens the application on Android if installed.') :
                             targetPlatform === 'ios' ? t('Membuka otomatis di iOS (iPhone) menggunakan Universal Links.', 'Automatically opens on iOS (iPhone) using Universal Links.') :
                             t('Kompatibel penuh: membuka otomatis baik di Android (AAR) maupun iOS (Universal Link).', 'Fully compatible: automatically opens on both Android (AAR) and iOS (Universal Link).')}
                          </p>
                        </motion.div>
                      )}

                      {/* 11. GEO COORDINATES MODE */}
                      {editMode === 'location' && (
                        <motion.div
                          key="form-location"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#f43f5e]">
                            <MapPin className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">{t('Koordinat Lokasi (Geo)', 'Location Coordinates (Geo)')}</h4>
                          </div>

                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Mengalihkan pengguna langsung ke titik koordinat peta spesifik di Google Maps atau Apple Maps.',
                              'Directs users instantly to a specific geographical coordinate point on Google Maps or Apple Maps.'
                            )}
                          </p>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 block">Latitude</label>
                              <input
                                type="text"
                                className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                                value={editPayload.lat || ''}
                                onChange={(e) => setEditPayload({ ...editPayload, lat: e.target.value })}
                                placeholder="-6.175392"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 block">Longitude</label>
                              <input
                                type="text"
                                className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                                value={editPayload.lng || ''}
                                onChange={(e) => setEditPayload({ ...editPayload, lng: e.target.value })}
                                placeholder="106.827153"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* 12. NAVIGATION MODE */}
                      {editMode === 'navigation' && (
                        <motion.div
                          key="form-navigation"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#06b6d4]">
                            <Navigation className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">{t('Navigasi Lokasi', 'Location Navigation')}</h4>
                          </div>

                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Arahkan pemindai langsung ke panduan rute navigasi di Google Maps menuju alamat atau tempat yang Anda tetapkan.',
                              'Directs the scanner straight into turn-by-turn routing navigation on Google Maps to your designated place.'
                            )}
                          </p>

                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 block">{t('Alamat Tujuan / Nama Tempat', 'Destination Address / Place Name')}</label>
                            <input
                              type="text"
                              className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                              value={editPayload.address || ''}
                              onChange={(e) => setEditPayload({ address: e.target.value })}
                              placeholder="Grand Indonesia, Jakarta"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* 13. STREET VIEW MODE */}
                      {editMode === 'streetview' && (
                        <motion.div
                          key="form-streetview"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#10b981]">
                            <Map className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">Google Street View</h4>
                          </div>

                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Tempelkan gantungan kunci untuk langsung memproyeksikan visual panorama 360 derajat Street View di lokasi koordinat ini.',
                              'Tap the keychain to instantly project the 360-degree interactive panorama Street View for these coordinates.'
                            )}
                          </p>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 block">Latitude</label>
                              <input
                                type="text"
                                className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                                value={editPayload.lat || ''}
                                onChange={(e) => setEditPayload({ ...editPayload, lat: e.target.value })}
                                placeholder="-6.175392"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 block">Longitude</label>
                              <input
                                type="text"
                                className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none text-sm font-bold text-[#18080F]"
                                value={editPayload.lng || ''}
                                onChange={(e) => setEditPayload({ ...editPayload, lng: e.target.value })}
                                placeholder="106.827153"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* 14. PESAN TEKS MODE */}
                      {editMode === 'text' && (
                        <motion.div
                          key="form-text"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2 text-[#64748b]">
                            <Type className="w-5 h-5" />
                            <h4 className="font-black text-sm uppercase tracking-wider">{t('Pesan Teks / Catatan', 'Custom Text Message')}</h4>
                          </div>

                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                            {t(
                              'Tampilkan memo pesan teks, kutipan, petunjuk, atau informasi kustom premium dengan tombol copy satu klik.',
                              'Presents a beautiful text memo card for custom messages, quotes, or notes, with one-click copy functionality.'
                            )}
                          </p>

                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 block">{t('Isi Pesan Teks', 'Text Message Content')}</label>
                            <textarea
                              rows={4}
                              className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-[#FF5FA2]/20 outline-none text-sm font-bold text-[#18080F]"
                              value={editPayload.text || ''}
                              onChange={(e) => setEditPayload({ text: e.target.value })}
                              placeholder={t('Halo, selamat datang di gantungan kunci OneTap saya! Silakan salin info ini...', 'Hello, welcome to my OneTap keychain! Feel free to copy this info...')}
                            />
                          </div>
                        </motion.div>
                      )}

                    </AnimatePresence>
                  </div>

                  {/* Advanced Security Panel */}
                  <div className="border border-slate-100 bg-slate-50/50 rounded-3xl overflow-hidden transition-all duration-300">
                    <button
                      type="button"
                      onClick={() => setShowSecurity(!showSecurity)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl transition-colors ${showSecurity ? 'bg-[#FF5FA2]/10 text-[#FF5FA2]' : 'bg-slate-100 text-slate-500'}`}>
                          <Lock className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-[#18080F] uppercase tracking-wider">
                            {t('Keamanan Tingkat Lanjut', 'Advanced Security')}
                          </h4>
                          <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                            {t('Proteksi password link & tag NFC', 'Link password & NFC tag lock protection')}
                          </p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: showSecurity ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-400"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {showSecurity && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="border-t border-slate-100"
                        >
                          <div className="p-6 space-y-5 bg-white">
                            
                            {/* Link Protection Password */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-700">
                                  {t('Password Proteksi Link', 'Link Protection Password')}
                                </label>
                                <span className="text-[9px] text-gray-400 font-semibold bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                  {t('Prompt Pengguna', 'User Prompt')}
                                </span>
                              </div>
                              <input
                                type="password"
                                className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-slate-200 focus:border-[#FF5FA2]/20 focus:bg-white outline-none transition-all text-xs font-bold text-[#18080F]"
                                value={linkPassword}
                                onChange={(e) => setLinkPassword(e.target.value)}
                                placeholder={t('Kosongkan untuk menonaktifkan...', 'Leave blank to disable...')}
                              />
                              <span className="text-[9px] text-gray-400 font-medium leading-relaxed block">
                                {t(
                                  'Jika diisi, pengunjung harus memasukkan password ini sebelum dapat mengakses konten redirection gantungan kunci Anda.',
                                  'If set, visitors must enter this password before they can access your keychain redirection content.'
                                )}
                              </span>
                            </div>

                            {/* NFC Tag Protection Password */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-700">
                                  {t('Password Kunci Tag NFC', 'NFC Tag Lock Password')}
                                </label>
                                <span className="bg-[#FF5FA2]/10 text-[#FF5FA2] text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                                  {t('Lock Tag', 'Lock Tag')}
                                </span>
                              </div>
                              <div className="relative">
                                <input
                                  type={showNfcPass ? 'text' : 'password'}
                                  className="w-full h-11 pl-4 pr-10 rounded-xl bg-gray-50 border border-slate-200 focus:border-[#FF5FA2]/20 focus:bg-white outline-none transition-all text-xs font-bold text-[#18080F]"
                                  value={tagPassword}
                                  onChange={(e) => setTagPassword(e.target.value)}
                                  placeholder={t('Password kunci software NFC...', 'NFC software lock password...')}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNfcPass(!showNfcPass)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF5FA2] transition-colors"
                                >
                                  {showNfcPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                              <span className="text-[9px] text-gray-400 font-medium leading-relaxed block">
                                {t(
                                  'Password ini akan digunakan sebagai referensi software lock untuk mencegah pihak ketiga menimpa data chip fisik NFC Anda.',
                                  'This password acts as a software lock reference to prevent third parties from overwriting your physical NFC chip data.'
                                )}
                              </span>
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
              className="bg-white rounded-[2rem] w-full max-w-md border border-[#F6B7C8]/10 p-5 sm:p-8 shadow-2xl relative z-10 overflow-hidden max-h-[90vh] overflow-y-auto"
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
                    
                    {scanning ? (
                      <div className="space-y-3">
                        {/* Viewfinder */}
                        <div className="relative w-full max-h-[220px] sm:max-h-none sm:aspect-square bg-[#18080F] rounded-2xl overflow-hidden border border-[#F6B7C8]/20 shadow-2xl flex items-center justify-center" style={{ height: '220px' }}>
                          <video 
                            ref={videoRef} 
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Laser Sweep */}
                          <motion.div
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF5FA2] to-transparent shadow-[0_0_12px_2px_#FF5FA2]"
                            animate={{ top: ['4%', '96%', '4%'] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                          />

                          {/* Focus Corners Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-48 h-48 border border-dashed border-[#FF5FA2]/30 rounded-2xl relative flex items-center justify-center">
                              {/* Corner Borders */}
                              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#FF5FA2] rounded-tl-lg -mt-[1px] -ml-[1px]" />
                              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#FF5FA2] rounded-tr-lg -mt-[1px] -mr-[1px]" />
                              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#FF5FA2] rounded-bl-lg -mb-[1px] -ml-[1px]" />
                              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#FF5FA2] rounded-br-lg -mb-[1px] -mr-[1px]" />
                              
                              {/* Central indicator */}
                              <div className="w-2 h-2 bg-[#FF5FA2] rounded-full animate-ping" />
                            </div>
                          </div>
                          
                          {/* Live indicator badge */}
                          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
                            <span className="w-1.5 h-1.5 bg-[#FF5FA2] rounded-full animate-ping" />
                            <span className="text-[9px] font-black text-white tracking-widest uppercase">Live Scan</span>
                          </div>
                        </div>

                        {/* Scanner action and status */}
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[10px] text-gray-400 font-semibold italic">
                            {t('Arahkan kamera ke QR code keychain', 'Aim camera at the keychain QR code')}
                          </p>
                          <button
                            type="button"
                            onClick={stopScanner}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-500 text-[10px] font-black transition-all active:scale-95"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                            {t('Matikan Kamera', 'Turn Off Camera')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            required
                            value={claimToken}
                            onChange={(e) => setClaimToken(e.target.value)}
                            placeholder="e.g. key-budi123"
                            className="w-full h-12 pl-4 pr-12 rounded-xl bg-gray-50 border border-slate-200 focus:border-[#FF5FA2]/20 focus:bg-white outline-none transition-all text-sm font-bold text-[#18080F] font-mono uppercase tracking-widest"
                          />
                          <button
                            type="button"
                            onClick={startScanner}
                            className="absolute right-3 p-1.5 rounded-lg bg-[#FF5FA2]/10 hover:bg-[#FF5FA2] text-[#FF5FA2] hover:text-white transition-all duration-300 active:scale-90"
                            title={t('Scan QR Code dengan Kamera', 'Scan QR Code with Camera')}
                          >
                            <QrCode className="w-4.5 h-4.5" />
                          </button>
                        </div>
                        {scanError && (
                          <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-[10px] font-bold text-red-500">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{scanError}</span>
                          </div>
                        )}
                        <span className="text-[10px] text-gray-400 font-semibold leading-relaxed block italic">
                          {t(
                            'Bebas daftarkan kode apa saja! Jika token belum ada di sistem, kami akan membuatnya otomatis atau gunakan tombol QR untuk scan.',
                            'Enter any custom code! If the token is new, we will register it for you automatically or use the QR button to scan.'
                          )}
                        </span>
                      </div>
                    )}
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

      {/* --- MODAL: TULIS NFC --- */}
      <AnimatePresence>
        {showWriteModal && writingKeychain && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#18080F]/60 backdrop-blur-md"
              onClick={handleCloseWriteModal}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="relative z-10 bg-white rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden"
            >
              {/* Gradient Header — OneTap Pink */}
              <div className="relative bg-gradient-to-br from-[#FF5FA2] via-[#E8457E] to-[#c73469] p-6 pb-8 overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-[#FF5FA2]/20 blur-2xl" />
                <button
                  onClick={handleCloseWriteModal}
                  className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="relative">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFF8F2]/80 block mb-1">
                    {t('Gantungan Kunci', 'Keychain')} • {writingKeychain.token}
                  </span>
                  <h3 className="text-xl font-black text-white">{t('Tulis ke Tag NFC', 'Write to NFC Tag')}</h3>
                  <p className="text-xs text-[#FFF8F2]/80 font-medium mt-1 leading-relaxed">
                    {t('Dekatkan tag NFC Anda ke belakang perangkat', 'Bring your NFC tag close to the back of this device')}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                <AnimatePresence mode="wait">

                  {/* IDLE STATE */}
                  {nfcWriteStatus === 'idle' && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-5"
                    >
                      {/* URL Preview */}
                      <div className="p-4 bg-[#FFF1F7] rounded-2xl border border-[#F6B7C8]/30">
                        <p className="text-[9px] font-black uppercase tracking-wider text-[#FF5FA2] mb-1">{t('URL yang akan ditulis', 'URL to be written')}</p>
                        <p className="text-xs font-black text-[#c73469] break-all">
                          https://onetap-charm.com/r/{writingKeychain.token}
                        </p>
                        {writingKeychain.payload_data?.tag_password && (
                          <p className="text-[9px] text-[#FF5FA2] font-semibold mt-2 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            {t('Lock password akan diperbarui otomatis', 'Lock password will be updated automatically')}
                          </p>
                        )}
                      </div>

                      {/* Unlock Password Input (shown if tag is protected) */}
                      {showUnlockInput && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-2"
                        >
                          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-xs font-semibold text-amber-700">{nfcWriteError}</p>
                          </div>
                          <label className="text-xs font-black text-[#18080F] uppercase tracking-wider block">
                            {t('Password Unlock Tag', 'Tag Unlock Password')}
                          </label>
                          <input
                            type="password"
                            value={nfcUnlockPassword}
                            onChange={(e) => setNfcUnlockPassword(e.target.value)}
                            placeholder={t('Masukkan password tag...', 'Enter tag password...')}
                            className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-slate-200 focus:border-[#FF5FA2]/40 outline-none text-sm font-bold text-[#18080F]"
                          />
                        </motion.div>
                      )}

                      <button
                        onClick={() => handleStartNfcWrite(writingKeychain, showUnlockInput ? nfcUnlockPassword : undefined)}
                        disabled={showUnlockInput && !nfcUnlockPassword.trim()}
                        className="w-full py-3.5 bg-[#FF5FA2] hover:bg-[#E8457E] text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-[#FF5FA2]/25 active:scale-[0.98] disabled:opacity-50"
                      >
                        <Wifi className="w-4 h-4 rotate-90" />
                        {showUnlockInput
                          ? t('Unlock & Tulis NFC', 'Unlock & Write NFC')
                          : t('Mulai Tulis NFC', 'Start NFC Write')}
                      </button>
                    </motion.div>
                  )}

                  {/* SCANNING STATE */}
                  {nfcWriteStatus === 'scanning' && (
                    <motion.div
                      key="scanning"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center text-center py-4 space-y-5"
                    >
                      {/* Pulsing Phone + Tag Animation */}
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full bg-[#F6B7C8]"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                          className="absolute inset-3 rounded-full bg-[#FF5FA2]/40"
                        />
                        <div className="relative w-16 h-16 bg-[#FF5FA2] rounded-2xl flex items-center justify-center shadow-xl shadow-[#FF5FA2]/30">
                          <Smartphone className="w-8 h-8 text-white" />
                        </div>
                        <motion.div
                          animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-xl flex items-center justify-center shadow-lg border border-[#F6B7C8]/40"
                        >
                          <Wifi className="w-4 h-4 text-[#FF5FA2] rotate-90" />
                        </motion.div>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-base font-black text-[#18080F]">{t('Menunggu Tag NFC...', 'Waiting for NFC Tag...')}</p>
                        <p className="text-xs text-gray-400 font-medium max-w-[220px] mx-auto leading-relaxed">
                          {t('Tempelkan tag OneTap ke bagian belakang ponsel Anda', 'Hold your OneTap tag against the back of your phone')}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-[#FF5FA2] bg-[#FFF1F7] px-4 py-2 rounded-full">
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-1.5 h-1.5 bg-[#FF5FA2] rounded-full"
                        />
                        {t('Siap membaca tag', 'Ready to read tag')}
                      </div>
                    </motion.div>
                  )}

                  {/* WRITING STATE */}
                  {nfcWriteStatus === 'writing' && (
                    <motion.div
                      key="writing"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center text-center py-4 space-y-5"
                    >
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FF5FA2]"
                        />
                        <div className="w-16 h-16 bg-[#FF5FA2] rounded-2xl flex items-center justify-center shadow-xl shadow-[#FF5FA2]/25">
                          <Save className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-base font-black text-[#18080F]">{t('Menulis ke Tag...', 'Writing to Tag...')}</p>
                        <p className="text-xs text-gray-400 font-medium">{t('Jangan angkat ponsel Anda', 'Do not move your phone')}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* SUCCESS STATE */}
                  {nfcWriteStatus === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="flex flex-col items-center text-center py-4 space-y-5"
                    >
                      <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.1 }}
                        className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-400/30"
                      >
                        <CheckCircle2 className="w-12 h-12 text-white" />
                      </motion.div>
                      <div className="space-y-1.5">
                        <p className="text-lg font-black text-[#18080F]">{t('Berhasil Ditulis! 🎉', 'Successfully Written! 🎉')}</p>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-[220px] mx-auto">
                          {t(
                            `Tag NFC "${writingKeychain.label}" sekarang mengarah ke tautan dinamis Anda.`,
                            `NFC tag "${writingKeychain.label}" now points to your dynamic redirect link.`
                          )}
                        </p>
                      </div>
                      <button
                        onClick={handleCloseWriteModal}
                        className="w-full py-3 bg-[#FF5FA2] hover:bg-[#E8457E] text-white font-black rounded-2xl text-sm transition-all shadow-lg shadow-[#FF5FA2]/20"
                      >
                        {t('Selesai', 'Done')}
                      </button>
                    </motion.div>
                  )}

                  {/* ERROR STATE */}
                  {nfcWriteStatus === 'error' && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center text-center py-4 space-y-5"
                    >
                      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border-2 border-red-100">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-base font-black text-[#18080F]">{t('Gagal Menulis', 'Write Failed')}</p>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[230px] mx-auto">
                          {nfcWriteError}
                        </p>
                      </div>
                      <div className="flex gap-3 w-full">
                        <button
                          onClick={handleCloseWriteModal}
                          className="flex-1 py-3 border border-gray-200 text-gray-600 font-black rounded-2xl text-xs hover:bg-gray-50 transition-all"
                        >
                          {t('Tutup', 'Close')}
                        </button>
                        <button
                          onClick={() => {
                            setNfcWriteStatus('idle');
                            setNfcWriteError('');
                          }}
                          className="flex-1 py-3 bg-[#FF5FA2] hover:bg-[#E8457E] text-white font-black rounded-2xl text-xs transition-all shadow-md shadow-[#FF5FA2]/20"
                        >
                          {t('Coba Lagi', 'Try Again')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom styled Tag Unlock Prompt Modal */}
      <AnimatePresence>
        {tagPrompt.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#18080F]/60 backdrop-blur-md"
              onClick={handleTagPromptCancel}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 bg-white rounded-[2rem] w-full max-w-md border border-[#F6B7C8]/10 p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
              {/* Decorative Accent */}
              <div className="absolute -right-20 -top-20 w-44 h-44 rounded-full bg-[#FF5FA2]/10 blur-3xl" />

              <form onSubmit={handleTagPromptSubmit} className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF5FA2]/10 text-[#FF5FA2] flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-black text-[#18080F]">
                    {t('Tag Terkunci Password', 'Password-Protected Tag')}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-[280px] mx-auto">
                    {t(
                      'Tag ini dilindungi password. Masukkan password tag NFC untuk membuka dan menulis ulang.',
                      'This tag is protected. Please enter the NFC tag password to unlock and write.'
                    )}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-[#18080F] uppercase tracking-wider block">
                    {t('Password Tag NFC', 'NFC Tag Password')}
                  </label>
                  <div className="relative">
                    <input
                      type={showTagPromptPass ? "text" : "password"}
                      required
                      autoFocus
                      value={tagPromptInput}
                      onChange={(e) => setTagPromptInput(e.target.value)}
                      placeholder={t('Masukkan password...', 'Enter password...')}
                      className="w-full h-12 px-4 pr-12 rounded-xl bg-gray-50 border border-slate-200 focus:border-[#FF5FA2]/40 outline-none text-sm font-bold text-[#18080F]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowTagPromptPass(!showTagPromptPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showTagPromptPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {tagPrompt.error && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-xs font-bold text-red-500">
                      <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                      <span>{tagPrompt.error}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleTagPromptCancel}
                    className="flex-1 h-12 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-black text-xs transition-all active:scale-95"
                  >
                    {t('Batal', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-12 rounded-xl bg-[#FF5FA2] hover:bg-[#E8457E] text-white font-black text-xs transition-all active:scale-95 shadow-md shadow-[#FF5FA2]/10"
                  >
                    {t('Unlock & Tulis', 'Unlock & Write')}
                  </button>
                </div>

                <div className="text-center pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleForceFormat}
                    className="text-xs text-red-500 hover:text-red-600 font-bold underline transition-colors"
                  >
                    {t('Lupa Password? Format Paksa Tag', 'Forgot Password? Force Format Tag')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
