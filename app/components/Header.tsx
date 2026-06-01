"use client";

import { useState, useEffect } from "react";
import { Zap, Menu, X, ChevronRight, Globe, Play, User, Users, LogOut, LayoutDashboard, MessageCircle, Link2, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import LogoutConfirmModal from "@/app/components/LogoutConfirmModal";

export default function Header() {
  const { t, locale, setLocale } = useLanguage();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine if we should show the "dark text / white background" style
  const showSolidStyle = isScrolled || !isHomePage;

  useEffect(() => {
    const supabase = createClient();
    
    const fetchProfile = async (userId: string) => {
      const { data } = await supabase.from('users_profile').select('*').eq('id', userId).single();
      setProfile(data);
    };

    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data.session?.user || null;
      setUser(currentUser);
      if (currentUser) fetchProfile(currentUser.id);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) fetchProfile(currentUser.id);
      else setProfile(null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: t('nav.howItWorks'), href: "/#how-it-works" },
    { label: t('nav.scan'), href: "/write" },
    { label: t('nav.products'), href: "/products" },
    { label: t('nav.pricing'), href: "/pricing" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showSolidStyle ? "py-4" : "py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <nav
          className={`relative flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-300 ${
            showSolidStyle
              ? "bg-white/80 backdrop-blur-lg border border-gray-100 shadow-lg shadow-gray-200/20"
              : "bg-transparent border border-transparent"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF5FA2] to-[#E8457E] flex items-center justify-center shadow-lg shadow-[#FF5FA2]/30">
              <Image src="/images/logo_simple.png" alt="OneTap" width={20} height={20} />
            </div>
            <span
              className={`text-xl font-bold tracking-tight transition-colors duration-300 ${showSolidStyle ? "text-[#18080F]" : "text-white"}`}
              style={{ fontFamily: "var(--font-display)" }}
            >
              OneTap
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-semibold transition-colors duration-300 ${showSolidStyle ? "text-[#18080F]/70" : "text-white/80"} hover:text-[#FF5FA2]`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-300 text-sm font-semibold ${showSolidStyle ? "text-[#18080F]/70" : "text-white/80"}`}
            >
              <Globe className="w-4 h-4" />
              {locale.toUpperCase()}
            </button>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center cursor-pointer gap-3 px-3 py-1.5 rounded-xl transition-all duration-300 ${
                    showSolidStyle ? "bg-gray-100" : "bg-white/10"
                  } hover:bg-[#FF5FA2]/10 group`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF5FA2] to-[#E8457E] flex items-center justify-center text-white">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`text-sm font-bold transition-colors duration-300 ${showSolidStyle ? "text-[#18080F]" : "text-white"} group-hover:text-[#FF5FA2]`}>
                    {profile?.display_name || user.email?.split('@')[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100 py-2 z-20 overflow-hidden"
                      >
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-[#18080F] hover:bg-gray-50 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#FF5FA2]" />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsLogoutModalOpen(true);
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className={`text-sm font-semibold transition-colors duration-300 ${showSolidStyle ? "text-[#18080F]" : "text-white"} hover:text-[#FF5FA2]`}
              >
                {t('common.login')}
              </Link>
            )}
            <a
              href="https://wa.me/6283114227745?text=Halo%20OneTap%2C%20saya%20ingin%20bertanya%20mengenai%20detail%20produk%20NFC%20OneTap%20yang%20tersedia."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF5FA2] text-white text-sm font-bold hover:bg-[#E8457E] transition-all duration-200 shadow-lg shadow-[#FF5FA2]/25"
            >
              {t('nav.orderNow')}
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
              showSolidStyle ? "bg-gray-50 text-[#18080F]" : "bg-white/10 text-white"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Card */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-[88px] left-5 right-5 z-50 lg:hidden origin-top"
            >
              <div className="bg-white rounded-[1.75rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] p-7 flex flex-col gap-6 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
                {/* User Profile Header (Mobile) */}
                {user && (
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 mb-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF5FA2] to-[#E8457E] flex items-center justify-center text-white shadow-lg shadow-[#FF5FA2]/20">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-[#18080F]">
                        {profile?.display_name || user.email?.split('@')[0]}
                      </span>
                      <span className="text-xs text-[#18080F]/50 font-medium">{user.email}</span>
                    </div>
                  </div>
                )}

                {/* Main Links */}
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-[#FF5FA2]/10 transition-colors">
                        {link.label === t('nav.howItWorks') && <Play className="w-4 h-4 text-[#FF5FA2]" />}
                        {link.label === t('nav.scan') && <QrCode className="w-4 h-4 text-[#FF5FA2]" />}
                        {link.label === t('nav.products') && <Link2 className="w-4 h-4 text-[#FF5FA2]" />}
                        {link.label === t('nav.pricing') && <Users className="w-4 h-4 text-[#FF5FA2]" />}
                      </div>
                      <span className="text-[17px] font-bold text-[#18080F] tracking-tight">
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="w-full h-[1px] bg-slate-100/60 my-1" />

                {/* Secondary Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setLocale(locale === 'id' ? 'en' : 'id');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-[17px] font-bold text-[#18080F] tracking-tight">{t('common.language')}</span>
                    </div>
                    <span className="text-sm font-bold text-[#FF5FA2] uppercase bg-[#FF5FA2]/10 px-2.5 py-1 rounded-lg">{locale}</span>
                  </button>
                  
                  <Link
                    href={user ? "/dashboard" : "/auth/login"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-[#FF5FA2]/10 transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-gray-400 group-hover:text-[#FF5FA2]" />
                    </div>
                    <span className="text-[17px] font-bold text-[#18080F] tracking-tight">
                      {user ? "Dashboard" : t('common.login')}
                    </span>
                  </Link>
                  
                  {user && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors group text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50/50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-500" />
                      </div>
                      <span className="text-[17px] font-bold text-red-500 tracking-tight">
                        Logout
                      </span>
                    </button>
                  )}
                  
                  <Link
                    href="/pricing"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-3 flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-[#FF5FA2] hover:bg-[#E8457E] transition-colors text-white font-bold text-[17px]"
                  >
                    {t('nav.orderNow')}
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={async () => {
          const supabase = createClient();
          await supabase.auth.signOut();
          window.location.href = "/";
        }}
      />
    </header>
  );
}
