"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutConfirmModalProps) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop with elegant blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#18080F]/80 backdrop-blur-md"
          />

          {/* Premium Glassmorphic Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
            className="relative w-full max-w-md bg-[#2D1020]/90 backdrop-blur-xl border border-[#FF5FA2]/20 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-[#FF5FA2]/15 overflow-hidden text-white"
          >
            {/* Ambient Background Glows */}
            <div className="absolute -left-20 -top-20 w-48 h-48 rounded-full bg-[#FF5FA2]/15 blur-3xl pointer-events-none" />
            <div className="absolute -right-20 -bottom-20 w-48 h-48 rounded-full bg-[#FF5FA2]/10 blur-3xl pointer-events-none" />

            {/* Custom Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-[#FF5FA2]/10 hover:border-[#FF5FA2]/30 transition-all duration-200 text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Body */}
            <div className="space-y-6 relative z-10 text-center">
              
              {/* Animated Floating Logout Icon HUD */}
              <div className="flex justify-center">
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-[#E8457E]/10 border border-red-500/30 flex items-center justify-center shadow-lg shadow-red-500/5">
                  {/* Rotating dashed ring */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="absolute inset-0 border border-dashed border-red-500/30 rounded-2xl scale-[1.12]"
                  />
                  <LogOut className="w-9 h-9 text-red-400" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2.5">
                <h3 
                  className="text-2xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-[#F6B7C8] to-[#FFF8F2] bg-clip-text text-transparent"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {t('logoutConfirm.title')}
                </h3>
                <p className="text-sm sm:text-base text-[#F6B7C8]/80 leading-relaxed font-medium">
                  {t('logoutConfirm.desc')}
                </p>
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  onClick={onClose}
                  className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-bold text-white/70 hover:text-white transition-all duration-200"
                >
                  {t('logoutConfirm.cancel')}
                </button>
                <button
                  onClick={onConfirm}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-[#E8457E] text-white font-bold hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5 transition-all duration-200 text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  {t('logoutConfirm.confirm')}
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
