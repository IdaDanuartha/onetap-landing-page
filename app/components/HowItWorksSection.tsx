"use client";
import { MousePointerClick, Palette, Share2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection, { fadeInUp } from "./AnimatedSection";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function HowItWorksSection() {
  const { t } = useLanguage();

  const steps = [
    {
      number: "01",
      icon: MousePointerClick,
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.desc'),
      gradient: "from-[#FF5FA2] to-[#FF8FC4]",
    },
    {
      number: "02",
      icon: Palette,
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.desc'),
      gradient: "from-[#E8457E] to-[#FF5FA2]",
    },
    {
      number: "03",
      icon: Share2,
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.desc'),
      gradient: "from-[#FF5FA2] to-[#F6B7C8]",
    },
  ];

  return (
    <AnimatedSection id="howitworks" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF8F2] border border-[#F6B7C8] text-[#FF5FA2] text-sm font-semibold mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5FA2]" />
            {t('howItWorks.badge')}
          </div>
          <h2
            className="text-4xl lg:text-5xl text-[#18080F] mb-5 font-extrabold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t('howItWorks.title').split(' 3 ')[0]} {" "}
            <span className="bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] bg-clip-text text-transparent">
              3 simple steps
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            {t('howItWorks.description')}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-8 left-[16.67%] right-[16.67%] h-0.5 border-t-2 border-dashed border-[#FF5FA2]/20" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div 
                    key={i} 
                    variants={fadeInUp}
                    className="relative flex flex-col items-center text-center"
                >
                  {/* Step icon */}
                  <div className="relative mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl shadow-[#FF5FA2]/25 relative z-10`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#18080F] flex items-center justify-center z-20">
                      <span className="text-white text-xs font-bold">{i + 1}</span>
                    </div>
                  </div>

                  {/* Large step number (decorative) */}
                  <div
                    className="text-7xl text-[#FFF8F2] mb-3 leading-none font-black"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step.number}
                  </div>

                  <h3
                    className="text-xl text-[#18080F] mb-3 -mt-8 font-bold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed max-w-xs">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div variants={fadeInUp} className="text-center mt-16">
          <a
            href="https://wa.me/6283114227745"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white font-semibold shadow-xl shadow-[#FF5FA2]/25 hover:shadow-[#FF5FA2]/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            {t('hero.ctaPrimary')}
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
