"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Smartphone, ArrowRight, Loader2, CheckCircle2, AlertCircle, Globe, Keyboard, Save, Trash2, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { dict } from "@/lib/i18n/dict";
import { createClient } from "@/lib/supabase/client";
import { canAccess, PLAN_BADGE_COLORS, PLANS } from "@/lib/plans";
import Link from "next/link";
import Toast from "@/app/components/Toast";

export default function WhatsAppSetupPage() {
  const { locale, setLocale, t } = useLanguage();
  const d_dashboard = dict[locale].dashboard;
  const d_attendance = dict[locale].dashboard.attendance;

  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [plan, setPlan] = useState("starter");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  // WhatsApp Configuration states
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
  const [template, setTemplate] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Connection states
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState("checking...");

  // Toast states
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("success");

  // Confirm Disconnect/Clear modal states
  const [confirmModalType, setConfirmModalType] = useState<"logout" | "clear" | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/auth/login";
        return;
      }

      const { data: profile } = await supabase
        .from("users_profile")
        .select("plan, plan_expires_at, whatsapp, whatsapp_token, whatsapp_template")
        .eq("id", user.id)
        .single();

      if (profile) {
        setPlan(profile.plan);
        setExpiresAt(profile.plan_expires_at);
        setPhone(profile.whatsapp || "");
        setToken(profile.whatsapp_token || "");
        setTemplate(profile.whatsapp_template || "✅ *Presensi Kehadiran*\n\nSiswa *{student_name}* hadir dalam kelas *{class_name}*\n📅 {date}\n🕒 {time} WITA");

        const access = canAccess(profile.plan, "attendance", profile.plan_expires_at);
        setHasAccess(access);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  // Poll status every 20 seconds if token is configured
  useEffect(() => {
    if (!hasAccess || !token) return;

    checkStatus();
    const interval = setInterval(checkStatus, 20000);
    return () => clearInterval(interval);
  }, [hasAccess, token]);

  const checkStatus = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/whatsapp/status");
      const data = await res.json();
      setIsConnected(data.isConnected);
      setDeviceStatus(data.deviceStatus);

      if (data.isConnected) {
        setQrCode(null);
      }
    } catch (err) {
      console.error("Failed to check status:", err);
    }
  };

  const handleRegisterDevice = async () => {
    if (!phone || phone.trim() === "") {
      setToastMsg("Nomor WhatsApp wajib diisi.");
      setToastType("warning");
      setShowToast(true);
      return;
    }

    setIsRegistering(true);
    try {
      const res = await fetch("/api/whatsapp/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone })
      });
      const result = await res.json();

      if (res.ok && result.success) {
        setToken(result.token);
        setPhone(result.device);
        setToastMsg("Nomor WhatsApp berhasil didaftarkan! Silakan hubungkan perangkat Anda.");
        setToastType("success");
        setShowToast(true);
      } else {
        setToastMsg(result.error || "Gagal mendaftarkan nomor WhatsApp.");
        setToastType("error");
        setShowToast(true);
      }
    } catch (err) {
      console.error("Failed to register WhatsApp:", err);
      setToastMsg("Terjadi kesalahan koneksi.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleGetQr = async () => {
    if (!token) return;
    setIsLoadingQr(true);
    try {
      const res = await fetch("/api/whatsapp/qr", { method: "POST" });
      const data = await res.json();
      if (data.status && data.url) {
        const qrSrc = data.url.startsWith("data:image") || data.url.startsWith("http")
          ? data.url
          : `data:image/png;base64,${data.url}`;
        setQrCode(qrSrc);
      } else {
        setToastMsg(data.reason || data.message || "Gagal mengambil QR Code.");
        setToastType("error");
        setShowToast(true);
      }
    } catch (err) {
      console.error("QR Fetch error:", err);
      setToastMsg("Terjadi kesalahan koneksi saat memuat QR Code.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsLoadingQr(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!template || template.trim() === "") {
      setToastMsg("Template pesan tidak boleh kosong.");
      setToastType("warning");
      setShowToast(true);
      return;
    }

    setIsSavingTemplate(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("users_profile")
        .update({ whatsapp_template: template })
        .eq("id", user.id);

      if (error) {
        setToastMsg(error.message);
        setToastType("error");
        setShowToast(true);
      } else {
        setToastMsg("Template pesan berhasil disimpan!");
        setToastType("success");
        setShowToast(true);
      }
    } catch (err) {
      console.error("Failed to save template:", err);
      setToastMsg("Terjadi kesalahan saat menyimpan.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleDisconnect = async (action: "logout" | "clear" = "logout") => {
    setIsDisconnecting(true);
    try {
      const res = await fetch("/api/whatsapp/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      const result = await res.json();

      if (res.ok && result.success) {
        if (action === "clear") {
          setToken("");
          setPhone("");
          setQrCode(null);
          setIsConnected(false);
          setDeviceStatus("checking...");
          setToastMsg("Nomor WhatsApp berhasil dihapus dari profil.");
        } else {
          setQrCode(null);
          setIsConnected(false);
          setDeviceStatus("checking...");
          setToastMsg("Sesi WhatsApp berhasil diputuskan dari Fonnte.");
        }
        setToastType("success");
        setShowToast(true);
      } else {
        setToastMsg(result.error || "Gagal memutuskan koneksi.");
        setToastType("error");
        setShowToast(true);
      }
    } catch (err) {
      console.error("Failed to disconnect:", err);
      setToastMsg("Terjadi kesalahan koneksi.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#FF5FA2] animate-spin" />
          <p className="text-gray-400 text-sm font-black uppercase tracking-widest">Loading Settings...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#FFF8F2]">
        <main className="max-w-4xl mx-auto px-6 py-24 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-8 border border-red-100 shadow-sm">
            <ShieldAlert className="w-10 h-10 text-red-500 animate-bounce" />
          </div>
          <h1 className="text-3xl font-black text-[#18080F] mb-4">Fitur WhatsApp Terkunci</h1>
          <p className="text-gray-500 max-w-md mb-10 font-medium leading-relaxed">
            Pengaturan WhatsApp Gateway Mandiri hanya tersedia untuk pengguna paket **Education**. Silakan upgrade paket Anda untuk menggunakan fitur ini.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/pricing" 
              className="px-8 py-4 bg-[#FF5FA2] text-white font-black rounded-2xl hover:bg-[#E8457E] transition-all shadow-lg shadow-[#FF5FA2]/20"
            >
              Upgrade ke Paket Education
            </Link>
            <Link 
              href="/dashboard" 
              className="px-8 py-4 bg-white border border-gray-200 text-[#18080F] font-black rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F2] selection:bg-[#FF5FA2]/20 selection:text-[#FF5FA2]">
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard/attendance" className="text-gray-400 hover:text-[#FF5FA2] flex items-center gap-2 font-bold transition-all">
            <ArrowRight className="w-4 h-4 rotate-180" />
            {d_attendance.title}
          </Link>
          <button
            onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-gray-500 hover:text-[#FF5FA2] hover:bg-[#FF5FA2]/5 transition-all duration-300 text-[10px] sm:text-xs font-bold uppercase"
          >
            <Globe className="w-3.5 h-3.5 sm:w-4 h-4" />
            {locale}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Connection Setup & Status */}
          <div className="lg:col-span-6 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-[#18080F] tracking-tight">Koneksi WhatsApp</h1>
                  <p className="text-xs text-gray-400 font-medium">Sambungkan nomor WhatsApp pengirim notifikasi.</p>
                </div>
              </div>

              {!token ? (
                // 1. Phone number registration step
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 text-xs text-orange-800 font-medium leading-relaxed">
                    <strong>Pendaftaran Device Otomatis:</strong> Masukkan nomor WhatsApp pengirim. Sistem akan mendaftarkannya secara otomatis di Fonnte.
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">
                      Nomor WhatsApp Device
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 081234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#FF5FA2]/20 outline-none transition-all font-bold text-sm text-[#18080F]"
                    />
                  </div>
                  <button
                    onClick={handleRegisterDevice}
                    disabled={isRegistering || !phone}
                    className="w-full py-3.5 rounded-xl bg-[#18080F] text-white text-xs font-black hover:bg-black/80 disabled:opacity-50 disabled:hover:bg-[#18080F] transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    {isRegistering ? <Loader2 className="w-4 h-4 animate-spin" /> : "Daftarkan Perangkat"}
                    {!isRegistering && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              ) : (
                // 2. Active token connection status step
                <div className="space-y-6">
                  {/* Status Panel */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Nomor Terhubung</p>
                      <p className="text-sm font-black text-[#18080F]">{phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Status</p>
                      <div className="flex items-center gap-1.5 justify-end">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-wider ${isConnected ? 'text-green-600' : 'text-orange-600'}`}>
                          {isConnected ? 'Connected' : deviceStatus === 'connect' ? 'Ready Scan' : deviceStatus.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* QR Display */}
                  <div className="p-6 rounded-[2rem] bg-gray-50 border-2 border-dashed border-gray-200 aspect-square flex flex-col items-center justify-center relative overflow-hidden max-w-sm mx-auto">
                    {isConnected ? (
                      <div className="space-y-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto border-4 border-white shadow-sm">
                          <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                        <div>
                          <p className="text-green-600 font-black text-base">WhatsApp Tersambung!</p>
                          <p className="text-gray-400 text-[10px] font-bold">Siap mengirim notifikasi otomatis.</p>
                        </div>
                      </div>
                    ) : qrCode ? (
                      <div className="space-y-4 text-center">
                        <img 
                          src={qrCode} 
                          alt="WhatsApp QR" 
                          className="w-48 h-48 rounded-xl shadow-md mx-auto border bg-white p-2" 
                        />
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Scan dengan WhatsApp Anda (Linked Devices)</p>
                      </div>
                    ) : (
                      <div className="space-y-4 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto">
                          <Smartphone className="w-8 h-8 text-gray-200" />
                        </div>
                        <p className="text-gray-400 text-xs font-semibold px-6">Hubungkan HP Anda dengan memindai kode QR baru.</p>
                      </div>
                    )}
                    
                    {isLoadingQr && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-6 h-6 text-[#FF5FA2] animate-spin" />
                          <p className="text-[#FF5FA2] text-[10px] font-black uppercase tracking-tighter">Meminta QR...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {!isConnected && (
                      <button
                        onClick={handleGetQr}
                        disabled={isLoadingQr}
                        className="w-full py-3.5 rounded-xl bg-[#FF5FA2] text-white text-xs font-black hover:bg-[#E8457E] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#FF5FA2]/15"
                      >
                        {isLoadingQr ? "Mengambil Data..." : qrCode ? "Refresh QR Code" : "Tampilkan QR Code"}
                      </button>
                    )}
                    
                    <button
                      onClick={() => setConfirmModalType("logout")}
                      disabled={isDisconnecting}
                      className="w-full py-3 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 text-xs font-bold text-gray-500 hover:text-red-500 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      {isDisconnecting ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <Trash2 className="w-4 h-4" />}
                      <span>Putuskan Sesi WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfirmModalType("clear")}
                      disabled={isDisconnecting}
                      className="w-full text-center text-[10px] font-bold text-gray-400 hover:text-[#FF5FA2] transition-colors mt-1 select-none"
                    >
                      Hapus / Ganti Nomor WhatsApp
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column: Message Template Editor */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl border border-gray-100 relative overflow-hidden h-full"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5FA2]/5 rounded-full -mr-16 -mt-16 blur-3xl" />

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                      <Keyboard className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#18080F] tracking-tight">Template WhatsApp</h3>
                      <p className="text-xs text-gray-400 font-medium">Sesuaikan isi notifikasi kehadiran ke orang tua.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Template Pesan</label>
                      <div className="flex flex-wrap gap-1.5">
                        {["{student_name}", "{class_name}", "{subject}", "{date}", "{time}"].map(v => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setTemplate(prev => prev + v)}
                            className="text-[9px] font-bold text-gray-400 hover:text-[#FF5FA2] hover:bg-[#FF5FA2]/5 hover:border-[#FF5FA2]/20 px-2 py-1 bg-gray-50 rounded-full border border-gray-100 transition-all cursor-pointer active:scale-95 select-none"
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      rows={6}
                      value={template}
                      onChange={(e) => setTemplate(e.target.value)}
                      placeholder="Halo, Siswa {student_name} telah hadir..."
                      className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#FF5FA2]/20 outline-none transition-all font-bold text-sm text-[#18080F] resize-none"
                    />

                    <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                      * Perubahan template pesan ini akan otomatis digunakan pada setiap pemindaian kehadiran siswa Anda.
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleSaveTemplate}
                    disabled={isSavingTemplate || !template}
                    className="w-full py-3.5 bg-[#FF5FA2] text-white font-black rounded-xl hover:bg-[#E8457E] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5FA2]/15 text-xs"
                  >
                    {isSavingTemplate ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Simpan Template Pesan</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Toast 
        isVisible={showToast} 
        message={toastMsg} 
        type={toastType} 
        onClose={() => setShowToast(false)} 
      />

      <AnimatePresence>
        {confirmModalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModalType(null)}
              className="absolute inset-0 bg-[#18080F]/45 backdrop-blur-[2px]"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[2rem] p-6 max-w-sm w-full border border-gray-100 shadow-2xl relative z-10 overflow-hidden text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-4 mx-auto border border-red-100">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#18080F] mb-2">
                {confirmModalType === "clear" ? "Hapus Nomor WhatsApp?" : "Putuskan Sesi WhatsApp?"}
              </h3>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed mb-6 px-2">
                {confirmModalType === "clear" 
                  ? "Apakah Anda yakin ingin menghapus nomor WhatsApp ini dari profil? Anda perlu mendaftarkannya kembali jika ingin menggunakannya."
                  : "Apakah Anda yakin ingin memutuskan sesi WhatsApp ini? Seluruh riwayat kirim notifikasi akan terhenti sementara."
                }
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmModalType(null)}
                  className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 text-[#18080F] text-xs font-bold rounded-xl transition-all border border-gray-100 active:scale-95"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    const action = confirmModalType;
                    setConfirmModalType(null);
                    handleDisconnect(action);
                  }}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-red-500/10 active:scale-95"
                >
                  {confirmModalType === "clear" ? "Ya, Hapus Nomor" : "Ya, Putuskan Sesi"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
