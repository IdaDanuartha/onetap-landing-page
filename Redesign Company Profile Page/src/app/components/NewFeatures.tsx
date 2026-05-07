import { Sparkles, Link2, BarChart3, Bell, QrCode, Layers } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const features = [
  {
    icon: Link2,
    title: "Smart Bio Links",
    description: "Add unlimited links with custom icons, animations, and click-tracking analytics.",
  },
  {
    icon: BarChart3,
    title: "Live Analytics",
    description: "See who viewed your profile, where they came from, and which links they clicked.",
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    description: "Get real-time alerts whenever someone taps your card or views your profile.",
  },
  {
    icon: QrCode,
    title: "Dynamic QR Codes",
    description: "QR codes that update with your profile — no reprinting ever needed again.",
  },
  {
    icon: Layers,
    title: "Portfolio Showcase",
    description: "Embed images, videos, and documents directly into your digital profile.",
  },
];

export function NewFeatures() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF8F2] border border-[#F6B7C8] text-[#FF5FA2] text-sm font-semibold mb-5">
            <Sparkles className="w-4 h-4" />
            New Features
          </div>
          <h2
            className="text-4xl lg:text-5xl text-[#18080F] mb-5"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
          >
            Powerful new tools,{" "}
            <span className="bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] bg-clip-text text-transparent">
              just for you
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            We're constantly shipping new features to keep your digital presence ahead of the curve.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Feature list */}
          <div className="space-y-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="group flex items-start gap-5 p-5 rounded-2xl hover:bg-[#FFF8F2] transition-all duration-200 cursor-pointer border border-transparent hover:border-[#F6B7C8]/60"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF5FA2] to-[#E8457E] flex items-center justify-center shrink-0 shadow-lg shadow-[#FF5FA2]/20 group-hover:shadow-[#FF5FA2]/35 transition-shadow">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3
                      className="text-[#18080F] mb-1.5"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                    >
                      {f.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
                  </div>
                </div>
              );
            })}

            <div className="pl-5">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-[#FF5FA2] font-semibold hover:gap-3 transition-all duration-200"
              >
                See all features →
              </a>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            {/* Background accent */}
            <div className="absolute -inset-4 bg-gradient-to-br from-[#FF5FA2]/10 to-[#F6B7C8]/15 rounded-3xl blur-2xl" />

            <div className="relative rounded-3xl overflow-hidden border border-[#F6B7C8]/30 shadow-2xl shadow-[#FF5FA2]/10">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1764406562219-105937cc3f95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBwcm9kdWN0JTIwc2hvd2Nhc2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3ODE0ODk4OXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="New Features Preview"
                className="w-full h-[500px] object-cover"
              />
              {/* Overlay with feature chips */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#18080F]/80 via-transparent to-transparent flex flex-col justify-end p-7">
                <div className="flex flex-wrap gap-2">
                  {["Smart Links", "QR Codes", "Analytics", "NFC", "Portfolio", "Notifications"].map((chip) => (
                    <span
                      key={chip}
                      className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-[#FF5FA2]/30 text-white text-xs font-medium"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating update badge */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-br from-[#FF5FA2] to-[#E8457E] rounded-2xl px-4 py-3 shadow-xl shadow-[#FF5FA2]/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white text-xs font-bold">v1.0.0 Released</span>
              </div>
              <div className="text-white/70 text-xs mt-0.5">May 2026</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
