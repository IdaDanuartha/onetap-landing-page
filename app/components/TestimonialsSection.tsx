"use client";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection, { fadeInUp } from "./AnimatedSection";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function TestimonialsSection() {
  const { t } = useLanguage();

  const testimonials = t('testimonials.items') as any[];
  const gradients = [
    "from-[#FF5FA2] to-[#FF8FC4]",
    "from-[#E8457E] to-[#FF5FA2]",
    "from-[#FF5FA2] to-[#F6B7C8]",
    "from-[#FF8FC4] to-[#E8457E]",
    "from-[#E8457E] to-[#FF8FC4]",
    "from-[#FF5FA2] to-[#E8457E]",
  ];

  return (
    <AnimatedSection id="testimonials" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF8F2] border border-[#F6B7C8] text-[#FF5FA2] text-sm font-semibold mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5FA2]" />
            {t('testimonials.badge')}
          </div>
          <h2
            className="text-4xl lg:text-5xl text-[#18080F] mb-5 font-extrabold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t('testimonials.title').split(' ').map((word: string, i: number) => 
              word.includes('50,000') ? (
                <span key={i} className="bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] bg-clip-text text-transparent"> {word} </span>
              ) : ` ${word} `
            )}
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            {t('testimonials.description')}
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((t_item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="break-inside-avoid p-7 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-[#FF5FA2]/8 hover:border-[#F6B7C8]/50 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Quote icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-[#F6B7C8]" fill="#FFF8F2" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400" fill="#FBBF24" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 leading-relaxed mb-6 text-[15px]">{t_item.text}</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center shrink-0`}
                >
                  <span className="text-white text-sm font-bold">{t_item.name.split(' ').map((n: string) => n[0]).join('')}</span>
                </div>
                <div>
                  <div
                    className="text-[#18080F] text-sm font-bold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {t_item.name}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {t_item.role} · {t_item.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Overall rating */}
        <motion.div variants={fadeInUp} className="text-center mt-14">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#FFF8F2] border border-[#F6B7C8]/50">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400" fill="#FBBF24" />
              ))}
            </div>
            <span className="text-[#E8457E] font-semibold text-sm">{t('testimonials.rating')}</span>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
