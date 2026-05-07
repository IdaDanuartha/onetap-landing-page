'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle2, Wifi, AlertCircle, Loader2, Zap, Smartphone, Globe, Activity, Info } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConnectNfcPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }

      const { data: profile } = await supabase
        .from('users_profile')
        .select('username')
        .eq('id', user.id)
        .single();

      if (profile) setUsername(profile.username);
      setLoading(false);
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

      const ndef = new (window as any).NDEFReader();
      await ndef.scan(); // Request NFC access
      
      await ndef.write({
        records: [{
          recordType: 'url',
          data: `https://onetap-charm.com/l/${username}`,
        }],
      });
      setConnected(true);
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setError('Izin NFC ditolak. Silakan berikan izin akses NFC pada browser Anda.');
      } else if (err.name === 'NotSupportedError') {
        setError('Perangkat Anda tidak mendukung fitur NFC.');
      } else {
        setError('Gagal menulis ke NFC tag. Pastikan tag tetap menempel di belakang HP selama proses.');
      }
    }
    setIsConnecting(false);
  };

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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center gap-4">
          <Link href="/dashboard" className="p-2.5 rounded-xl hover:bg-[#FFF8F2] text-gray-500 hover:text-[#FF5FA2] transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-black text-[#18080F]">NFC Activator</h1>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-8 sm:py-16 text-center relative z-10">
        
        {/* Animated NFC Visual */}
        <div className="relative mx-auto w-48 h-48 mb-12">
          <AnimatePresence>
            {!connected && isConnecting && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border-4 border-[#FF5FA2]/30"
              />
            )}
          </AnimatePresence>
          
          <motion.div 
            animate={connected ? { scale: [1, 1.1, 1] } : {}}
            className={`absolute inset-0 flex items-center justify-center rounded-[56px] shadow-2xl transition-all duration-500 ${
              connected 
                ? 'bg-green-500 text-white shadow-green-500/30' 
                : 'bg-white border border-[#F6B7C8]/20 text-[#FF5FA2]'
            }`}
          >
            {connected ? (
              <CheckCircle2 className="w-20 h-20" strokeWidth={2.5} />
            ) : (
              <Wifi className="w-16 h-16" strokeWidth={2.5} />
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={connected ? 'success' : 'waiting'}
          className="space-y-4"
        >
          <h2 className="text-3xl font-black text-[#18080F] tracking-tight">
            {connected ? 'NFC Siap Digunakan! 🎉' : 'Aktifkan Keychain NFC'}
          </h2>
          <p className="text-gray-400 font-medium max-w-sm mx-auto">
            {connected 
              ? 'Keychain kamu sekarang telah terprogram dan siap dibagikan ke seluruh dunia.' 
              : 'Hubungkan keychain fisikmu ke profil digital OneTap dalam hitungan detik.'}
          </p>
        </motion.div>

        {!connected && (
          <div className="mt-12 space-y-8">
            {/* URL preview */}
            <div className="p-6 bg-white border border-[#F6B7C8]/10 rounded-[32px] shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Link Tujuan</p>
                  <p className="text-sm font-bold text-[#18080F]">/l/{username}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF5FA2]/5 text-[#FF5FA2] text-[10px] font-black uppercase">
                <Activity className="w-3 h-3" />
                Live
              </div>
            </div>

            {/* Steps */}
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              {[
                { icon: Smartphone, text: 'Buka di Chrome Android' },
                { icon: Info, text: 'Tempel keychain di belakang HP' },
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

            <button
              onClick={handleConnectNfc}
              disabled={isConnecting}
              className={`w-full py-5 rounded-[24px] font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                isConnecting 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-[#FF5FA2] text-white hover:bg-[#E8457E] shadow-[#FF5FA2]/20'
              }`}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Mencari Tag...
                </>
              ) : (
                <>
                  <Wifi className="w-6 h-6" />
                  Mulai Proses Aktivasi
                </>
              )}
            </button>
          </div>
        )}

        {connected && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 space-y-4"
          >
            <div className="p-8 bg-white border border-[#F6B7C8]/10 rounded-[40px] shadow-sm mb-8">
              <p className="text-sm font-bold text-gray-500 mb-6 italic">
                &quot;Sekarang siapapun yang menge-tap keychain kamu akan langsung melihat profilmu secara instan!&quot;
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => { setConnected(false); setError(''); }}
                  className="flex-1 py-4 rounded-2xl bg-[#FFF8F2] text-[#FF5FA2] font-black hover:bg-[#FF5FA2]/5 transition-all"
                >
                  Program Tag Lain
                </button>
                <Link 
                  href="/dashboard" 
                  className="flex-1 py-4 rounded-2xl bg-[#18080F] text-white font-black hover:bg-[#FF5FA2] transition-all shadow-lg"
                >
                  Selesai
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Decorative background element */}
      <div className="fixed bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent -z-10 opacity-50" />
    </div>
  );
}

