"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants, type Easing } from "framer-motion";
import {
  Wifi,
  Link as LinkIcon,
  Type,
  Phone,
  MessageSquare,
  Mail,
  Eraser,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  Shield,
  Contact2,
  Bluetooth,
  AppWindow,
  MapPin,
  Navigation,
  Map,
  Search,
  Globe,
  Activity,
  User,
  ChevronDown,
  Eye,
  EyeOff,
  Lock
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { InstagramIcon, FacebookIcon, LinkedinIcon, XIcon, YoutubeIcon, TiktokIcon, TelegramIcon } from "@/app/components/BrandIcons";


// ─── NFC helper ─────────────────────────────────────────────────────────────
function isNFCSupported(): boolean {
  return typeof window !== "undefined" && "NDEFReader" in window;
}

async function writeCustomRecord(
  type: "url" | "text" | "phone" | "sms" | "email" | "erase" | "whatsapp",
  data: string
): Promise<void> {
  if (!isNFCSupported()) throw new Error("Web NFC is not supported");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ndef = new (window as any).NDEFReader();

  let record: unknown;
  if (type === "erase") {
    record = { recordType: "empty" };
  } else if (type === "url") {
    record = { recordType: "url", data };
  } else {
    record = { recordType: "text", data };
  }

  await ndef.write({ records: [record] });
}

// ─── Types ───────────────────────────────────────────────────────────────────
type RecordType = 
  | 'vcard' | 'whatsapp' | 'phone' | 'sms' | 'email' 
  | 'wifi' | 'bluetooth' | 'app' 
  | 'location' | 'navigation' | 'streetview' 
  | 'url' | 'text' | 'instagram' | 'tiktok' | 'telegram' | 'facebook' | 'linkedin' | 'twitter' | 'youtube' | 'erase';

const MODE_CATEGORIES = [
  { id: 'networking', label: 'Networking', icon: User },
  { id: 'connectivity', label: 'Konektivitas', icon: Wifi },
  { id: 'maps', label: 'Maps', icon: MapPin },
  { id: 'social', label: 'Sosial', icon: Globe },
  { id: 'utility', label: 'Utilitas', icon: Activity },
];

const TYPE_OPTIONS: { id: RecordType; category: string; label: string; icon: any; placeholder?: string }[] = [
  // Networking
  { id: 'vcard', category: 'networking', label: 'Kontak (vCard)', icon: Contact2, placeholder: 'Nama & No HP' },
  { id: 'whatsapp', category: 'networking', label: 'WhatsApp', icon: MessageCircle, placeholder: '62812... (Pesan)' },
  { id: 'phone', category: 'networking', label: 'Telepon', icon: Phone, placeholder: '+62812...' },
  { id: 'sms', category: 'networking', label: 'Kirim SMS', icon: MessageSquare, placeholder: '+62812...' },
  { id: 'email', category: 'networking', label: 'Kirim Email', icon: Mail, placeholder: 'nama@email.com' },
  
  // Connectivity
  { id: 'wifi', category: 'connectivity', label: 'Wi-Fi Network', icon: Wifi, placeholder: 'SSID & Password' },
  { id: 'bluetooth', category: 'connectivity', label: 'Bluetooth', icon: Bluetooth, placeholder: 'Mac Address' },
  { id: 'app', category: 'connectivity', label: 'Open App', icon: AppWindow, placeholder: 'com.package.name' },

  // Maps
  { id: 'location', category: 'maps', label: 'Lokasi (Geo)', icon: MapPin, placeholder: 'Lat, Lng' },
  { id: 'navigation', category: 'maps', label: 'Navigasi', icon: Navigation, placeholder: 'Alamat Tujuan' },
  { id: 'streetview', category: 'maps', label: 'Street View', icon: Map, placeholder: 'Lat, Lng' },

  // Social
  { id: 'url', category: 'social', label: 'Link Kustom', icon: LinkIcon, placeholder: 'https://...' },
  { id: 'instagram', category: 'social', label: 'Instagram', icon: InstagramIcon, placeholder: 'username' },
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

type WriteStatus = "idle" | "waiting";

// ─── Animation variants ──────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.3 } },
};

function NFCWriter() {
  const { t } = useLanguage();
  const [supported, setSupported] = useState(true);
  const [recordType, setRecordType] = useState<RecordType>("vcard");
  const [activeCategory, setActiveCategory] = useState("networking");
  const [data, setData] = useState("");
  const [waNumber, setWaNumber] = useState("");
  const [waMessage, setWaMessage] = useState("");
  const [writeStatus, setWriteStatus] = useState<WriteStatus>("idle");
  const [lastResult, setLastResult] = useState<"success" | "error" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPass, setShowPass] = useState(false);

  // New Mode States
  const [vcardData, setVcardData] = useState({ firstName: '', lastName: '', phone: '', email: '', org: '' });
  const [wifiData, setWifiData] = useState({ ssid: '', password: '', encryption: 'WPA' });
  const [btAddress, setBtAddress] = useState('');
  const [appPackage, setAppPackage] = useState('');
  const [geoData, setGeoData] = useState({ lat: '', lng: '' });
  const [navAddress, setNavAddress] = useState('');
  const [svData, setSvData] = useState({ lat: '', lng: '' });

  useEffect(() => {
    setSupported(isNFCSupported());
  }, []);

  async function handleWrite() {
    const isErase = recordType === "erase";
    const isVcard = recordType === "vcard";
    const isWifi = recordType === "wifi";
    const isLocation = recordType === "location";
    const isNav = recordType === "navigation";
    const isSv = recordType === "streetview";
    const isApp = recordType === "app";
    const isBt = recordType === "bluetooth";
    const isWa = recordType === "whatsapp";

    if (!isErase) {
      if (isVcard && (!vcardData.firstName || !vcardData.phone)) return;
      if (isWifi && !wifiData.ssid) return;
      if (isLocation && (!geoData.lat || !geoData.lng)) return;
      if (isNav && !navAddress) return;
      if (isSv && (!svData.lat || !svData.lng)) return;
      if (isApp && !appPackage) return;
      if (isBt && !btAddress) return;
      if (isWa && !waNumber) return;
      if (!isVcard && !isWifi && !isLocation && !isNav && !isSv && !isApp && !isBt && !isWa && !data.trim()) return;
    }

    let payload = data.trim();

    if (recordType === "url") {
      if (!payload.startsWith("http://") && !payload.startsWith("https://")) {
        payload = `https://${payload}`;
      }
    } else if (recordType === "instagram") {
      payload = payload.replace('@', '');
      payload = `https://instagram.com/${payload}`;
    } else if (recordType === "tiktok") {
      payload = payload.replace('@', '');
      payload = `https://tiktok.com/@${payload}`;
    } else if (recordType === "telegram") {
      payload = payload.replace('@', '');
      payload = `https://t.me/${payload}`;
    } else if (recordType === "facebook") {
      payload = `https://facebook.com/${payload}`;
    } else if (recordType === "linkedin") {
      payload = `https://linkedin.com/in/${payload}`;
    } else if (recordType === "twitter") {
      payload = payload.replace('@', '');
      payload = `https://x.com/${payload}`;
    } else if (recordType === "youtube") {
      const cleaned = payload.startsWith('@') ? payload : `@${payload}`;
      payload = `https://youtube.com/${cleaned}`;
    } else if (recordType === "whatsapp") {
      const cleanNum = waNumber.replace(/[^0-9]/g, "");
      payload = `https://wa.me/${cleanNum}${waMessage ? `?text=${encodeURIComponent(waMessage)}` : ""}`;
    } else if (recordType === "phone") {
      payload = `tel:${payload.replace(/[^0-9+]/g, "")}`;
    } else if (recordType === "sms") {
      payload = `sms:${payload.replace(/[^0-9+]/g, "")}`;
    } else if (recordType === "email") {
      payload = `mailto:${payload}`;
    } else if (recordType === 'vcard') {
      payload = `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardData.firstName} ${vcardData.lastName}\nN:${vcardData.lastName};${vcardData.firstName};;;\nTEL;TYPE=CELL:${vcardData.phone}\nEMAIL:${vcardData.email}\nORG:${vcardData.org}\nEND:VCARD`;
    } else if (recordType === 'wifi') {
      payload = `WIFI:S:${wifiData.ssid};T:${wifiData.encryption};P:${wifiData.password};;`;
    } else if (recordType === 'location') {
      payload = `geo:${geoData.lat},${geoData.lng}`;
    } else if (recordType === 'navigation') {
      payload = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(navAddress)}`;
    } else if (recordType === 'streetview') {
      payload = `google.streetview:cbll=${svData.lat},${svData.lng}`;
    } else if (recordType === 'app') {
      payload = appPackage;
    } else if (recordType === 'bluetooth') {
      payload = btAddress;
    }

    setWriteStatus("waiting");
    setLastResult(null);

    try {
      const ndef = new (window as any).NDEFReader();
      let record: any = { recordType: 'url', data: payload };

      if (['text', 'phone', 'sms', 'email', 'bluetooth'].includes(recordType)) {
        record.recordType = 'text';
      } else if (recordType === 'vcard') {
        record.recordType = 'mime';
        record.mediaType = 'text/vcard';
      } else if (recordType === 'wifi') {
        record.recordType = 'mime';
        record.mediaType = 'application/vnd.wfa.wsc';
        record.data = new TextEncoder().encode(payload);
      } else if (recordType === 'app') {
        record.recordType = 'android.com:pkg';
      } else if (recordType === 'erase') {
        record.recordType = 'empty';
      }

      await ndef.write({ records: [record] });
      setLastResult("success");
    } catch (err) {
      setLastResult("error");
      setErrorMsg(err instanceof Error ? err.message : "Gagal terhubung ke NFC.");
    } finally {
      setWriteStatus("idle");
    }
  }

  const selectedType = TYPE_OPTIONS.find((t) => t.id === recordType)!;

  if (!supported) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur-xl border border-pink-200 shadow-xl shadow-pink-500/10 rounded-[2rem] p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-pink-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">{t('write.writer.unsupported.title')}</h2>
          <p className="text-slate-500 leading-relaxed">
            {t('write.writer.unsupported.desc')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      key="writer"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-2xl mx-auto flex justify-center"
    >
      <div className="w-[calc(100vw-24px)] sm:w-full bg-white/90 backdrop-blur-2xl border border-white/50 shadow-[0_20px_60px_-15px_rgba(255,95,162,0.12)] rounded-[1.5rem] sm:rounded-[2.5rem] relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/40 rounded-full blur-3xl pointer-events-none" />

        {/* Header Section */}
        <div className="px-4 sm:px-8 pt-8 sm:pt-10 pb-6 sm:pb-8 text-center relative z-10 border-b border-slate-100">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-600 text-sm font-semibold mb-6 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            {t('write.writer.verified')}
          </motion.div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{t('write.writer.title')}</h1>
          <p className="mt-3 text-slate-500 text-base max-w-md mx-auto">
            {t('write.writer.desc')}
          </p>
        </div>
        
        {/* Upsell Banner */}
        <div className="px-4 sm:px-8 mt-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-gradient-to-br from-indigo-50/50 to-primary-50/50 border border-indigo-100/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white border border-indigo-50 flex items-center justify-center shadow-sm shrink-0">
                <Sparkles className="w-6 h-6 text-indigo-500" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-slate-800">{t('write.upsell.title')}</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-[240px]">
                  {t('write.upsell.desc')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 relative z-10 w-full sm:w-auto">
              <Link 
                href="/auth/login?next=/dashboard/nfc/connect" 
                className="flex-1 sm:flex-none text-center px-5 py-2.5 text-xs font-bold text-slate-600 bg-white/80 hover:bg-white border border-slate-200 rounded-xl transition-all active:scale-95"
              >
                {t('write.upsell.login')}
              </Link>
              <Link 
                href="/auth/register?next=/dashboard/nfc/connect" 
                className="flex-1 sm:flex-none text-center px-5 py-2.5 text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                {t('write.upsell.register')}
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="p-4 sm:p-8 relative z-10">
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-6 sm:gap-8">
            
            {/* Left Column: Type Selection */}
            <div className="space-y-4 overflow-hidden">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 ml-1">{t('write.writer.type')}</h3>
              
              <div className="relative">
                <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar mb-2 px-1 touch-pan-x">
                {MODE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all text-xs sm:text-sm font-bold ${
                      activeCategory === cat.id
                        ? 'bg-primary-500 border-primary-500 text-white shadow-md shadow-primary-500/20'
                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                ))}
                </div>
              </div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 ml-1">{t('write.writer.mode')}</h3>
              <div className="grid grid-cols-2 gap-3">
                {TYPE_OPTIONS.filter(m => m.category === activeCategory).map((t) => {
                  const Icon = t.icon;
                  const active = recordType === t.id;
                  const isErase = t.id === "erase";
                  return (
                    <button
                      key={t.id}
                      onClick={() => { setRecordType(t.id); setData(""); setLastResult(null); }}
                      className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
                        active
                          ? isErase
                            ? "bg-red-50 border-2 border-red-400 text-red-600 shadow-sm"
                            : "bg-primary-50/50 border-2 border-primary-500 text-primary-600 shadow-md shadow-primary-500/10"
                          : "bg-slate-50 border-2 border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${active && !isErase ? "text-primary-500" : ""}`} />
                      <span className="text-[10px] font-bold tracking-wide text-center uppercase">{t.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 ml-1">{t('write.writer.content')}</h3>
              
              <div className="flex-1 bg-slate-50 rounded-[1.5rem] sm:rounded-3xl p-4 sm:p-6 border border-slate-100/50 min-h-[280px] sm:min-h-[320px] overflow-y-auto max-h-[60vh] md:max-h-none">
                {recordType === "erase" ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                      <Eraser className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{t('write.writer.erase.title')}</h4>
                      <p className="text-sm text-slate-500 mt-2 max-w-[200px] mx-auto">
                        {t('write.writer.erase.desc')}
                      </p>
                    </div>
                  </div>
                ) : recordType === "vcard" ? (
                  <div className="space-y-3 mt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input 
                        type="text"
                        value={vcardData.firstName}
                        onChange={(e) => setVcardData({...vcardData, firstName: e.target.value})}
                        placeholder="Nama Depan"
                        className="text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded-xl w-full px-4 py-3 outline-none focus:border-primary-500 transition-all"
                      />
                      <input 
                        type="text"
                        value={vcardData.lastName}
                        onChange={(e) => setVcardData({...vcardData, lastName: e.target.value})}
                        placeholder="Nama Belakang"
                        className="text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded-xl w-full px-4 py-3 outline-none focus:border-primary-500 transition-all"
                      />
                    </div>
                    <input 
                      type="text"
                      value={vcardData.phone}
                      onChange={(e) => setVcardData({...vcardData, phone: e.target.value})}
                      placeholder="No. Telepon"
                      className="text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded-xl w-full px-4 py-3 outline-none focus:border-primary-500 transition-all"
                    />
                    <input 
                      type="email"
                      value={vcardData.email}
                      onChange={(e) => setVcardData({...vcardData, email: e.target.value})}
                      placeholder="Email"
                      className="text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded-xl w-full px-4 py-3 outline-none focus:border-primary-500 transition-all"
                    />
                    <input 
                      type="text"
                      value={vcardData.org}
                      onChange={(e) => setVcardData({...vcardData, org: e.target.value})}
                      placeholder="Perusahaan / Organisasi"
                      className="text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded-xl w-full px-4 py-3 outline-none focus:border-primary-500 transition-all"
                    />
                  </div>
                ) : recordType === "wifi" ? (
                  <div className="space-y-3 mt-2">
                    <input 
                      type="text"
                      value={wifiData.ssid}
                      onChange={(e) => setWifiData({...wifiData, ssid: e.target.value})}
                      placeholder="SSID (Nama Wi-Fi)"
                      className="text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded-xl w-full px-4 py-3 outline-none focus:border-primary-500 transition-all"
                    />
                    <div className="relative">
                      <input 
                        type={showPass ? "text" : "password"}
                        value={wifiData.password}
                        onChange={(e) => setWifiData({...wifiData, password: e.target.value})}
                        placeholder="Password Wi-Fi"
                        className="text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded-xl w-full px-4 py-3 outline-none focus:border-primary-500 transition-all"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <select 
                      value={wifiData.encryption}
                      onChange={(e) => setWifiData({...wifiData, encryption: e.target.value})}
                      className="text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded-xl w-full px-4 py-3 outline-none focus:border-primary-500 transition-all appearance-none"
                    >
                      <option value="WPA">WPA / WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="None">Tanpa Password</option>
                    </select>
                  </div>
                ) : recordType === "location" ? (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input 
                      type="text"
                      value={geoData.lat}
                      onChange={(e) => setGeoData({...geoData, lat: e.target.value})}
                      placeholder="Latitude"
                      className="text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded-xl w-full px-4 py-3 outline-none focus:border-primary-500 transition-all"
                    />
                    <input 
                      type="text"
                      value={geoData.lng}
                      onChange={(e) => setGeoData({...geoData, lng: e.target.value})}
                      placeholder="Longitude"
                      className="text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded-xl w-full px-4 py-3 outline-none focus:border-primary-500 transition-all"
                    />
                  </div>
                ) : recordType === "navigation" ? (
                  <div className="space-y-3 mt-2">
                    <input 
                      type="text"
                      value={navAddress}
                      onChange={(e) => setNavAddress(e.target.value)}
                      placeholder="Alamat Tujuan (Nama Tempat/Alamat)"
                      className="text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded-xl w-full px-4 py-3 outline-none focus:border-primary-500 transition-all"
                    />
                  </div>
                ) : recordType === "streetview" ? (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input 
                      type="text"
                      value={svData.lat}
                      onChange={(e) => setSvData({...svData, lat: e.target.value})}
                      placeholder="Latitude"
                      className="text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded-xl w-full px-4 py-3 outline-none focus:border-primary-500 transition-all"
                    />
                    <input 
                      type="text"
                      value={svData.lng}
                      onChange={(e) => setSvData({...svData, lng: e.target.value})}
                      placeholder="Longitude"
                      className="text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded-xl w-full px-4 py-3 outline-none focus:border-primary-500 transition-all"
                    />
                  </div>
                ) : recordType === "app" ? (
                  <div className="space-y-3 mt-2">
                    <input 
                      type="text"
                      value={appPackage}
                      onChange={(e) => setAppPackage(e.target.value)}
                      placeholder="Contoh: com.whatsapp atau id.dana"
                      className="text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded-xl w-full px-4 py-3 outline-none focus:border-primary-500 transition-all"
                    />
                    <p className="text-[10px] text-gray-400 px-1 italic">Membuka aplikasi otomatis di Android jika sudah terinstal.</p>
                  </div>
                ) : recordType === "bluetooth" ? (
                  <div className="space-y-3 mt-2">
                    <input 
                      type="text"
                      value={btAddress}
                      onChange={(e) => setBtAddress(e.target.value)}
                      placeholder="Mac Address (Contoh: 00:11:22:33:FF:EE)"
                      className="text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded-xl w-full px-4 py-3 outline-none focus:border-primary-500 transition-all"
                    />
                  </div>
                ) : (
                  <div className="space-y-3 h-full flex flex-col">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <selectedType.icon className="w-4 h-4 text-primary-500" />
                      {t('write.writer.inputLabel')} {selectedType.label}
                    </label>
                    {recordType === "whatsapp" ? (
                      <div className="space-y-3 flex-1 flex flex-col">
                        <input
                          type="text"
                          value={waNumber}
                          onChange={(e) => { setWaNumber(e.target.value); setLastResult(null); }}
                          placeholder={t('write.writer.waPlaceholder')}
                          className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-primary-500 bg-white text-slate-800 outline-none transition-all text-base shadow-sm focus:ring-4 focus:ring-primary-500/10"
                        />
                        <textarea
                          value={waMessage}
                          onChange={(e) => { setWaMessage(e.target.value); setLastResult(null); }}
                          placeholder={t('write.writer.waMsgPlaceholder')}
                          rows={3}
                          className="w-full flex-1 px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-primary-500 bg-white text-slate-800 outline-none transition-all text-base resize-none shadow-sm focus:ring-4 focus:ring-primary-500/10"
                        />
                      </div>
                    ) : recordType === "text" ? (
                      <textarea
                        value={data}
                        onChange={(e) => { setData(e.target.value); setLastResult(null); }}
                        placeholder={selectedType.placeholder}
                        rows={5}
                        className="w-full flex-1 px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-primary-500 bg-white text-slate-800 outline-none transition-all text-base resize-none shadow-sm focus:ring-4 focus:ring-primary-500/10"
                      />
                    ) : (
                      <input
                        type={recordType === "url" ? "url" : recordType === "email" ? "email" : "text"}
                        value={data}
                        onChange={(e) => { setData(e.target.value); setLastResult(null); }}
                        placeholder={selectedType.placeholder}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-primary-500 bg-white text-slate-800 outline-none transition-all text-base shadow-sm focus:ring-4 focus:ring-primary-500/10"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="mt-8 pt-8 border-t border-slate-100 relative">
            <AnimatePresence mode="popLayout">
              {lastResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border ${
                    lastResult === "success" 
                      ? "bg-green-50 border-green-200 text-green-700" 
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  {lastResult === "success" ? <CheckCircle2 className="w-6 h-6 shrink-0 text-green-500" /> : <XCircle className="w-6 h-6 shrink-0 text-red-500" />}
                  <span className="font-semibold">{lastResult === "success" ? t('write.writer.success') : errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={handleWrite}
              disabled={
                recordType === "erase" ? false :
                (recordType === "vcard" ? !vcardData.firstName || !vcardData.phone :
                recordType === "whatsapp" ? !waNumber :
                recordType === "wifi" ? !wifiData.ssid :
                recordType === "location" ? !geoData.lat || !geoData.lng :
                recordType === "navigation" ? !navAddress :
                recordType === "streetview" ? !svData.lat || !svData.lng :
                recordType === "app" ? !appPackage :
                recordType === "bluetooth" ? !btAddress :
                !data.trim())
              }
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full h-16 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all duration-300 disabled:opacity-50 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed ${
                recordType === "erase"
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/25"
                  : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20"
              }`}
            >
              <Image src="/images/logo_simple.png" alt="" width={24} height={24} className="invert brightness-0" />
              {recordType === "erase" ? t('write.writer.btnFormat') : t('write.writer.btnWrite')}
            </motion.button>
          </div>
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {writeStatus === "waiting" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 rounded-[2.5rem] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8"
            >
              <div className="relative w-32 h-32 mb-6">
                <span className="absolute inset-0 rounded-full border-[1px] border-primary-500/30" style={{ animation: "nfc-ring-pulse 2s cubic-bezier(0.16, 1, 0.3, 1) 0s infinite" }} />
                <span className="absolute inset-0 rounded-full border-[1px] border-primary-500/20" style={{ animation: "nfc-ring-pulse 2s cubic-bezier(0.16, 1, 0.3, 1) 0.6s infinite" }} />
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600 rounded-full shadow-2xl shadow-primary-500/40 p-6">
                  <Image src="/images/logo_simple.png" alt="OneTap" width={64} height={64} className="object-contain invert brightness-0" />
                </div>
              </div>
              <h2 className="font-extrabold text-2xl text-slate-800 mb-2">{t('write.writer.waiting.title')}</h2>
              <p className="text-slate-500 max-w-[250px] leading-relaxed">
                {t('write.writer.waiting.desc')}
              </p>
              
              <button 
                onClick={() => setWriteStatus("idle")}
                className="mt-8 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors px-4 py-2"
              >
                {t('write.writer.waiting.cancel')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function WritePageContent() {
  const { t } = useLanguage();

  return (
    <>
      <style>{`
        @keyframes nfc-ring-pulse {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>

      <div className="min-h-screen bg-[#FAFAFA] bg-[url('/images/noise.png')] flex flex-col relative selection:bg-primary-500/30">
        
        {/* Ambient background colors */}
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#FFE5F0]/60 to-transparent pointer-events-none" />

        {/* Brand header */}
        <header className="relative z-10 flex items-center justify-between py-6 px-6 sm:px-12">
          <a href="/" className="flex items-center gap-3 group">
            <Image src="/images/logo_simple.png" alt="OneTap" width={36} height={36} className="object-contain" />
            <span className="text-xl font-extrabold text-slate-800 tracking-tight">
              OneTap
            </span>
          </a>
          <LanguageSwitcher />
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center py-6 sm:py-10 px-3 sm:px-6 relative z-10 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <NFCWriter key="writer" />
          </AnimatePresence>
        </main>

        {/* Minimal Footer */}
        <footer className="relative z-10 py-8 px-6 text-center border-t border-slate-200/60">
          <div className="max-w-md mx-auto">
            <p className="text-sm font-semibold text-slate-800 mb-1">{t('write.footer.title')}</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('write.footer.desc')}
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default function WritePage() {
  return (
    <WritePageContent />
  );
}
