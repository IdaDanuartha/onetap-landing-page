"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants, type Easing } from "framer-motion";
import {
  Wifi,
  Link as LinkIcon,
  Type,
  Phone,
  MessageSquare,
  Mail,
  Eraser,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  SmartphoneNfc,
  MessageCircle,
  Sparkles,
  Shield
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";


// ─── NFC helper ─────────────────────────────────────────────────────────────
function isNFCSupported(): boolean {
  return typeof window !== "undefined" && "NDEFReader" in window;
}

async function writeCustomRecord(
  type: "url" | "text" | "phone" | "sms" | "email" | "erase" | "whatsapp",
  data: string
): Promise<void> {
  if (!isNFCSupported()) throw new Error("Web NFC is not supported");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ndef = new (window as any).NDEFReader();

  let record: unknown;
  if (type === "erase") {
    record = { recordType: "empty" };
  } else if (type === "url") {
    record = { recordType: "url", data };
  } else {
    record = { recordType: "text", data };
  }

  await ndef.write({ records: [record] });
}

// ─── Types ───────────────────────────────────────────────────────────────────
type RecordType = "url" | "text" | "phone" | "sms" | "email" | "erase" | "whatsapp";
type WriteStatus = "idle" | "waiting";

// ─── Animation variants ──────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.3 } },
};


// ─── NFC Writer ───────────────────────────────────────────────────────────────
type IconComponent = React.FC<React.SVGProps<SVGSVGElement> & { className?: string }>;

const TYPE_OPTIONS: { id: RecordType; label: string; icon: IconComponent; placeholder?: string }[] = [
  { id: "url", label: "Link/URL", icon: LinkIcon as IconComponent, placeholder: "https://instagram.com/..." },
  { id: "text", label: "Pesan Teks", icon: Type as IconComponent, placeholder: "Halo, ini keychain saya!" },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle as IconComponent, placeholder: "62812... (Pesan)" },
  { id: "phone", label: "Telepon", icon: Phone as IconComponent, placeholder: "+62812..." },
  { id: "sms", label: "Kirim SMS", icon: MessageSquare as IconComponent, placeholder: "+62812..." },
  { id: "email", label: "Kirim Email", icon: Mail as IconComponent, placeholder: "nama@email.com" },
  { id: "erase", label: "Format Ulang", icon: Eraser as IconComponent, placeholder: undefined },
];

