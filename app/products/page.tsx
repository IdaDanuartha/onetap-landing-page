"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronRight, Package } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/catalog/ProductCard";
import { Product, mapDbProductToProduct, formatPrice } from "@/app/data/products";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ProductSidebarProps {
  search: string;
  setSearch: (val: string) => void;
  selectedSizes: string[];
  toggleSize: (size: string) => void;
  minPrice: number | null;
  setMinPrice: (val: number | null) => void;
  maxPrice: number | null;
  setMaxPrice: (val: number | null) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

function ProductSidebar({
  search,
  setSearch,
  selectedSizes,
  toggleSize,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  hasActiveFilters,
  clearFilters,
}: ProductSidebarProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-7">
      {/* Search */}
      <div>
        <h3
          className="text-sm font-bold text-[#18080F] mb-3 uppercase tracking-wide"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t('catalog.searchLabel')}
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('catalog.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#18080F] placeholder:text-gray-400 outline-none focus:border-[#FF5FA2] focus:ring-2 focus:ring-[#FF5FA2]/20 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF5FA2]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h3
          className="text-sm font-bold text-[#18080F] mb-3 uppercase tracking-wide"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t('catalog.sizeLabel')}
        </h3>
        <div className="flex flex-col gap-2">
          {["5x5", "6x6", "7x7"].map((size) => (
            <label
              key={size}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                onClick={() => toggleSize(size)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                  selectedSizes.includes(size)
                    ? "bg-[#FF5FA2] border-[#FF5FA2]"
                    : "border-gray-300 group-hover:border-[#FF5FA2]"
                }`}
              >
                {selectedSizes.includes(size) && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`text-sm transition-colors ${
                  selectedSizes.includes(size)
                    ? "text-[#FF5FA2] font-semibold"
                    : "text-gray-600 group-hover:text-[#18080F]"
                }`}
              >
                {size} cm
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3
          className="text-sm font-bold text-[#18080F] mb-3 uppercase tracking-wide"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t('catalog.priceLabel')}
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs text-gray-500 font-semibold">
            <span>{formatPrice(minPrice ?? 0)}</span>
            <span>{formatPrice(maxPrice ?? 50000)}</span>
          </div>
          
          <div className="relative w-full h-2 bg-gray-100 rounded-full mt-2">
            <div 
              className="absolute h-full bg-[#FF5FA2] rounded-full"
              style={{
                left: `${((minPrice ?? 0) / 50000) * 100}%`,
                right: `${100 - ((maxPrice ?? 50000) / 50000) * 100}%`
              }}
            />
            
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={minPrice ?? 0}
              onChange={(e) => {
                const val = Number(e.target.value);
                setMinPrice(Math.min(val, (maxPrice ?? 50000) - 1000));
              }}
              className="absolute w-full h-2 top-0 left-0 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FF5FA2] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#FF5FA2] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
            />
            
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={maxPrice ?? 50000}
              onChange={(e) => {
                const val = Number(e.target.value);
                setMaxPrice(Math.max(val, (minPrice ?? 0) + 1000));
              }}
              className="absolute w-full h-2 top-0 left-0 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FF5FA2] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#FF5FA2] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 text-sm text-[#FF5FA2] font-semibold hover:text-[#E8457E] transition-colors"
        >
          <X className="w-4 h-4" />
          {t('catalog.resetFilter')}
        </button>
      )}
    </div>
  );
}

type SortOption = "best-seller" | "price-asc" | "price-desc";

export default function ProductsPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("best-seller");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("catalog_products")
          .select("*")
          .neq("status", "inactive")
          .order("id", { ascending: true });

        if (error) throw error;
        if (data) {
          setProducts(data.map(mapDbProductToProduct));
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.character.toLowerCase().includes(search.toLowerCase());

      const matchPrice =
        (minPrice === null || p.price >= minPrice) &&
        (maxPrice === null || p.price <= maxPrice);

      const matchSize =
        p.is_custom ||
        selectedSizes.length === 0 ||
        selectedSizes.some((sz) => {
          const normalizedProductSize = p.size.toLowerCase().replace(/×/g, "x");
          const normalizedSz = sz.toLowerCase();
          return normalizedProductSize.includes(normalizedSz);
        });

      return matchSearch && matchPrice && matchSize;
    });
  }, [products, search, minPrice, maxPrice, selectedSizes]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortBy === "best-seller") {
      list.sort((a, b) => {
        const aBest = a.is_best_seller ? 1 : 0;
        const bBest = b.is_best_seller ? 1 : 0;
        return bBest - aBest;
      });
    } else if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    }

    // Always sort coming_soon to the very end
    list.sort((a, b) => {
      const aComing = a.status === "coming_soon" ? 1 : 0;
      const bComing = b.status === "coming_soon" ? 1 : 0;
      return aComing - bComing;
    });

    return list;
  }, [filtered, sortBy]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedSizes([]);
    setMinPrice(null);
    setMaxPrice(null);
    setSortBy("best-seller");
  };

  const hasActiveFilters =
    search !== "" || selectedSizes.length > 0 || minPrice !== null || maxPrice !== null || sortBy !== "best-seller";


  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FAFAFA] pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-[#FF5FA2] transition-colors font-medium">
              {t('catalog.breadcrumbHome')}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#18080F] font-semibold">{t('catalog.breadcrumbAll')}</span>
          </nav>

          {/* Page Title & Sort Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl lg:text-4xl font-extrabold text-[#18080F] mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t('catalog.allProductsTitle')}{" "}
                <span className="bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] bg-clip-text text-transparent">
                  {t('catalog.allProductsTitleHighlight')}
                </span>
              </motion.h1>
              <p className="text-gray-500 text-sm">
                {loading
                  ? t('catalog.loadingProducts')
                  : t('catalog.productsFound').replace('{count}', String(sorted.length))}
              </p>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('catalog.sortLabel')}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-sm font-semibold text-[#18080F] shadow-sm outline-none focus:border-[#FF5FA2] focus:ring-2 focus:ring-[#FF5FA2]/20 transition-all cursor-pointer"
              >
                <option value="best-seller">{t('catalog.sortBestSeller')}</option>
                <option value="price-asc">{t('catalog.sortPriceAsc')}</option>
                <option value="price-desc">{t('catalog.sortPriceDesc')}</option>
              </select>
            </div>
          </div>

          <div className="flex gap-8 lg:gap-10">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="bg-white rounded-3xl border border-gray-100 p-6 sticky top-28 shadow-sm">
                <ProductSidebar
                  search={search}
                  setSearch={setSearch}
                  selectedSizes={selectedSizes}
                  toggleSize={toggleSize}
                  minPrice={minPrice}
                  setMinPrice={setMinPrice}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  hasActiveFilters={hasActiveFilters}
                  clearFilters={clearFilters}
                />
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Mobile filter toggle */}
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-[#18080F] shadow-sm hover:border-[#FF5FA2] transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#FF5FA2]" />
                  {t('catalog.filterLabel')}
                  {hasActiveFilters && (
                    <span className="w-5 h-5 rounded-full bg-[#FF5FA2] text-white text-[10px] font-bold flex items-center justify-center">
                      {(selectedSizes.length > 0 ? 1 : 0) +
                        (minPrice !== null || maxPrice !== null ? 1 : 0) +
                        (search ? 1 : 0)}
                    </span>
                  )}
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#FF5FA2] font-semibold hover:text-[#E8457E]"
                  >
                    {t('catalog.resetFilter')}
                  </button>
                )}
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[3/4] bg-white rounded-3xl border border-gray-100 p-4 flex flex-col gap-4"
                    >
                      <div className="aspect-square bg-gray-50 rounded-2xl w-full animate-pulse" />
                      <div className="h-4 bg-gray-50 rounded w-1/2" />
                      <div className="h-4 bg-gray-50 rounded w-3/4" />
                      <div className="h-6 bg-gray-50 rounded w-1/3 mt-auto" />
                    </div>
                  ))}
                </div>
              ) : sorted.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sorted.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#FFF1F7] flex items-center justify-center mb-4">
                    <Package className="w-8 h-8 text-[#FF5FA2]" />
                  </div>
                  <h3
                    className="text-lg font-bold text-[#18080F] mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {t('catalog.notFound')}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 max-w-xs">
                    {t('catalog.notFoundDesc')}
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-5 py-2.5 rounded-xl bg-[#FF5FA2] text-white text-sm font-bold hover:bg-[#E8457E] transition-colors"
                  >
                    {t('catalog.resetFilter')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Drawer */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 left-0 w-72 bg-white z-50 shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2
                className="font-bold text-[#18080F]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t('catalog.filterProducts')}
              </h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:text-[#18080F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto h-full pb-20">
              <ProductSidebar
                search={search}
                setSearch={setSearch}
                selectedSizes={selectedSizes}
                toggleSize={toggleSize}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                hasActiveFilters={hasActiveFilters}
                clearFilters={clearFilters}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="w-full py-3 rounded-2xl bg-[#FF5FA2] text-white font-bold text-sm hover:bg-[#E8457E] transition-colors"
              >
                {t('catalog.showProducts').replace('{count}', loading ? '...' : String(sorted.length))}
              </button>
            </div>
          </motion.div>
        </>
      )}

      <Footer />
    </>
  );
}
