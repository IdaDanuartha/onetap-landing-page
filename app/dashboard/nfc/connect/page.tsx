'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, CheckCircle2, Wifi, AlertCircle, Loader2, 
  User, Link2, Type, Phone, MessageSquare, Mail, ChevronDown,
  Eye, EyeOff, Zap, Eraser, MessageCircle, CreditCard, Wallet, QrCode,
  Contact2, Bluetooth, AppWindow, MapPin, Navigation, Map, Search,
  Share2, Globe, Building2, ShieldCheck, Info, Smartphone, Activity,
  Lock, Shield, Sparkles, BookOpen
} from 'lucide-react';
import nextDynamic from 'next/dynamic';
const GuidedTour = nextDynamic(() => import('@/app/components/GuidedTour'), { ssr: false });
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { dict } from '@/lib/i18n/dict';
import jsQR from 'jsqr';
import { InstagramIcon, FacebookIcon, LinkedinIcon, XIcon, YoutubeIcon, TiktokIcon, TelegramIcon, SpotifyIcon } from "@/app/components/BrandIcons";

function buildWifiPayload(ssid: string, password?: string, encryption: string = 'WPA'): Uint8Array {
  const encoder = new TextEncoder();
  const ssidBytes = encoder.encode(ssid);
  
  let authType = 0x0001; // OPEN
  let encType = 0x0001;  // NONE
  let hasPassword = false;

  if (encryption === 'WEP') {
    authType = 0x0001;
    encType = 0x0002;
    hasPassword = true;
  } else if (encryption === 'WPA') {
    authType = 0x0022; // WPA/WPA2-Personal mixed
    encType = 0x000c;  // AES/TKIP mixed
    hasPassword = true;
  }

  const passwordBytes = (hasPassword && password) ? encoder.encode(password) : new Uint8Array(0);

  let credentialLength = 5 + (4 + ssidBytes.length) + 6 + 6;
  if (hasPassword) {
    credentialLength += 4 + passwordBytes.length;
  }

  const totalLength = 4 + credentialLength;
  const payload = new Uint8Array(totalLength);
  let offset = 0;

  const writeUint16 = (val: number) => {
    payload[offset++] = (val >> 8) & 0xff;
    payload[offset++] = val & 0xff;
  };

  const writeBytes = (bytes: Uint8Array) => {
    payload.set(bytes, offset);
    offset += bytes.length;
  };

  // Outer Wrapper: Credential (0x100e)
  writeUint16(0x100e);
  writeUint16(credentialLength);

  // Network Index (0x1026)
  writeUint16(0x1026);
  writeUint16(1);
  payload[offset++] = 0x01;

  // SSID (0x1045)
  writeUint16(0x1045);
  writeUint16(ssidBytes.length);
  writeBytes(ssidBytes);

  // Authentication Type (0x1003)
  writeUint16(0x1003);
  writeUint16(2);
  writeUint16(authType);

  // Encryption Type (0x100f)
  writeUint16(0x100f);
  writeUint16(2);
  writeUint16(encType);

  // Network Key (0x1027)
  if (hasPassword) {
    writeUint16(0x1027);
    writeUint16(passwordBytes.length);
    writeBytes(passwordBytes);
  }

  return payload;
}

function buildBluetoothPayload(macAddress: string): Uint8Array {
  const cleanMac = macAddress.replace(/[^0-9a-fA-F]/g, '');
  if (cleanMac.length !== 12) {
    throw new Error('MAC Address harus 12 karakter hex (Contoh: 00:11:22:33:FF:EE)');
  }
  
  const macBytes = new Uint8Array(6);
  for (let i = 0; i < 6; i++) {
    macBytes[i] = parseInt(cleanMac.substring(i * 2, i * 2 + 2), 16);
  }
  
  macBytes.reverse();

  const payload = new Uint8Array(8);
  payload[0] = 0x08;
  payload[1] = 0x00;
  payload.set(macBytes, 2);

  return payload;
}

type Mode = 
  | 'profile' | 'vcard' | 'bridge' 
  | 'whatsapp' | 'phone' | 'sms' | 'email' 
  | 'wifi' | 'bluetooth' | 'app' 
  | 'location' | 'navigation' | 'streetview' 
  | 'url' | 'text' | 'instagram' | 'spotify' | 'tiktok' | 'telegram' | 'facebook' | 'linkedin' | 'twitter' | 'youtube' | 'payment' | 'erase';

const MODE_CATEGORIES = [
  { id: 'social', label: 'Sosial', icon: Globe },
  { id: 'networking', label: 'Networking', icon: User },
  { id: 'communication', label: 'Komunikasi', icon: MessageCircle },
  { id: 'connectivity', label: 'Konektivitas', icon: Wifi },
  { id: 'maps', label: 'Maps', icon: MapPin },
  { id: 'utility', label: 'Utilitas', icon: Activity },
];