function NFCWriter() {
  const { t } = useLanguage();
  const [supported, setSupported] = useState(true);
  const [recordType, setRecordType] = useState<RecordType>("url");
  const [data, setData] = useState("");
  const [waNumber, setWaNumber] = useState("");
  const [waMessage, setWaMessage] = useState("");
  const [writeStatus, setWriteStatus] = useState<WriteStatus>("idle");
  const [lastResult, setLastResult] = useState<"success" | "error" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setSupported(isNFCSupported());
  }, []);

  async function handleWrite() {
    if (recordType !== "erase" && !data.trim()) return;

    let payload = data.trim();

    if (recordType === "url") {
      if (!payload.startsWith("http://") && !payload.startsWith("https://")) {
        payload = `https://${payload}`;
      }
    } else if (recordType === "whatsapp") {
      const cleanNum = waNumber.replace(/[^0-9]/g, "");
      payload = `https://wa.me/${cleanNum}${waMessage ? `?text=${encodeURIComponent(waMessage)}` : ""}`;
    } else if (recordType === "phone") {
      payload = `tel:${payload.replace(/[^0-9+]/g, "")}`;
    } else if (recordType === "sms") {
      payload = `sms:${payload.replace(/[^0-9+]/g, "")}`;
    } else if (recordType === "email") {
      payload = `mailto:${payload}`;
    }

    setWriteStatus("waiting");
    setLastResult(null);

    try {
      await writeCustomRecord(recordType === "phone" || recordType === "sms" || recordType === "email" ? "text" : (recordType === "whatsapp" ? "url" : recordType), payload);
      setLastResult("success");
    } catch (err) {
      setLastResult("error");
      setErrorMsg(err instanceof Error ? err.message : "Gagal terhubung ke NFC.");
    } finally {
      setWriteStatus("idle");
    }
  }

  const selectedType = TYPE_OPTIONS.find((t) => t.id === recordType)!;

  if (!supported) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur-xl border border-pink-200 shadow-xl shadow-pink-500/10 rounded-[2rem] p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-pink-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">{t('write.writer.unsupported.title')}</h2>
          <p className="text-slate-500 leading-relaxed">
            {t('write.writer.unsupported.desc')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      key="writer"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-[0_20px_60px_-15px_rgba(255,95,162,0.12)] rounded-[2.5rem] overflow-hidden relative">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/40 rounded-full blur-3xl pointer-events-none" />

        {/* Header Section */}
        <div className="px-8 pt-10 pb-8 text-center relative z-10 border-b border-slate-100">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-600 text-sm font-semibold mb-6 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            {t('write.writer.verified')}
          </motion.div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{t('write.writer.title')}</h1>
          <p className="mt-3 text-slate-500 text-base max-w-md mx-auto">
            {t('write.writer.desc')}
          </p>
        </div>
        
        {/* Upsell Banner */}
        <div className="px-8 mt-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-gradient-to-br from-indigo-50/50 to-primary-50/50 border border-indigo-100/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white border border-indigo-50 flex items-center justify-center shadow-sm shrink-0">
                <Sparkles className="w-6 h-6 text-indigo-500" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-slate-800">{t('write.upsell.title')}</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-[240px]">
                  {t('write.upsell.desc')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 relative z-10 w-full sm:w-auto">
              <Link 
                href="/auth/login?next=/dashboard/nfc/connect" 
                className="flex-1 sm:flex-none text-center px-5 py-2.5 text-xs font-bold text-slate-600 bg-white/80 hover:bg-white border border-slate-200 rounded-xl transition-all active:scale-95"
              >
                {t('write.upsell.login')}
              </Link>
              <Link 
                href="/auth/register?next=/dashboard/nfc/connect" 
                className="flex-1 sm:flex-none text-center px-5 py-2.5 text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                {t('write.upsell.register')}
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="p-8 relative z-10">
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-8">
            
            {/* Left Column: Type Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 ml-1">{t('write.writer.mode')}</h3>
              <div className="grid grid-cols-2 gap-3">
                {TYPE_OPTIONS.map((t) => {
                  const Icon = t.icon;
                  const active = recordType === t.id;
                  const isErase = t.id === "erase";
                  return (
                    <button
                      key={t.id}
                      onClick={() => { setRecordType(t.id); setData(""); setLastResult(null); }}
                      className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
                        active
                          ? isErase
                            ? "bg-red-50 border-2 border-red-400 text-red-600 shadow-sm"
                            : "bg-primary-50/50 border-2 border-primary-500 text-primary-600 shadow-md shadow-primary-500/10"
                          : "bg-slate-50 border-2 border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${active && !isErase ? "text-primary-500" : ""}`} />
                      <span className="text-xs font-bold tracking-wide text-center">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Input & Action */}
            <div className="flex flex-col">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 ml-1">{t('write.writer.content')}</h3>
              
              <div className="flex-1 bg-slate-50 rounded-3xl p-6 border border-slate-100/50">
                {recordType === "erase" ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                      <Eraser className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{t('write.writer.erase.title')}</h4>
                      <p className="text-sm text-slate-500 mt-2 max-w-[200px] mx-auto">
                        {t('write.writer.erase.desc')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 h-full flex flex-col">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <selectedType.icon className="w-4 h-4 text-primary-500" />
                      {t('write.writer.inputLabel')} {selectedType.label}
                    </label>
                    {recordType === "whatsapp" ? (
                      <div className="space-y-3 flex-1 flex flex-col">
                        <input
                          type="text"
                          value={waNumber}
                          onChange={(e) => { setWaNumber(e.target.value); setLastResult(null); }}
                          placeholder={t('write.writer.waPlaceholder')}
                          className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-primary-500 bg-white text-slate-800 outline-none transition-all text-base shadow-sm focus:ring-4 focus:ring-primary-500/10"
                        />
                        <textarea
                          value={waMessage}
                          onChange={(e) => { setWaMessage(e.target.value); setLastResult(null); }}
                          placeholder={t('write.writer.waMsgPlaceholder')}
                          rows={3}
                          className="w-full flex-1 px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-primary-500 bg-white text-slate-800 outline-none transition-all text-base resize-none shadow-sm focus:ring-4 focus:ring-primary-500/10"
                        />
                      </div>
                    ) : recordType === "text" ? (
                      <textarea
                        value={data}
                        onChange={(e) => { setData(e.target.value); setLastResult(null); }}
                        placeholder={selectedType.placeholder}
                        rows={5}
                        className="w-full flex-1 px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-primary-500 bg-white text-slate-800 outline-none transition-all text-base resize-none shadow-sm focus:ring-4 focus:ring-primary-500/10"
                      />
                    ) : (
                      <input
                        type={recordType === "url" ? "url" : recordType === "email" ? "email" : "text"}
                        value={data}
                        onChange={(e) => { setData(e.target.value); setLastResult(null); }}
                        placeholder={selectedType.placeholder}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-primary-500 bg-white text-slate-800 outline-none transition-all text-base shadow-sm focus:ring-4 focus:ring-primary-500/10"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="mt-8 pt-8 border-t border-slate-100 relative">
            <AnimatePresence mode="popLayout">
              {lastResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border ${
                    lastResult === "success" 
                      ? "bg-green-50 border-green-200 text-green-700" 
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  {lastResult === "success" ? <CheckCircle2 className="w-6 h-6 shrink-0 text-green-500" /> : <XCircle className="w-6 h-6 shrink-0 text-red-500" />}
                  <span className="font-semibold">{lastResult === "success" ? t('write.writer.success') : errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={handleWrite}
              disabled={recordType === "whatsapp" ? !waNumber.trim() : (recordType !== "erase" && !data.trim())}
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full h-16 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all duration-300 disabled:opacity-50 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed ${
                recordType === "erase"
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/25"
                  : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20"
              }`}
            >
              <Image src="/images/logo_simple.png" alt="" width={24} height={24} className="invert brightness-0" />
              {recordType === "erase" ? t('write.writer.btnFormat') : t('write.writer.btnWrite')}
            </motion.button>
          </div>
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {writeStatus === "waiting" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 rounded-[2.5rem] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8"
            >
              <div className="relative w-32 h-32 mb-6">
                <span className="absolute inset-0 rounded-full border-[1px] border-primary-500/30" style={{ animation: "nfc-ring-pulse 2s cubic-bezier(0.16, 1, 0.3, 1) 0s infinite" }} />
                <span className="absolute inset-0 rounded-full border-[1px] border-primary-500/20" style={{ animation: "nfc-ring-pulse 2s cubic-bezier(0.16, 1, 0.3, 1) 0.6s infinite" }} />
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600 rounded-full shadow-2xl shadow-primary-500/40 p-6">
                  <Image src="/images/logo_simple.png" alt="OneTap" width={64} height={64} className="object-contain invert brightness-0" />
                </div>
              </div>
              <h2 className="font-extrabold text-2xl text-slate-800 mb-2">{t('write.writer.waiting.title')}</h2>
              <p className="text-slate-500 max-w-[250px] leading-relaxed">
                {t('write.writer.waiting.desc')}
              </p>
              
              <button 
                onClick={() => setWriteStatus("idle")}
                className="mt-8 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors px-4 py-2"
              >
                {t('write.writer.waiting.cancel')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function WritePageContent() {
  const { t } = useLanguage();

  return (
    <>
      <style>{`
        @keyframes nfc-ring-pulse {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>

      <div className="min-h-screen bg-[#FAFAFA] bg-[url('/images/noise.png')] flex flex-col relative overflow-hidden selection:bg-primary-500/30">
        
        {/* Ambient background colors */}
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#FFE5F0]/60 to-transparent pointer-events-none" />

        {/* Brand header */}
        <header className="relative z-10 flex items-center justify-between py-6 px-6 sm:px-12">
          <a href="/" className="flex items-center gap-3 group">
            <Image src="/images/logo_simple.png" alt="OneTap" width={36} height={36} className="object-contain" />
            <span className="text-xl font-extrabold text-slate-800 tracking-tight">
              OneTap
            </span>
          </a>
          <LanguageSwitcher />
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
          <AnimatePresence mode="wait">
            <NFCWriter key="writer" />
          </AnimatePresence>
        </main>

        {/* Minimal Footer */}
        <footer className="relative z-10 py-8 px-6 text-center border-t border-slate-200/60">
          <div className="max-w-md mx-auto">
            <p className="text-sm font-semibold text-slate-800 mb-1">{t('write.footer.title')}</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('write.footer.desc')}
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default function WritePage() {
  return (
    <WritePageContent />
  );
}
