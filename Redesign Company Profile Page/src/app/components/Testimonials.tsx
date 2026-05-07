import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Andi Pratama",
    role: "Marketing Manager",
    company: "Tokopedia",
    avatar: "AP",
    avatarGradient: "from-[#FF5FA2] to-[#FF8FC4]",
    rating: 5,
    text: "OneTap completely changed how I network at events. One tap and my full profile is shared — no more fumbling for business cards. The analytics showing who viewed my profile is a game changer.",
  },
  {
    name: "Sarah Wijaya",
    role: "Founder & CEO",
    company: "Kreativa Studio",
    avatar: "SW",
    avatarGradient: "from-[#E8457E] to-[#FF5FA2]",
    rating: 5,
    text: "I set up our team's attendance system in one afternoon. The tap-to-check-in feature saves us so much time and the reports are incredibly detailed. OneTap is the smartest investment we've made.",
  },
  {
    name: "Dr. Budi Santoso",
    role: "Vice Rector",
    company: "Universitas Indonesia",
    avatar: "BS",
    avatarGradient: "from-[#FF5FA2] to-[#F6B7C8]",
    rating: 5,
    text: "We deployed OneTap across 12 faculties and 8,000 students. The integration was smooth and the attendance accuracy improved from 70% to 98%. Absolutely outstanding.",
  },
  {
    name: "Rizky Mahendra",
    role: "Freelance Designer",
    company: "Independent",
    avatar: "RM",
    avatarGradient: "from-[#FF8FC4] to-[#E8457E]",
    rating: 5,
    text: "My OneTap profile IS my portfolio now. Clients tap my card, see my work, my rates, and book me — all in one place. My conversion rate has literally doubled since switching.",
  },
  {
    name: "Maya Kusuma",
    role: "HR Director",
    company: "Bank Mandiri",
    avatar: "MK",
    avatarGradient: "from-[#E8457E] to-[#FF8FC4]",
    rating: 5,
    text: "Managing 2,000 employees' digital profiles and attendance from one dashboard used to sound like a dream. With OneTap Business, it's our daily reality now.",
  },
  {
    name: "Kevin Tanoto",
    role: "Event Organizer",
    company: "Neo Events",
    avatar: "KT",
    avatarGradient: "from-[#FF5FA2] to-[#E8457E]",
    rating: 5,
    text: "For conferences, OneTap is unbeatable. Attendees tap to check in, share contacts, and access event info. We replaced a 3-app stack with just OneTap.",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF8F2] border border-[#F6B7C8] text-[#FF5FA2] text-sm font-semibold mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5FA2]" />
            Testimonials
          </div>
          <h2
            className="text-4xl lg:text-5xl text-[#18080F] mb-5"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
          >
            Trusted by{" "}
            <span className="bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] bg-clip-text text-transparent">
              50,000+ users
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            From solopreneurs to enterprise teams — hear what people are saying about OneTap.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="break-inside-avoid p-7 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-[#FF5FA2]/8 hover:border-[#F6B7C8]/50 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Quote icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-[#F6B7C8]" fill="#FFF8F2" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400" fill="#FBBF24" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 leading-relaxed mb-6 text-[15px]">{t.text}</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarGradient} flex items-center justify-center shrink-0`}
                >
                  <span className="text-white text-sm font-bold">{t.avatar}</span>
                </div>
                <div>
                  <div
                    className="text-[#18080F] text-sm"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                  >
                    {t.name}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {t.role} · {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall rating */}
        <div className="text-center mt-14">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#FFF8F2] border border-[#F6B7C8]/50">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400" fill="#FBBF24" />
              ))}
            </div>
            <span className="text-[#E8457E] font-semibold text-sm">4.9 / 5 from 2,000+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}
