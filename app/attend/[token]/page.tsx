'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  User, BookOpen, School, CheckCircle2, XCircle,
  Clock, CalendarDays, TrendingUp, Loader2, AlertTriangle,
  Nfc, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface KeychainData {
  studentName: string;
  className: string;
  subject: string | null;
  schoolName: string | null;
  isActive: boolean;
  presentToday: boolean;
  lastTappedAt: string | null;
  totalAttendance: number;
  monthAttendance: number;
  today: string;
}

function StatCard({ icon, label, value, accent }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl ${accent}`}
    >
      <div className="opacity-70">{icon}</div>
      <span className="text-2xl font-black">{value}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-center">{label}</span>
    </motion.div>
  );
}

export default function AttendKeychainPage() {
  const params = useParams();
  const token = params?.token as string;

  const [data, setData] = useState<KeychainData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/attend/${token}`);
        if (!res.ok) {
          const json = await res.json();
          setError(json.error || 'Keychain tidak ditemukan.');
        } else {
          const json = await res.json();
          setData(json);
        }
      } catch {
        setError('Gagal memuat data. Periksa koneksi internet Anda.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Makassar',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF0F7] via-[#FFF8F2] to-[#F0F4FF] flex flex-col items-center justify-center p-5">
      <AnimatePresence mode="wait">
        {/* Loading */}
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 text-[#FF5FA2]"
          >
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="text-sm font-bold text-gray-400">Memuat data keychain…</p>
          </motion.div>
        )}

        {/* Error */}
        {!loading && error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-sm w-full bg-white rounded-[36px] p-10 shadow-2xl text-center border border-red-100"
          >
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-9 h-9 text-red-400" />
            </div>
            <h1 className="text-2xl font-black text-[#18080F] mb-3">Keychain Tidak Ditemukan</h1>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">{error}</p>
          </motion.div>
        )}

        {/* Data */}
        {!loading && data && (
          <motion.div
            key="data"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="max-w-sm w-full"
          >
            {/* Main Card */}
            <div className="bg-white rounded-[36px] shadow-2xl shadow-[#FF5FA2]/10 border border-[#FFD6E8]/40 overflow-hidden">
              
              {/* Header gradient */}
              <div className={`relative px-8 pt-10 pb-8 ${data.presentToday
                ? 'bg-gradient-to-br from-[#FF5FA2] via-[#FF7BAB] to-[#FFB347]'
                : 'bg-gradient-to-br from-[#18080F] via-[#2d1020] to-[#3d1a2e]'
              }`}>
                {/* NFC decoration */}
                <div className="absolute top-4 right-5 opacity-20">
                  <Nfc className="w-8 h-8 text-white" />
                </div>

                {/* Status badge */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-5 ${
                  data.presentToday
                    ? 'bg-white/20 text-white'
                    : 'bg-white/10 text-white/70'
                }`}>
                  {data.presentToday
                    ? <><CheckCircle2 className="w-3 h-3" /> Hadir Hari Ini</>
                    : <><XCircle className="w-3 h-3" /> Belum Hadir</>
                  }
                </div>

                {/* Avatar */}
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 shadow-inner">
                  <User className="w-8 h-8 text-white" />
                </div>

                {/* Student name */}
                <h1 className="text-2xl font-black text-white leading-tight mb-1">
                  {data.studentName}
                </h1>
                <p className="text-white/70 text-sm font-semibold">
                  {data.className}
                  {data.subject ? ` · ${data.subject}` : ''}
                </p>

                {/* Check-in time if present */}
                {data.presentToday && data.lastTappedAt && (
                  <div className="flex items-center gap-1.5 mt-3 text-white/80 text-xs font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    Masuk pukul {formatTime(data.lastTappedAt)} WITA
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="px-6 pt-6 pb-8 space-y-5">
                
                {/* School info */}
                {data.schoolName && (
                  <div className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="w-9 h-9 rounded-xl bg-[#FF5FA2]/10 flex items-center justify-center flex-shrink-0">
                      <School className="w-4.5 h-4.5 text-[#FF5FA2]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sekolah</p>
                      <p className="text-sm font-bold text-[#18080F]">{data.schoolName}</p>
                    </div>
                  </div>
                )}

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3">
                  <StatCard
                    icon={<TrendingUp className="w-5 h-5 text-[#FF5FA2]" />}
                    label="Total Hadir"
                    value={data.totalAttendance}
                    accent="bg-[#FFF0F7] text-[#18080F]"
                  />
                  <StatCard
                    icon={<CalendarDays className="w-5 h-5 text-[#6366F1]" />}
                    label="Bulan Ini"
                    value={data.monthAttendance}
                    accent="bg-[#F0F4FF] text-[#18080F]"
                  />
                </div>

                {/* Status row */}
                <div className={`flex items-center justify-between py-3.5 px-4 rounded-2xl border ${
                  data.isActive
                    ? 'bg-green-50 border-green-100'
                    : 'bg-red-50 border-red-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${data.isActive ? 'bg-green-500' : 'bg-red-400'} animate-pulse`} />
                    <span className="text-xs font-black text-gray-600 uppercase tracking-wider">Status Kartu</span>
                  </div>
                  <span className={`text-xs font-black uppercase tracking-wide ${data.isActive ? 'text-green-600' : 'text-red-500'}`}>
                    {data.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>

                {/* Token info */}
                <div className="flex items-center justify-between py-2 px-1">
                  <div className="flex items-center gap-2 text-gray-300">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Kode Kartu</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                    {token?.toString().toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Branding */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 flex items-center justify-center gap-2 opacity-40"
            >
              <Image src="/images/logo_simple.png" alt="OneTap" width={18} height={18} />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#18080F]">OneTap</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
