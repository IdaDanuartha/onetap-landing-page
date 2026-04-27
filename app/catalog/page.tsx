"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FloatingWA from "../components/FloatingWA";
import ProductCard from "../components/ProductCard";
import { products } from "@/lib/products";
import { Search } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function CatalogPage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>(t('catalog.all'));
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [t('catalog.all'), t('catalog.personal'), t('catalog.business'), t('catalog.event')];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === t('catalog.all') || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, t]);

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Header />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold" style={{ color: "var(--color-text-dark)" }}>
              {t('catalog.title').split(' ')[0]} <span className="gradient-text">{t('catalog.title').split(' ')[1]}</span>
            </h1>
            <p className="mt-4 text-lg max-w-2xl" style={{ color: "var(--color-text-muted)" }}>
              {t('catalog.description')}
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-6 mb-12 items-start md:items-center justify-between">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    activeCategory === cat
                      ? "btn-primary"
                      : "bg-white border border-gray-200 text-gray-500 hover:border-pink-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('catalog.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all text-sm"
              />
            </div>
          </div>

          {/* Grid */}
          <AnimatePresence mode="popLayout">
            {filteredProducts.length > 0 ? (
              <motion.div 
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{t('catalog.noFound')}</h3>
                <p className="text-gray-500 mt-2">{t('catalog.search')}</p>
                <button 
                  onClick={() => {setActiveCategory(t('catalog.all')); setSearchQuery("");}}
                  className="mt-6 text-pink-500 font-semibold hover:underline"
                >
                  {t('catalog.reset')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
      <FloatingWA />
    </div>
  );
}
