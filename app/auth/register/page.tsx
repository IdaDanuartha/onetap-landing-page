"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, Mail, Lock, User, AtSign, CheckCircle2, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

const USERNAME_RESERVED = ['catalog', 'blog', 'about', 'auth', 'dashboard', 'l', 'r', 'attend', 'api', 'write', 'product'];

function validateUsername(username: string): string {
  if (!username) return 'Username wajib diisi';
  if (username.length < 3) return 'Username minimal 3 karakter';
  if (username.length > 30) return 'Username maksimal 30 karakter';
  if (!/^[a-z0-9-]+$/.test(username)) return 'Hanya huruf kecil, angka, dan tanda hubung (-)';
  if (USERNAME_RESERVED.includes(username)) return 'Username ini tidak tersedia';
  return '';
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');

  // Restore success state on page refresh
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const success = sessionStorage.getItem('register_success');
      if (success === 'true') {
        setIsSuccess(true);
        setForm({
          name: sessionStorage.getItem('register_name') || '',
          email: sessionStorage.getItem('register_email') || '',
          username: sessionStorage.getItem('register_username') || '',
          password: '',
        });
      }
    }
  }, []);

  const handleClearSuccessState = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('register_success');
      sessionStorage.removeItem('register_email');
      sessionStorage.removeItem('register_name');
      sessionStorage.removeItem('register_username');
    }
    setIsSuccess(false);
  };

  const handleResendEmail = async () => {
    setResendLoading(true);
    setResendMessage('');
    setResendError('');

    try {
      const res = await fetch('/api/auth/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          username: form.username,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setResendError(result.error || 'Gagal mengirim ulang email.');
      } else {
        setResendMessage(result.message || 'Email berhasil dikirim ulang!');
      }
    } catch {
      setResendError('Terjadi kesalahan koneksi.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleUsernameChange = (val: string) => {
    const sanitized = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setForm({ ...form, username: sanitized });
    setUsernameError(validateUsername(sanitized));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const uErr = validateUsername(form.username);
    if (uErr) { setUsernameError(uErr); return; }
    if (form.password.length < 8) {
      setError('Password minimal 8 karakter');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call the API route instead of direct client-side signUp
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          name: form.name,
          username: form.username,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Gagal membuat akun. Coba lagi.');
        setLoading(false);
        return;
      }

      // Since email is auto-confirmed, they are registered successfully!
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('register_success', 'true');
        sessionStorage.setItem('register_email', form.email);
        sessionStorage.setItem('register_name', form.name);
        sessionStorage.setItem('register_username', form.username);
      }
      setIsSuccess(true);
    } catch {
      setError('Terjadi kesalahan. Coba lagi.');
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
        onClick={handleClearSuccessState}
        className="absolute top-8 left-8 flex items-center gap-2 text-[#18080F]/60 hover:text-[#FF5FA2] transition-colors font-medium text-sm group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Beranda
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] relative z-10 py-10"
      >
        <div className="bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl shadow-[#FF5FA2]/5">
          {isSuccess ? (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mb-6 text-green-500 shadow-lg shadow-green-500/10">
                <CheckCircle2 className="w-8 h-8 animate-bounce" />
              </div>
              <h2
                className="text-2xl font-extrabold text-[#18080F] mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Registrasi Berhasil!
              </h2>
              <p className="text-gray-600 font-medium text-sm leading-relaxed mb-8">
                Akun Anda telah <strong>aktif secara instan</strong>! Anda dapat langsung masuk sekarang. 
                Kami juga telah mengirimkan email selamat datang ke <strong className="text-[#FF5FA2] break-all">{form.email}</strong> menggunakan <strong>Resend</strong>.
              </p>
              
              <Link
                href="/auth/login"
                onClick={handleClearSuccessState}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white font-bold shadow-xl shadow-[#FF5FA2]/25 hover:shadow-[#FF5FA2]/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center mb-4"
              >
                Masuk Sekarang
              </Link>

              <button
                onClick={handleResendEmail}
                disabled={resendLoading}
                className="flex items-center justify-center gap-2 text-sm font-bold text-[#FF5FA2] hover:text-[#E8457E] disabled:opacity-50 transition-colors py-2 px-4 cursor-pointer"
              >
                {resendLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Kirim Ulang Email Selamat Datang
              </button>

              <AnimatePresence>
                {resendMessage && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-green-600 font-semibold mt-2"
                  >
                    {resendMessage}
                  </motion.p>
                )}
                {resendError && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 font-semibold mt-2"
                  >
                    {resendError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              {/* Logo & Header */}
              <div className="flex flex-col items-center mb-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF5FA2] to-[#E8457E] flex items-center justify-center mb-6 shadow-xl shadow-[#FF5FA2]/20">
                  <Image
                    src="/images/logo_simple.png"
                    alt="OneTap"
                    width={32}
                    height={32}
                    className="brightness-0 invert object-contain"
                  />
                </div>
                <h1
                  className="text-3xl font-extrabold text-[#18080F] mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Buat Akun OneTap
                </h1>
                <p className="text-[#18080F]/60 text-center font-medium">
                  Mulai bagikan identitas digitalmu sekarang
                </p>
              </div>

              {/* Social Register */}
              <button
                onClick={handleGoogleLogin}
                className="w-full h-14 rounded-2xl border border-white/50 bg-white/50 hover:bg-white hover:shadow-md transition-all flex items-center justify-center gap-3 mb-8 font-semibold text-[#18080F]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Daftar dengan Google
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-[#18080F]/10 flex-1" />
                <span className="text-xs font-bold text-[#18080F]/30 uppercase tracking-widest text-center">Atau isi data manual</span>
                <div className="h-px bg-[#18080F]/10 flex-1" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#18080F] ml-1">Nama Lengkap</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#18080F]/40 group-focus-within:text-[#FF5FA2] transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Nama Lengkap"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white border border-[#18080F]/10 outline-none focus:ring-2 focus:ring-[#FF5FA2]/20 focus:border-[#FF5FA2] transition-all font-medium"
                    />
                  </div>
                </div>

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

                {/* Username Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#18080F] ml-1">Username</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#18080F]/40 group-focus-within:text-[#FF5FA2] transition-colors">
                      <AtSign className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="username-kamu"
                      required
                      value={form.username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      className={`w-full h-14 pl-12 pr-12 rounded-2xl bg-white border outline-none focus:ring-2 transition-all font-medium ${
                        usernameError ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-[#18080F]/10 focus:ring-[#FF5FA2]/20 focus:border-[#FF5FA2]"
                      }`}
                    />
                    {form.username && !usernameError && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  {usernameError && (
                    <p className="text-xs text-red-500 font-semibold ml-1">{usernameError}</p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#18080F] ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#18080F]/40 group-focus-within:text-[#FF5FA2] transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Minimal 8 karakter"
                      required
                      minLength={8}
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
                  disabled={loading || !!usernameError}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white font-bold shadow-xl shadow-[#FF5FA2]/25 hover:shadow-[#FF5FA2]/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Image src="/images/logo_simple.png" alt="Loading" width={24} height={24} className="animate-pulse" />
                      <span className="animate-pulse">Memuat...</span>
                    </div>
                  ) : "Daftar Akun Sekarang"}
                </button>
              </form>

              {/* Footer */}
              <p className="text-center text-[#18080F]/50 text-sm mt-10 font-medium">
                Sudah punya akun?{" "}
                <Link href="/auth/login" className="text-[#FF5FA2] font-bold hover:underline">
                  Masuk Disini
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
