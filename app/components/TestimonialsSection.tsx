"use client";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection, { fadeInUp } from "./AnimatedSection";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function TestimonialsSection() {
  const { t } = useLanguage();

  const testimonials = t('testimonials.items') as any[];
  
  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <AnimatedSection id="testimonials" className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center">
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
      </div>

      {/* Testimonials Marquee Container */}
      <div className="relative group">
        {/* Left and Right Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-64 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-64 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

        <div className="flex overflow-hidden py-10">
          <div className="flex gap-6 animate-marquee">
            {duplicatedTestimonials.map((t_item, i) => (
              <div
                key={i}
                className="w-[350px] md:w-[420px] shrink-0 p-8 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:shadow-[#FF5FA2]/5 hover:border-[#F6B7C8]/40 transition-all duration-300"
              >
                {/* Stars & Quote */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-amber-400" fill="#FBBF24" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#F6B7C8]/20" fill="currentColor" />
                </div>

                {/* Text */}
                <p className="text-gray-600 leading-relaxed mb-8 text-[15px] italic line-clamp-4">
                  "{t_item.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 border-t border-gray-50 pt-6">
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-md shadow-gray-200 shrink-0 border border-gray-100">
                    <img 
                      src={`https://i.pravatar.cc/150?u=${t_item.name}`} 
                      alt={t_item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div
                      className="text-[#18080F] text-[15px] font-bold truncate"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {t_item.name}
                    </div>
                    <div className="text-gray-400 text-xs truncate">
                      {t_item.role} · {t_item.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {duplicatedTestimonials.map((t_item, i) => (
              <div
                key={`dup-${i}`}
                className="w-[350px] md:w-[420px] shrink-0 p-8 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:shadow-[#FF5FA2]/5 hover:border-[#F6B7C8]/40 transition-all duration-300"
              >
                {/* Stars & Quote */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-amber-400" fill="#FBBF24" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#F6B7C8]/20" fill="currentColor" />
                </div>

                {/* Text */}
                <p className="text-gray-600 leading-relaxed mb-8 text-[15px] italic line-clamp-4">
                  "{t_item.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 border-t border-gray-50 pt-6">
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-md shadow-gray-200 shrink-0 border border-gray-100">
                    <img 
                      src={`https://i.pravatar.cc/150?u=${t_item.name}`} 
                      alt={t_item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div
                      className="text-[#18080F] text-[15px] font-bold truncate"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {t_item.name}
                    </div>
                    <div className="text-gray-400 text-xs truncate">
                      {t_item.role} · {t_item.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 80s linear infinite;
          width: max-content;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Overall rating */}
        <motion.div variants={fadeInUp} className="text-center mt-14">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#FFF8F2] border border-[#F6B7C8]/50 shadow-sm">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400" fill="#FBBF24" />
              ))}
            </div>
            <span className="text-[#E8457E] font-bold text-sm uppercase tracking-wide">{t('testimonials.rating')}</span>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
