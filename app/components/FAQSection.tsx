"use client";

import { HelpCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AnimatedSection, { fadeInUp } from "./AnimatedSection";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function FAQSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = t('faq.items') as { q: string; a: string }[];

  return (
    <AnimatedSection id="faq" className="py-24 lg:py-32 bg-[#FFF8F2]">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#F6B7C8] text-[#FF5FA2] text-sm font-semibold mb-5">
            <HelpCircle className="w-4 h-4" />
            {t('faq.badge')}
          </div>
          <h2
            className="text-4xl lg:text-5xl text-[#18080F] mb-5 font-extrabold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t('faq.title')}
          </h2>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                openIndex === i ? "bg-white border-[#F6B7C8] shadow-lg shadow-[#FF5FA2]/5" : "bg-white/50 border-gray-100 hover:border-gray-200"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span
                  className={`text-lg font-bold pr-8 transition-colors duration-200 ${
                    openIndex === i ? "text-[#FF5FA2]" : "text-[#18080F]"
                  }`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180 text-[#FF5FA2]" : "text-gray-400"
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-gray-500 leading-relaxed">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
