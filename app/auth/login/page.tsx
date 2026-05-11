"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, Mail, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (authError) {
        setError("Email atau password salah. Coba lagi.");
        setLoading(false);
        return;
      }

      // Check if user is admin
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from('users_profile')
          .select('role')
          .eq('id', authUser.id)
          .single();
        
        if (profile?.role === 'admin') {
          await supabase.auth.signOut();
          setError("Akun Admin tidak diizinkan masuk ke halaman ini. Silakan gunakan dashboard Admin khusus.");
          setLoading(false);
          return;
        }
      }

      // Check for 'next' redirect parameter
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");
      router.push(next || "/dashboard");
    } catch (err) {
      setError("Terjadi kesalahan sistem. Silakan coba lagi nanti.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FF5FA2] rounded-full opacity-[0.08] blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#F6B7C8] rounded-full opacity-[0.1] blur-[100px]" />

      {/* Back to Home */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-[#18080F]/60 hover:text-[#FF5FA2] transition-colors font-medium text-sm group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Beranda
      </Link>

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
            <h1
              className="text-3xl font-extrabold text-[#18080F] mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Selamat Datang
            </h1>
            <p className="text-[#18080F]/60 text-center font-medium">
              Masuk untuk mengelola profil digital kamu
            </p>
          </div>

          {/* Social Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full h-14 rounded-2xl border border-white/50 bg-white/50 hover:bg-white hover:shadow-md transition-all flex items-center justify-center gap-3 mb-8 font-semibold text-[#18080F]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Lanjutkan dengan Google
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-[#18080F]/10 flex-1" />
            <span className="text-xs font-bold text-[#18080F]/30 uppercase tracking-widest">Atau dengan Email</span>
            <div className="h-px bg-[#18080F]/10 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#18080F] ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#18080F]/40 group-focus-within:text-[#FF5FA2] transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white border border-[#18080F]/10 outline-none focus:ring-2 focus:ring-[#FF5FA2]/20 focus:border-[#FF5FA2] transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-[#18080F]">Password</label>
                <Link href="/auth/forgot-password" className="text-xs font-bold text-[#FF5FA2] hover:underline">
                  Lupa Password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#18080F]/40 group-focus-within:text-[#FF5FA2] transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white font-bold shadow-xl shadow-[#FF5FA2]/25 hover:shadow-[#FF5FA2]/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Image src="/images/logo_simple.png" alt="Loading" width={24} height={24} className="animate-pulse" />
                  <span className="animate-pulse">Memuat...</span>
                </div>
              ) : "Masuk Sekarang"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-[#18080F]/50 text-sm mt-10 font-medium">
            Belum punya akun?{" "}
            <Link href="/auth/register" className="text-[#FF5FA2] font-bold hover:underline">
              Buat Akun Gratis
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
