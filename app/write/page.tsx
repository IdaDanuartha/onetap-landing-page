"use client";

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
  KeyRound,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from "lucide-react";

// ─── Valid access codes ─────────────────────────────────────────────────────
// Each keychain QR code links to:  /write?code=<ACCESS_CODE>
// The codes below are the only valid ones — add more as you ship more keychains.
const VALID_ACCESS_CODES: Set<string> = new Set([
  "WJI6UNRR", "DM85KY8W", "MHIP22TO", "7SIF01UZ", "314BETR0",
  "6GFLIIZI", "O3QUHQ7D", "491ON71B", "AIZNYI70", "W51DCDM1",
  "U44UZLET", "9BXHTXWU", "9GQE5FMA", "YCFF3ZCK", "L2Z037TP",
  "F0K93HEW", "XNNVJ0CC", "75W331FV", "GDFJCTAQ", "YEBK393M",
]);

// ─── NFC helper ─────────────────────────────────────────────────────────────
function isNFCSupported(): boolean {
  return typeof window !== "undefined" && "NDEFReader" in window;
}

async function writeCustomRecord(
  type: "url" | "text" | "phone" | "sms" | "email" | "erase",
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
type RecordType = "url" | "text" | "phone" | "sms" | "email" | "erase";
type Screen = "gate" | "writer";
type WriteStatus = "idle" | "waiting";

// ─── Animation variants ──────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as Easing } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25 } },
};

