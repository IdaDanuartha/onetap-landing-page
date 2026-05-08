"use client";
import { ArrowRight, Play, Users, Link2, CheckCircle, Instagram, Twitter, Linkedin, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { motion } from "framer-motion";

export default function HeroSection() {
  const { t } = useLanguage();

  const stats = [
    { value: "50K+", label: t('hero.statHappy') || "Active Users" },
    { value: "120+", label: t('hero.statApps') || "Integrations" },
    { value: "99.9%", label: t('hero.statRating') || "Uptime SLA" },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #18080F 0%, #2D1020 50%, #18080F 100%)" }}
    >
      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF5FA2] rounded-full opacity-15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-[#F6B7C8] rounded-full opacity-10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-[#FF5FA2] rounded-full opacity-8 blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.2
                }
              }
            }}
          >
            {/* Badge */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FF5FA2]/30 bg-[#FF5FA2]/10 backdrop-blur-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#F6B7C8] animate-pulse" />
              <span className="text-sm text-[#F6B7C8] font-medium">{t('hero.badge')}</span>
            </motion.div>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.1] mb-6"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
            >
              {t('hero.title1')}{" "}
              <span className="bg-gradient-to-r from-[#F6B7C8] via-[#FF5FA2] to-[#FFF8F2] bg-clip-text text-transparent">
                {t('hero.title2')}
              </span>
              <br />
              {t('hero.title3')}
            </motion.h1>

            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-lg text-[#F6B7C8]/80 leading-relaxed mb-10 max-w-lg"
            >
              {t('hero.description')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <a
                href="/auth/register"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white font-semibold shadow-2xl shadow-[#FF5FA2]/30 hover:shadow-[#FF5FA2]/50 hover:-translate-y-0.5 transition-all duration-200"
              >
                {t('hero.ctaPrimary')}
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="flex items-center gap-8"
            >
              {stats.map((stat, i) => (
                <motion.div 
                  key={i}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                >
                  <div
                    className="text-2xl text-white mb-0.5"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#F6B7C8]/70">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative mx-auto w-full max-w-md">
              {/* Hero image */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-[#2D1020]">
                <img
                  src="https://images.unsplash.com/photo-1720135885007-454165745e21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBTYWFTJTIwZGFzaGJvYXJkJTIwYXBwJTIwZGFyayUyMGludGVyZmFjZXxlbnwxfHx8fDE3NzgxNDg5ODh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="OneTap Dashboard"
                  className="w-full h-80 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#18080F]/60 to-transparent" />
              </div>

              {/* Floating profile card */}
              <motion.div 
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-12 top-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl z-20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF5FA2] to-[#F6B7C8] flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{t('hero.floating.profile')}</div>
                    <div className="text-[#F6B7C8] text-xs">onetap-charm.com/l/yourname</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[
                    { icon: Instagram, color: "#FF5FA2" },
                    { icon: Twitter, color: "#1DA1F2" },
                    { icon: Linkedin, color: "#0A66C2" },
                    { icon: MessageCircle, color: "#25D366" }
                  ].map((s, i) => (
                    <div key={i} className="p-1.5 rounded-lg bg-white/10 text-white/80">
                      <s.icon className="w-3.5 h-3.5" />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Floating attendance card */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -right-10 bottom-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl z-20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FF5FA2]/20 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-[#FF5FA2]" />
                  </div>
                  <span className="text-white text-sm font-semibold">{t('hero.floating.attendance')}</span>
                </div>
                <div className="text-[#F6B7C8] text-xs">Yogik — 08:42 AM ✓</div>
              </motion.div>

              {/* Floating link card */}
              <div className="absolute -bottom-4 left-4 bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] rounded-2xl px-5 py-3 shadow-2xl shadow-[#FF5FA2]/40 flex items-center gap-2.5">
                <Link2 className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-semibold">{t('hero.floating.link')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute -bottom-[1px] left-0 right-0 z-10">
        <svg 
          viewBox="0 0 1440 80" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-auto block scale-105 origin-bottom"
          preserveAspectRatio="none"
        >
          <path 
            d="M0 40L60 45C120 50 240 60 360 65C480 70 600 70 720 65C840 60 960 50 1080 45C1200 40 1320 40 1380 40L1440 40V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V40Z" 
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
