'use client';

import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { ArrowRight, Link2, Palette, BarChart2, Wifi, Instagram, Briefcase, Mail, Music, User, Sparkles, Link as LinkIcon } from 'lucide-react';
import { useLanguage } from "@/lib/i18n/LanguageContext";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const fadeInDelayed: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function OneTapHighlight() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const featureItems = [
    { icon: Link2, label: t('onetap_card.features.links'), color: '#FF5FA2', bg: '#FFF8F2' },
    { icon: Palette, label: t('onetap_card.features.themes'), color: '#FF5FA2', bg: '#FFF8F2' },
    { icon: BarChart2, label: t('onetap_card.features.analytics'), color: '#FF5FA2', bg: '#FFF8F2' },
    { icon: Wifi, label: t('onetap_card.features.nfc'), color: '#FF5FA2', bg: '#FFF8F2' },
  ];

  // Mini preview links for mockup
  const previewLinks = [
    { icon: Instagram, label: 'Instagram' },
    { icon: Briefcase, label: t('onetap_card.mockup.portfolio') },
    { icon: Mail, label: t('onetap_card.mockup.email') },
    { icon: Music, label: 'Spotify' },
  ];

  return (
    <section
      ref={ref}
      className="py-24 bg-white overflow-hidden relative"
      id="onetap-card"
    >
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-tr from-[#FF5FA2]/5 to-[#E8457E]/5 rounded-full blur-[80px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Phone mockup */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeIn}
            className="flex justify-center relative"
          >
            {/* Phone frame */}
            <div className="relative w-[280px]">
              <div className="bg-[#18080F] rounded-[44px] p-3 shadow-2xl ring-4 ring-[#18080F]/10">
                {/* Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#18080F] rounded-b-2xl z-10" />
                <div
                  className="rounded-[32px] overflow-hidden bg-[#FFF8F2] relative h-[580px]"
                >
                  {/* OneTap preview content */}
                  <div className="flex flex-col items-center py-12 px-5">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg shadow-[#FF5FA2]/20 mb-4 ring-4 ring-white">
                      <img
                        src="/images/yogik_avatar.png"
                        alt="Yogik Pratama Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-bold text-lg text-center text-[#18080F]" style={{ fontFamily: "var(--font-display)" }}>
                      {t('onetap_card.mockup.name')}
                    </p>
                    <p className="text-xs text-center mt-1 text-[#18080F]/60 font-medium">
                      {t('onetap_card.mockup.role')}
                    </p>

                    {/* Links */}
                    <div className="w-full mt-8 space-y-3">
                      {previewLinks.map((link) => (
                        <div
                          key={link.label}
                          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold bg-white border border-[#F6B7C8] text-[#18080F] shadow-sm hover:border-[#FF5FA2] transition-colors"
                        >
                          <link.icon className="w-4 h-4 text-[#FF5FA2]" />
                          {link.label}
                        </div>
                      ))}
                    </div>

                    <p className="text-[10px] mt-8 text-[#18080F]/40 font-bold tracking-wider uppercase">Powered by OneTap</p>
                  </div>
                </div>
              </div>

              {/* Floating badge — URL */}
              <div
                className="absolute -top-4 -right-8 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 bg-white text-[#18080F] border border-gray-100 z-20"
              >
                <div className="w-6 h-6 rounded-full bg-[#FFF8F2] flex items-center justify-center">
                  <LinkIcon className="w-3.5 h-3.5 text-[#FF5FA2]" />
                </div>
                onetap-charm.com/l/yogik
              </div>
              {/* Floating badge — Stats */}
              <div
                className="absolute -bottom-4 -left-8 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white z-20"
              >
                <BarChart2 className="w-4 h-4" />
                248 {t('onetap_card.stats')}
              </div>
            </div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeInDelayed}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#F6B7C8] bg-[#FFF8F2] mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#FF5FA2]" />
              <span className="text-sm font-semibold text-[#FF5FA2]">{t('onetap_card.badge')}</span>
            </div>

            <h2
              className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-[#18080F]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('onetap_card.title1')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5FA2] to-[#E8457E]">{t('onetap_card.title2')}</span>
            </h2>

            <p className="text-lg mb-10 leading-relaxed text-[#18080F]/70">
              {t('onetap_card.description')}
            </p>

            <div className="space-y-5 mb-10">
              {featureItems.map((feat) => (
                <div key={feat.label} className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: feat.bg }}
                  >
                    <feat.icon className="w-6 h-6" style={{ color: feat.color }} />
                  </div>
                  <p className="text-base font-semibold text-[#18080F]">
                    {feat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <a href="/auth/register" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white font-semibold shadow-xl shadow-[#FF5FA2]/20 hover:shadow-[#FF5FA2]/40 hover:-translate-y-0.5 transition-all duration-200">
                {t('onetap_card.cta')}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="/auth/login" className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl border-2 border-gray-100 bg-white text-[#18080F] font-semibold hover:border-[#F6B7C8] hover:bg-[#FFF8F2] transition-colors duration-200">
                {t('common.login')}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
