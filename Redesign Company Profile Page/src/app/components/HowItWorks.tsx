import { MousePointerClick, Palette, Share2, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MousePointerClick,
    title: "Create Your Account",
    description:
      "Sign up in seconds. Choose your plan, pick your unique URL, and claim your OneTap identity instantly.",
    gradient: "from-[#FF5FA2] to-[#FF8FC4]",
  },
  {
    number: "02",
    icon: Palette,
    title: "Customize Your Profile",
    description:
      "Design your profile page with your brand colors, photo, bio, links, and social media — everything in one place.",
    gradient: "from-[#E8457E] to-[#FF5FA2]",
  },
  {
    number: "03",
    icon: Share2,
    title: "Share & Connect",
    description:
      "Share via your NFC card tap, QR code scan, or direct link. Start building meaningful connections in the real world.",
    gradient: "from-[#FF5FA2] to-[#F6B7C8]",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF8F2] border border-[#F6B7C8] text-[#FF5FA2] text-sm font-semibold mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5FA2]" />
            How It Works
          </div>
          <h2
            className="text-4xl lg:text-5xl text-[#18080F] mb-5"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
          >
            Up and running in{" "}
            <span className="bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] bg-clip-text text-transparent">
              3 simple steps
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            No technical setup, no complicated onboarding. Start sharing your digital identity in minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-20 left-[calc(16.67%-20px)] right-[calc(16.67%-20px)] h-px bg-gradient-to-r from-[#FF5FA2]/20 via-[#FF5FA2]/50 to-[#F6B7C8]/30" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative flex flex-col items-center lg:items-start text-center lg:text-left">
                  {/* Step icon */}
                  <div className="relative mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl shadow-[#FF5FA2]/25`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#18080F] flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{i + 1}</span>
                    </div>
                  </div>

                  {/* Large step number (decorative) */}
                  <div
                    className="text-7xl text-[#FFF8F2] mb-3 leading-none"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 900 }}
                  >
                    {step.number}
                  </div>

                  <h3
                    className="text-xl text-[#18080F] mb-3 -mt-8"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">{step.description}</p>

                  {i < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-4">
                      <ArrowRight className="w-6 h-6 text-[#F6B7C8] rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white font-semibold shadow-xl shadow-[#FF5FA2]/25 hover:shadow-[#FF5FA2]/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            Start Your Journey
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
