"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Shield, Smartphone, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FonnteSetupPage() {
  const [apiKey, setApiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSave = async () => {
    setIsSaving(true);
    setStatus("idle");
    
    // Mock save logic
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setStatus("success");
  };

  return (
    <div className="min-h-screen bg-[#FFF8F2]">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/dashboard" className="text-gray-400 hover:text-[#FF5FA2] flex items-center gap-2 mb-8 font-bold transition-all">
          <ArrowRight className="w-4 h-4 rotate-180" />
          Kembali ke Dashboard
        </Link>

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
                <h1 className="text-3xl font-black text-[#18080F] tracking-tight">Fonnte Setup</h1>
              </div>
              <p className="text-gray-500 font-medium">Hubungkan OneTap dengan akun Fonnte Anda untuk notifikasi WhatsApp otomatis.</p>
            </div>
            <Image src="/images/logo_simple.png" alt="Fonnte" width={50} height={50} className="opacity-20 grayscale" />
          </div>

          <div className="space-y-8">
            {/* Instruction Card */}
            <div className="p-6 rounded-3xl bg-blue-50 border border-blue-100">
              <h3 className="text-blue-700 font-bold mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Cara Mendapatkan API Key:
              </h3>
              <ol className="text-blue-600/80 text-sm space-y-2 list-decimal list-inside font-medium">
                <li>Login ke dashboard <a href="https://fonnte.com" target="_blank" className="underline font-bold">Fonnte.com</a></li>
                <li>Buka menu **API Key** di sidebar kiri.</li>
                <li>Salin token yang tertera dan tempelkan di bawah ini.</li>
              </ol>
            </div>

            {/* Input Section */}
            <div className="space-y-4">
              <label className="block text-sm font-black text-[#18080F] uppercase tracking-wider">
                Fonnte API Token
              </label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Paste your Fonnte API Key here..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-mono text-sm"
                />
              </div>
              
              {status === "success" && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 p-3 rounded-xl border border-green-100">
                  <CheckCircle2 className="w-4 h-4" />
                  API Key berhasil disimpan dan diverifikasi!
                </motion.div>
              )}

              {status === "error" && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 text-red-600 font-bold text-sm bg-red-50 p-3 rounded-xl border border-red-100">
                  <AlertCircle className="w-4 h-4" />
                  Gagal menyimpan API Key. Silakan coba lagi.
                </motion.div>
              )}
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving || !apiKey}
              className="w-full py-4 rounded-2xl bg-[#18080F] text-white font-black hover:bg-orange-500 disabled:opacity-50 disabled:hover:bg-[#18080F] transition-all flex items-center justify-center gap-3 shadow-lg shadow-gray-200"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Simpan Konfigurasi"}
              {!isSaving && <ArrowRight className="w-5 h-5" />}
            </button>

            <div className="pt-6 border-t border-gray-50 text-center">
              <p className="text-xs text-gray-400 font-medium">
                Semua pesan akan dikirim menggunakan perangkat yang terhubung di akun Fonnte Anda.
                Pastikan perangkat Anda dalam status <span className="text-green-500 font-bold">Connected</span>.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
