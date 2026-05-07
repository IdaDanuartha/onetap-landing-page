"use client";
import { motion } from "framer-motion";
import { Check, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/products";

import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ProductCardProps {
  product: Product;
}

const WA_NUMBER = "6283114227745";

function getOrderLink(productName: string, price: string, locale: string) {
  const isId = locale === 'id';
  const message = encodeURIComponent(
    isId 
      ? `Halo OneTap! Saya ingin order:\n*Produk:* ${productName}\n*Harga:* ${price}\n\nBoleh minta info lebih lanjut?`
      : `Hello OneTap! I want to order:\n*Product:* ${productName}\n*Price:* ${price}\n\nCan I get more info?`
  );
  return `https://wa.me/${WA_NUMBER}?text=${message}`;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t, locale } = useLanguage();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      className={`relative flex flex-col h-full bg-white rounded-3xl p-6 transition-all duration-300 ${
        product.popular ? "border-2 border-[#FF5FA2] shadow-xl shadow-[#FF5FA2]/10" : "border border-gray-100 shadow-lg shadow-gray-200/50 hover:border-[#F6B7C8]/50"
      }`}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute -top-3.5 left-6 z-10">
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${
            product.popular ? "bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white shadow-md shadow-[#FF5FA2]/30" : "bg-[#FFF8F2] text-[#FF5FA2] border border-[#F6B7C8]"
          }`}>
            {product.badge}
          </span>
        </div>
      )}

      {/* Product Image Placeholder */}
      <div className="relative w-full aspect-square mb-6 rounded-2xl overflow-hidden bg-[#FFF8F2] flex items-center justify-center group">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FF5FA2]/5 to-[#E8457E]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <h3
        className="text-xl font-bold text-[#18080F]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {product.name}
      </h3>
      <p
        className="mt-2 text-sm text-[#18080F]/60 leading-relaxed"
      >
        {product.description}
      </p>

      <ul className="mt-6 space-y-3 flex-1">
        {product.features.slice(0, 4).map((f, fi) => (
          <li key={fi} className="flex items-start gap-3 text-sm">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-[#FFF8F2] mt-0.5"
            >
              <Check
                className="w-3 h-3 text-[#FF5FA2]"
              />
            </span>
            <span className="text-[#18080F]/80 leading-relaxed">{f}</span>
          </li>
        ))}
      </ul>

      <div
        className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
            <p
                className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF5FA2] to-[#E8457E]"
            >
                {product.formattedPrice}
            </p>
            <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-200">
                {product.category}
            </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
            <Link
                href={`/product/${product.slug}`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[#FFF8F2] text-[#FF5FA2] text-sm font-semibold hover:bg-[#FF5FA2] hover:text-white transition-colors duration-300"
            >
                {t('products.detail')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <motion.a
                href={getOrderLink(product.name, product.formattedPrice, locale)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white text-sm font-semibold shadow-md shadow-[#FF5FA2]/20 hover:shadow-lg hover:shadow-[#FF5FA2]/40 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <MessageCircle className="w-3.5 h-3.5" />
                {t('products.order')}
            </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
