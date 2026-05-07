import { ArrowRight, Zap } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #18080F 0%, #2D1020 50%, #18080F 100%)" }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      {/* Glow blobs */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#FF5FA2] rounded-full opacity-15 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-[#F6B7C8] rounded-full opacity-10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-[#E8457E] rounded-full opacity-8 blur-[100px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF5FA2] to-[#E8457E] items-center justify-center mb-8 shadow-2xl shadow-[#FF5FA2]/40">
          <Zap className="w-8 h-8 text-white" fill="white" />
        </div>

        <h2
          className="text-4xl lg:text-6xl text-white mb-6 leading-tight"
          style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
        >
          Ready to make your
          <br />
          <span className="bg-gradient-to-r from-[#F6B7C8] via-[#FF5FA2] to-[#FFF8F2] bg-clip-text text-transparent">
            first tap?
          </span>
        </h2>

        <p className="text-[#F6B7C8]/80 text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Join 50,000+ professionals, creators, and organizations who are already living the OneTap life. Start free — no credit card required.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <a
            href="#"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-[#FF5FA2] font-bold shadow-2xl hover:shadow-white/20 hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Started for Free
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-200"
          >
            Talk to Sales
          </a>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-[#F6B7C8]/60 text-sm">
          {[
            "✓ Free 14-day trial",
            "✓ No credit card needed",
            "✓ Cancel anytime",
            "✓ Setup in 5 minutes",
          ].map((item, i) => (
            <span key={i} className="font-medium">{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
