"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  MessageCircle,
  CheckCircle2,
  Package,
  Truck,
  ShieldCheck,
  Star,
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProductGallery from "@/app/components/catalog/ProductGallery";
import ProductCard from "@/app/components/catalog/ProductCard";
import { Product, formatPrice, WA_BASE_URL } from "@/app/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const badgeStyles: Record<string, string> = {
  "Best Seller": "bg-gradient-to-r from-amber-400 to-orange-400 text-white",
};

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product, related }: Props) {
  const { t } = useLanguage();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const waUrl = `${WA_BASE_URL}?text=${encodeURIComponent(product.waMessage)}`;

  const trustBadges = [
    { icon: ShieldCheck, labelKey: "catalog.detail.trustPremium" },
    { icon: Truck, labelKey: "catalog.detail.trustShipping" },
    { icon: Star, labelKey: "catalog.detail.trustQuality" },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FAFAFA] pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 flex-wrap">
            <Link href="/" className="hover:text-[#FF5FA2] transition-colors font-medium">
              {t('catalog.breadcrumbHome')}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/products" className="hover:text-[#FF5FA2] transition-colors font-medium">
              {t('catalog.breadcrumbAll')}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#18080F] font-semibold line-clamp-1">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left — Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductGallery images={product.images} productName={product.name} />
            </motion.div>

            {/* Right — Info */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              {/* Category & Badge */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs font-bold text-[#FF5FA2] uppercase tracking-widest">
                  {product.category}
                </span>
                {product.badge && (
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${badgeStyles[product.badge]}`}
                  >
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Name */}
              <h1
                className="text-2xl lg:text-3xl font-extrabold text-[#18080F] mb-2 leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {product.name}
              </h1>

              {/* Size & Sold Count */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-5 font-medium flex-wrap">
                <p>
                  {t('catalog.detail.size')}: <span className="text-[#18080F] font-semibold">{product.size}</span>
                </p>
                <span className="text-gray-300">|</span>
                <p>
                  {t('catalog.detail.sold')}: <span className="text-[#18080F] font-semibold">{product.sold} pcs</span>
                </p>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="text-3xl font-extrabold text-[#18080F]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {product.slug === "custom-design-keychain" ? t('catalog.startingFrom') : ""}{formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-gray-400 text-lg line-through font-medium">
                      {formatPrice(product.originalPrice)}
                    </span>
                    {discount && (
                      <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-500 text-xs font-extrabold">
                        -{discount}%
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Min Order */}
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#FFF1F7] border border-[#F6B7C8]/50 mb-6">
                <Package className="w-4 h-4 text-[#FF5FA2] shrink-0" />
                <span className="text-sm text-[#18080F] font-medium">
                  {t('catalog.detail.minOrder')} <strong>{product.minOrder} pcs</strong>
                </span>
              </div>

              {/* Order via WA button */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#22C55E] text-white font-bold text-base hover:bg-[#16A34A] transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5 mb-4"
              >
                <MessageCircle className="w-5 h-5" />
                {t('catalog.detail.orderWa')}
              </a>

              <Link
                href="/products"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-[#FF5FA2] text-[#FF5FA2] font-bold text-sm hover:bg-[#FF5FA2] hover:text-white transition-all duration-200 mb-8"
              >
                {t('catalog.detail.viewOther')}
              </Link>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {trustBadges.map((item) => (
                  <div
                    key={item.labelKey}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white border border-gray-100 text-center"
                  >
                    <item.icon className="w-5 h-5 text-[#FF5FA2]" />
                    <span className="text-[11px] font-semibold text-[#18080F] leading-tight">
                      {t(item.labelKey)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Highlights */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
                <h3
                  className="text-sm font-bold text-[#18080F] mb-4 uppercase tracking-wide"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {t('catalog.detail.highlights')}
                </h3>
                <ul className="space-y-3">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#FF5FA2] shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Specs & Description */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Description */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <h2
                className="text-lg font-extrabold text-[#18080F] mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t('catalog.detail.description')}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Specs */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <h2
                className="text-lg font-extrabold text-[#18080F] mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t('catalog.detail.specs')}
              </h2>
              <table className="w-full text-sm">
                <tbody>
                  {product.specs.map((spec, i) => (
                    <tr
                      key={i}
                      className={`${i !== product.specs.length - 1 ? "border-b border-gray-50" : ""}`}
                    >
                      <td className="py-3 pr-4 text-gray-400 font-medium w-36">
                        {spec.label}
                      </td>
                      <td className="py-3 text-[#18080F] font-semibold">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-20">
              <h2
                className="text-2xl font-extrabold text-[#18080F] mb-8"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t('catalog.detail.related')}{" "}
                <span className="bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] bg-clip-text text-transparent">
                  {t('catalog.detail.relatedHighlight')}
                </span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {related.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
