"use client";
import { Zap, Shield, BarChart3, Smartphone, Globe2, HeadphonesIcon } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection, { fadeInUp } from "./AnimatedSection";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Zap,
      gradient: "from-[#FF5FA2] to-[#FF8FC4]",
      title: t('features.items.setup.title'),
      description: t('features.items.setup.desc'),
    },
    {
      icon: Smartphone,
      gradient: "from-[#FF8FC4] to-[#FF5FA2]",
      title: t('features.items.everywhere.title'),
      description: t('features.items.everywhere.desc'),
    },
    {
      icon: BarChart3,
      gradient: "from-[#FF5FA2] to-[#F6B7C8]",
      title: t('features.items.analytics.title'),
      description: t('features.items.analytics.desc'),
    },
  ];

  return (
    <AnimatedSection id="features" className="py-24 lg:py-32 bg-white relative z-20 -mt-[1px]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF8F2] border border-[#F6B7C8] text-[#FF5FA2] text-sm font-semibold mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5FA2]" />
            {t('features.badge')}
          </div>
          <h2
            className="text-4xl lg:text-5xl text-[#18080F] mb-5 font-extrabold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t('features.title').split('?')[0]} {" "}
            <span className="bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] bg-clip-text text-transparent">
              OneTap
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            {t('features.description')}
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="group relative p-7 rounded-2xl border border-gray-100 hover:border-[#F6B7C8] bg-white hover:shadow-xl hover:shadow-[#FF5FA2]/8 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg shadow-[#FF5FA2]/20`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3
                  className="text-lg text-[#18080F] mb-2.5 font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {f.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>

                {/* Hover accent line */}
                <div className={`absolute bottom-0 left-7 right-7 h-0.5 rounded-full bg-gradient-to-r ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