// ─── Access Gate ─────────────────────────────────────────────────────────────
function AccessGate({ onUnlock }: { onUnlock: (code: string) => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const trimmed = code.trim().toUpperCase();
      if (VALID_ACCESS_CODES.has(trimmed)) {
        onUnlock(trimmed);
      } else {
        setError("Kode akses tidak valid. Cek QR code pada box keychainmu.");
        setLoading(false);
      }
    }, 700); // brief delay for UX
  }

  return (
    <motion.div
      key="gate"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-md mx-auto"
    >
      {/* Icon */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-2xl">
            <KeyRound className="w-10 h-10 text-secondary-400" />
          </div>
          {/* Animated rings */}
          {[0, 0.4, 0.8].map((delay, i) => (
            <span
              key={i}
              className="absolute inset-0 rounded-full border-2 border-secondary-400/40"
              style={{
                animation: `nfc-ring-pulse 2.4s ease-out ${delay}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Masukkan Kode Akses</h1>
        <p className="mt-3 text-foreground-muted text-sm leading-relaxed max-w-xs mx-auto">
          Kode akses tersedia di QR code yang ada di dalam box keychain OneTap kamu.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            id="access-code-input"
            type="text"
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(null); }}
            placeholder="KODE AKSES"
            maxLength={10}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className={`w-full h-14 px-5 rounded-2xl border-2 bg-background text-foreground text-center text-xl font-bold tracking-[0.3em] uppercase outline-none transition-all duration-200 ${
              error
                ? "border-red-400 focus:border-red-500 bg-red-50/10"
                : "border-foreground/10 focus:border-primary-500"
            }`}
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-400/30 text-red-500 text-sm"
            >
              <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={!code.trim() || loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Verifikasi <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </form>

      <p className="mt-8 text-center text-xs text-foreground-muted">
        Tidak punya kode?{" "}
        <a href="/#contact" className="text-primary-500 hover:underline">
          Hubungi OneTap
        </a>
      </p>
    </motion.div>
  );
}

// ─── NFC Writer ───────────────────────────────────────────────────────────────
type IconComponent = React.FC<React.SVGProps<SVGSVGElement> & { className?: string }>;

const TYPE_OPTIONS: { id: RecordType; label: string; icon: IconComponent; placeholder?: string }[] = [
  { id: "url", label: "URL / Link", icon: LinkIcon as IconComponent, placeholder: "https://example.com" },
  { id: "text", label: "Plain Text", icon: Type as IconComponent, placeholder: "Ketik teks apapun…" },
  { id: "phone", label: "Phone", icon: Phone as IconComponent, placeholder: "+628123456789" },
  { id: "sms", label: "SMS", icon: MessageSquare as IconComponent, placeholder: "+628123456789" },
  { id: "email", label: "Email", icon: Mail as IconComponent, placeholder: "hello@example.com" },
  { id: "erase", label: "Hapus Tag", icon: Eraser as IconComponent, placeholder: undefined },
];

function NFCWriter() {
  const [supported, setSupported] = useState(true);
  const [recordType, setRecordType] = useState<RecordType>("url");
  const [data, setData] = useState("");
  const [writeStatus, setWriteStatus] = useState<WriteStatus>("idle");
  const [lastResult, setLastResult] = useState<"success" | "error" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setSupported(isNFCSupported());
  }, []);

  async function handleWrite() {
    if (recordType !== "erase" && !data.trim()) return;

    let payload = data.trim();

    // Normalize data per type
    if (recordType === "url") {
      if (!payload.startsWith("http://") && !payload.startsWith("https://")) {
        payload = `https://${payload}`;
      }
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
      await writeCustomRecord(recordType === "phone" || recordType === "sms" || recordType === "email" ? "text" : recordType, payload);
      setLastResult("success");
    } catch (err) {
      setLastResult("error");
      setErrorMsg(err instanceof Error ? err.message : "Gagal menulis ke tag.");
    } finally {
      setWriteStatus("idle");
    }
  }

  const selectedType = TYPE_OPTIONS.find((t) => t.id === recordType)!;

  if (!supported) {
    return (
      <div className="w-full max-w-md mx-auto mt-4">
        <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-6 flex flex-col items-center gap-3 text-center">
          <AlertCircle className="w-10 h-10 text-amber-500" />
          <p className="font-semibold text-amber-600">Web NFC Tidak Didukung</p>
          <p className="text-sm text-amber-600/80">
            Fitur ini hanya tersedia di Android Chrome. Pastikan kamu menggunakan Chrome di Android.
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
      className="w-full max-w-lg mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-500 text-sm font-medium mb-4">
          <ShieldCheck className="w-4 h-4" />
          Akses Terverifikasi
        </div>
        <h1 className="text-2xl font-bold text-foreground">Tulis NFC Tag</h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Pilih jenis data, isi konten, lalu tempelkan tag ke belakang HP.
        </p>
      </div>

      {/* Waiting overlay */}
      <AnimatePresence>
        {writeStatus === "waiting" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl border-2 border-primary-500 bg-primary-500/5 p-8 flex flex-col items-center gap-4 text-center"
          >
            <div className="relative w-20 h-20">
              <span className="absolute inset-0 rounded-full border-2 border-primary-400/40" style={{ animation: "nfc-ring-pulse 1.6s ease-out 0s infinite" }} />
              <span className="absolute inset-0 rounded-full border-2 border-primary-400/30" style={{ animation: "nfc-ring-pulse 1.6s ease-out 0.4s infinite" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Wifi className="w-8 h-8 text-primary-500 animate-pulse" />
              </div>
            </div>
            <p className="font-semibold text-foreground text-lg">Siap Menulis…</p>
            <p className="text-sm text-foreground-muted">Tempelkan NFC tag ke belakang HP kamu sekarang.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {writeStatus === "idle" && (
        <>
          {/* Result feedback */}
          <AnimatePresence>
            {lastResult === "success" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-600"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">Berhasil ditulis ke NFC tag!</span>
              </motion.div>
            )}
            {lastResult === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-400/30 text-red-500"
              >
                <XCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm">{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Type selector */}
          <div className="card-writer">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-3">Jenis Data</p>
            <div className="grid grid-cols-3 gap-2">
              {TYPE_OPTIONS.map((t) => {
                const Icon = t.icon;
                const active = recordType === t.id;
                const isErase = t.id === "erase";
                return (
                  <button
                    key={t.id}
                    onClick={() => { setRecordType(t.id); setData(""); setLastResult(null); }}
                    className={`flex flex-col items-center gap-2 py-4 px-2 rounded-xl border-2 transition-all duration-200 ${
                      active
                        ? isErase
                          ? "border-red-400 bg-red-500/10 text-red-500"
                          : "border-primary-500 bg-primary-500/10 text-primary-500"
                        : "border-transparent bg-background-secondary text-foreground-muted hover:border-primary-400/40 hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-semibold tracking-wide text-center">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input */}
          <div className="card-writer">
            {recordType === "erase" ? (
              <div className="flex items-start gap-3 text-red-500">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">
                  Aksi ini akan <strong>menghapus semua data</strong> dari NFC tag dan mengembalikannya ke kondisi kosong.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                  {recordType === "url" ? "URL" : recordType === "text" ? "Teks" : recordType === "phone" ? "Nomor Telepon" : recordType === "sms" ? "Nomor SMS" : "Alamat Email"}
                </label>
                {recordType === "text" ? (
                  <textarea
                    value={data}
                    onChange={(e) => { setData(e.target.value); setLastResult(null); }}
                    placeholder={selectedType.placeholder}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-primary-500 bg-background text-foreground outline-none transition-colors text-sm resize-none"
                  />
                ) : (
                  <input
                    type={recordType === "url" ? "url" : recordType === "email" ? "email" : "text"}
                    value={data}
                    onChange={(e) => { setData(e.target.value); setLastResult(null); }}
                    placeholder={selectedType.placeholder}
                    className="w-full h-12 px-4 rounded-xl border-2 border-foreground/10 focus:border-primary-500 bg-background text-foreground outline-none transition-colors text-sm"
                  />
                )}
              </div>
            )}
          </div>

          {/* Write button */}
          <motion.button
            onClick={handleWrite}
            disabled={recordType !== "erase" && !data.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full h-14 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 shadow-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
              recordType === "erase"
                ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/30"
                : "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary-500/30"
            }`}
          >
            <Wifi className="w-5 h-5" />
            {recordType === "erase" ? "Hapus NFC Tag" : "Tulis ke NFC Tag"}
          </motion.button>
        </>
      )}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WritePage() {
  const [screen, setScreen] = useState<Screen>("gate");
  const [autoChecked, setAutoChecked] = useState(false);

  const handleUnlock = (code: string) => {
    localStorage.setItem("onetap_access_code", code);
    setScreen("writer");
  };

  // Auto-verify if ?code= is in URL or saved in localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qrCode = params.get("code")?.trim().toUpperCase() ?? null;
    const savedCode = localStorage.getItem("onetap_access_code");

    if (qrCode && VALID_ACCESS_CODES.has(qrCode)) {
      localStorage.setItem("onetap_access_code", qrCode);
      setScreen("writer");
    } else if (savedCode && VALID_ACCESS_CODES.has(savedCode)) {
      setScreen("writer");
    }
    setAutoChecked(true);
  }, []);

  if (!autoChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes nfc-ring-pulse {
          0%   { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>

      <div className="min-h-screen bg-background flex flex-col">
        {/* Minimal brand bar */}
        <header className="flex items-center justify-center py-6 px-4 border-b border-foreground/5">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow">
              <Wifi className="w-4 h-4 text-secondary-400" />
            </div>
            <span className="text-lg font-bold text-foreground group-hover:text-primary-500 transition-colors">
              OneTap
            </span>
          </a>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <AnimatePresence mode="wait">
            {screen === "gate" ? (
              <AccessGate key="gate" onUnlock={handleUnlock} />
            ) : (
              <NFCWriter key="writer" />
            )}
          </AnimatePresence>
        </main>

        {/* Footer note */}
        <footer className="py-6 text-center text-xs text-foreground-muted border-t border-foreground/5">
          OneTap NFC — Layanan eksklusif untuk pemilik keychain ✦ Web NFC hanya tersedia di Android Chrome
        </footer>
      </div>
    </>
  );
}
