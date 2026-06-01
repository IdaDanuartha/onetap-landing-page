'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, CheckCircle2, XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

function ConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function verify() {
      const tokenHash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      const next = searchParams.get('next') ?? '/dashboard';

      if (!tokenHash || !type) {
        setStatus('error');
        setErrorMsg('Link konfirmasi tidak lengkap atau tidak valid.');
        return;
      }

      try {
        const supabase = createClient();
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as any,
        });

        if (error) {
          console.error('Verification error:', error);
          setStatus('error');
          setErrorMsg(error.message || 'Token verifikasi sudah kadaluarsa atau tidak valid.');
          return;
        }

        setStatus('success');
        
        // Short delay for a smooth user experience
        setTimeout(() => {
          router.push(next);
        }, 2000);
      } catch (err: any) {
        console.error('Verification system error:', err);
        setStatus('error');
        setErrorMsg('Terjadi kesalahan sistem saat memproses verifikasi.');
      }
    }

    verify();
  }, [router, searchParams]);

  return (
    <div className="w-full max-w-[460px] relative z-10">
      <div className="bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl shadow-[#FF5FA2]/5 text-center">
        
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF5FA2] to-[#E8457E] flex items-center justify-center mb-6 shadow-xl shadow-[#FF5FA2]/20">
            <img
              src="/images/logo_simple.png"
              alt="OneTap"
              className="w-9 h-9 brightness-0 invert object-contain"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-[#18080F]">
            Verifikasi OneTap
          </h1>
        </div>

        {/* Verifying State */}
        {status === 'verifying' && (
          <motion.div
            key="verifying"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 space-y-6"
          >
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#FF5FA2]/10" />
              <Loader2 className="w-10 h-10 text-[#FF5FA2] animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#18080F] mb-2">Memproses Verifikasi</h3>
              <p className="text-[#18080F]/60 text-sm font-medium leading-relaxed">
                Harap tunggu sebentar, kami sedang memverifikasi token keamanan Anda langsung dengan sistem.
              </p>
            </div>
          </motion.div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#18080F] mb-2 font-black text-green-600 uppercase tracking-wide">Verifikasi Berhasil</h3>
              <p className="text-[#18080F]/60 text-sm font-medium leading-relaxed">
                Akun Anda telah berhasil dikonfirmasi! Anda akan diarahkan ke dashboard dalam beberapa detik.
              </p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'linear' }}
                className="bg-green-500 h-full"
              />
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-6 space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto shadow-sm">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#18080F] mb-2 font-black text-red-600 uppercase tracking-wide">Verifikasi Gagal</h3>
              <p className="text-red-500 text-sm font-semibold mb-1">
                {errorMsg}
              </p>
              <p className="text-[#18080F]/50 text-xs font-medium leading-relaxed mt-2">
                Token mungkin sudah kedaluwarsa karena batas waktu keamanan atau telah digunakan sebelumnya.
              </p>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <Link
                href="/auth/login"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white font-bold shadow-lg shadow-[#FF5FA2]/20 hover:shadow-[#FF5FA2]/30 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Login
              </Link>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center p-6 relative overflow-hidden selection:bg-[#FF5FA2]/20 selection:text-[#FF5FA2]">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FF5FA2] rounded-full opacity-[0.08] blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#F6B7C8] rounded-full opacity-[0.1] blur-[100px]" />

      <Suspense fallback={
        <div className="w-full max-w-[460px] bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] p-10 shadow-2xl shadow-[#FF5FA2]/5 text-center flex flex-col items-center justify-center py-16 gap-4">
          <Loader2 className="w-10 h-10 text-[#FF5FA2] animate-spin" />
          <p className="text-sm font-black text-[#FF5FA2] uppercase tracking-widest">Memuat...</p>
        </div>
      }>
        <ConfirmContent />
      </Suspense>
    </div>
  );
}
