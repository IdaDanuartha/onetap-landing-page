"use client";
import { motion } from "framer-motion";
import { Settings, Fingerprint, Link2 } from "lucide-react";
import AnimatedSection, { fadeInUp } from "./AnimatedSection";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function HowItWorksSection() {
  const { t } = useLanguage();

  const steps = [
    {
      step: "01",
      icon: Settings,
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.desc'),
    },
    {
      step: "02",
      icon: Fingerprint,
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.desc'),
    },
    {
      step: "03",
      icon: Link2,
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.desc'),
    },
  ];

  return (
    <AnimatedSection className="section bg-page" id="howitworks">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-14">
          <span className="badge-soft">{t('howItWorks.badge')}</span>
          <h2
            className="mt-4 text-3xl md:text-5xl font-bold"
            style={{ color: "var(--color-text-dark)" }}
          >
            {t('howItWorks.title')}
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="relative text-center"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block step-connector" />
              )}

              {/* Icon circle */}
              <motion.div
                className="relative z-10 w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-lg"
                style={{ background: "var(--color-primary-light)", border: "2px solid var(--color-primary-soft)" }}
                whileHover={{ scale: 1.1 }}
              >
                <s.icon
                  className="w-10 h-10"
                  style={{ color: "var(--color-primary)" }}
                />
              </motion.div>

              <div className="mt-6">
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {s.step}
                </span>
                <h3
                  className="text-xl font-bold mt-1"
                  style={{ color: "var(--color-text-dark)" }}
                >
                  {s.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {s.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
