"use client";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Wifi } from "lucide-react";
import { fadeInUp, staggerContainer } from "./AnimatedSection";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const WA_LINK =
  "https://wa.me/6283114227745?text=Halo+OneTap!+Saya+ingin+order+NFC+Keychain.";

import ThreeDKeychain from "./ThreeDKeychain";

export default function HeroSection() {
  const { t } = useLanguage();
  
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "var(--color-bg)" }}
    >
      <div
        className="absolute top-24 right-8 w-96 h-96 blob pointer-events-none"
        style={{ background: "var(--color-primary-soft)", opacity: 0.12 }}
      />
      <div
        className="absolute bottom-20 left-4 w-64 h-64 blob pointer-events-none"
        style={{ background: "var(--color-primary-soft)", opacity: 0.1 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <span className="badge-soft">{t('hero.badge')}</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="mt-5 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight"
              style={{ color: "var(--color-text-dark)" }}
            >
              {t('hero.title1')}
              <br />
              <span className="gradient-text">{t('hero.title2')}</span>
              <br />
              {t('hero.title3')}
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg md:text-xl max-w-lg leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t('hero.description')}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-8 flex flex-wrap gap-4"
            >
              <motion.a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <MessageCircle className="w-4 h-4" />
                {t('hero.ctaPrimary')}
              </motion.a>
              <motion.a
                href="/catalog"
                className="btn-secondary"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                {t('hero.ctaSecondary')}
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-wrap gap-6"
            >
              {[
                { value: "1,500+", label: t('hero.statHappy') },
                { value: "5.0/5.0", label: t('hero.statRating') },
                { value: "100%", label: t('hero.statApps') },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {item.value}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center lg:justify-end w-full"
          >
            <ThreeDKeychain />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
