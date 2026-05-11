'use client';

import { useState, useEffect, use } from 'react';
import { Lock, Loader2, AlertCircle, ArrowRight, Wifi } from 'lucide-react';
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


  // Check if link is protected or not on mount
  useEffect(() => {
    // SECURITY: If there's a password in the URL (?p=...), strip it immediately
    // so it's not visible in the address bar.
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
          body: JSON.stringify({}), // Empty probe — returns 401 if protected
        });

        if (res.ok) {
          const { url } = await res.json();
          window.location.href = url;
        } else if (res.status === 404) {
          setError('Link tidak valid atau telah kadaluarsa.');
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

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center space-y-6">
          {/* Animated NFC ring */}
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 border-4 rounded-full animate-ping" style={{ borderColor: 'var(--color-primary-soft)' }} />
            <div className="absolute inset-0 border-4 rounded-full" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Wifi className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
            </div>
          </div>
          <p className="font-medium" style={{ color: 'var(--color-text-muted)' }}>
            Menyiapkan pengalihan...
          </p>
        </div>
      </div>
    );
  }

  if (error && !password) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--color-bg)' }}>
        <div className="card max-w-sm w-full text-center p-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: '#FEE2E2', color: '#DC2626' }}
          >
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-dark)' }}>
            Link Tidak Valid
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {error}
          </p>
        </div>
      </div>
    );
  }


  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#FAFAFA' }}
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
            <h1 className="text-2xl font-black text-[#0F172A] mb-2">
              Link Terproteksi
            </h1>
            <p className="text-sm text-[#64748B] leading-relaxed">
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
            <span className="text-[10px] font-black tracking-[0.2em] text-[#0F172A] uppercase">
              Powered by OneTap NFC
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
