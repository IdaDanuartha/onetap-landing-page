"use client";
import { motion } from "framer-motion";
import { User, Briefcase, PartyPopper, Lock } from "lucide-react";
import AnimatedSection, { fadeInUp, scaleIn } from "./AnimatedSection";

const useCases = [
  {
    icon: User,
    title: "Personal Branding",
    description: "Bagikan profil profesional dengan sentuhan elegan",
  },
  {
    icon: Briefcase,
    title: "Business Networking",
    description: "Kartu nama digital yang tidak akan pernah hilang",
  },
  {
    icon: PartyPopper,
    title: "Event & Conference",
    description: "Badge peserta dengan akses informasi event instant",
  },
  {
    icon: Lock,
    title: "Private File",
    description: "Simpan link dokumen penting dengan proteksi password",
  },
];

export default function UseCasesSection() {
  return (
    <AnimatedSection className="section bg-page">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="text-center mb-14">
          <span className="badge-soft">Use Cases</span>
          <h2
            className="mt-4 text-3xl md:text-5xl font-bold"
            style={{ color: "var(--color-text-dark)" }}
          >
            Cocok untuk{" "}
            <span className="gradient-text">Berbagai</span> Kebutuhan
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((u, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              whileHover={{ scale: 1.05, y: -4 }}
              className="p-6 rounded-2xl text-center cursor-pointer group transition-all"
              style={{
                background: "var(--color-bg-white)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: "var(--color-primary-light)" }}
              >
                <u.icon
                  className="w-7 h-7"
                  style={{ color: "var(--color-primary)" }}
                />
              </div>
              <h3
                className="font-semibold text-base"
                style={{ color: "var(--color-text-dark)" }}
              >
                {u.title}
              </h3>
              <p
                className="mt-2 text-xs leading-relaxed"
                style={{ color: "var(--color-text-muted)" }}
              >
                {u.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
