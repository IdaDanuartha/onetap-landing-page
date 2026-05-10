"use client";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function FloatingWA() {
  const { t } = useLanguage();
  const WA_LINK = `https://wa.me/6283114227745?text=${encodeURIComponent(t('common.waMessage'))}`;

  return (
    <motion.a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-wa"
      style={{ bottom: '100px' }} // Lifted to avoid chatbot overlap
      aria-label="Chat WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
    >
      <MessageCircle className="w-5 h-5" />
      <span>{t('common.chatWa')}</span>
    </motion.a>
  );
}
