"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { 
  User, 
  Lock, 
  ChevronLeft, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Settings as SettingsIcon,
  ShieldCheck,
  Trash2,
  X,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "@/app/components/Toast";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  
  // Profile state
  const [profile, setProfile] = useState({
    id: "",
    display_name: "",
    email: "",
    username: ""
  });

  // Password state
  const [passForm, setPassForm] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [showPass, setShowPass] = useState(false);
  const [passError, setPassError] = useState("");
  
  // Delete state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmPhrase, setConfirmPhrase] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [originalUsername, setOriginalUsername] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.push("/auth/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("users_profile")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profileData) {
        setProfile({
          id: authUser.id,
          display_name: profileData.display_name || "",
          email: authUser.email || "",
          username: profileData.username || ""
        });
        setOriginalUsername(profileData.username || "");
      }
      setLoading(false);
    }
    loadProfile();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const supabase = createClient();

    try {
      // Validate username if changed
      if (profile.username !== originalUsername) {
        if (!/^[a-z0-9_-]+$/.test(profile.username)) {
          setToastMsg("Username hanya boleh huruf kecil, angka, - dan _");
          setShowToast(true);
          setIsSavingProfile(false);
          return;
        }

        // Check availability
        const { data: existing } = await supabase
          .from("users_profile")
          .select("id")
          .eq("username", profile.username)
          .single();
        
        if (existing && existing.id !== profile.id) {
          setToastMsg("Username sudah digunakan orang lain.");
          setShowToast(true);
          setIsSavingProfile(false);
          return;
        }
      }

      const { error } = await supabase
        .from("users_profile")
        .update({ 
          display_name: profile.display_name,
          username: profile.username
        })
        .eq("id", profile.id);

      if (error) throw error;

      setOriginalUsername(profile.username);
      setToastMsg("Profil berhasil diperbarui!");
      setShowToast(true);
    } catch (err: any) {
      console.error(err);
      setToastMsg("Gagal memperbarui profil.");
      setShowToast(true);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmPhrase !== "HAPUS AKUN SAYA") return;
    
    setIsDeleting(true);
    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "POST",
      });
      
      if (!res.ok) throw new Error("Gagal menghapus akun");
      
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setToastMsg("Gagal menghapus akun. Silakan coba lagi.");
      setShowToast(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");

    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassError("Konfirmasi password tidak cocok.");
      return;
    }

    if (passForm.newPassword.length < 6) {
      setPassError("Password minimal 6 karakter.");
      return;
    }

    setIsChangingPass(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.updateUser({
        password: passForm.newPassword
      });

      if (error) throw error;

      setToastMsg("Password berhasil diubah!");
      setShowToast(true);
      setPassForm({ newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      console.error(err);
      setPassError(err.message || "Gagal mengubah password.");
    } finally {
      setIsChangingPass(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF5FA2] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F2] selection:bg-[#FF5FA2]/20 selection:text-[#FF5FA2]">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#FF5FA2]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#F6B7C8]/10 rounded-full blur-[100px]" />
      </div>

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#F6B7C8]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/dashboard" className="flex items-center gap-2 text-[#18080F]/60 hover:text-[#FF5FA2] transition-all font-bold">
              <ChevronLeft className="w-5 h-5" />
              Kembali
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF5FA2] to-[#E8457E] flex items-center justify-center">
                <SettingsIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black text-[#18080F]">Pengaturan</span>
            </div>
            <div className="w-20" /> {/* Spacer */}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Profile Section */}
          <section className="bg-white rounded-[32px] border border-[#F6B7C8]/10 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-gradient-to-r from-[#FFF1F7]/30 to-transparent">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF1F7] flex items-center justify-center">
                  <User className="w-6 h-6 text-[#FF5FA2]" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#18080F]">Informasi Profil</h2>
                  <p className="text-sm text-gray-500 font-medium">Perbarui informasi dasar akun kamu.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#18080F] ml-1">Nama Tampilan</label>
                  <input
                    type="text"
                    value={profile.display_name}
                    onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                    placeholder="Masukkan nama kamu"
                    className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-[#FF5FA2]/20 focus:border-[#FF5FA2] transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#18080F] ml-1">Username</label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                    placeholder="username_kamu"
                    className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-[#FF5FA2]/20 focus:border-[#FF5FA2] transition-all font-medium"
                  />
                  <p className="text-[10px] text-gray-400 font-bold ml-1 uppercase tracking-wider">Username digunakan untuk identitas profil unik kamu.</p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-[#18080F] ml-1">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full h-12 px-4 rounded-xl bg-gray-100 border border-gray-100 text-gray-400 font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#FF5FA2] text-white font-bold shadow-lg shadow-[#FF5FA2]/20 hover:bg-[#E8457E] transition-all disabled:opacity-70"
                >
                  {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </section>

          {/* Password Section */}
          <section className="bg-white rounded-[32px] border border-[#F6B7C8]/10 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-gradient-to-r from-[#f5f3ff]/30 to-transparent">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-[#f5f3ff] flex items-center justify-center">
                  <Lock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#18080F]">Ganti Password</h2>
                  <p className="text-sm text-gray-500 font-medium">Amankan akun kamu dengan password yang kuat.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#18080F] ml-1">Password Baru</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={passForm.newPassword}
                      onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full h-12 px-4 pr-12 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-[#FF5FA2]/20 focus:border-[#FF5FA2] transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF5FA2] transition-colors"
                    >
                      {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#18080F] ml-1">Konfirmasi Password Baru</label>
                  <input
                    type={showPass ? "text" : "password"}
                    value={passForm.confirmPassword}
                    onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-[#FF5FA2]/20 focus:border-[#FF5FA2] transition-all font-medium"
                  />
                </div>
              </div>

              {passError && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {passError}
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#18080F] text-white font-bold shadow-lg shadow-black/10 hover:bg-black transition-all disabled:opacity-70"
                >
                  {isChangingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  Update Password
                </button>
              </div>
            </form>
          </section>

          {/* Delete Account Section - Clean Version */}
          <section className="bg-white rounded-[32px] border border-red-50 shadow-sm overflow-hidden group">
            <div className="p-8 border-b border-red-50/50 bg-red-50/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-red-600">Hapus Akun</h2>
                  <p className="text-sm text-red-400 font-medium italic">Sekali dihapus, data tidak bisa dikembalikan.</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="max-w-md">
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  Semua data profil digital, link, dan log absensi akan dihapus permanen dari sistem kami.
                </p>
              </div>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="px-8 py-3 rounded-xl border-2 border-red-100 text-red-500 font-bold hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex items-center gap-2 group/btn"
              >
                <Trash2 className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                Hapus Akun Saya
              </button>
            </div>
          </section>
        </motion.div>
      </main>

      {/* Secure Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-[#18080F]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-black text-[#18080F] mb-2">Hapus Akun?</h2>
                <p className="text-gray-500 font-medium mb-8">
                  Tindakan ini permanen. Ketik <span className="font-black text-red-600 tracking-wider">HAPUS AKUN SAYA</span> di bawah untuk mengonfirmasi.
                </p>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={confirmPhrase}
                    onChange={(e) => setConfirmPhrase(e.target.value)}
                    placeholder="HAPUS AKUN SAYA"
                    className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-bold text-center placeholder:font-medium"
                  />

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={confirmPhrase !== "HAPUS AKUN SAYA" || isDeleting}
                      className="w-full h-12 rounded-xl bg-red-500 text-white font-black hover:bg-red-600 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                    >
                      {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                      Ya, Hapus Permanen
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteModal(false);
                        setConfirmPhrase("");
                      }}
                      className="w-full h-12 rounded-xl bg-gray-50 text-gray-500 font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                    >
                      Batalkan
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toast 
        isVisible={showToast} 
        message={toastMsg} 
        onClose={() => setShowToast(false)} 
      />
    </div>
  );
}
