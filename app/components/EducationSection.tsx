"use client";
import { GraduationCap, ArrowRight, BookOpen, Users2, ClipboardCheck } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection, { fadeInUp } from "./AnimatedSection";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function EducationSection() {
  const { t } = useLanguage();

  const eduFeatures = [
    {
      icon: ClipboardCheck,
      title: t('education.items.absensi.title'),
      description: t('education.items.absensi.desc'),
    },
    {
      icon: Users2,
      title: t('education.items.management.title'),
      description: t('education.items.management.desc'),
    },
    {
      icon: BookOpen,
      title: t('education.items.profile.title'),
      description: t('education.items.profile.desc'),
    },
  ];

  const stats = [
    { value: "500+", label: t('education.stats.schools') },
    { value: "2M+", label: t('education.stats.taps') },
    { value: "98%", label: t('education.stats.accuracy') },
  ];

  return (
    <AnimatedSection id="education" className="py-24 lg:py-32 bg-[#FFF8F2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#F6B7C8] text-[#FF5FA2] text-sm font-semibold mb-5">
            <GraduationCap className="w-4 h-4" />
            {t('education.badge')}
          </div>
          <h2
            className="text-4xl lg:text-5xl text-[#18080F] mb-5 font-extrabold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t('education.title').split(' ').map((word: string, i: number) => 
              word.toLowerCase() === 'campuses' || word.toLowerCase() === 'kampus' ? (
                <span key={i} className="bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] bg-clip-text text-transparent"> {word} </span>
              ) : ` ${word} `
            )}
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            {t('education.description')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <motion.div variants={fadeInUp} className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#FF5FA2]/10 to-[#F6B7C8]/15 rounded-3xl blur-2xl" />
            <div className="relative rounded-3xl overflow-hidden border border-[#F6B7C8]/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1551402991-6e4b5fc0b01c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGVkdWNhdGlvbiUyMGRpZ2l0YWwlMjB0YWJsZXQlMjBjbGFzc3Jvb218ZW58MXx8fHwxNzc4MTQ4OTg5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Education Technology"
                className="w-full h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#18080F]/50 via-transparent to-transparent" />
            </div>

            {/* Floating attendance card */}
            <div className="absolute bottom-8 left-6 right-6 bg-white rounded-2xl shadow-2xl p-5 border border-[#F6B7C8]/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#18080F] text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  {t('education.attendanceLabel')}
                </span>
                <span className="text-[#FF5FA2] text-xs font-semibold bg-[#FFF8F2] px-2 py-1 rounded-lg border border-[#F6B7C8]/50">{t('education.live')}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-[#FFF8F2] rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] rounded-full" style={{ width: "87%" }} />
                </div>
                <span className="text-[#18080F] text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>87%</span>
              </div>
              <div className="text-gray-400 text-xs mt-1.5">43 of 50 {t('education.presentLabel')}</div>
            </div>
          </motion.div>

          {/* Right: Features */}
          <div className="order-1 lg:order-2">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {stats.map((s, i) => (
                <motion.div key={i} variants={fadeInUp} className="text-center p-4 rounded-2xl bg-white border border-[#F6B7C8]/40 shadow-sm">
                  <div
                    className="text-2xl text-[#FF5FA2] mb-1 font-extrabold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-gray-500 text-xs">{s.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-4 mb-10">
              {eduFeatures.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div key={i} variants={fadeInUp} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#F6B7C8]/30 shadow-sm hover:shadow-md hover:border-[#FF5FA2]/30 transition-all duration-200">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF5FA2] to-[#E8457E] flex items-center justify-center shrink-0 shadow-lg shadow-[#FF5FA2]/20">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3
                        className="text-[#18080F] mb-1 font-bold"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {f.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/6283114227745"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white font-semibold shadow-lg shadow-[#FF5FA2]/25 hover:shadow-[#FF5FA2]/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                {t('education.ctaSecondary')}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
