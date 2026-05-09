"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is actually authenticated (from reset link)
    async function checkSession() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Sesi tidak valid atau telah kadaluarsa. Silakan minta link baru.");
      }
    }
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Password tidak cocok.");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FF5FA2] rounded-full opacity-[0.08] blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#F6B7C8] rounded-full opacity-[0.1] blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl shadow-[#FF5FA2]/5">
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF5FA2] to-[#E8457E] flex items-center justify-center mb-6 shadow-xl shadow-[#FF5FA2]/20">
              <Image
                src="/images/logo_simple.png"
                alt="OneTap"
                width={36}
                height={36}
                className="brightness-0 invert object-contain"
              />
            </div>
            <h1 className="text-2xl font-extrabold text-[#18080F] mb-2 text-center">
              Reset Password
            </h1>
            <p className="text-[#18080F]/60 text-center font-medium text-sm">
              Silakan masukkan password baru kamu untuk mengamankan akun.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-[#18080F] mb-2">Password Diperbarui!</h3>
                <p className="text-[#18080F]/60 text-sm font-medium mb-8">
                  Password kamu berhasil diubah. Kamu akan dialihkan ke halaman login dalam beberapa detik.
                </p>
                <div className="flex items-center justify-center gap-2 text-[#FF5FA2] font-bold text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mengalihkan...
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-5"
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#18080F] ml-1">Password Baru</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#18080F]/40 group-focus-within:text-[#FF5FA2] transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-14 pl-12 pr-12 rounded-2xl bg-white border border-[#18080F]/10 outline-none focus:ring-2 focus:ring-[#FF5FA2]/20 focus:border-[#FF5FA2] transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#18080F]/30 hover:text-[#FF5FA2] transition-colors"
                    >
                      {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#18080F] ml-1">Konfirmasi Password</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#18080F]/40 group-focus-within:text-[#FF5FA2] transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-14 pl-12 pr-12 rounded-2xl bg-white border border-[#18080F]/10 outline-none focus:ring-2 focus:ring-[#FF5FA2]/20 focus:border-[#FF5FA2] transition-all font-medium"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !!error.includes("Sesi tidak valid")}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white font-bold shadow-xl shadow-[#FF5FA2]/25 hover:shadow-[#FF5FA2]/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Memperbarui...</span>
                    </div>
                  ) : "Simpan Password Baru"}
                </button>

                {error.includes("Sesi tidak valid") && (
                  <Link
                    href="/auth/forgot-password"
                    className="block text-center text-[#FF5FA2] font-bold text-sm hover:underline mt-4"
                  >
                    Minta Link Baru
                  </Link>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
