import { GraduationCap, ArrowRight, BookOpen, Users2, ClipboardCheck } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const eduFeatures = [
  {
    icon: ClipboardCheck,
    title: "Automated Attendance",
    description: "Students tap their NFC card or scan QR at the door — attendance recorded instantly.",
  },
  {
    icon: Users2,
    title: "Class Management",
    description: "Track attendance per subject, per teacher, and per semester with a single dashboard.",
  },
  {
    icon: BookOpen,
    title: "Student Digital Profiles",
    description: "Students carry their academic portfolio, club activities, and achievements digitally.",
  },
];

const stats = [
  { value: "500+", label: "Schools & Campuses" },
  { value: "2M+", label: "Student Taps / Month" },
  { value: "98%", label: "Accuracy Rate" },
];

export function ForEducation() {
  return (
    <section className="py-24 lg:py-32 bg-[#FFF8F2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#F6B7C8] text-[#FF5FA2] text-sm font-semibold mb-5">
            <GraduationCap className="w-4 h-4" />
            For Education
          </div>
          <h2
            className="text-4xl lg:text-5xl text-[#18080F] mb-5"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
          >
            Transforming campuses{" "}
            <span className="bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] bg-clip-text text-transparent">
              with smart tech
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            OneTap's education suite makes attendance, student ID, and campus life seamlessly digital.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#FF5FA2]/10 to-[#F6B7C8]/15 rounded-3xl blur-2xl" />
            <div className="relative rounded-3xl overflow-hidden border border-[#F6B7C8]/30 shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1551402991-6e4b5fc0b01c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGVkdWNhdGlvbiUyMGRpZ2l0YWwlMjB0YWJsZXQlMjBjbGFzc3Jvb218ZW58MXx8fHwxNzc4MTQ4OTg5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Education Technology"
                className="w-full h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#18080F]/50 via-transparent to-transparent" />
            </div>

            {/* Floating attendance card */}
            <div className="absolute bottom-8 left-6 right-6 bg-white rounded-2xl shadow-2xl p-5 border border-[#F6B7C8]/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#18080F] text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  Today's Attendance
                </span>
                <span className="text-[#FF5FA2] text-xs font-semibold bg-[#FFF8F2] px-2 py-1 rounded-lg border border-[#F6B7C8]/50">Live</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-[#FFF8F2] rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] rounded-full" style={{ width: "87%" }} />
                </div>
                <span className="text-[#18080F] text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>87%</span>
              </div>
              <div className="text-gray-400 text-xs mt-1.5">43 of 50 students present</div>
            </div>
          </div>

          {/* Right: Features */}
          <div className="order-1 lg:order-2">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {stats.map((s, i) => (
                <div key={i} className="text-center p-4 rounded-2xl bg-white border border-[#F6B7C8]/40 shadow-sm">
                  <div
                    className="text-2xl text-[#FF5FA2] mb-1"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
                  >
                    {s.value}
                  </div>
                  <div className="text-gray-500 text-xs">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-10">
              {eduFeatures.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#F6B7C8]/30 shadow-sm hover:shadow-md hover:border-[#FF5FA2]/30 transition-all duration-200">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF5FA2] to-[#E8457E] flex items-center justify-center shrink-0 shadow-lg shadow-[#FF5FA2]/20">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3
                        className="text-[#18080F] mb-1"
                        style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                      >
                        {f.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white font-semibold shadow-lg shadow-[#FF5FA2]/25 hover:shadow-[#FF5FA2]/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                Explore Education Plan
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-[#F6B7C8] text-[#FF5FA2] font-semibold hover:bg-[#FFF8F2] transition-all duration-200"
              >
                Request Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
