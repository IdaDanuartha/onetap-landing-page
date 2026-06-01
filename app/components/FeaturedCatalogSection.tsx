"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "./catalog/ProductCard";
import { Product, mapDbProductToProduct } from "@/app/data/products";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function FeaturedCatalogSection() {
  const { t } = useLanguage();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("catalog_products")
          .select("*")
          .neq("status", "inactive")
          .order("status", { ascending: true })
          .order("is_best_seller", { ascending: false })
          .order("id", { ascending: true })
          .limit(4);

        if (error) throw error;
        if (data) {
          const mapped = data.map(mapDbProductToProduct);
          mapped.sort((a, b) => {
            const aComing = a.status === "coming_soon" ? 1 : 0;
            const bComing = b.status === "coming_soon" ? 1 : 0;
            return aComing - bComing;
          });
          setFeatured(mapped);
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  return (
    <section className="pb-20 bg-white" id="katalog">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF1F7] border border-[#F6B7C8] text-[#FF5FA2] text-sm font-semibold mb-5"
          >
            <Sparkles className="w-4 h-4" />
            {t('catalog.badge')}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl lg:text-5xl text-[#18080F] mb-4 font-extrabold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t('catalog.title')}{" "}
            <span className="bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] bg-clip-text text-transparent">
              {t('catalog.titleHighlight')}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-gray-500 text-lg max-w-xl mx-auto"
          >
            {t('catalog.subtitle')}
          </motion.p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-50 rounded-3xl border border-gray-100 animate-pulse flex items-center justify-center"
              >
                <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#FF5FA2] animate-spin" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border-2 border-[#FF5FA2] text-[#FF5FA2] font-bold text-sm hover:bg-[#FF5FA2] hover:text-white transition-all duration-200 hover:shadow-lg hover:shadow-[#FF5FA2]/25 hover:-translate-y-0.5"
          >
            {t('catalog.viewAll')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
