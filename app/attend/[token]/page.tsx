'use client';

import { useState, useEffect, use, useRef } from 'react';
import { CheckCircle2, AlertCircle, Calendar, Clock, BookOpen, MessageSquare, Lock } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface AttendancePageProps {
  params: Promise<{ token: string }>;
}

export default function AttendancePage({ params }: AttendancePageProps) {
  const { token } = use(params);
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'unauthorized'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [data, setData] = useState<{
    studentName: string;
    className: string;
    subject: string | null;
    date: string;
    time: string;
    waSent: boolean;
    waError?: string | null;
  } | null>(null);

  const processedRef = useRef(false);

  useEffect(() => {
    async function processAttendance() {
      if (processedRef.current) return;
      processedRef.current = true;

      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setStatus('unauthorized');
          return;
        }

        const res = await fetch(`/api/attendance/${token}`, { method: 'POST' });
        const result = await res.json();

        if (res.ok && result.success) {
          setData(result);
          setStatus('success');
        } else {
          const detailMsg = result.message ? `\n(${result.message})` : '';
          setErrorMessage((result.error || 'Gagal mencatat kehadiran.') + detailMsg);
          setStatus('error');
        }
      } catch (err: any) {
        setErrorMessage('Gangguan koneksi server: ' + (err.message || 'Unknown error'));
        setStatus('error');
      }
    }
    processAttendance();
  }, [token]);

  if (status === 'loading') {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: 'var(--color-bg)' }}
      >
        <div className="text-center space-y-8">
          {/* Animated NFC rings */}
          <div className="relative mx-auto w-28 h-28">
            <div className="nfc-ring" />
            <div className="nfc-ring" />
            <div className="nfc-ring" />
            <div
              className="absolute inset-0 flex items-center justify-center rounded-full"
              style={{ background: 'var(--color-primary-light)' }}
            >
              <Image src="/images/logo_simple.png" alt="OneTap" width={44} height={44} className="object-contain" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-dark)' }}>
              Mencatat Kehadiran...
            </h2>
            <p
              className="text-sm animate-pulse"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Mohon jangan tutup halaman ini
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: 'var(--color-bg)' }}
      >
        <div className="card max-w-sm w-full text-center p-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: '#FEF3C7', color: '#D97706' }}
          >
            <Lock className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--color-text-dark)' }}>
            Akses Terbatas
          </h2>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Hanya akun terdaftar (Guru/Admin) yang dapat mencatat kehadiran. Silakan login terlebih dahulu.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/login')}
              className="btn-primary w-full justify-center py-4 text-base"
            >
              Login Sekarang
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full text-xs font-bold text-gray-400 hover:text-[#FF5FA2] transition-colors"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: 'var(--color-bg)' }}
      >
        <div className="card max-w-sm w-full text-center p-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: '#FEE2E2', color: '#DC2626' }}
          >
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-dark)' }}>
            Oops!
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
            {errorMessage}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary w-full justify-center"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #d1fae5 100%)' }}
    >
      {/* Card */}
      <div
        className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: 'white' }}
      >
        {/* Green header */}
        <div
          className="relative p-8 text-center text-white overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
        >
          {/* Decorative blobs */}
          <div
            className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-20"
            style={{ background: 'white' }}
          />
          <div
            className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full opacity-10"
            style={{ background: 'black' }}
          />

          <div className="relative z-10 space-y-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg"
              style={{ background: 'white' }}
            >
              <CheckCircle2 className="w-12 h-12" style={{ color: '#22c55e' }} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Hadir! ✅</h1>
              <p className="text-green-100 font-medium text-sm mt-1">
                Kehadiran Berhasil Tercatat
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-5">
          {/* Student info */}
          <div className="text-center">
            <h2
              className="text-2xl font-black uppercase tracking-tight"
              style={{ color: 'var(--color-text-dark)' }}
            >
              {data?.studentName}
            </h2>
            <span
              className="inline-block mt-2 px-4 py-1 rounded-full text-sm font-semibold"
              style={{ background: '#dcfce7', color: '#15803d' }}
            >
              {data?.className}
            </span>
          </div>

          {/* Details grid */}
          <div className="space-y-3">
            <div
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{ background: 'var(--color-bg-gray)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#dbeafe', color: '#2563eb' }}
              >
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                  Tanggal
                </p>
                <p className="text-sm font-bold" style={{ color: 'var(--color-text-dark)' }}>
                  {data?.date}
                </p>
              </div>
            </div>

            <div
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{ background: 'var(--color-bg-gray)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#fef3c7', color: '#d97706' }}
              >
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                  Waktu
                </p>
                <p className="text-sm font-bold" style={{ color: 'var(--color-text-dark)' }}>
                  {data?.time} WIB
                </p>
              </div>
            </div>

            {data?.subject && (
              <div
                className="flex items-center gap-4 p-4 rounded-2xl"
                style={{ background: 'var(--color-bg-gray)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#ede9fe', color: '#7c3aed' }}
                >
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                    Mata Pelajaran
                  </p>
                  <p className="text-sm font-bold" style={{ color: 'var(--color-text-dark)' }}>
                    {data.subject}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* WA status */}
          <div
            className="flex flex-col items-center justify-center gap-1 p-4 rounded-2xl border-2"
            style={
              data?.waSent
                ? { background: '#f0fdf4', borderColor: '#86efac', color: '#15803d' }
                : { background: '#fffbeb', borderColor: '#fcd34d', color: '#92400e' }
            }
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <p className="text-xs font-bold uppercase tracking-wide">
                {data?.waSent
                  ? 'Notifikasi WA Terkirim ke Guru ✓'
                  : 'Gagal Mengirim Notifikasi WA'}
              </p>
            </div>
            {!data?.waSent && data?.waError && (
              <p className="text-[10px] font-medium opacity-70 text-center px-2">
                Detail: {data.waError}
              </p>
            )}
          </div>

          {/* OneTap branding */}
          <div className="text-center pt-1">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: 'var(--color-text-muted)', letterSpacing: '0.2em' }}
            >
              OneTap NFC Attendance System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
