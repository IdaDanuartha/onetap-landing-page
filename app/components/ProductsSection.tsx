"use client";

import { useState } from "react";
import { Check, Star, ArrowRight, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import AnimatedSection, { fadeInUp } from "./AnimatedSection";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { PlanId } from "@/lib/plans";

export default function ProductsSection() {
  const { t } = useLanguage();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      id: "starter" as PlanId,
      name: t('products.plans.starter.name'),
      tag: null,
      price: t('products.plans.starter.price.monthly'),
      yearlyPrice: t('products.plans.starter.price.yearly'),
      originalPrice: null,
      originalYearlyPrice: null,
      period: "",
      description: t('products.plans.starter.desc'),
      border: "border-gray-200",
      buttonStyle: "bg-[#FF5FA2] text-white shadow-md shadow-[#FF5FA2]/15 hover:bg-[#E8457E]",
      isPrimary: false,
      features: t('products.plans.starter.features') as unknown as string[],
    },
    {
      id: "professional" as PlanId,
      name: t('products.plans.professional.name'),
      tag: t('products.plans.professional.tag'),
      price: t('products.plans.professional.price.monthly'),
      yearlyPrice: t('products.plans.professional.price.yearly'),
      originalPrice: t('products.plans.professional.price.originalMonthly'),
      originalYearlyPrice: t('products.plans.professional.price.originalYearly'),
      period: "/bulan",
      description: t('products.plans.professional.desc'),
      border: "border-[#FF5FA2]",
      buttonStyle: "bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white shadow-lg shadow-[#FF5FA2]/25",
      isPrimary: true,
      features: t('products.plans.professional.features') as unknown as string[],
    },
    {
      id: "education" as PlanId,
      name: t('products.plans.education.name'),
      tag: null,
      price: t('products.plans.education.price.monthly'),
      yearlyPrice: t('products.plans.education.price.yearly'),
      originalPrice: t('products.plans.education.price.originalMonthly'),
      originalYearlyPrice: t('products.plans.education.price.originalYearly'),
      period: "/bulan",
      description: t('products.plans.education.desc'),
      border: "border-gray-200",
      buttonStyle: "bg-[#FF5FA2] text-white shadow-md shadow-[#FF5FA2]/15 hover:bg-[#E8457E]",
      isPrimary: false,
      features: t('products.plans.education.features') as unknown as string[],
    },
  ];

  return (
    <AnimatedSection id="pricing" className="py-24 lg:py-32 bg-[#FFF8F2]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#F6B7C8] text-[#FF5FA2] text-sm font-semibold mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5FA2]" />
            {t('products.badge')}
          </div>
          <h2
            className="text-4xl lg:text-5xl text-[#18080F] mb-5 font-extrabold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t('products.title').split(' ').slice(0, -1).join(' ')}{" "}
            <span className="bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] bg-clip-text text-transparent">
              {t('products.title').split(' ').pop()}
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            {t('products.description')}
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-1 mt-8 p-1 rounded-xl bg-white border border-[#F6B7C8]/50 shadow-sm">
            {(["monthly", "yearly"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  billing === b
                    ? "bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white shadow-md shadow-[#FF5FA2]/20"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {b === "monthly" ? t('products.billing.monthly') : t('products.billing.yearly')}{" "}
                {b === "yearly" && (
                  <span className={`text-xs ml-1 font-bold ${billing === b ? "text-white/90" : "text-emerald-500"}`}>
                    -20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className={`relative bg-white rounded-3xl border-2 ${plan.border} p-8 flex flex-col ${
                plan.isPrimary
                  ? "shadow-2xl shadow-[#FF5FA2]/15 scale-105 z-10"
                  : "shadow-sm"
              }`}
            >
              {/* Popular Badge */}
              {plan.tag && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white text-xs font-bold shadow-lg shadow-[#FF5FA2]/30">
                    <Star className="w-3 h-3 fill-white" />
                    {plan.tag}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className="text-lg text-[#18080F] mb-2 font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {plan.name}
                </h3>
                <p className="text-gray-500 text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-7">
                <div className="flex items-baseline flex-wrap gap-1">
                  {(billing === "yearly" ? plan.originalYearlyPrice : plan.originalPrice) && (
                    <span className="text-gray-400 text-lg line-through font-medium mr-1">
                      {billing === "yearly" ? plan.originalYearlyPrice : plan.originalPrice}
                    </span>
                  )}
                  <span
                    className="text-4xl text-[#18080F] font-extrabold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {billing === "yearly" ? plan.yearlyPrice : plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-400 text-sm">{plan.period}</span>
                  )}
                </div>
                {billing === "yearly" && plan.id !== "starter" && (
                  <p className="text-emerald-500 text-xs mt-1 font-medium">{t('products.billing.save')}</p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8 flex-1">
                {Array.isArray(plan.features) ? plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#FFF8F2] border border-[#F6B7C8] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#FF5FA2]" />
                    </div>
                    <span className="text-gray-600 text-[14px] leading-[20px]">{f}</span>
                  </li>
                )) : null}
              </ul>

              <Link
                href={plan.id === "starter" ? "/auth/register" : `/checkout?plan=${plan.id}&cycle=${billing}`}
                className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 ${plan.buttonStyle}`}
              >
                {plan.id === "starter" ? (
                  t('products.cta.free')
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    {t('products.cta.paid')}
                  </>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
