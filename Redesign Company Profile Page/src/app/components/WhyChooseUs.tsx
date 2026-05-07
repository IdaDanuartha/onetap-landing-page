import { Zap, Shield, BarChart3, Smartphone, Globe2, HeadphonesIcon } from "lucide-react";

const features = [
  {
    icon: Zap,
    gradient: "from-[#FF5FA2] to-[#FF8FC4]",
    bg: "bg-[#FFF8F2]",
    title: "Instant Setup",
    description: "Go live in minutes. No technical skills needed — just tap, configure, and share your digital identity with the world.",
  },
  {
    icon: Shield,
    gradient: "from-[#E8457E] to-[#FF5FA2]",
    bg: "bg-[#FFF8F2]",
    title: "Enterprise Security",
    description: "Bank-grade encryption and privacy controls ensure your data and your team's attendance records stay protected.",
  },
  {
    icon: BarChart3,
    gradient: "from-[#FF5FA2] to-[#F6B7C8]",
    bg: "bg-[#FFF8F2]",
    title: "Smart Analytics",
    description: "Real-time dashboard with deep insights on profile views, tap counts, link clicks, and attendance trends.",
  },
  {
    icon: Smartphone,
    gradient: "from-[#FF8FC4] to-[#FF5FA2]",
    bg: "bg-[#FFF8F2]",
    title: "Works Everywhere",
    description: "NFC, QR code, and direct link — your profile works on every device, every OS, without any app install.",
  },
  {
    icon: Globe2,
    gradient: "from-[#E8457E] to-[#F6B7C8]",
    bg: "bg-[#FFF8F2]",
    title: "Custom Domain",
    description: "Use your own branded domain or our smart links. Your digital presence, fully customized to your brand identity.",
  },
  {
    icon: HeadphonesIcon,
    gradient: "from-[#FF5FA2] to-[#E8457E]",
    bg: "bg-[#FFF8F2]",
    title: "24/7 Support",
    description: "Dedicated support team ready to help you anytime. Priority assistance for teams and enterprise accounts.",
  },
];

export function WhyChooseUs() {
  return (
    <section id="why" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF8F2] border border-[#F6B7C8] text-[#FF5FA2] text-sm font-semibold mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5FA2]" />
            Why OneTap
          </div>
          <h2
            className="text-4xl lg:text-5xl text-[#18080F] mb-5"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
          >
            Why thousands choose{" "}
            <span className="bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] bg-clip-text text-transparent">
              OneTap
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            More than just a digital card — OneTap is a complete digital identity ecosystem built for the modern professional.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="group relative p-7 rounded-2xl border border-gray-100 hover:border-[#F6B7C8] bg-white hover:shadow-xl hover:shadow-[#FF5FA2]/8 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg shadow-[#FF5FA2]/20`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3
                  className="text-lg text-[#18080F] mb-2.5"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                >
                  {f.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>

                {/* Hover accent line */}
                <div className={`absolute bottom-0 left-7 right-7 h-0.5 rounded-full bg-gradient-to-r ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