const MODE_OPTIONS: { id: Mode; category: string; label: string; icon: any; placeholder?: string }[] = [
  // Networking
  { id: 'profile', category: 'networking', label: 'Profil Digital', icon: User, placeholder: 'onetap-charm.com/l/...' },
  { id: 'vcard', category: 'networking', label: 'Kontak (vCard)', icon: Contact2, placeholder: 'Nama & No HP' },
  
  // Communication
  { id: 'whatsapp', category: 'communication', label: 'WhatsApp', icon: MessageCircle, placeholder: '62812... (Pesan)' },
  { id: 'phone', category: 'communication', label: 'Telepon', icon: Phone, placeholder: '+62812...' },
  { id: 'email', category: 'communication', label: 'Kirim Email', icon: Mail, placeholder: 'nama@email.com' },

  // Connectivity
  { id: 'wifi', category: 'connectivity', label: 'Wi-Fi Network', icon: Wifi, placeholder: 'SSID & Password' },
  { id: 'bluetooth', category: 'connectivity', label: 'Bluetooth', icon: Bluetooth, placeholder: 'Mac Address' },
  { id: 'app', category: 'connectivity', label: 'Open App', icon: AppWindow, placeholder: 'com.package.name' },

  // Maps
  { id: 'location', category: 'maps', label: 'Lokasi (Geo)', icon: MapPin, placeholder: 'Lat, Lng' },
  { id: 'navigation', category: 'maps', label: 'Navigasi', icon: Navigation, placeholder: 'Alamat Tujuan' },
  { id: 'streetview', category: 'maps', label: 'Street View', icon: Map, placeholder: 'Lat, Lng' },

  // Social
  { id: 'url', category: 'social', label: 'Link Kustom', icon: Link2, placeholder: 'https://...' },
  { id: 'instagram', category: 'social', label: 'Instagram', icon: InstagramIcon, placeholder: 'username' },
  { id: 'spotify', category: 'social', label: 'Spotify', icon: SpotifyIcon, placeholder: 'link/ID' },
  { id: 'tiktok', category: 'social', label: 'TikTok', icon: TiktokIcon, placeholder: 'username' },
  { id: 'telegram', category: 'social', label: 'Telegram', icon: TelegramIcon, placeholder: 'username' },
  { id: 'facebook', category: 'social', label: 'Facebook', icon: FacebookIcon, placeholder: 'username' },
  { id: 'linkedin', category: 'social', label: 'LinkedIn', icon: LinkedinIcon, placeholder: 'username' },
  { id: 'twitter', category: 'social', label: 'Twitter / X', icon: XIcon, placeholder: 'username' },
  { id: 'youtube', category: 'social', label: 'YouTube', icon: YoutubeIcon, placeholder: 'username' },
  { id: 'text', category: 'social', label: 'Pesan Teks', icon: Type, placeholder: 'Halo, ini keychain saya!' },
  
  // Utility
  { id: 'erase', category: 'utility', label: 'Format NFC', icon: Eraser, placeholder: 'Hapus data' },
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

export default function ConnectNfcPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [mode, setMode] = useState<Mode>('profile');
  const [data, setData] = useState('');
  const [waNumber, setWaNumber] = useState('');
  const [waMessage, setWaMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfileSlug, setSelectedProfileSlug] = useState('');
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [activeCategory, setActiveCategory] = useState('networking');
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimedToken, setClaimedToken] = useState('');

  // Guided Tour State
  const [runTour, setRunTour] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const [tourKey, setTourKey] = useState(0);

  // New Mode States
  const [vcardData, setVcardData] = useState({ firstName: '', lastName: '', phone: '', email: '', org: '' });
  const [wifiData, setWifiData] = useState({ ssid: '', password: '', encryption: 'WPA' });
  const [btAddress, setBtAddress] = useState('');
  const [appPackage, setAppPackage] = useState('com.whatsapp');
  const [selectedApp, setSelectedApp] = useState('com.whatsapp');
  const [iosUrl, setIosUrl] = useState('https://wa.me');
  const [targetPlatform, setTargetPlatform] = useState<'both' | 'android' | 'ios'>('both');
  const [geoData, setGeoData] = useState({ lat: '', lng: '' });
  const [navAddress, setNavAddress] = useState('');
  const [svData, setSvData] = useState({ lat: '', lng: '' });
  
  // Payment states
  const [paymentType, setPaymentType] = useState<'deepLink' | 'qris'>('deepLink');
  const [paymentPlatform, setPaymentPlatform] = useState<'gopay' | 'ovo' | 'dana' | 'shopeepay' | 'linkaja'>('gopay');
  const [merchantId, setMerchantId] = useState('');
  const [qrisUrl, setQrisUrl] = useState('');
  
  // Bridge states
  const [qrisData, setQrisData] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);
  const [merchantName, setMerchantName] = useState('');

  const handleQrisUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsDecoding(true);
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        const imageData = context.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setQrisData(code.data);
          // Try to extract merchant name (Tag 59 in EMVCo QRIS)
          const match = code.data.match(/59(\d{2})(.{1,99})60/);
          if (match) {
            const length = parseInt(match[1]);
            setMerchantName(match[2].substring(0, length));
          } else {
            setMerchantName('QRIS Detected');
          }
        } else {
          setError('Gagal membaca kode QRIS. Pastikan gambar jelas.');
        }
        setIsDecoding(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  const { locale, setLocale, t } = useLanguage();
  const d = dict[locale].dashboard.nfc || { title: 'NFC Activator' };

  const tourSteps = useMemo(() => [
    {
      target: '#tour-nfc-scan',
      title: t('dashboard.tour.nfc.scan.title'),
      content: t('dashboard.tour.nfc.scan.desc'),
      disableBeacon: true,
      data: { id: 'scan' },
      spotlightClicks: true,
    },
    {
      target: '#tour-nfc-link-input',
      title: t('dashboard.tour.nfc.linkInput.title'),
      content: t('dashboard.tour.nfc.linkInput.desc'),
      disableBeacon: true,
      data: { id: 'linkInput' },
      spotlightClicks: true,
    },
    {
      target: '#tour-nfc-write',
      title: t('dashboard.tour.nfc.write.title'),
      content: t('dashboard.tour.nfc.write.desc'),
      disableBeacon: true,
      data: { id: 'write' },
      spotlightClicks: true,
    }
  ], [t]);

  const handleTourClose = () => {
    setRunTour(false);
    localStorage.setItem('onetap_tour_nfc_completed', 'true');
  };

  const handleTourRestart = () => {
    setConnected(false);
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
  
  // Security states
  const [showSecurity, setShowSecurity] = useState(false);
  const [linkPassword, setLinkPassword] = useState('');
  const [nfcPassword, setNfcPassword] = useState('');
  const [showNfcPass, setShowNfcPass] = useState(false);
  const [isDirectForceFormat, setIsDirectForceFormat] = useState(false);

  // Custom Tag Unlock Prompt State
  const [tagPrompt, setTagPrompt] = useState<{
    isOpen: boolean;
    resolve: ((val: string | null) => void) | null;
    error: string;
  }>({ isOpen: false, resolve: null, error: '' });
  const [tagPromptInput, setTagPromptInput] = useState('');
  const [showTagPromptPass, setShowTagPromptPass] = useState(false);

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    resolve: ((val: boolean) => void) | null;
  }>({
    isOpen: false,
    title: '',
    message: '',
    resolve: null
  });

  const requestConfirmation = (title: string, message: string) => {
    return new Promise<boolean>((resolve) => {
      setConfirmModal({
        isOpen: true,
        title,
        message,
        resolve
      });
    });
  };

  const handleConfirmModalAction = (val: boolean) => {
    if (confirmModal.resolve) {
      confirmModal.resolve(val);
    }
    setConfirmModal({ isOpen: false, title: '', message: '', resolve: null });
  };

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
    const confirmed = await requestConfirmation(
      locale === 'id' ? "Konfirmasi Format Paksa" : "Confirm Force Format",
      confirmMsg
    );
    if (!confirmed) return;

    if (tagPrompt.resolve) {
      tagPrompt.resolve('force_format_bypass');
    }
  };

  const handleForceFormatDirect = async () => {
    const confirmMsg = locale === 'id'
      ? "Apakah Anda yakin ingin memformat paksa tag ini? Seluruh data dan password di dalam tag akan dihapus permanen. Tindakan ini tidak memerlukan password lama tag."
      : "Are you sure you want to force format this tag? All data and password inside the tag will be permanently erased. This action does not require the old tag password.";
    const confirmed = await requestConfirmation(
      locale === 'id' ? "Konfirmasi Format Paksa" : "Confirm Force Format",
      confirmMsg
    );
    if (!confirmed) return;

    setIsDirectForceFormat(true);
    setIsConnecting(true);
    setError('');
    setConnected(false);

    try {
      if (!('NDEFReader' in window)) {
        setError(locale === 'id' ? "Web NFC tidak didukung di browser ini. Gunakan Chrome di Android dengan fitur NFC aktif." : "Web NFC is not supported in this browser. Use Chrome on Android with NFC active.");
        setIsConnecting(false);
        setIsDirectForceFormat(false);
        return;
      }

      const ndef = new (window as any).NDEFReader();
      await ndef.scan();
      
      ndef.onreading = async (event: any) => {
        try {
          await ndef.write({ records: [{ recordType: 'empty' }] });
          setConnected(true);
          setIsConnecting(false);
          setIsDirectForceFormat(false);
        } catch (err) {
          setError(locale === 'id' ? "Gagal memformat paksa tag. Pastikan tag tetap menempel." : "Failed to force format tag. Keep tag close.");
          setIsConnecting(false);
          setIsDirectForceFormat(false);
        }
      };
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setError(locale === 'id' ? 'Izin NFC ditolak. Silakan berikan izin akses NFC pada browser Anda.' : 'NFC permission denied. Please allow NFC access.');
      } else if (err.name === 'NotSupportedError') {
        setError(locale === 'id' ? 'Perangkat Anda tidak mendukung fitur NFC.' : 'Your device does not support NFC.');
      } else {
        setError(locale === 'id' ? 'Gagal menginisialisasi NFC. Coba lagi.' : 'Failed to initialize NFC. Try again.');
      }
      setIsConnecting(false);
      setIsDirectForceFormat(false);
    }
  };

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }

      const { data: profile } = await supabase
        .from('users_profile')
        .select('username, whatsapp')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUsername(profile.username);
        if (profile.whatsapp) setWaNumber(profile.whatsapp);
        
        // Also fetch all pages
        setLoadingProfiles(true);
        try {
          const res = await fetch('/api/linktree/save');
          if (res.ok) {
            const data = await res.json();
            if (data.pages) {
              setProfiles(data.pages);
              if (data.pages.length > 0) {
                // Default to first profile slug
                setSelectedProfileSlug(data.pages[0].slug || data.pages[0].id);
              } else {
                setSelectedProfileSlug(profile.username);
              }
            }
          }
        } catch (err) {
          console.error("Error fetching profiles:", err);
        } finally {
          setLoadingProfiles(false);
        }
      }
      setLoading(false);
      const searchParams = new URLSearchParams(window.location.search);
      
      // Auto Claim Keychain logic
      const tokenParam = searchParams.get('token');
      if (tokenParam) {
        try {
          const claimRes = await fetch('/api/keychains', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'claim',
              token: tokenParam.trim().toLowerCase(),
              label: 'OneTap Keychain'
            })
          });
          if (claimRes.ok) {
            setClaimedToken(tokenParam);
            setClaimSuccess(true);
            // Clean the token parameter from URL so it doesn't claim again on page refresh
            if (window.history.replaceState) {
              const url = new URL(window.location.href);
              url.searchParams.delete('token');
              window.history.replaceState({ path: url.href }, '', url.href);
            }
          }
        } catch (err) {
          console.error("Auto claim token error:", err);
        }
      }

      const isTourParam = searchParams.get('tour') === 'true';
      const completed = localStorage.getItem('onetap_tour_nfc_completed');
      if (isTourParam || !completed) {
        setRunTour(true);
        if (isTourParam) {
          setTourStepIndex(0);
        }
        // Save immediately to prevent auto-restart on re-render / page revisit
        localStorage.setItem('onetap_tour_nfc_completed', 'true');
        // Clean URL parameters immediately
        if (window.history.replaceState) {
          const url = new URL(window.location.href);
          url.searchParams.delete('tour');
          window.history.replaceState({ path: url.href }, '', url.href);
        }
      }
    }
    load();
  }, [router]);

  const handleConnectNfc = async () => {
    setIsConnecting(true);
    setError('');
    setConnected(false);

    try {
      if (!('NDEFReader' in window)) {
        setError('Web NFC tidak didukung di browser ini. Gunakan Chrome di Android dengan fitur NFC aktif.');
        setIsConnecting(false);
        return;
      }


      let finalPayload = data.trim();
      const slug = selectedProfileSlug || username;
      const selectedPage = profiles.find(p => p.slug === selectedProfileSlug || p.id === selectedProfileSlug);

      // Handle Profile Mode
      if (mode === 'profile') {
        finalPayload = `https://onetap-charm.com/l/${slug}`;
        if (selectedPage) {
          const supabase = createClient();
          await supabase
            .from('linktree_pages')
            .update({ password: linkPassword || null })
            .eq('id', selectedPage.id);
        }
      } 
      // Handle Bridge Mode
      else if (mode === 'bridge') {
        finalPayload = `https://onetap-charm.com/pay/${slug}`;
        if (selectedPage && (qrisData || linkPassword)) {
          const supabase = createClient();
          await supabase
            .from('linktree_pages')
            .update({ 
              qris_data: qrisData || null,
              password: linkPassword || null
            })
            .eq('id', selectedPage.id);
        }
      } 
      // Handle Custom URL Mode with Protection
      else if (mode === 'url' && linkPassword) {
        // Create a protected link on the server
        const targetUrl = finalPayload.startsWith('http') ? finalPayload : `https://${finalPayload}`;
        
        try {
          const res = await fetch('/api/links/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              url: targetUrl, 
              password: linkPassword 
            })
          });
          
          if (!res.ok) throw new Error('API Error');
          

          const linkData = await res.json();
          if (linkData.token) {
            finalPayload = `https://onetap-charm.com/r/${linkData.token}`;
          } else {
            throw new Error(linkData.debug || linkData.error || 'No token');
          }
        } catch (err: any) {
          console.error('[ProtectedLink]', err);
          setError(`Gagal menyiapkan link terproteksi: ${err.message}`);
          setIsConnecting(false);
          return;
        }
      }
      // Handle Standard URL Mode
      else if (mode === 'url') {
        if (!finalPayload.startsWith('http')) finalPayload = `https://${finalPayload}`;
      } 
      else if (mode === 'instagram') {
        finalPayload = finalPayload.replace('@', '');
        finalPayload = `https://instagram.com/${finalPayload}`;
      } else if (mode === 'spotify') {
        if (!finalPayload.startsWith('http')) {
          if (finalPayload.startsWith('spotify:')) {
            // Keep as is
          } else if (finalPayload.includes('spotify.com')) {
            finalPayload = `https://${finalPayload}`;
          } else {
            finalPayload = `https://open.spotify.com/${finalPayload}`;
          }
        }
      } else if (mode === 'tiktok') {
        finalPayload = finalPayload.replace('@', '');
        finalPayload = `https://tiktok.com/@${finalPayload}`;
      } else if (mode === 'telegram') {
        finalPayload = finalPayload.replace('@', '');
        finalPayload = `https://t.me/${finalPayload}`;
      } else if (mode === 'facebook') {
        finalPayload = `https://facebook.com/${finalPayload}`;
      } else if (mode === 'linkedin') {
        finalPayload = `https://linkedin.com/in/${finalPayload}`;
      } else if (mode === 'twitter') {
        finalPayload = finalPayload.replace('@', '');
        finalPayload = `https://x.com/${finalPayload}`;
      } else if (mode === 'youtube') {
        const cleaned = finalPayload.startsWith('@') ? finalPayload : `@${finalPayload}`;
        finalPayload = `https://youtube.com/${cleaned}`;
      }
      // Handle Other Modes
      else if (mode === 'whatsapp') {
        const cleanNum = waNumber.replace(/[^0-9]/g, "");
        finalPayload = `https://wa.me/${cleanNum}${waMessage ? `?text=${encodeURIComponent(waMessage)}` : ""}`;
      } else if (mode === 'phone') {
        finalPayload = `tel:${finalPayload.replace(/[^0-9+]/g, '')}`;
      } else if (mode === 'sms') {
        finalPayload = `sms:${finalPayload.replace(/[^0-9+]/g, '')}`;
      } else if (mode === 'email') {
        finalPayload = `mailto:${finalPayload}`;
      } else if (mode === 'payment') {
        if (paymentType === 'deepLink') {
          if (paymentPlatform === 'gopay') finalPayload = `gopay://pay?merchant_id=${merchantId}`;
          else if (paymentPlatform === 'ovo') finalPayload = `ovo://qris?data=${merchantId}`;
          else if (paymentPlatform === 'dana') finalPayload = `dana://pay?merchant=${merchantId}`;
          else if (paymentPlatform === 'shopeepay') finalPayload = `shopeepay://pay?payload=${merchantId}`;
          else if (paymentPlatform === 'linkaja') finalPayload = `linkaja://pay?merchant_id=${merchantId}`;
        } else {
          if (!finalPayload.startsWith('http')) finalPayload = `https://${finalPayload}`;
        }
      } else if (mode === 'vcard') {
        finalPayload = `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardData.firstName} ${vcardData.lastName}\nN:${vcardData.lastName};${vcardData.firstName};;;\nTEL;TYPE=CELL:${vcardData.phone}\nEMAIL:${vcardData.email}\nORG:${vcardData.org}\nEND:VCARD`;
      } else if (mode === 'wifi') {
        finalPayload = `WIFI:S:${wifiData.ssid};T:${wifiData.encryption};P:${wifiData.password};;`;
      } else if (mode === 'location') {
        finalPayload = `geo:${geoData.lat},${geoData.lng}`;
      } else if (mode === 'navigation') {
        finalPayload = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(navAddress)}`;
      } else if (mode === 'streetview') {
        finalPayload = `google.streetview:cbll=${svData.lat},${svData.lng}`;
      } else if (mode === 'app') {
        finalPayload = appPackage; // Will be used as external record
      } else if (mode === 'bluetooth') {
        finalPayload = btAddress;
      }


      // NEW: We no longer append ?p= to the URL because it's visible in OS notifications.
      // Instead, we store it in a SEPARATE record that OS doesn't show in the popup.
      const mainPayload = data.trim();
      
      // Helper to hash password for tag storage
      const hashTagPassword = async (pass: string) => {
        const msgUint8 = new TextEncoder().encode(pass + "onetap_salt");
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      };

      const ndef = new (window as any).NDEFReader();
      await ndef.scan();
      
      ndef.onreading = async (event: any) => {
        const message = event.message;
        let isProtected = false;
        let existingPassHash = '';
        let isLegacyProtection = false;
        let legacyPass = '';

        // Robust record scanning for protection markers
        for (const record of message.records) {
          try {
            const decoder = new TextDecoder();
            const rawData = decoder.decode(record.data);
            
            // 1. Check for New Protection (Separate Record)
            const otIndex = rawData.indexOf('ot_p:');
            if (otIndex !== -1) {
              isProtected = true;
              existingPassHash = rawData.substring(otIndex + 5).replace(/[^a-fA-F0-9]/g, '').toLowerCase().substring(0, 64);
              break;
            }

            // 2. Check for Legacy Protection (?p= in URL)
            const pMatch = rawData.match(/[?&]p=([^& \n\r\t]+)/);
            if (pMatch) {
              isProtected = true;
              isLegacyProtection = true;
              legacyPass = decodeURIComponent(pMatch[1]);
              // Don't break yet, might find a new protection record which takes priority
            }
          } catch (e) {
            console.error("Error decoding record:", e);
          }
        }

        // SECURITY CHECK: If the tag is protected, prompt immediately using our premium custom modal!
        let promptValue: string | null = null;
        if (isProtected) {
          let isValid = false;
          while (!isValid) {
            promptValue = await requestTagPassword();
            if (promptValue === null) {
              setError(locale === 'id' ? "Penulisan dibatalkan." : "Writing cancelled.");
              setIsConnecting(false);
              return;
            }

            if (promptValue === 'force_format_bypass') {
              try {
                await ndef.write({ records: [{ recordType: 'empty' }] });
                setConnected(true);
                setIsConnecting(false);
                setTagPrompt({ isOpen: false, resolve: null, error: '' });
                return;
              } catch (err) {
                setError(locale === 'id' ? "Gagal memformat paksa tag." : "Failed to force format tag.");
                setIsConnecting(false);
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
                error: locale === 'id' ? "Password Tag salah! Coba lagi." : "Wrong tag password! Try again."
              }));
            } else {
              setTagPrompt({ isOpen: false, resolve: null, error: '' });
            }
          }
        }

        try {
          let records: any[] = [];
          if (mode === 'erase') {
            records.push({ recordType: 'empty' });
          } else {
            if (mode === 'app') {
              if (targetPlatform === 'android') {
                records.push({ recordType: 'android.com:pkg', data: new TextEncoder().encode(appPackage) });
              } else if (targetPlatform === 'ios') {
                records.push({ recordType: 'url', data: iosUrl });
              } else {
                // Dual records configuration: URL record (first) allows iOS background tag reading.
                // AAR record (second) allows Android system redirection.
                records.push({ recordType: 'url', data: iosUrl });
                records.push({ recordType: 'android.com:pkg', data: new TextEncoder().encode(appPackage) });
              }
            } else {
              let record: any;
              if (mode === 'url') {
                record = { recordType: 'url', data: finalPayload };
              } else if (mode === 'text') {
                record = { recordType: 'text', data: finalPayload };
              } else if (mode === 'vcard') {
                record = { recordType: 'mime', mediaType: 'text/vcard', data: finalPayload };
              } else if (mode === 'wifi') {
                const wifiPayload = buildWifiPayload(wifiData.ssid, wifiData.password, wifiData.encryption);
                record = { recordType: 'mime', mediaType: 'application/vnd.wfa.wsc', data: wifiPayload };
              } else if (mode === 'bluetooth') {
                const btPayload = buildBluetoothPayload(btAddress);
                record = { recordType: 'mime', mediaType: 'application/vnd.bluetooth.ep.oob', data: btPayload };
              } else {
                record = { recordType: 'url', data: finalPayload };
              }
              records.push(record);
            }

            // Secondary Protection Record (Hidden from OS notifications)
            const activeWritePassword = nfcPassword || (isProtected ? promptValue : '');
            if (activeWritePassword) {
              const passHash = await hashTagPassword(activeWritePassword);
              records.push({
                recordType: 'text',
                data: `ot_p:${passHash}`
              });
            }
          }

          await ndef.write({ records });
          setConnected(true);
          setIsConnecting(false);
          if (runTour && tourStepIndex === 2) {
            handleTourClose();
          }
        } catch (err) {
          setError('Gagal menulis. Pastikan tag tetap menempel.');
          setIsConnecting(false);
        }
      };

    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setError('Izin NFC ditolak. Silakan berikan izin akses NFC pada browser Anda.');
      } else if (err.name === 'NotSupportedError') {
        setError('Perangkat Anda tidak mendukung fitur NFC.');
      } else {
        setError('Gagal menginisialisasi NFC. Coba lagi.');
      }
      setIsConnecting(false);
    }
  };

  const isFormValid = () => {
    if (mode === 'profile' || mode === 'erase') return true;
    if (mode === 'bridge') return !!qrisData;
    if (mode === 'vcard') return !!vcardData.firstName && !!vcardData.phone;
    if (mode === 'wifi') return !!wifiData.ssid;
    if (mode === 'bluetooth') return !!btAddress;
    if (mode === 'location') return !!geoData.lat && !!geoData.lng;
    if (mode === 'navigation') return !!navAddress;
    if (mode === 'streetview') return !!svData.lat && !!svData.lng;
    if (mode === 'app') {
      if (targetPlatform === 'android') return !!appPackage;
      if (targetPlatform === 'ios') return !!iosUrl;
      return !!appPackage && !!iosUrl;
    }
    if (mode === 'whatsapp') return !!waNumber;
    if (mode === 'payment') return paymentType === 'qris' ? !!qrisUrl : !!merchantId;
    return !!data.trim();
  };

  const selectedMode = MODE_OPTIONS.find(m => m.id === mode)!;

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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 max-w-[50%] min-w-0">
            <Link href="/dashboard" className="p-2 sm:p-2.5 rounded-xl hover:bg-[#FFF8F2] text-gray-500 hover:text-[#FF5FA2] transition-all flex-shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg sm:text-xl font-black text-[#18080F] truncate whitespace-nowrap">NFC Activator</h1>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            <button
              onClick={handleTourRestart}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl text-gray-500 hover:text-[#FF5FA2] hover:bg-[#FF5FA2]/5 transition-all duration-300 text-[10px] sm:text-xs font-bold uppercase cursor-pointer whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 h-4" />
              <span className="hidden sm:inline">{t('dashboard.tour.restart')}</span>
            </button>

            <div className="h-6 w-px bg-gray-100 mx-0.5 sm:mx-1" />

            <button
              onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl text-gray-500 hover:text-[#FF5FA2] hover:bg-[#FF5FA2]/5 transition-all duration-300 text-[10px] sm:text-xs font-bold uppercase whitespace-nowrap"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 h-4" />
              <span>{locale.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-8 sm:py-12 relative z-10">
        
        {/* Animated NFC Visual */}
        <div id="tour-nfc-scan" className="relative mx-auto w-40 h-40 mb-10">
          <AnimatePresence>
            {!connected && isConnecting && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border border-[#FF5FA2]/30"
              />
            )}
          </AnimatePresence>
          
          <motion.div 
            animate={connected ? { scale: [1, 1.05, 1], rotate: [0, 5, 0] } : {}}
            className={`absolute inset-0 flex items-center justify-center rounded-[56px] shadow-2xl transition-all duration-700 ${
              connected 
                ? 'bg-gradient-to-br from-[#FF5FA2] to-[#E8457E] text-white shadow-[#FF5FA2]/40' 
                : mode === 'erase'
                  ? 'bg-red-500 text-white shadow-red-500/30'
                  : 'bg-white border border-[#F6B7C8]/20 text-[#FF5FA2]'
            }`}
          >
            {connected ? (
              <div className="relative">
                <motion.div
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <ShieldCheck className="w-20 h-20" strokeWidth={1.5} />
                </motion.div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 bg-white/20 rounded-full"
                />
              </div>
            ) : mode === 'erase' ? (
              <Eraser className="w-12 h-12" strokeWidth={2.5} />
            ) : (
              <Image 
                src="/images/logo_simple.png" 
                alt="OneTap" 
                width={56} 
                height={56} 
                className="object-contain"
              />
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3 mb-10"
        >
          <h2 className="text-3xl font-black text-[#18080F] tracking-tight">
            {connected ? dict[locale].dashboard.nfc.success.title : 'Konfigurasi NFC'}
          </h2>
          <p className="text-gray-400 font-medium max-w-sm mx-auto text-sm leading-relaxed">
            {connected 
              ? dict[locale].dashboard.nfc.success.subtitle
              : 'Pilih mode dan kustomisasi aksi keychain OneTap kamu.'}
          </p>
        </motion.div>

        {claimSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 rounded-3xl bg-green-50 border border-green-100 flex items-start gap-3 text-green-800 text-xs sm:text-sm font-semibold shadow-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="font-extrabold text-green-900">Keychain Berhasil Diklaim!</p>
              <p className="text-green-700/80 font-medium mt-0.5">
                Kode keychain <span className="font-mono bg-green-100 px-1.5 py-0.5 rounded text-green-900 font-bold">{claimedToken}</span> telah berhasil dihubungkan ke akun Anda. Silakan kustomisasi aksinya di bawah dan tulis ke gantungan kunci fisik Anda.
              </p>
            </div>
          </motion.div>
        )}

        {!connected && (
          <div className="space-y-6">
            {/* Category Selection */}
            <div className="relative">
              <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar -mx-1 px-1 touch-pan-x">
              {MODE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap transition-all text-xs font-bold ${
                    activeCategory === cat.id
                      ? 'bg-[#FF5FA2] border-[#FF5FA2] text-white shadow-md'
                      : 'bg-white border-[#F6B7C8]/20 text-gray-500 hover:border-[#FF5FA2]/30'
                  }`}
                >
                  <cat.icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              ))}
              </div>
              <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white/50 to-transparent pointer-events-none md:hidden" />
            </div>

            {/* Mode Selection Grid (Filtered by Category) */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {MODE_OPTIONS.filter(m => m.category === activeCategory).map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setMode(m.id); setData(''); }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                    mode === m.id 
                      ? 'bg-[#FF5FA2] border-[#FF5FA2] text-white shadow-lg shadow-[#FF5FA2]/20' 
                      : 'bg-white border-[#F6B7C8]/20 text-gray-400 hover:border-[#FF5FA2]/50 hover:text-[#FF5FA2]'
                  }`}
                >
                  <m.icon className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter whitespace-nowrap">{m.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>


            {/* Input Area */}
            <div id="tour-nfc-link-input" className={`p-6 bg-white border rounded-[32px] shadow-sm space-y-4 transition-all ${mode === 'erase' ? 'border-red-100 ring-4 ring-red-50' : 'border-[#F6B7C8]/10'}`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mode === 'erase' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-500'}`}>
                    <selectedMode.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedMode.label}</p>
                    {mode === 'erase' ? (
                      <div className="mt-2 space-y-1">
                        <p className="text-sm font-bold text-red-600">Hapus Semua Data</p>
                        <p className="text-[10px] text-gray-500 leading-tight">Chip NFC akan dikosongkan. Jika tag ini memiliki password pelindung, masukkan password di bagian Keamanan Lanjutan.</p>
                      </div>
                    ) : mode === 'profile' ? (
                      <div className="space-y-3 mt-2">
                        {loadingProfiles ? (
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Memuat profil...
                          </div>
                        ) : profiles.length > 0 ? (
                          <div className="grid gap-2">
                            {profiles.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => setSelectedProfileSlug(p.slug || p.id)}
                                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                                  selectedProfileSlug === (p.slug || p.id)
                                    ? "bg-[#FF5FA2]/5 border-[#FF5FA2] text-[#FF5FA2]"
                                    : "bg-white border-gray-100 text-gray-500 hover:border-[#FF5FA2]/30"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                    <User className="w-4 h-4 text-gray-400" />
                                  </div>
                                  <div className="text-left">
                                    <p className="text-xs font-bold">{p.title || "Untitled Profile"}</p>
                                    <p className="text-[9px] opacity-60 font-medium tracking-tight">/l/{p.slug || p.id}</p>
                                  </div>
                                </div>
                                {selectedProfileSlug === (p.slug || p.id) && (
                                  <CheckCircle2 className="w-4 h-4 text-[#FF5FA2]" strokeWidth={3} />
                                )}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm font-bold text-[#18080F]">/l/{username}</p>
                        )}
                      </div>
                    ) : mode === 'whatsapp' ? (
                      <div className="space-y-3 mt-2">
                        <input 
                          type="text"
                          value={waNumber}
                          onChange={(e) => setWaNumber(e.target.value)}
                          placeholder="Nomor WhatsApp (628...)"
                          className="text-sm font-bold text-[#18080F] bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-full px-4 py-3 outline-none focus:border-[#FF5FA2]/30 transition-all"
                        />
                        <textarea 
                          value={waMessage}
                          onChange={(e) => setWaMessage(e.target.value)}
                          placeholder="Pesan otomatis (Opsional)"
                          rows={3}
                          className="text-sm font-bold text-[#18080F] bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-full px-4 py-3 outline-none focus:border-[#FF5FA2]/30 transition-all resize-none"
                        />
                      </div>
                    ) : mode === 'payment' ? (
                      <div className="space-y-4 mt-3">
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => setPaymentType('deepLink')}
                            className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-[10px] font-bold transition-all ${paymentType === 'deepLink' ? 'bg-[#FF5FA2] border-[#FF5FA2] text-white shadow-md' : 'bg-white border-gray-100 text-gray-500'}`}
                          >
                            <Wallet className="w-3 h-3" />
                            {dict[locale].dashboard.nfc.payment.types.deepLink}
                          </button>
                          <button 
                            onClick={() => setPaymentType('qris')}
                            className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-[10px] font-bold transition-all ${paymentType === 'qris' ? 'bg-[#FF5FA2] border-[#FF5FA2] text-white shadow-md' : 'bg-white border-gray-100 text-gray-500'}`}
                          >
                            <QrCode className="w-3 h-3" />
                            {dict[locale].dashboard.nfc.payment.types.qris}
                          </button>
                        </div>

                        {paymentType === 'deepLink' ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-1.5">
                              {['gopay', 'ovo', 'dana', 'shopeepay', 'linkaja'].map((p) => (
                                <button
                                  key={p}
                                  onClick={() => setPaymentPlatform(p as any)}
                                  className={`p-2 rounded-lg border text-[9px] font-black uppercase tracking-wider transition-all ${paymentPlatform === p ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-gray-100 text-gray-400'}`}
                                >
                                  {p}
                                </button>
                              ))}
                            </div>
                            <input 
                              type="text"
                              value={merchantId}
                              onChange={(e) => setMerchantId(e.target.value)}
                              placeholder={dict[locale].dashboard.nfc.payment.merchantPlaceholder}
                              className="text-sm font-bold text-[#18080F] bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-full px-4 py-3 outline-none focus:border-[#FF5FA2]/30 transition-all"
                            />
                          </div>
                        ) : (
                          <input 
                            type="text"
                            value={qrisUrl}
                            onChange={(e) => setQrisUrl(e.target.value)}
                            placeholder={dict[locale].dashboard.nfc.payment.qrisPlaceholder}
                            className="text-sm font-bold text-[#18080F] bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-full px-4 py-3 outline-none focus:border-[#FF5FA2]/30 transition-all"
                          />
                        )}
                      </div>
                     ) : mode === 'bridge' ? (
                      <div className="space-y-4 mt-3">
                        <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl p-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                            Pilih Profil Digital
                          </label>
                          <div className="relative">
                            <select 
                              value={selectedProfileSlug}
                              onChange={(e) => setSelectedProfileSlug(e.target.value)}
                              className="w-full bg-white border border-[#F1F5F9] rounded-lg px-3 py-2 text-xs font-bold text-[#18080F] outline-none appearance-none"
                            >
                              {profiles.map(p => (
                                <option key={p.id} value={p.slug}>{p.title || 'Profil Utama'} ({p.slug})</option>
                              ))}
                              {profiles.length === 0 && (
                                <option value="">Profil Utama ({username})</option>
                              )}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        <div className="relative">
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={handleQrisUpload}
                            id="qris-upload"
                            className="hidden"
                          />
                          <label 
                            htmlFor="qris-upload"
                            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${qrisData ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-slate-100 text-slate-400 hover:border-[#FF5FA2]/30 hover:bg-[#FF5FA2]/5'}`}
                          >
                            {isDecoding ? (
                              <Loader2 className="w-8 h-8 animate-spin" />
                            ) : qrisData ? (
                              <CheckCircle2 className="w-8 h-8" />
                            ) : (
                              <QrCode className="w-8 h-8" />
                            )}
                            <div className="text-center">
                              <p className="text-xs font-bold">
                                {isDecoding ? 'Memproses...' : qrisData ? 'QRIS Berhasil Discan' : 'Upload Foto QRIS Anda'}
                              </p>
                              {merchantName && (
                                <p className="text-[10px] font-medium opacity-70 mt-1">{merchantName}</p>
                              )}
                            </div>
                          </label>
                        </div>
                        
                        {qrisData && (
                          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
                            <Info className="w-4 h-4 text-yellow-500 shrink-0" />
                            <p className="text-[10px] font-bold text-yellow-700 leading-tight">
                              NFC akan membuka halaman khusus dengan pilihan tombol Bank/E-Wallet otomatis.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : mode === 'vcard' ? (
                      <div className="space-y-3 mt-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text"
                            value={vcardData.firstName}
                            onChange={(e) => setVcardData({...vcardData, firstName: e.target.value})}
                            placeholder="Nama Depan"
                            className="text-sm font-bold text-[#18080F] bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-full px-4 py-3 outline-none focus:border-[#FF5FA2]/30 transition-all"
                          />
                          <input 
                            type="text"
                            value={vcardData.lastName}
                            onChange={(e) => setVcardData({...vcardData, lastName: e.target.value})}
                            placeholder="Nama Belakang"
                            className="text-sm font-bold text-[#18080F] bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-full px-4 py-3 outline-none focus:border-[#FF5FA2]/30 transition-all"
                          />
                        </div>
                        <input 
                          type="text"
                          value={vcardData.phone}
                          onChange={(e) => setVcardData({...vcardData, phone: e.target.value})}
                          placeholder="No. Telepon"
                          className="text-sm font-bold text-[#18080F] bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-full px-4 py-3 outline-none focus:border-[#FF5FA2]/30 transition-all"
                        />
                        <input 
                          type="email"
                          value={vcardData.email}
                          onChange={(e) => setVcardData({...vcardData, email: e.target.value})}
                          placeholder="Email"
                          className="text-sm font-bold text-[#18080F] bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-full px-4 py-3 outline-none focus:border-[#FF5FA2]/30 transition-all"
                        />
                        <input 
                          type="text"
                          value={vcardData.org}
                          onChange={(e) => setVcardData({...vcardData, org: e.target.value})}
                          placeholder="Perusahaan / Organisasi"
                          className="text-sm font-bold text-[#18080F] bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-full px-4 py-3 outline-none focus:border-[#FF5FA2]/30 transition-all"
                        />
                      </div>
                    ) : mode === 'wifi' ? (
                      <div className="space-y-3 mt-2">
                        <input 
                          type="text"
                          value={wifiData.ssid}
                          onChange={(e) => setWifiData({...wifiData, ssid: e.target.value})}
                          placeholder="SSID (Nama Wi-Fi)"
                          className="text-sm font-bold text-[#18080F] bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-full px-4 py-3 outline-none focus:border-[#FF5FA2]/30 transition-all"
                        />
                        <div className="relative">
                          <input 
                            type={showNfcPass ? "text" : "password"}
                            value={wifiData.password}
                            onChange={(e) => setWifiData({...wifiData, password: e.target.value})}
                            placeholder="Password Wi-Fi"
                            className="text-sm font-bold text-[#18080F] bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-full px-4 py-3 outline-none focus:border-[#FF5FA2]/30 transition-all"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowNfcPass(!showNfcPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                          >
                            {showNfcPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <select 
                          value={wifiData.encryption}
                          onChange={(e) => setWifiData({...wifiData, encryption: e.target.value})}
                          className="text-sm font-bold text-[#18080F] bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-full px-4 py-3 outline-none focus:border-[#FF5FA2]/30 transition-all appearance-none"
                        >
                          <option value="WPA">WPA / WPA2</option>
                          <option value="WEP">WEP</option>
                          <option value="None">Tanpa Password</option>
                        </select>
                      </div>
                    ) : mode === 'location' ? (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <input 
                          type="text"
                          value={geoData.lat}
                          onChange={(e) => setGeoData({...geoData, lat: e.target.value})}
                          placeholder="Latitude"
                          className="text-sm font-bold text-[#18080F] bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-full px-4 py-3 outline-none focus:border-[#FF5FA2]/30 transition-all"
                        />
                        <input 
                          type="text"
                          value={geoData.lng}
                          onChange={(e) => setGeoData({...geoData, lng: e.target.value})}
                          placeholder="Longitude"
                          className="text-sm font-bold text-[#18080F] bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-full px-4 py-3 outline-none focus:border-[#FF5FA2]/30 transition-all"
                        />
                      </div>
                    ) : mode === 'navigation' ? (
                      <div className="space-y-3 mt-2">
                        <input 
                          type="text"
                          value={navAddress}
                          onChange={(e) => setNavAddress(e.target.value)}
                          placeholder="Alamat Tujuan (Nama Tempat/Alamat)"
                          className="text-sm font-bold text-[#18080F] bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-full px-4 py-3 outline-none focus:border-[#FF5FA2]/30 transition-all"
                        />
                      </div>
                    ) : mode === 'streetview' ? (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <input 
                          type="text"
                          value={svData.lat}
                          onChange={(e) => setSvData({...svData, lat: e.target.value})}
                          placeholder="Latitude"
                          className="text-sm font-bold text-[#18080F] bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-full px-4 py-3 outline-none focus:border-[#FF5FA2]/30 transition-all"
                        />
                        <input 
                          type="text"
                          value={svData.lng}
                          onChange={(e) => setSvData({...svData, lng: e.target.value})}
                          placeholder="Longitude"
                          className="text-sm font-bold text-[#18080F] bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-full px-4 py-3 outline-none focus:border-[#FF5FA2]/30 transition-all"
                        />
                      </div>
                    ) : mode === 'app' ? (
                      <div className="space-y-3 mt-2">
                        {/* Custom Platform Selector */}
                        <div className="flex bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl p-1 w-full">
                          {[
                            { id: 'both', label: 'Semua (Android & iOS)' },
                            { id: 'android', label: 'Android' },
                            { id: 'ios', label: 'iOS (Apple)' }
                          ].map((platform) => (
                            <button
                              key={platform.id}
                              type="button"
                              onClick={() => setTargetPlatform(platform.id as any)}
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

                        <div className="relative">
                          <select 
                            value={selectedApp}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSelectedApp(val);
                              if (val !== 'custom') {
                                setAppPackage(val);
                                const app = POPULAR_APPS.find(a => a.package === val);
                                if (app) setIosUrl(app.iosUrl);
                              } else {
                                setAppPackage('');
                                setIosUrl('');
                              }
                            }}
                            className="text-sm font-bold text-[#18080F] bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-full px-4 py-3 pr-10 outline-none focus:border-[#FF5FA2]/30 transition-all appearance-none cursor-pointer"
                          >
                            {POPULAR_APPS.map(app => (
                              <option key={app.package} value={app.package}>{app.name}</option>
                            ))}
                            <option value="custom">Kustom (Ketik Sendiri)</option>
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>

                        <AnimatePresence>
                          {selectedApp === 'custom' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0, y: -5 }}
                              animate={{ opacity: 1, height: 'auto', y: 0 }}
                              exit={{ opacity: 0, height: 0, y: -5 }}
                              className="overflow-hidden space-y-2"
                            >
                              {(targetPlatform === 'both' || targetPlatform === 'android') && (
                                <input 
                                  type="text"
                                  value={appPackage}
                                  onChange={(e) => setAppPackage(e.target.value)}
                                  placeholder="Android Package (Contoh: com.whatsapp)"
                                  className="text-sm font-bold text-[#18080F] bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-full px-4 py-3 outline-none focus:border-[#FF5FA2]/30 transition-all"
                                />
                              )}
                              {(targetPlatform === 'both' || targetPlatform === 'ios') && (
                                <input 
                                  type="text"
                                  value={iosUrl}
                                  onChange={(e) => setIosUrl(e.target.value)}
                                  placeholder="iOS Link / Universal URL (Contoh: https://wa.me)"
                                  className="text-sm font-bold text-[#18080F] bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-full px-4 py-3 outline-none focus:border-[#FF5FA2]/30 transition-all"
                                />
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <p className="text-[10px] text-gray-400 px-1 italic">
                          {targetPlatform === 'android' ? 'Membuka aplikasi otomatis di Android jika terinstal.' :
                           targetPlatform === 'ios' ? 'Membuka otomatis di iOS (iPhone) menggunakan Universal Links.' :
                           'Kompatibel penuh: membuka otomatis baik di Android (AAR) maupun iOS (Universal Link).'}
                        </p>
                      </div>
                    ) : mode === 'bluetooth' ? (
                      <div className="space-y-3 mt-2">
                        <input 
                          type="text"
                          value={btAddress}
                          onChange={(e) => setBtAddress(e.target.value)}
                          placeholder="Mac Address (Contoh: 00:11:22:33:FF:EE)"
                          className="text-sm font-bold text-[#18080F] bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl w-full px-4 py-3 outline-none focus:border-[#FF5FA2]/30 transition-all"
                        />
                      </div>
                    ) : (
                      <input 
                        type="text"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        placeholder={selectedMode.placeholder}
                        className="text-sm font-bold text-[#18080F] bg-transparent border-none outline-none w-full p-0 mt-1"
                      />
                    )}
                  </div>
                </div>
                {mode === 'profile' && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-[10px] font-black uppercase">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </div>
                )}
                {mode === 'erase' && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-[10px] font-black uppercase">
                    <AlertCircle className="w-3 h-3" />
                    Destructive
                  </div>
                )}
              </div>
            </div>

            {/* Security Options (Premium Feature Toggle) */}
            <div className="space-y-3">
              <button 
                onClick={() => setShowSecurity(!showSecurity)}
                className="w-full p-5 bg-white/50 border border-[#F6B7C8]/10 rounded-2xl flex items-center justify-between group hover:bg-white transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-[#18080F]">{dict[locale].protection.advanced}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showSecurity ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showSecurity && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden space-y-3"
                  >
                    <div className="p-6 bg-white border border-[#F6B7C8]/10 rounded-[24px] space-y-4 shadow-sm">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Globe className="w-3 h-3" />
                          {dict[locale].protection.linkPassLabel}
                        </label>
                        <input 
                          type="password"
                          value={linkPassword}
                          onChange={(e) => setLinkPassword(e.target.value)}
                          placeholder={dict[locale].protection.linkPassPlaceholder}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-medium focus:bg-white focus:border-[#FF5FA2] outline-none transition-all"
                        />
                        <p className="text-[10px] text-gray-400">{dict[locale].protection.linkPassInfo}</p>
                      </div>

                      <div className="h-px bg-gray-50" />

                      <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Smartphone className="w-3 h-3" />
                          {dict[locale].protection.tagPassLabel}
                        </label>
                        <div className="relative">
                          <input 
                            type={showNfcPass ? "text" : "password"}
                            value={nfcPassword}
                            onChange={(e) => setNfcPassword(e.target.value)}
                            placeholder={dict[locale].protection.tagPassPlaceholder}
                            className="w-full px-4 py-3 pr-10 rounded-xl bg-gray-50 border border-gray-100 text-sm font-medium focus:bg-white focus:border-[#FF5FA2] outline-none transition-all"
                          />
                          <button 
                            onClick={() => setShowNfcPass(!showNfcPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNfcPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400">{dict[locale].protection.tagPassInfo}</p>
                        
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 mt-2">
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <p className="text-[10px] font-bold text-red-600 leading-normal text-left">
                            {locale === 'id'
                              ? 'PENTING: Jangan sampai lupa password tag Anda! Jika lupa, tag Anda tidak akan bisa ditulis ulang kecuali dengan memformat paksa tag (yang akan menghapus seluruh data di dalamnya secara permanen).'
                              : 'WARNING: Do not forget your tag password! If forgotten, your tag cannot be rewritten unless you perform a force format (which will permanently erase all data inside it).'}
                          </p>
                        </div>
                        
                        <div className="pt-2 text-right">
                          <button
                            type="button"
                            onClick={handleForceFormatDirect}
                            className="text-xs text-red-500 hover:text-red-600 font-bold hover:underline transition-all flex items-center gap-1.5 ml-auto"
                          >
                            <Eraser className="w-3.5 h-3.5" />
                            {locale === 'id' ? "Lupa Password Tag? Format Paksa / Reset Tag" : "Forgot Password? Force Format / Reset Tag"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Steps */}
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              {[
                { icon: Smartphone, text: dict[locale].protection.step1 },
                { icon: Info, text: dict[locale].protection.step2 },
              ].map((step, i) => (
                <div key={i} className="p-5 bg-white/50 border border-[#F6B7C8]/10 rounded-2xl flex items-center gap-3">
                  <step.icon className="w-5 h-5 text-[#FF5FA2]" />
                  <span className="text-xs font-bold text-[#18080F]">{step.text}</span>
                </div>
              ))}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-left"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-bold">{error}</p>
              </motion.div>
            )}

            <motion.button
              id="tour-nfc-write"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConnectNfc}
              disabled={isConnecting || !isFormValid()}
              className={`w-full py-4 sm:py-5 rounded-[24px] font-black text-sm sm:text-base uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 ${
                isConnecting 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                  : mode === 'erase'
                    ? 'bg-red-500 text-white shadow-red-500/20 hover:bg-red-600'
                    : 'bg-[#FF5FA2] text-white shadow-[#FF5FA2]/20 hover:bg-[#E8457E]'
              }`}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  {dict[locale].protection.connecting || 'Menghubungkan...'}
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6" />
                  {mode === 'erase' ? 'Format Tag Sekarang' : 'Aktifkan Keychain'}
                </>
              )}
            </motion.button>
          </div>
        )}

        {connected && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 space-y-4"
          >
            <div className="p-8 bg-white border border-[#F6B7C8]/10 rounded-[40px] shadow-sm mb-8">
              <p className="text-sm font-bold text-gray-500 mb-6 italic">
                &quot;{dict[locale].dashboard.nfc.success.ready} {selectedMode.label}!&quot;
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => { setConnected(false); setError(''); }}
                  className="flex-1 py-4 rounded-2xl bg-[#FFF8F2] text-[#FF5FA2] font-black hover:bg-[#FF5FA2]/5 transition-all"
                >
                  {dict[locale].dashboard.nfc.success.programOther}
                </button>
                <Link 
                  href="/dashboard" 
                  className="flex-1 py-4 rounded-2xl bg-[#18080F] text-white font-black hover:bg-[#FF5FA2] transition-all shadow-lg flex items-center justify-center"
                >
                  {dict[locale].dashboard.nfc.success.done}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Decorative background element */}
      <div className="fixed bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent -z-10 opacity-50" />

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
                    {locale === 'id' ? "Tag Terkunci Password" : "Password-Protected Tag"}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-[280px] mx-auto">
                    {locale === 'id'
                      ? "Tag ini dilindungi password. Masukkan password tag NFC untuk membuka dan menulis ulang."
                      : "This tag is protected. Please enter the NFC tag password to unlock and write."}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-[#18080F] uppercase tracking-wider block">
                    {locale === 'id' ? "Password Tag NFC" : "NFC Tag Password"}
                  </label>
                  <div className="relative">
                    <input
                      type={showTagPromptPass ? "text" : "password"}
                      required
                      autoFocus
                      value={tagPromptInput}
                      onChange={(e) => setTagPromptInput(e.target.value)}
                      placeholder={locale === 'id' ? "Masukkan password..." : "Enter password..."}
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
                    {locale === 'id' ? "Batal" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-12 rounded-xl bg-[#FF5FA2] hover:bg-[#E8457E] text-white font-black text-xs transition-all active:scale-95 shadow-md shadow-[#FF5FA2]/10"
                  >
                    {locale === 'id' ? "Unlock & Tulis" : "Unlock & Write"}
                  </button>
                </div>

                <div className="text-center pt-2 border-t border-slate-100 space-y-2">
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-red-600 leading-normal text-left">
                      {locale === 'id'
                        ? 'PENTING: Memformat paksa tag akan menghapus seluruh data dan password di dalamnya secara permanen.'
                        : 'IMPORTANT: Force formatting the tag will permanently erase all data and password inside it.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleForceFormat}
                    className="text-xs text-red-500 hover:text-red-600 font-bold underline transition-colors block mx-auto"
                  >
                    {locale === 'id' ? "Lupa Password? Format Paksa Tag" : "Forgot Password? Force Format Tag"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom styled Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#18080F]/60 backdrop-blur-md"
              onClick={() => handleConfirmModalAction(false)}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 bg-white rounded-[2rem] w-full max-w-md border border-red-100 p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
              {/* Decorative Accent */}
              <div className="absolute -right-20 -top-20 w-44 h-44 rounded-full bg-red-500/10 blur-3xl" />

              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-6 h-6 animate-bounce" />
                  </div>
                  <h3 className="text-xl font-black text-[#18080F]">
                    {confirmModal.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-bold leading-relaxed max-w-[320px] mx-auto">
                    {confirmModal.message}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleConfirmModalAction(false)}
                    className="flex-1 h-12 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-black text-xs transition-all active:scale-95"
                  >
                    {locale === 'id' ? "Batal" : "Cancel"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirmModalAction(true)}
                    className="flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-xs transition-all active:scale-95 shadow-md shadow-red-500/20"
                  >
                    {locale === 'id' ? "Ya, Format Paksa" : "Yes, Force Format"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <GuidedTour 
        key={`nfc-${tourKey}`}
        pageKey="nfc"
        steps={tourSteps}
        run={runTour}
        onClose={handleTourClose}
        stepIndex={tourStepIndex}
        callback={handleTourCallback}
      />
    </div>
  );
}

