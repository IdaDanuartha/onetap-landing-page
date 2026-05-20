'use client';

import { useState, useEffect, use } from 'react';
import { 
  Lock, Loader2, AlertCircle, ArrowRight, Wifi, 
  Copy, Check, Eye, EyeOff, User, Phone, Mail, 
  Building2, Download, ExternalLink, ShieldCheck 
} from 'lucide-react';
import Image from 'next/image';

interface RedirectPageProps {
  params: Promise<{ token: string }>;
}

export default function RedirectPage({ params }: RedirectPageProps) {
  const { token } = use(params);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Keychain states
  const [keychainData, setKeychainData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [showWifiPassword, setShowWifiPassword] = useState(false);

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
          if (data.is_keychain) {
            setKeychainData(data);
            setChecking(false);
            // If it's a direct redirect mode, perform the redirect immediately
            if (data.url) {
              window.location.href = data.url;
            }
          } else if (data.url) {
            window.location.href = data.url;
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
        const { url } = await res.json();
        window.location.href = url;
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
