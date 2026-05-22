"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, QrCode, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function FirstTimePopup() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // Check localStorage to see if user has selected to skip this popup
    const hasSeen = localStorage.getItem("onetap_hide_first_time_popup");
    if (hasSeen !== "true") {
      // Show popup after a premium delay of 1.2s for optimal pacing
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("onetap_hide_first_time_popup", "true");
    }
    setIsOpen(false);
  };

  const handleCTA = () => {
    if (dontShowAgain) {
      localStorage.setItem("onetap_hide_first_time_popup", "true");
    }
    setIsOpen(false);
    router.push("/dashboard/nfc");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#18080F]/80 backdrop-blur-md"
          />

          {/* Premium Glassmorphic Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.15 }}
            className="relative w-full max-w-lg bg-[#2D1020]/90 backdrop-blur-xl border border-[#FF5FA2]/20 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-[#FF5FA2]/15 overflow-hidden text-white"
          >
            {/* Ambient Background Glows */}
            <div className="absolute -left-20 -top-20 w-48 h-48 rounded-full bg-[#FF5FA2]/15 blur-3xl pointer-events-none" />
            <div className="absolute -right-20 -bottom-20 w-48 h-48 rounded-full bg-[#FF5FA2]/10 blur-3xl pointer-events-none" />

            {/* Custom Premium Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-[#FF5FA2]/10 hover:border-[#FF5FA2]/30 transition-all duration-200 text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Body */}
            <div className="space-y-6 relative z-10">
              
              {/* Premium Floating Scanner HUD Visual */}
              <div className="flex justify-center">
                <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-[#FF5FA2]/20 to-[#E8457E]/10 border border-[#FF5FA2]/30 flex items-center justify-center shadow-lg shadow-[#FF5FA2]/5">
                  
                  {/* Dashboard Laser Line Effect */}
                  <motion.div
                    animate={{ y: [-36, 36, -36] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-[#FF5FA2] to-transparent shadow-[0_0_8px_#FF5FA2] z-10"
                  />

                  {/* Rotating dashed target border */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    className="absolute inset-0 border border-dashed border-[#FF5FA2]/30 rounded-2xl scale-[1.12]"
                  />
                  
                  <QrCode className="w-10 h-10 text-[#FF5FA2] relative z-0" />
                  
                  <div className="absolute bottom-2 right-2 w-4.5 h-4.5 bg-white rounded-full flex items-center justify-center shadow-md">
                    <Sparkles className="w-2.5 h-2.5 text-[#E8457E] animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Title & Desc */}
              <div className="text-center space-y-3">
                <h3 
                  className="text-2xl sm:text-3xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-[#F6B7C8] to-[#FFF8F2] bg-clip-text text-transparent"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {t('firstTimePopup.title')}
                </h3>
                <p className="text-sm sm:text-base text-[#F6B7C8]/80 leading-relaxed font-medium">
                  {t('firstTimePopup.desc')}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleCTA}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white font-bold hover:shadow-lg hover:shadow-[#FF5FA2]/30 hover:-translate-y-0.5 transition-all duration-200 text-base"
                >
                  <QrCode className="w-5 h-5" />
                  {t('firstTimePopup.cta')}
                </button>
                
                <button
                  onClick={handleClose}
                  className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-semibold text-white/70 hover:text-white transition-all duration-200"
                >
                  {t('firstTimePopup.close')}
                </button>
              </div>

              {/* Remember Choices Toggle */}
              <div className="flex items-center justify-center gap-2.5 pt-4 border-t border-white/5">
                <label className="relative flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 rounded-md border border-white/20 peer-checked:border-[#FF5FA2] peer-checked:bg-[#FF5FA2] transition-all duration-200 flex items-center justify-center text-white">
                    {dontShowAgain && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                  <span className="ml-2.5 text-xs font-semibold text-[#F6B7C8]/70 hover:text-white transition-colors duration-200">
                    {t('firstTimePopup.checkbox')}
                  </span>
                </label>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
