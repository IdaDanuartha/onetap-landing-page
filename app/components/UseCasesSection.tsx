"use client";
import { motion } from "framer-motion";
import { Briefcase, Music, Camera, Building2, Stethoscope, GraduationCap, Utensils, Dumbbell } from "lucide-react";
import AnimatedSection, { fadeInUp } from "./AnimatedSection";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function UseCasesSection() {
  const { t } = useLanguage();

  const useCases = [
    // {
    //   icon: Briefcase,
    //   title: t('useCases.items.corporate.title'),
    //   description: t('useCases.items.corporate.desc'),
    //   tag: t('useCases.items.corporate.tag'),
    //   tagColor: "bg-[#FF5FA2]/20 text-[#FF5FA2]",
    // },
    {
      icon: Music,
      title: t('useCases.items.artist.title'),
      description: t('useCases.items.artist.desc'),
      tag: t('useCases.items.artist.tag'),
      tagColor: "bg-[#FF5FA2]/20 text-[#FF5FA2]",
    },
    {
      icon: Camera,
      title: t('useCases.items.creator.title'),
      description: t('useCases.items.creator.desc'),
      tag: t('useCases.items.creator.tag'),
      tagColor: "bg-[#F6B7C8]/30 text-white",
    },
    // {
    //   icon: Building2,
    //   title: t('useCases.items.property.title'),
    //   description: t('useCases.items.property.desc'),
    //   tag: t('useCases.items.property.tag'),
    //   tagColor: "bg-[#F6B7C8]/30 text-white",
    // },
    {
      icon: Stethoscope,
      title: t('useCases.items.health.title'),
      description: t('useCases.items.health.desc'),
      tag: t('useCases.items.health.tag'),
      tagColor: "bg-[#FF5FA2]/20 text-[#FF5FA2]",
    },
    {
      icon: GraduationCap,
      title: t('useCases.items.education.title'),
      description: t('useCases.items.education.desc'),
      tag: t('useCases.items.education.tag'),
      tagColor: "bg-[#F6B7C8]/30 text-white",
    },
    {
      icon: Utensils,
      title: t('useCases.items.fnb.title'),
      description: t('useCases.items.fnb.desc'),
      tag: t('useCases.items.fnb.tag'),
      tagColor: "bg-[#FF5FA2]/20 text-[#FF5FA2]",
    },
    {
      icon: Dumbbell,
      title: t('useCases.items.fitness.title'),
      description: t('useCases.items.fitness.desc'),
      tag: t('useCases.items.fitness.tag'),
      tagColor: "bg-[#F6B7C8]/30 text-white",
    },
  ];

  return (
    <AnimatedSection id="usecases" className="py-24 lg:py-32 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #18080F 0%, #2D1020 60%, #18080F 100%)" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      {/* Glow blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF5FA2] rounded-full opacity-10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#F6B7C8] rounded-full opacity-5 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FF5FA2]/30 bg-[#FF5FA2]/10 text-[#F6B7C8] text-sm font-semibold mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5FA2]" />
            {t('useCases.badge')}
          </div>
          <h2
            className="text-4xl lg:text-5xl text-white mb-5 font-extrabold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {(t('useCases.title') as string).split(' ').map((word: string, i, arr) => {
              // Highlight the last 2 words with gradient
              const isHighlight = i >= arr.length - 2;
              return (
                <span key={i}>
                  {isHighlight ? (
                    <span className="bg-gradient-to-r from-[#F6B7C8] to-[#FF5FA2] bg-clip-text text-transparent">
                      {word}
                    </span>
                  ) : (
                    word
                  )}
                  {i < arr.length - 1 ? ' ' : ''}
                </span>
              );
            })}
          </h2>
          <p className="text-[#F6B7C8]/70 text-lg max-w-xl mx-auto">
            {t('useCases.description')}
          </p>
        </motion.div>

        {/* Feature image + cards split */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Left image */}
          <motion.div variants={fadeInUp} className="lg:col-span-2 relative">
            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1758518729685-f88df7890776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW0lMjBvZmZpY2UlMjBjb2xsYWJvcmF0aW9uJTIwbW9kZXJufGVufDF8fHx8MTc3ODE0ODk4OXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Use Cases"
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#18080F]/70 via-transparent to-transparent rounded-3xl" />
            </div>
            {/* Floating stat */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-[#FF5FA2]/20 rounded-2xl p-5">
              <div className="text-white text-3xl mb-1 font-extrabold" style={{ fontFamily: "var(--font-display)" }}>
                {t('useCases.statTitle')}
              </div>
              <div className="text-[#F6B7C8] text-sm">{t('useCases.statLabel')}</div>
            </div>
          </motion.div>

          {/* Right grid */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {useCases.map((uc, i) => {
              const Icon = uc.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="group p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#FF5FA2]/30 transition-all duration-200 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FF5FA2]/15 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#FF5FA2]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${uc.tagColor}`}>
                          {uc.tag}
                        </span>
                      </div>
                      <h3 className="text-white text-sm font-semibold mb-1 font-bold" style={{ fontFamily: "var(--font-display)" }}>
                        {uc.title}
                      </h3>
                      <p className="text-[#F6B7C8]/70 text-xs leading-relaxed">{uc.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
