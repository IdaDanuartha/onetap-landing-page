'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, CheckCircle2, Wifi, AlertCircle, Loader2, 
  Smartphone, Globe, Activity, Info, Lock, ShieldCheck, 
  User, Link2, Type, Phone, MessageSquare, Mail, ChevronDown,
  Eye, EyeOff, Zap, Eraser, MessageCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

type Mode = 'profile' | 'url' | 'text' | 'phone' | 'sms' | 'email' | 'whatsapp' | 'erase';

const MODE_OPTIONS: { id: Mode; label: string; icon: any; placeholder?: string }[] = [
  { id: 'profile', label: 'Profil Digital', icon: User, placeholder: 'onetap-charm.com/l/...' },
  { id: 'url', label: 'Link Kustom', icon: Link2, placeholder: 'https://...' },
  { id: 'text', label: 'Pesan Teks', icon: Type, placeholder: 'Halo, ini keychain saya!' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, placeholder: '62812... (Pesan)' },
  { id: 'phone', label: 'Telepon', icon: Phone, placeholder: '+62812...' },
  { id: 'sms', label: 'Kirim SMS', icon: MessageSquare, placeholder: '+62812...' },
  { id: 'email', label: 'Kirim Email', icon: Mail, placeholder: 'nama@email.com' },
  { id: 'erase', label: 'Format NFC', icon: Eraser, placeholder: 'Hapus data' },
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
  
  // Security states
  const [showSecurity, setShowSecurity] = useState(false);
  const [linkPassword, setLinkPassword] = useState('');
  const [nfcPassword, setNfcPassword] = useState('');
  const [showNfcPass, setShowNfcPass] = useState(false);

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
      }
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

      let payload = data.trim();
      if (mode === 'profile') {
        payload = `https://onetap-charm.com/l/${username}`;
        // If password is set for the link, we might need a specific handling 
        // (e.g. adding a query param if the digital profile supports it)
        if (linkPassword) {
          payload += `?p=${encodeURIComponent(linkPassword)}`;
        }
      } else if (mode === 'url') {
        if (!payload.startsWith('http')) payload = `https://${payload}`;
        if (linkPassword) {
          // Wrap in a proxy or just handle via query param if the destination supports it
          // For now, let's assume standard handling
        }
      } else if (mode === 'whatsapp') {
        const cleanNum = waNumber.replace(/[^0-9]/g, "");
        payload = `https://wa.me/${cleanNum}${waMessage ? `?text=${encodeURIComponent(waMessage)}` : ""}`;
      } else if (mode === 'phone') {
        payload = `tel:${payload.replace(/[^0-9+]/g, '')}`;
      } else if (mode === 'sms') {
        payload = `sms:${payload.replace(/[^0-9+]/g, '')}`;
      } else if (mode === 'email') {
        payload = `mailto:${payload}`;
      }

      const ndef = new (window as any).NDEFReader();
      await ndef.scan(); // Request NFC access
      
      let record: any;
      if (mode === 'erase') {
        record = { recordType: 'empty' };
      } else {
        record = {
          recordType: (mode === 'url' || mode === 'profile' || mode === 'whatsapp') ? 'url' : 'text',
          data: payload,
        };
      }

      await ndef.write({
        records: [record],
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center gap-4">
          <Link href="/dashboard" className="p-2.5 rounded-xl hover:bg-[#FFF8F2] text-gray-500 hover:text-[#FF5FA2] transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-black text-[#18080F]">NFC Activator</h1>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-8 sm:py-12 relative z-10">
        
        {/* Animated NFC Visual */}
        <div className="relative mx-auto w-40 h-40 mb-10">
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
            animate={connected ? { scale: [1, 1.1, 1] } : {}}
            className={`absolute inset-0 flex items-center justify-center rounded-[48px] shadow-2xl transition-all duration-500 ${
              connected 
                ? 'bg-green-500 text-white shadow-green-500/30' 
                : mode === 'erase'
                  ? 'bg-red-500 text-white shadow-red-500/30'
                  : 'bg-white border border-[#F6B7C8]/20 text-[#FF5FA2]'
            }`}
          >
            {connected ? (
              <CheckCircle2 className="w-16 h-16" strokeWidth={2.5} />
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
            {connected ? 'NFC Siap Digunakan! 🎉' : 'Konfigurasi NFC'}
          </h2>
          <p className="text-gray-400 font-medium max-w-sm mx-auto text-sm">
            {connected 
              ? 'Keychain kamu sekarang telah terprogram dan siap dibagikan.' 
              : 'Pilih mode dan kustomisasi aksi keychain OneTap kamu.'}
          </p>
        </motion.div>

        {!connected && (
          <div className="space-y-6">
            {/* Mode Selection */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {MODE_OPTIONS.map((m) => (
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
            <div className="p-6 bg-white border border-[#F6B7C8]/10 rounded-[32px] shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                    <selectedMode.icon className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="text-left w-full">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedMode.label}</p>
                    {mode === 'profile' ? (
                      <p className="text-sm font-bold text-[#18080F]">/l/{username}</p>
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
                  <span className="text-sm font-bold text-[#18080F]">Keamanan Lanjutan</span>
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
                          Password Proteksi Link
                        </label>
                        <input 
                          type="password"
                          value={linkPassword}
                          onChange={(e) => setLinkPassword(e.target.value)}
                          placeholder="Kosongkan jika tidak perlu"
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-medium focus:bg-white focus:border-[#FF5FA2] outline-none transition-all"
                        />
                        <p className="text-[10px] text-gray-400">Pintu masuk link akan memerlukan password ini.</p>
                      </div>

                      <div className="h-px bg-gray-50" />

                      <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Smartphone className="w-3 h-3" />
                          Password Proteksi Tag NFC
                        </label>
                        <div className="relative">
                          <input 
                            type={showNfcPass ? "text" : "password"}
                            value={nfcPassword}
                            onChange={(e) => setNfcPassword(e.target.value)}
                            placeholder="Mencegah orang lain me-write ulang"
                            className="w-full px-4 py-3 pr-10 rounded-xl bg-gray-50 border border-gray-100 text-sm font-medium focus:bg-white focus:border-[#FF5FA2] outline-none transition-all"
                          />
                          <button 
                            onClick={() => setShowNfcPass(!showNfcPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNfcPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400">Chip akan terkunci secara fisik (NFC Protection).</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
              disabled={isConnecting || (mode === 'whatsapp' ? !waNumber.trim() : (mode !== 'profile' && mode !== 'erase' && !data.trim()))}
              className={`w-full py-5 rounded-[24px] font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                isConnecting 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : mode === 'erase'
                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20'
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
                  <Zap className="w-6 h-6" />
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
            className="mt-10 space-y-4"
          >
            <div className="p-8 bg-white border border-[#F6B7C8]/10 rounded-[40px] shadow-sm mb-8">
              <p className="text-sm font-bold text-gray-500 mb-6 italic">
                &quot;Sekarang keychain kamu siap digunakan dengan mode {selectedMode.label}!&quot;
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

