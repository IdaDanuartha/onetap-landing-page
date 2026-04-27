"use client";
import { motion } from "framer-motion";
import { Smartphone, Palette, Shield, Globe, Lock, Leaf } from "lucide-react";
import AnimatedSection, { fadeInUp } from "./AnimatedSection";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Smartphone,
      title: t('features.tap.title'),
      description: t('features.tap.desc'),
    },
    {
      icon: Palette,
      title: t('features.design.title'),
      description: t('features.design.desc'),
    },
    {
      icon: Shield,
      title: t('features.quality.title'),
      description: t('features.quality.desc'),
    },
    {
      icon: Globe,
      title: t('features.platform.title'),
      description: t('features.platform.desc'),
    },
    {
      icon: Lock,
      title: t('features.secure.title'),
      description: t('features.secure.desc'),
    },
    {
      icon: Leaf,
      title: t('features.eco.title'),
      description: t('features.eco.desc'),
    },
  ];

  return (
    <AnimatedSection className="section bg-white-clean" id="features">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-14">
          <span className="badge-soft">{t('features.badge')}</span>
          <h2
            className="mt-4 text-3xl md:text-5xl font-bold"
            style={{ color: "var(--color-text-dark)" }}
          >
            {t('features.title').split('?')[0]}?
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              className="card group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: "var(--color-primary-light)" }}
              >
                <f.icon
                  className="w-6 h-6"
                  style={{ color: "var(--color-primary)" }}
                />
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: "var(--color-text-dark)" }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
