import { useState } from "react";
import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Starter",
    tag: null,
    price: "Free",
    period: "",
    description: "Perfect to get started and explore OneTap's core features.",
    border: "border-gray-200",
    buttonStyle: "border-2 border-[#FF5FA2] text-[#FF5FA2] hover:bg-[#FFF8F2]",
    isPrimary: false,
    features: [
      "1 Digital Profile",
      "Basic Link in Bio",
      "QR Code Generator",
      "10 Custom Links",
      "Basic Analytics",
      "Email Support",
    ],
  },
  {
    name: "Professional",
    tag: "Most Popular",
    price: "Rp 99K",
    period: "/month",
    description: "For professionals and creators who want full control of their identity.",
    border: "border-[#FF5FA2]",
    buttonStyle: "bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white shadow-lg shadow-[#FF5FA2]/25",
    isPrimary: true,
    features: [
      "3 Digital Profiles",
      "Custom Domain",
      "NFC Business Card",
      "Unlimited Links",
      "Advanced Analytics",
      "Priority Support",
      "Attendance Tracker",
      "Custom Branding",
    ],
  },
  {
    name: "Business",
    tag: null,
    price: "Rp 299K",
    period: "/month",
    description: "Built for teams and organizations that need scale and control.",
    border: "border-gray-200",
    buttonStyle: "border-2 border-[#FF5FA2] text-[#FF5FA2] hover:bg-[#FFF8F2]",
    isPrimary: false,
    features: [
      "Unlimited Profiles",
      "Team Dashboard",
      "Multi-location Attendance",
      "API Access",
      "Custom Integrations",
      "SSO & Admin Controls",
      "Dedicated Account Manager",
      "SLA Guarantee",
    ],
  },
];

export function OurProduct() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="products" className="py-24 lg:py-32 bg-[#FFF8F2]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#F6B7C8] text-[#FF5FA2] text-sm font-semibold mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5FA2]" />
            Our Products
          </div>
          <h2
            className="text-4xl lg:text-5xl text-[#18080F] mb-5"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
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
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative bg-white rounded-3xl border-2 ${plan.border} p-8 flex flex-col ${
                plan.isPrimary
                  ? "shadow-2xl shadow-[#FF5FA2]/15 scale-105"
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
                  className="text-lg text-[#18080F] mb-2"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                >
                  {plan.name}
                </h3>
                <p className="text-gray-500 text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-7">
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-4xl text-[#18080F]"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
                  >
                    {billing === "yearly" && plan.price !== "Free"
                      ? plan.name === "Professional"
                        ? "Rp 79K"
                        : "Rp 239K"
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

              <button
                className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${plan.buttonStyle}`}
              >
                {plan.price === "Free" ? "Get Started Free" : "Start Now"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
