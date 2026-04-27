"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import AnimatedSection, { fadeInUp } from "./AnimatedSection";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const faqs = [
  {
    q: "Apa itu NFC keychain OneTap?",
    a: "NFC keychain OneTap adalah aksesori berbentuk gantungan kunci yang dilengkapi chip NFC. Cukup tempelkan ke smartphone, dan orang lain bisa langsung mengakses link atau info yang Anda simpan.",
  },
  {
    q: "Apakah perlu aplikasi khusus untuk menggunakannya?",
    a: "Tidak perlu aplikasi apapun! Semua smartphone Android dan iPhone modern sudah mendukung NFC bawaan.",
  },
  {
    q: "Berapa lama proses produksi?",
    a: "Estimasi produksi 3–7 hari kerja setelah desain dan pembayaran dikonfirmasi. Pengiriman ke seluruh Indonesia.",
  },
  {
    q: "Apakah bisa custom desain sepenuhnya?",
    a: "Tentu! Kami menerima desain custom sesuai keinginan Anda — logo, warna, ukuran, bahkan bentuk khusus tersedia di paket Custom Edition.",
  },
  {
    q: "Berapa harga minimum order?",
    a: "Mulai dari Rp 25.000 untuk Basic Keychain dan Rp 45.000 untuk NFC Keychain. Untuk bulk order 10 pcs ke atas ada diskon khusus.",
  },
  {
    q: "Apakah data di chip NFC bisa diubah?",
    a: "Ya! Data yang tersimpan di chip bisa diubah kapan saja melalui platform kami tanpa perlu mengganti fisik keychain.",
  },
  {
    q: "Bagaimana cara order?",
    a: "Cukup klik tombol 'Order via WhatsApp', nanti tim kami akan membantu Anda memilih produk, mengirim desain, dan mengkonfirmasi pembayaran.",
  },
  {
    q: "Apakah ada garansi produk?",
    a: "Ya, kami memberikan garansi 30 hari untuk cacat produksi. Jika ada masalah, kami ganti tanpa biaya tambahan.",
  },
];

// Note: In a real app, you'd translate the FAQ list too. 
// For now, I'll translate the section header.

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <button
        className="faq-question w-full text-left"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown
            className="w-5 h-5"
            style={{ color: "var(--color-primary)" }}
          />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="faq-answer">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <AnimatedSection className="section bg-page">
      <div className="max-w-3xl mx-auto">
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <span className="badge-soft">{t('faq.badge')}</span>
          <h2
            className="mt-4 text-3xl md:text-4xl font-bold"
            style={{ color: "var(--color-text-dark)" }}
          >
            {t('faq.title')}
          </h2>
        </motion.div>

        <motion.div variants={fadeInUp} className="flex flex-col gap-3">
          {faqs.map((item, i) => (
            <FAQItem 
              key={i} 
              q={item.q} 
              a={item.a} 
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
