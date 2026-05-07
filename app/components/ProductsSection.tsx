"use client";

import { useState } from "react";
import { Check, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection, { fadeInUp } from "./AnimatedSection";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ProductsSection() {
  const { t } = useLanguage();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Starter",
      tag: null,
      price: "Free",
      period: "",
      description: "Sempurna untuk memulai profil digital pertamamu.",
      border: "border-gray-200",
      buttonStyle: "border-2 border-[#FF5FA2] text-[#FF5FA2] hover:bg-[#FFF8F2]",
      isPrimary: false,
      features: [
        "1 Digital Profile (Slug)",
        "Custom Links & Socials",
        "QR Code Generator",
        "Basic Analytics",
        "Standard Themes",
        "Email Support",
      ],
    },
    {
      name: "Professional",
      tag: "Paling Populer",
      price: "Rp 49K",
      period: "/bulan",
      description: "Untuk profesional yang ingin kontrol penuh dengan NFC.",
      border: "border-[#FF5FA2]",
      buttonStyle: "bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white shadow-lg shadow-[#FF5FA2]/25",
      isPrimary: true,
      features: [
        "3 Digital Profiles (Multi-Slug)",
        "Koneksi Kartu NFC OneTap",
        "Advanced Analytics",
        "Priority Support",
        "Attendance Tracker (Absensi)",
        "Custom Branding (Hapus Logo)",
        "Bio Video & Music Player",
        "Password Protected Links",
      ],
    },
    {
      name: "Business",
      tag: null,
      price: "Rp 99K",
      period: "/bulan",
      description: "Solusi lengkap untuk tim dan manajemen absensi lokasi.",
      border: "border-gray-200",
      buttonStyle: "border-2 border-[#FF5FA2] text-[#FF5FA2] hover:bg-[#FFF8F2]",
      isPrimary: false,
      features: [
        "Unlimited Digital Profiles",
        "Team Management Dashboard",
        "Multi-location Attendance Tracking",
        "Export Data Excel/CSV",
        "API Access & Webhooks",
        "Dedicated Account Manager",
        "Custom Domain Support",
        "SLA Guarantee 99.9%",
      ],
    },
  ];

  return (
    <AnimatedSection id="products" className="py-24 lg:py-32 bg-[#FFF8F2]">
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
            Simple, transparent{" "}
            <span className="bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] bg-clip-text text-transparent">
              pricing
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Start free, scale when you're ready. No hidden fees, cancel anytime.
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
                {b === "monthly" ? "Monthly" : "Yearly"}{" "}
                {b === "yearly" && <span className="text-xs text-emerald-400 ml-1">-20%</span>}
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
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-4xl text-[#18080F] font-extrabold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {billing === "yearly" && plan.price !== "Free"
                      ? plan.name === "Professional"
                        ? "Rp 39K"
                        : "Rp 79K"
                      : plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-400 text-sm">{plan.period}</span>
                  )}
                </div>
                {billing === "yearly" && plan.price !== "Free" && (
                  <p className="text-emerald-500 text-xs mt-1 font-medium">Save 20% annually</p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#FFF8F2] border border-[#F6B7C8] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#FF5FA2]" />
                    </div>
                    <span className="text-gray-600 text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="https://wa.me/6281234567890"
                className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 text-center ${plan.buttonStyle}`}
              >
                {plan.price === "Free" ? "Get Started Free" : "Start Now"}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Catalog Link */}
        <motion.div variants={fadeInUp} className="mt-16 text-center">
            <a 
                href="/catalog" 
                className="inline-flex items-center gap-2.5 text-[#FF5FA2] font-semibold hover:gap-3 transition-all duration-200 group"
            >
                {t('products.viewAll')}
                <ArrowRight className="w-4 h-4" />
            </a>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
