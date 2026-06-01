'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Wifi, Sparkles, Smartphone, ShieldCheck, HelpCircle, Key } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { dict } from '@/lib/i18n/dict';

export default function NfcHubPage() {
  const { locale } = useLanguage();
  
  // Handlers for dynamic dictionary fallback
  const dNfc = dict[locale]?.dashboard?.nfc || {};
  const hubTitle = locale === 'id' ? 'Konektivitas Chip OneTap' : 'OneTap Chip Connectivity';
  const hubSubtitle = locale === 'id' 
    ? 'Pilih metode untuk mengaktifkan dan mengelola gantungan kunci atau kartu chip Anda.' 
    : 'Choose a method to activate and manage your chip keychains or cards.';

  return (
    <div className="min-h-screen bg-[#FFF8F2] selection:bg-[#FF5FA2]/20 selection:text-[#FF5FA2]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-[#F6B7C8]/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2.5 rounded-xl hover:bg-[#FFF8F2] text-gray-500 hover:text-[#FF5FA2] transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg sm:text-xl font-black text-[#18080F] tracking-tight">{hubTitle}</h1>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 relative z-10 flex flex-col items-center">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-12 sm:mb-16 max-w-lg"
        >
          <span className="text-[10px] font-black text-[#FF5FA2] uppercase tracking-[0.25em] bg-[#FF5FA2]/5 border border-[#FF5FA2]/10 px-4 py-1.5 rounded-full inline-block">
            Chip Connectivity
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#18080F] tracking-tight leading-tight">
            {locale === 'id' ? 'Koneksi Chip' : 'Chip Connections'}
          </h2>
          <p className="text-gray-400 font-medium text-sm sm:text-base leading-relaxed">
            {hubSubtitle}
          </p>
        </motion.div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          
          {/* OPTION 1: DYNAMIC KEYCHAIN MANAGER */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="group"
          >
            <Link href="/dashboard/nfc/keychains" className="block h-full">
              <div className="h-full bg-white rounded-[2.5rem] border border-[#F6B7C8]/10 p-8 sm:p-10 shadow-sm hover:shadow-2xl hover:shadow-[#FF5FA2]/5 transition-all duration-500 flex flex-col justify-between relative overflow-hidden group-hover:-translate-y-1.5">
                
                {/* Glow Accent */}
                <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-[#FF5FA2]/5 blur-3xl group-hover:bg-[#FF5FA2]/15 transition-all duration-700" />
                
                <div className="space-y-6 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-[#FFF1F7] border border-[#FFF1F7] flex items-center justify-center text-[#FF5FA2] shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Key className="w-7 h-7" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-black text-[#18080F]">
                        {locale === 'id' ? 'Gantungan Kunci OneTap (Android & iOS)' : 'OneTap Keychain (Android & iOS)'}
                      </h3>
                    </div>
                    
                    <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed">
                      {locale === 'id'
                        ? 'Kelola gantungan kunci resmi OneTap Anda secara online. Cukup masukkan kode unik gantungan kunci Anda, lalu atur atau ganti tujuan link (Instagram, WhatsApp, Portofolio, dll.) kapan saja secara instan dan mudah dari HP iPhone maupun Android!'
                        : 'Manage your official OneTap keychains online. Simply claim your unique code, and instantly update where the keychain points (Instagram, WhatsApp, Portfolio, etc.) anytime — quick, easy, and fully compatible with both iPhone and Android!'}
                    </p>
                  </div>
                </div>

                <div className="pt-8 flex items-center justify-between border-t border-[#F6B7C8]/5 mt-8 relative z-10">
                  <span className="text-xs font-black text-[#FF5FA2] group-hover:translate-x-1.5 transition-transform duration-300 flex items-center gap-2">
                    {locale === 'id' ? 'Buka Pengelola' : 'Open Manager'}
                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      →
                    </motion.span>
                  </span>
                  <div className="flex items-center gap-1 opacity-40">
                    <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">100% Free Plan</span>
                  </div>
                </div>

              </div>
            </Link>
          </motion.div>

          {/* OPTION 2: PHYSICAL NFC TAG WRITER */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="group"
          >
            <Link href="/dashboard/nfc/connect" className="block h-full">
              <div className="h-full bg-white rounded-[2.5rem] border border-[#F6B7C8]/10 p-8 sm:p-10 shadow-sm hover:shadow-2xl hover:shadow-[#0ea5e9]/5 transition-all duration-500 flex flex-col justify-between relative overflow-hidden group-hover:-translate-y-1.5">
                
                {/* Glow Accent */}
                <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-[#0ea5e9]/5 blur-3xl group-hover:bg-[#0ea5e9]/15 transition-all duration-700" />

                <div className="space-y-6 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-[#f0f9ff] border border-[#e0f2fe] flex items-center justify-center text-[#0ea5e9] shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Wifi className="w-7 h-7" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-black text-[#18080F]">
                        {locale === 'id' ? 'Tulis ke Chip Kosong (Khusus Android)' : 'Write to Blank Chip (Android Only)'}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed">
                      {locale === 'id'
                        ? 'Punya kartu, gantungan kunci, atau stiker chip kosong lainnya? Anda bisa merekam link profil digital Anda langsung ke dalam chip fisik tersebut menggunakan fitur NFC di handphone Anda. (Hanya untuk HP Android dengan fitur NFC aktif dan browser Google Chrome).'
                        : 'Have other blank cards, keychains, or chip stickers? You can write your digital profile link directly onto any custom chip using your phone\'s NFC feature. (Requires an Android device with NFC enabled running Google Chrome browser).'}
                    </p>
                  </div>
                </div>

                <div className="pt-8 flex items-center justify-between border-t border-[#0ea5e9]/5 mt-8 relative z-10">
                  <span className="text-xs font-black text-[#0ea5e9] group-hover:translate-x-1.5 transition-transform duration-300 flex items-center gap-2">
                    {locale === 'id' ? 'Buka Penulis Chip' : 'Open Chip Writer'}
                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      →
                    </motion.span>
                  </span>
                  <div className="flex items-center gap-1 opacity-40">
                    <Smartphone className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Web Chip</span>
                  </div>
                </div>

              </div>
            </Link>
          </motion.div>

        </div>

        {/* Footer Support Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-[#F6B7C8]/10 text-xs font-bold text-gray-400 max-w-sm text-center shadow-sm"
        >
          <HelpCircle className="w-4 h-4 text-[#FF5FA2] shrink-0" />
          <span>
            {locale === 'id'
              ? 'Pengguna iOS disarankan menggunakan fitur Gantungan Kunci Dinamis untuk kemudahan penuh.'
              : 'iOS users are highly recommended to use Dynamic Keychains for full browser compatibility.'}
          </span>
        </motion.div>

      </div>
    </div>
  );
}
