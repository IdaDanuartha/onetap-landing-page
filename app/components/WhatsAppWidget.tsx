'use client';

import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function WhatsAppWidget() {
  const { t } = useLanguage();
  const pathname = usePathname();

  // Hide on dashboard pages
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  const phoneNumber = '6283114227745';
  const encodedMessage = encodeURIComponent(t('common.waMessage'));
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <motion.a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_8px_30px_rgb(37,211,102,0.4)] hover:shadow-[0_12px_40px_rgb(37,211,102,0.5)] transition-all group"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-current transition-transform group-hover:rotate-12" />
        
        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute right-16 px-4 py-2 bg-white text-[#18080F] text-xs font-black rounded-xl shadow-xl border border-gray-100 whitespace-nowrap pointer-events-none"
        >
          {t('common.waTooltip')}
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white border-r border-t border-gray-100 rotate-45" />
        </motion.div>
      </motion.a>
    </div>
  );
}
