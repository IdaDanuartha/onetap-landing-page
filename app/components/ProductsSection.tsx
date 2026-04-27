"use client";
import { motion } from "framer-motion";
import AnimatedSection, { fadeInUp } from "./AnimatedSection";
import ProductCard from "./ProductCard";
import { products } from "@/lib/products";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ProductsSection() {
  // Show only 3 popular/featured products on homepage
  const featuredProducts = products.filter(p => p.slug !== 'event-badge-nfc').slice(0, 3);

  return (
    <AnimatedSection className="section bg-white-clean" id="products">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-14">
          <span className="badge-soft">Produk Kami</span>
          <h2
            className="mt-4 text-3xl md:text-5xl font-bold"
            style={{ color: "var(--color-text-dark)" }}
          >
            Pilihan <span className="gradient-text">Tepat</span> untuk Anda
          </h2>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
            Berbagai pilihan keychain dan kartu nama NFC untuk mendukung identitas digital Anda.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Catalog Link */}
        <motion.div variants={fadeInUp} className="mt-16 text-center">
            <Link 
                href="/catalog" 
                className="btn-secondary group"
            >
                Lihat Seluruh Katalog
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
