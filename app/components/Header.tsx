"use client";

import { useState, useEffect } from "react";
import { Zap, Menu, X, ChevronRight, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const { t, locale, setLocale } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  const navLinks = [
    { label: t('nav.features'), href: "#features" },
    { label: t('nav.howItWorks'), href: "#how-it-works" },
    { label: t('products.badge'), href: "#pricing" },
    { label: t('education.badge'), href: "#education" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-4" : "py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <nav
          className={`relative flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-300 ${
            isScrolled
              ? "bg-white/80 backdrop-blur-lg border border-gray-100 shadow-lg shadow-gray-200/20"
              : "bg-transparent border border-transparent"
          }`}
        >
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF5FA2] to-[#E8457E] flex items-center justify-center shadow-lg shadow-[#FF5FA2]/30">
              <Image src="/images/logo_simple.png" alt="OneTap" width={20} height={20} />
            </div>
            <span
              className={`text-xl font-bold tracking-tight transition-colors duration-300 ${isScrolled ? "text-[#18080F]" : "text-white"}`}
              style={{ fontFamily: "var(--font-display)" }}
            >
              OneTap
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-semibold transition-colors duration-300 ${isScrolled ? "text-[#18080F]/70" : "text-white/80"} hover:text-[#FF5FA2]`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-300 text-sm font-semibold ${isScrolled ? "text-[#18080F]/70" : "text-white/80"}`}
            >
              <Globe className="w-4 h-4" />
              {locale.toUpperCase()}
            </button>
            
            <a
              href={user ? "/dashboard" : "/auth/login"}
              className={`text-sm font-semibold transition-colors duration-300 ${isScrolled ? "text-[#18080F]" : "text-white"} hover:text-[#FF5FA2]`}
            >
              {user ? "Dashboard" : t('common.login')}
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#18080F] text-white text-sm font-bold hover:bg-[#FF5FA2] transition-all duration-200 shadow-lg shadow-[#18080F]/10"
            >
              {t('nav.orderNow')}
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
              isScrolled ? "bg-gray-50 text-[#18080F]" : "bg-white/10 text-white"
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
              <div className="bg-white rounded-[1.75rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] p-7 flex flex-col gap-6">
                {/* Main Links */}
                <div className="flex flex-col gap-5">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[17px] font-bold text-[#18080F] tracking-tight"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>

                <div className="w-full h-[1px] bg-slate-100/60 my-1" />

                {/* Secondary Actions */}
                <div className="flex flex-col gap-5">
                  <button
                    onClick={() => {
                      setLocale(locale === 'id' ? 'en' : 'id');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between w-full"
                  >
                    <span className="text-[17px] font-bold text-[#18080F] tracking-tight">{t('common.language')}</span>
                    <span className="text-[17px] font-bold text-[#FF5FA2] uppercase">{locale}</span>
                  </button>
                  
                  <a
                    href={user ? "/dashboard" : "/auth/login"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[17px] font-bold text-[#18080F] text-left tracking-tight"
                  >
                    {user ? "Dashboard" : t('common.login')}
                  </a>
                  
                  <a
                    href="#pricing"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-3 flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-[#FF5FA2] hover:bg-[#E8457E] transition-colors text-white font-bold text-[17px]"
                  >
                    {t('nav.orderNow')}
                    <ChevronRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
