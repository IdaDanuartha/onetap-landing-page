"use client";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import AnimatedSection, { fadeInUp } from "./AnimatedSection";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const WA_LINK =
  "https://wa.me/6283114227745?text=Halo+OneTap!+Saya+ingin+konsultasi+gratis.";

export default function CTABannerSection() {
  const { t } = useLanguage();

  return (
    <AnimatedSection className="section bg-pink-cta" id="contact">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div variants={fadeInUp}>
          <h2 className="text-3xl md:text-5xl font-black !text-white">
            {t('cta.title')}
          </h2>
          <p className="mt-5 text-lg text-white/80 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <motion.a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-on-pink"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <MessageCircle className="w-5 h-5" />
            {t('cta.chat')}
          </motion.a>
          <motion.a
            href="/catalog"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-white border-2 border-white/40 hover:bg-white/10 transition-all"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {t('cta.catalog')}
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
