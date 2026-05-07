"use client";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import AnimatedSection, { fadeInUp } from "./AnimatedSection";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function CTABannerSection() {
  const { t } = useLanguage();

  return (
    <AnimatedSection id="cta" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-[#18080F] px-8 py-20 lg:py-24 text-center">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10" 
               style={{ backgroundImage: "radial-gradient(#FF5FA2 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#FF5FA2]/20 to-transparent pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/90 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 text-[#FF5FA2]" />
              {t('cta.title')}
            </motion.div>
            
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl lg:text-6xl text-white mb-8 font-extrabold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t('cta.title')}
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-white/60 text-lg lg:text-xl mb-12 max-w-2xl mx-auto">
              {t('cta.description')}
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/6283114227745"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white font-bold shadow-xl shadow-[#FF5FA2]/20 hover:shadow-[#FF5FA2]/40 hover:-translate-y-1 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                {t('cta.chat')}
              </a>
              <a
                href="/catalog"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold hover:bg-white/20 hover:-translate-y-1 transition-all duration-300"
              >
                {t('cta.catalog')}
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
