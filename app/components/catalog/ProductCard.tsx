"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Tag } from "lucide-react";
import { Product, formatPrice } from "@/app/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const badgeStyles: Record<string, string> = {
  "Best Seller": "bg-gradient-to-r from-amber-400 to-orange-400 text-white",
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { t } = useLanguage();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const isComingSoon = product.status === "coming_soon";

  const cardContent = (
    <div className={`bg-white rounded-3xl border border-gray-100 overflow-hidden relative shadow-sm transition-all duration-300 ${
      isComingSoon 
        ? "" 
        : "hover:shadow-xl hover:shadow-[#FF5FA2]/10 hover:-translate-y-1"
    }`}>
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#FFF8F2]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-500 ${!isComingSoon && "group-hover:scale-105"}`}
          unoptimized
        />

        {/* Coming Soon Full Overlay (Image Only) */}
        {isComingSoon && (
          <div className="absolute inset-0 bg-[#FFF6F9]/75 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 p-4 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#F6B7C8] flex items-center justify-center mb-2.5 text-[#FF5FA2] shadow-sm">
              <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[#FF5FA2] font-black text-[11px] uppercase tracking-widest text-center bg-white/95 px-3 py-1 rounded-full shadow-sm border border-[#F6B7C8]/25">
              {t('catalog.comingSoon')}
            </span>
            <span className="text-[#18080F]/50 text-[9px] font-black uppercase tracking-wider mt-1.5 text-center leading-none">
              {t('catalog.comingSoonSub')}
            </span>
          </div>
        )}

        {/* Badge */}
        {product.badge && !isComingSoon && (
          <div
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold ${badgeStyles[product.badge]}`}
          >
            {product.badge}
          </div>
        )}

        {/* Discount badge */}
        {discount && !isComingSoon && (
          <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
            <span className="text-[10px] font-extrabold text-[#E8457E] leading-tight text-center">
              -{discount}%
            </span>
          </div>
        )}

        {/* Hover overlay */}
        {!isComingSoon && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <span className="flex items-center gap-2 bg-white text-[#FF5FA2] text-sm font-bold px-4 py-2 rounded-full shadow-lg">
              <ShoppingBag className="w-4 h-4" />
              {t('catalog.viewDetail')}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-1">
          <Tag className="w-3 h-3 text-[#FF5FA2]" />
          <span className="text-[11px] font-semibold text-[#FF5FA2] uppercase tracking-wide">
            {product.category} · {product.size}
          </span>
        </div>
        <div className="text-[11px] font-medium text-gray-400 mb-1.5">
          {product.sold} {t('catalog.soldCount')}
        </div>

        <h3
          className="text-[#18080F] font-bold text-sm leading-snug mb-2 line-clamp-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {product.name}
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[#18080F] font-extrabold text-base"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {product.slug === "custom-design-keychain" ? t('catalog.startingFrom') : ""}{formatPrice(product.price)}
          </span>
          {product.originalPrice && !isComingSoon && (
            <span className="text-gray-400 text-xs line-through font-medium">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
    >
      {isComingSoon ? (
        <div className="group block cursor-default">
          {cardContent}
        </div>
      ) : (
        <Link href={`/products/${product.slug}`} className="group block">
          {cardContent}
        </Link>
      )}
    </motion.div>
  );
}
