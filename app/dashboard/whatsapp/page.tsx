"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Smartphone, ArrowRight, Loader2, CheckCircle2, AlertCircle, Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { dict } from "@/lib/i18n/dict";
import Link from "next/link";

export default function WhatsAppSetupPage() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState("checking...");
  const { locale, setLocale } = useLanguage();
  const d_dashboard = dict[locale].dashboard;

  // Check initial status
  useEffect(() => {
    checkStatus();
  }, []);

  // Poll status every 5 seconds if not connected
  useEffect(() => {
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
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

  const handleGetQr = async () => {
    setIsLoadingQr(true);
    try {
      const res = await fetch("/api/whatsapp/qr", { method: "POST" });
      const data = await res.json();
      if (data.status && data.url) {
        setQrCode(data.url);
      } else {
        alert(`Gagal: ${data.message || "Token tidak valid"}. \n\nMohon periksa kembali FONNTE_API_TOKEN di file .env.local atau di Dashboard Fonnte Anda.`);
      }
    } catch (err) {
      console.error("QR Fetch error:", err);
    } finally {
      setIsLoadingQr(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F2]">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="text-gray-400 hover:text-[#FF5FA2] flex items-center gap-2 font-bold transition-all">
            <ArrowRight className="w-4 h-4 rotate-180" />
            {d_dashboard.title}
          </Link>
          <button
            onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-gray-500 hover:text-[#FF5FA2] hover:bg-[#FF5FA2]/5 transition-all duration-300 text-[10px] sm:text-xs font-bold uppercase"
          >
            <Globe className="w-3.5 h-3.5 sm:w-4 h-4" />
            {locale}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-xl border border-gray-100"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-orange-500" />
                </div>
                <h1 className="text-3xl font-black text-[#18080F] tracking-tight">WhatsApp Setup</h1>
              </div>
              <p className="text-gray-500 font-medium">
                Hubungkan perangkat Anda secara instan untuk notifikasi otomatis. Layanan WhatsApp disediakan oleh OneTap.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="p-8 rounded-[2rem] bg-gray-50 border-2 border-dashed border-gray-200 w-full max-w-sm aspect-square flex flex-col items-center justify-center relative overflow-hidden">
                {isConnected ? (
                  <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
                    <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto border-4 border-white shadow-sm">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <div>
                      <p className="text-green-600 font-black text-lg">Tersambung!</p>
                      <p className="text-gray-400 text-xs font-medium">Perangkat Anda siap digunakan.</p>
                    </div>
                  </motion.div>
                ) : qrCode ? (
                  <div className="space-y-6">
                    {/* Use standard img tag instead of next/image to avoid hostname issues */}
                    <img 
                      src={qrCode} 
                      alt="WhatsApp QR" 
                      width={200} 
                      height={200} 
                      className="rounded-xl shadow-md mx-auto" 
                    />
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Scan dengan WhatsApp Anda</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mx-auto">
                      <Smartphone className="w-10 h-10 text-gray-200" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium px-8">Klik tombol di bawah untuk memunculkan QR Code koneksi.</p>
                  </div>
                )}
                
                {isLoadingQr && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 text-[#FF5FA2] animate-spin" />
                      <p className="text-[#FF5FA2] text-xs font-black uppercase tracking-tighter">Menyiapkan...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 w-full flex flex-col items-center">
                {!isConnected && (
                  <button
                    onClick={handleGetQr}
                    disabled={isLoadingQr}
                    className="w-full max-w-sm py-4 rounded-2xl bg-[#FF5FA2] text-white font-black hover:bg-[#E8457E] transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#FF5FA2]/20"
                  >
                    {isLoadingQr ? "Mohon Tunggu..." : qrCode ? "Refresh QR Code" : "Hubungkan Perangkat"}
                  </button>
                )}
                
                {isConnected && (
                  <button
                    onClick={() => { setQrCode(null); setIsConnected(false); }}
                    className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Putuskan Koneksi
                  </button>
                )}
                
                <p className="text-xs text-gray-400 max-w-xs mx-auto font-medium">
                  Anda tidak perlu membayar biaya gateway tambahan. Cukup gunakan nomor WhatsApp Anda sendiri.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50">
                  <h4 className="text-[#18080F] font-bold text-sm mb-1">Status Perangkat</h4>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`} />
                    <p className={`text-xs font-black uppercase tracking-tighter ${isConnected ? 'text-green-600' : 'text-orange-600'}`}>
                      {isConnected ? 'Terhubung' : deviceStatus === 'connect' ? 'Ready to Scan' : deviceStatus.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className={`p-4 rounded-2xl border transition-all ${isConnected ? 'bg-green-50/50 border-green-100/50' : 'bg-gray-50 border-gray-100'}`}>
                  <h4 className="text-[#18080F] font-bold text-sm mb-1">Device Limit</h4>
                  <p className={`text-xs font-black ${isConnected ? 'text-green-600' : 'text-gray-400'}`}>
                    {isConnected ? '1 Device Connected' : '0 Device Active'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
