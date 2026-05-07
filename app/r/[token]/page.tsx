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
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Background blobs */}
      <div
        className="fixed top-20 right-10 w-72 h-72 blob pointer-events-none"
        style={{ background: 'var(--color-primary-soft)', opacity: 0.12 }}
      />
      <div
        className="fixed bottom-20 left-10 w-48 h-48 blob pointer-events-none"
        style={{ background: 'var(--color-primary-soft)', opacity: 0.08 }}
      />

      <div className="card max-w-sm w-full overflow-hidden p-0 relative z-10">
        {/* Top accent bar */}
        <div className="h-1.5 w-full" style={{ background: 'var(--color-primary)' }} />

        <div className="p-8 flex flex-col items-center text-center gap-6">
          {/* Logo */}
          <Image src="/images/logo_simple.png" alt="OneTap" width={44} height={44} className="object-contain" />

          {/* Lock icon */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'var(--color-primary-light)' }}
          >
            <Lock className="w-10 h-10" style={{ color: 'var(--color-primary)' }} />
          </div>

          <div>
            <h1
              className="text-2xl font-bold mb-1"
              style={{ color: 'var(--color-text-dark)' }}
            >
              Link Terproteksi
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Konten ini dilindungi password. Masukkan password untuk melanjutkan.
            </p>
          </div>

          <div className="w-full space-y-3">
            <input
              id="link-password"
              type="password"
              placeholder="••••••••"
              className="w-full h-12 px-4 text-center text-lg tracking-widest rounded-xl border transition-all outline-none focus:ring-2"
              style={{
                background: 'var(--color-bg)',
                border: '1.5px solid var(--color-border)',
                color: 'var(--color-text-dark)',
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              autoFocus
            />
            {error && (
              <div
                className="flex items-center justify-center gap-2 text-sm font-medium"
                style={{ color: '#DC2626' }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              id="unlock-btn"
              onClick={handleUnlock}
              disabled={loading || !password}
              className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Buka Link
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>

          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)', letterSpacing: '0.2em' }}
          >
            Powered by OneTap NFC
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
