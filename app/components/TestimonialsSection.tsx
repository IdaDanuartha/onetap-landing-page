"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import AnimatedSection, { fadeInUp } from "./AnimatedSection";

const testimonials = [
  {
    name: "Rina Kusuma",
    role: "Content Creator",
    rating: 5,
    text: "Keren banget! Langsung kasih ke klien dan mereka langsung bisa lihat portofolio saya. No drama, no aplikasi.",
  },
  {
    name: "Budi Santoso",
    role: "Sales Manager",
    rating: 5,
    text: "Pengganti kartu nama yang jauh lebih praktis. Sudah order 20 pcs untuk tim sales saya.",
  },
  {
    name: "Sari Dewi",
    role: "Mahasiswi",
    rating: 5,
    text: "Awalnya ragu, tapi begitu coba langsung jatuh cinta. Desainnya juga cakep banget!",
  },
  {
    name: "Andi Wijaya",
    role: "Event Organizer",
    rating: 5,
    text: "Kami pakai OneTap untuk badge peserta event. Feedback dari tamu sangat positif!",
  },
  {
    name: "Mega Putri",
    role: "Freelance Designer",
    rating: 5,
    text: "Harganya terjangkau tapi kualitasnya premium. Sudah saya rekomendasikan ke semua teman.",
  },
  {
    name: "Rizky Fauzan",
    role: "Entrepreneur",
    rating: 5,
    text: "Praktis, modern, dan bikin berkesan. Ini bukan sekadar keychain, ini statement!",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4 fill-current"
          style={{ color: "var(--color-primary)" }}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <AnimatedSection className="section bg-white-clean">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="text-center mb-14">
          <span className="badge-soft">Testimoni</span>
          <h2
            className="mt-4 text-3xl md:text-5xl font-bold"
            style={{ color: "var(--color-text-dark)" }}
          >
            Kata Mereka tentang{" "}
            <span className="gradient-text">OneTap</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="testimonial-card flex flex-col gap-4"
            >
              <StarRating count={t.rating} />
              <p
                className="text-sm leading-relaxed flex-1"
                style={{ color: "var(--color-text-body)" }}
              >
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                  style={{ background: "var(--color-primary)" }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "var(--color-text-dark)" }}
                  >
                    {t.name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
