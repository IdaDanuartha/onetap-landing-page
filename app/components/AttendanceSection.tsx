"use client";

import { motion } from "framer-motion";
import { CheckCircle2, MessageSquare, ShieldCheck, Zap, ArrowRight, Bell } from "lucide-react";
import AnimatedSection, { fadeInUp } from "./AnimatedSection";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function AttendanceSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Zap,
      title: t('attendanceSection.items.tap.title'),
      desc: t('attendanceSection.items.tap.desc'),
      color: "bg-blue-500",
    },
    {
      icon: MessageSquare,
      title: t('attendanceSection.items.wa.title'),
      desc: t('attendanceSection.items.wa.desc'),
      color: "bg-green-500",
    },
    {
      icon: ShieldCheck,
      title: t('attendanceSection.items.security.title'),
      desc: t('attendanceSection.items.security.desc'),
      color: "bg-purple-500",
    },
  ];

  const formatMessage = (text: string) => {
    return text.split('**').map((part, i) => 
      i % 2 === 1 ? <span key={i} className="font-black text-[#18080F]">{part}</span> : part
    );
  };

  return (
    <AnimatedSection id="attendance" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div variants={fadeInUp}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {t('attendanceSection.badge')}
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-[#18080F] mb-6 leading-tight">
              {t('attendanceSection.title').split(' ').slice(0, -2).join(' ')} <br />
              <span className="text-blue-500">{t('attendanceSection.title').split(' ').slice(-2).join(' ')}</span>
            </h2>
            <p className="text-gray-500 text-lg mb-10 leading-relaxed">
              {t('attendanceSection.description')}
            </p>

            <div className="space-y-6 mb-10">
              {features.map((f, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center shrink-0 shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform`}>
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#18080F] mb-1">{f.title}</h4>
                    <p className="text-gray-500 text-sm">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/6283114227745"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
              >
                {t('attendanceSection.ctaSecondary')}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Right: Visual Preview */}
          <motion.div
            variants={fadeInUp}
            className="relative"
          >
            <div className="relative bg-blue-50 rounded-[3rem] p-8 lg:p-12 overflow-hidden">
              {/* Phone Mockup Placeholder */}
              <div className="relative mx-auto w-[280px] h-[560px] bg-[#18080F] rounded-[3rem] p-3 shadow-2xl border-4 border-gray-100">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="h-6 bg-white w-full" />
                  
                  {/* WA Interface Mockup */}
                  <div className="p-4 bg-[#075E54] text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1.5 overflow-hidden shadow-inner shrink-0">
                      <img src="/images/logo_simple.png" alt="OneTap" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold leading-none">OneTap Attendance</p>
                      <p className="text-[10px] opacity-70">Online</p>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4 bg-[#E5DDD5] h-full">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]"
                    >
                      <p className="text-[11px] font-bold text-blue-600 mb-1">{t('attendanceSection.mock.title')}</p>
                      <p className="text-[10px] text-gray-700 leading-relaxed">
                        {formatMessage(t('attendanceSection.mock.body1'))}
                      </p>
                      <p className="text-[9px] text-gray-400 mt-1 text-right">07:15</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 }}
                      className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]"
                    >
                      <p className="text-[11px] font-bold text-blue-600 mb-1">{t('attendanceSection.mock.title')}</p>
                      <p className="text-[10px] text-gray-700 leading-relaxed">
                        {formatMessage(t('attendanceSection.mock.body2'))}
                      </p>
                      <p className="text-[9px] text-gray-400 mt-1 text-right">07:20</p>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-20 right-4 bg-white p-4 rounded-2xl shadow-xl border border-blue-50 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{t('attendanceSection.mock.status')}</p>
                  <p className="text-sm font-bold">{t('attendanceSection.mock.connected')}</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute bottom-20 left-4 bg-white p-4 rounded-2xl shadow-xl border border-blue-50 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{t('attendanceSection.mock.response')}</p>
                  <p className="text-sm font-bold">&lt; 1 Second</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}
