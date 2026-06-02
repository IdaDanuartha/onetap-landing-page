'use client';

import { useState, useEffect, use } from 'react';
import { 
  Lock, Loader2, AlertCircle, ArrowRight, Wifi, 
  Copy, Check, Eye, EyeOff, User, Phone, Mail, 
  Building2, Download, ExternalLink, ShieldCheck,
  Bluetooth, Type, QrCode, Sparkles
} from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface RedirectPageProps {
  params: Promise<{ token: string }>;
}

export default function RedirectPage({ params }: RedirectPageProps) {
  const { token } = use(params);
  const { locale } = useLanguage();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Keychain states
  const [keychainData, setKeychainData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [showWifiPassword, setShowWifiPassword] = useState(false);
  const [isUnconfigured, setIsUnconfigured] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [downloadingQr, setDownloadingQr] = useState(false);
  const [qrCopied, setQrCopied] = useState(false);

  // Fetch session on mount to see if user is logged in
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
  }, []);

  // Check if link is a keychain or protected on mount
  useEffect(() => {
    // SECURITY: If there's a password in the URL (?p=...), strip it immediately
    const url = new URL(window.location.href);
    if (url.searchParams.has('p')) {
      url.searchParams.delete('p');
      window.history.replaceState({}, '', url.toString());
    }

    async function checkLink() {
      try {
        const res = await fetch(`/api/links/unlock/${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}), // Empty probe
        });

        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            // Check if it's just a placeholder/empty redirect URL
            const isEmptyUrl = 
              data.url === '/l/' || 
              data.url === 'https://wa.me/' || 
              data.url === 'tel:' || 
              data.url === 'sms:' || 
              data.url === 'mailto:' || 
              data.url === 'geo:,' || 
              data.url === 'https://www.google.com/maps/dir/?api=1&destination=' || 
              data.url === 'google.streetview:cbll=,' || 
              data.url === 'intent://#Intent;package=;end';

            if (isEmptyUrl) {
              if (data.is_keychain) {
                setKeychainData(data);
                setIsUnconfigured(true);
              } else {
                window.location.href = 'https://onetap-charm.com';
                return;
              }
            } else {
              window.location.href = data.url;
            }
          } else {
            if (data.is_keychain) {
              // If it's a redirect mode but has no URL, show setup page
              const redirectModes = ['url', 'profile', 'whatsapp', 'phone', 'sms', 'email', 'location', 'navigation', 'streetview', 'app', 'instagram', 'facebook', 'linkedin', 'twitter', 'youtube', 'tiktok', 'telegram', 'github', 'spotify'];
              if (redirectModes.includes(data.active_mode) || !data.active_mode) {
                setKeychainData(data);
                setIsUnconfigured(true);
              } else {
                setKeychainData(data);
              }
            }
            setChecking(false);
          }
        } else if (res.status === 404) {
          setError('Link atau Keychain tidak valid.');
          setChecking(false);
        } else {
          // Status 401 means protected — show password form
          setChecking(false);
        }
      } catch {
        setError('Terjadi kesalahan koneksi.');
        setChecking(false);
      }
    }
    checkLink();
  }, [token]);

  const handleUnlock = async () => {
    if (!password) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/links/unlock/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          // Check if it's just a placeholder/empty redirect URL
          const isEmptyUrl = 
            data.url === '/l/' || 
            data.url === 'https://wa.me/' || 
            data.url === 'tel:' || 
            data.url === 'sms:' || 
            data.url === 'mailto:' || 
            data.url === 'geo:,' || 
            data.url === 'https://www.google.com/maps/dir/?api=1&destination=' || 
            data.url === 'google.streetview:cbll=,' || 
            data.url === 'intent://#Intent;package=;end';

          if (isEmptyUrl) {
            if (data.is_keychain) {
              setKeychainData(data);
              setIsUnconfigured(true);
            } else {
              window.location.href = 'https://onetap-charm.com';
              return;
            }
          } else {
            window.location.href = data.url;
          }
        } else {
          if (data.is_keychain) {
            // If it's a redirect mode but has no URL, show setup page
            const redirectModes = ['url', 'profile', 'whatsapp', 'phone', 'sms', 'email', 'location', 'navigation', 'streetview', 'app', 'instagram', 'facebook', 'linkedin', 'twitter', 'youtube', 'tiktok', 'telegram', 'github', 'spotify'];
            if (redirectModes.includes(data.active_mode) || !data.active_mode) {
              setKeychainData(data);
              setIsUnconfigured(true);
            } else {
              setKeychainData(data);
            }
          }
          setLoading(false);
        }
      } else {
        setError('Password salah. Silakan coba lagi.');
        setLoading(false);
      }
    } catch {
      setError('Gagal membuka link.');
      setLoading(false);
    }
  };

  const handleCopyPassword = (pass: string) => {
    navigator.clipboard.writeText(pass);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = async () => {
    setDownloadingQr(true);
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(`https://onetap-charm.com/r/${token}`)}`;
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const localUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = localUrl;
      link.setAttribute('download', `onetap-qr-${token}.png`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(localUrl);
    } catch (err) {
      window.open(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(`https://onetap-charm.com/r/${token}`)}`, '_blank');
    } finally {
      setDownloadingQr(false);
    }
  };

  const handleCopyQrLink = () => {
    navigator.clipboard.writeText(`https://onetap-charm.com/r/${token}`);
    setQrCopied(true);
    setTimeout(() => setQrCopied(false), 2000);
  };

  const handleDownloadVcard = () => {
    if (!keychainData || !keychainData.payload_data) return;
    const p = keychainData.payload_data;
    const firstName = p.firstName || 'OneTap';
    const lastName = p.lastName || 'User';
    const phone = p.phone || '';
    const email = p.email || '';
    const org = p.org || '';

    const vcardContent = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${firstName} ${lastName}`,
      `N:${lastName};${firstName};;;`,
      `TEL;TYPE=CELL:${phone}`,
      email ? `EMAIL:${email}` : '',
      org ? `ORG:${org}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\n');

    const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${firstName}_${lastName}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#FFF8F2]">
        <div className="text-center space-y-6">
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-[#FF5FA2]/20 rounded-full animate-ping" />
            <div className="absolute inset-0 border-4 border-[#FF5FA2] rounded-full border-t-transparent animate-spin" />
            <Image src="/images/logo_simple.png" alt="OneTap" width={48} height={48} className="object-contain animate-pulse" />
          </div>
          <p className="font-bold text-gray-500 text-sm tracking-wide animate-pulse">
            Menghubungkan OneTap NFC...
          </p>
        </div>
      </div>
    );
  }

  // --- INTERACTIVE MODE: WI-FI NETWORK ---
  if (keychainData && keychainData.active_mode === 'wifi') {
    const wifi = keychainData.payload_data || {};
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#FFF8F2]">
        <div className="w-full max-w-sm bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-[#FF5FA2]/5 overflow-hidden border border-white/60 p-8 flex flex-col items-center">
          
          <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6 shadow-inner">
            <Wifi className="w-10 h-10 text-indigo-600 animate-pulse" />
          </div>

          <div className="text-center mb-8">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
              Sambungkan Wi-Fi
            </span>
            <h1 className="text-2xl font-black text-[#18080F] mt-3">
              OneTap Wi-Fi
            </h1>
            <p className="text-xs text-gray-400 mt-1 max-w-[240px] mx-auto">
              Silakan salin password di bawah ini untuk tersambung ke jaringan.
            </p>
          </div>

          {/* Wi-Fi Details Card */}
          <div className="w-full bg-white border border-[#F6B7C8]/10 rounded-3xl p-5 space-y-4 shadow-sm mb-6">
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nama Jaringan (SSID)</p>
              <p className="text-base font-black text-[#18080F] bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl flex items-center justify-between select-all">
                {wifi.ssid || 'Wi-Fi Network'}
              </p>
            </div>

            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Kata Sandi (Password)</p>
              <div className="relative">
                <input
                  type={showWifiPassword ? 'text' : 'password'}
                  readOnly
                  value={wifi.password || ''}
                  className="w-full text-base font-black text-[#18080F] bg-gray-50 border border-gray-100 px-4 pr-12 py-2.5 rounded-xl outline-none select-all"
                />
                <button 
                  onClick={() => setShowWifiPassword(!showWifiPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF5FA2] transition-colors"
                >
                  {showWifiPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Copy Password CTA */}
          <button
            onClick={() => handleCopyPassword(wifi.password || '')}
            className={`w-full h-14 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-indigo-600/10 active:scale-[0.98] ${
              copied 
                ? 'bg-green-600 text-white shadow-green-500/20' 
                : 'bg-[#0F172A] text-white hover:bg-slate-800'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Password Disalin!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Salin Password Wi-Fi
              </>
            )}
          </button>

          {/* Instruction Details */}
          <div className="w-full mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Panduan Sambung:</p>
            <ol className="text-[10px] text-gray-500 font-medium space-y-1.5 list-decimal pl-4 leading-relaxed">
              <li>Klik tombol <b>Salin Password Wi-Fi</b> di atas.</li>
              <li>Buka <b>Pengaturan Wi-Fi</b> di HP Anda.</li>
              <li>Pilih jaringan <b>{wifi.ssid || 'Wi-Fi Network'}</b>.</li>
              <li><b>Tempel (Paste)</b> password yang sudah disalin, lalu sambungkan!</li>
            </ol>
          </div>

          <div className="mt-8 flex flex-col items-center gap-1 opacity-40">
            <span className="text-[9px] font-black tracking-[0.2em] text-[#18080F] uppercase">
              Powered by OneTap NFC
            </span>
          </div>

        </div>
      </div>
    );
  }

  // --- INTERACTIVE MODE: CONTACT (vCARD) ---
  if (keychainData && keychainData.active_mode === 'vcard') {
    const card = keychainData.payload_data || {};
    const initials = `${(card.firstName || 'O').charAt(0)}${(card.lastName || 'T').charAt(0)}`.toUpperCase();

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#FFF8F2]">
        <div className="w-full max-w-sm bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-[#FF5FA2]/5 overflow-hidden border border-white/60 p-8 flex flex-col items-center">
          
          {/* Avatar Profile */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#FF5FA2] to-[#E8457E] flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-[#FF5FA2]/30 border-4 border-white">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white border border-[#F6B7C8]/20 text-[#FF5FA2] w-8 h-8 rounded-full flex items-center justify-center shadow-md">
              <User className="w-4 h-4" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-[#18080F]">
              {card.firstName || 'OneTap'} {card.lastName || 'User'}
            </h1>
            {card.org && (
              <p className="text-xs font-bold text-gray-400 mt-1 flex items-center justify-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-gray-400" />
                {card.org}
              </p>
            )}
          </div>

          {/* Contact Details List */}
          <div className="w-full bg-white border border-[#F6B7C8]/10 rounded-3xl p-5 space-y-4 shadow-sm mb-6">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Telepon</p>
                <a href={`tel:${card.phone}`} className="text-sm font-black text-[#18080F] hover:text-[#FF5FA2] transition-colors truncate block">
                  {card.phone || '-'}
                </a>
              </div>
            </div>

            {card.email && (
              <div className="flex items-center gap-4 border-t border-gray-50 pt-4">
                <div className="w-9 h-9 rounded-xl bg-[#FFF1F7] border border-[#FFF1F7] flex items-center justify-center text-[#FF5FA2] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
                  <a href={`mailto:${card.email}`} className="text-sm font-black text-[#18080F] hover:text-[#FF5FA2] transition-colors truncate block">
                    {card.email}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Save Contact CTA */}
          <button
            onClick={handleDownloadVcard}
            className="w-full h-14 rounded-2xl bg-[#0F172A] text-white font-black text-sm flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all shadow-xl shadow-black/10 hover:bg-slate-800"
          >
            <Download className="w-5 h-5" />
            Simpan Kontak
          </button>

          <div className="mt-8 flex flex-col items-center gap-1 opacity-40">
            <span className="text-[9px] font-black tracking-[0.2em] text-[#18080F] uppercase">
              Powered by OneTap NFC
            </span>
          </div>

        </div>
      </div>
    );
  }

  // --- INTERACTIVE MODE: BLUETOOTH ---
  if (keychainData && keychainData.active_mode === 'bluetooth') {
    const bluetooth = keychainData.payload_data || {};
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#FFF8F2]">
        <div className="w-full max-w-sm bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-[#FF5FA2]/5 overflow-hidden border border-white/60 p-8 flex flex-col items-center">
          
          <div className="w-20 h-20 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6 shadow-inner text-blue-600">
            <Bluetooth className="w-10 h-10 animate-pulse" />
          </div>

          <div className="text-center mb-8">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              Koneksi Bluetooth
            </span>
            <h1 className="text-2xl font-black text-[#18080F] mt-3">
              OneTap Bluetooth
            </h1>
            <p className="text-xs text-gray-400 mt-1 max-w-[240px] mx-auto">
              Silakan salin alamat MAC di bawah ini untuk menghubungkan perangkat Anda.
            </p>
          </div>

          {/* Bluetooth Details Card */}
          <div className="w-full bg-white border border-[#F6B7C8]/10 rounded-3xl p-5 space-y-4 shadow-sm mb-6">
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Alamat MAC Perangkat (MAC Address)</p>
              <p className="text-base font-black text-[#18080F] bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl flex items-center justify-between select-all font-mono tracking-wider">
                {bluetooth.mac || '00:00:00:00:00:00'}
              </p>
            </div>
          </div>

          {/* Copy MAC CTA */}
          <button
            onClick={() => handleCopyPassword(bluetooth.mac || '')}
            className={`w-full h-14 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-blue-600/10 active:scale-[0.98] ${
              copied 
                ? 'bg-green-600 text-white shadow-green-500/20' 
                : 'bg-[#0F172A] text-white hover:bg-slate-800'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Alamat MAC Disalin!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Salin Alamat MAC
              </>
            )}
          </button>

          {/* Instruction Details */}
          <div className="w-full mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Panduan Koneksi:</p>
            <ol className="text-[10px] text-gray-500 font-medium space-y-1.5 list-decimal pl-4 leading-relaxed">
              <li>Klik tombol <b>Salin Alamat MAC</b> di atas.</li>
              <li>Buka pengaturan Bluetooth/aplikasi pairing perangkat Anda.</li>
              <li>Gunakan alamat MAC yang disalin untuk mendaftarkan atau memprogram koneksi manual ke perangkat Anda.</li>
            </ol>
          </div>

          <div className="mt-8 flex flex-col items-center gap-1 opacity-40">
            <span className="text-[9px] font-black tracking-[0.2em] text-[#18080F] uppercase">
              Powered by OneTap NFC
            </span>
          </div>

        </div>
      </div>
    );
  }

  // --- INTERACTIVE MODE: PESAN TEKS / MEMO ---
  if (keychainData && keychainData.active_mode === 'text') {
    const textMsg = keychainData.payload_data || {};
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#FFF8F2]">
        <div className="w-full max-w-sm bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-[#FF5FA2]/5 overflow-hidden border border-white/60 p-8 flex flex-col items-center">
          
          <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shadow-inner text-slate-600">
            <Type className="w-10 h-10 animate-pulse" />
          </div>

          <div className="text-center mb-8">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
              Pesan Teks / Memo
            </span>
            <h1 className="text-2xl font-black text-[#18080F] mt-3">
              OneTap Memo
            </h1>
            <p className="text-xs text-gray-400 mt-1 max-w-[240px] mx-auto">
              Memo kustom yang dibagikan melalui gantungan kunci.
            </p>
          </div>

          {/* Text Message Card */}
          <div className="w-full bg-slate-50 border border-[#F6B7C8]/10 rounded-3xl p-5 shadow-inner mb-6 text-left relative overflow-hidden min-h-[100px] flex items-center">
            <div className="absolute top-2 right-3 opacity-[0.03] pointer-events-none select-none">
              <Type className="w-32 h-32" />
            </div>
            <p className="text-sm font-semibold text-gray-700 leading-relaxed whitespace-pre-wrap relative z-10 w-full">
              {textMsg.text || 'Tidak ada pesan teks.'}
            </p>
          </div>

          {/* Copy Text CTA */}
          <button
            onClick={() => handleCopyPassword(textMsg.text || '')}
            className={`w-full h-14 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-slate-600/10 active:scale-[0.98] ${
              copied 
                ? 'bg-green-600 text-white shadow-green-500/20' 
                : 'bg-[#0F172A] text-white hover:bg-slate-800'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Pesan Disalin!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Salin Isi Pesan
              </>
            )}
          </button>

          <div className="mt-8 flex flex-col items-center gap-1 opacity-40">
            <span className="text-[9px] font-black tracking-[0.2em] text-[#18080F] uppercase">
              Powered by OneTap NFC
            </span>
          </div>

        </div>
      </div>
    );
  }

  // --- UNCONFIGURED KEYCHAIN SETUP VIEW ---
  if (isUnconfigured) {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`https://onetap-charm.com/r/${token}`)}`;
    const setupUrl = isLoggedIn 
      ? `/dashboard/nfc/keychains?token=${token}` 
      : `/auth/login?next=${encodeURIComponent(`/dashboard/nfc/keychains?token=${token}`)}`;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#FFF8F2] relative overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FF5FA2] rounded-full opacity-[0.06] blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#F6B7C8] rounded-full opacity-[0.08] blur-[120px]" />

        <div className="w-full max-w-sm bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-[#FF5FA2]/5 overflow-hidden border border-white/60 p-8 flex flex-col items-center relative z-10">
          
          {/* Logo */}
          <div className="mb-6 flex items-center gap-2">
            <Image src="/images/logo_simple.png" alt="OneTap" width={32} height={32} className="object-contain" />
            <span className="text-sm font-black tracking-widest text-[#18080F]">ONETAP</span>
          </div>

          {/* Sparkly Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF1F7] border border-[#FFF1F7] text-[#FF5FA2] text-[10px] font-black uppercase tracking-wider mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#FF5FA2]" />
            {locale === 'id' ? 'Keychain Siap Diklaim' : 'Keychain Ready to Claim'}
          </div>

          {/* QR Code Card Wrapper */}
          <div className="w-full bg-white border border-gray-100 rounded-3xl p-5 shadow-inner mb-6 flex flex-col items-center">
            <div className="relative w-48 h-48 bg-[#FFF8F2] rounded-2xl flex items-center justify-center p-3 border-2 border-dashed border-[#FF5FA2]/20 mb-4 group hover:border-[#FF5FA2] transition-colors">
              <img 
                src={qrCodeUrl} 
                alt="OneTap QR Code" 
                width={192} 
                height={192}
                className="object-contain rounded-lg"
              />
            </div>
            
            {/* Quick Actions (Copy & Download) */}
            <div className="flex gap-3 w-full">
              <button
                onClick={handleCopyQrLink}
                className={`flex-1 h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                  qrCopied 
                    ? 'bg-green-50 border-green-200 text-green-600' 
                    : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {qrCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    {locale === 'id' ? 'Tautan Disalin' : 'Link Copied'}
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    {locale === 'id' ? 'Salin Tautan QR' : 'Copy QR Link'}
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadQr}
                disabled={downloadingQr}
                className="flex-1 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                {downloadingQr ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                {locale === 'id' ? 'Unduh QR Code' : 'Download QR Code'}
              </button>
            </div>
          </div>

          {/* Text/Details info */}
          <div className="text-center mb-8 px-2">
            <h1 className="text-xl font-extrabold text-[#18080F] mb-2 leading-tight">
              {locale === 'id' ? 'Aktifkan Gantungan Kunci' : 'Activate Keychain'}
            </h1>
            <p className="text-xs text-gray-500 leading-relaxed max-w-[280px] mx-auto">
              {locale === 'id' 
                ? 'Gantungan kunci OneTap NFC premium Anda terdeteksi baru/belum dikonfigurasi. Hubungkan ke akun Anda sekarang untuk menjadikannya kartu nama digital, profil sosial, atau Wi-Fi instan!'
                : 'Your premium OneTap NFC keychain is detected as new/unconfigured. Connect it to your account now to make it your digital business card, social profile, or instant Wi-Fi!'}
            </p>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => window.location.href = setupUrl}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#FF5FA2]/20 hover:shadow-[#FF5FA2]/30 active:scale-[0.98] transition-all"
          >
            {locale === 'id' ? 'Klaim Sekarang' : 'Claim Now'}
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="mt-8 flex flex-col items-center gap-1 opacity-40">
            <span className="text-[9px] font-black tracking-[0.2em] text-[#18080F] uppercase">
              Powered by OneTap NFC
            </span>
          </div>

        </div>
      </div>
    );
  }

  // --- PASSWORD-PROTECTED LINK VIEW ---
  if (error && !password) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#FFF8F2]">
        <div className="w-full max-w-sm bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-black/5 overflow-hidden border border-white/60 p-8 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-red-100 text-red-600 shadow-inner"
          >
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-[#18080F]">
            Tautan Tidak Valid
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-[#FFF8F2]"
    >
      <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl shadow-black/5 overflow-hidden border border-gray-100">
        {/* Top accent bar */}
        <div className="h-2 w-full bg-[#FF5FA2]" />

        <div className="p-8 flex flex-col items-center text-center">
          {/* Logo */}
          <div className="mb-8">
            <Image src="/images/logo_simple.png" alt="OneTap" width={60} height={60} className="object-contain" />
          </div>

          {/* Lock icon */}
          <div className="w-20 h-20 rounded-3xl bg-[#FFF1F7] flex items-center justify-center mb-6">
            <Lock className="w-10 h-10 text-[#FF5FA2]" />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-black text-[#18080F] mb-2">
              Link Terproteksi
            </h1>
            <p className="text-xs text-gray-400 leading-relaxed">
              Konten ini dilindungi password.<br />Masukkan password untuk melanjutkan.
            </p>
          </div>

          <div className="w-full space-y-4">
            <div className="relative">
              <input
                type="password"
                placeholder="Password Link"
                className="w-full h-14 px-6 text-center text-lg tracking-[0.3em] rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#FF5FA2]/20 focus:bg-white outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-red-500 py-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              onClick={handleUnlock}
              disabled={loading || !password}
              className="w-full h-14 rounded-2xl bg-[#0F172A] text-white font-black text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-black/10"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Buka Link
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          <div className="mt-12 flex flex-col items-center gap-1 opacity-40">
            <span className="text-[10px] font-black tracking-[0.2em] text-[#18080F] uppercase">
              Powered by OneTap NFC
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
