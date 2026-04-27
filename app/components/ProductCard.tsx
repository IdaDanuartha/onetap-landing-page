"use client";
import { motion } from "framer-motion";
import { Check, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

const WA_NUMBER = "6283114227745";

function getOrderLink(productName: string, price: string) {
  const message = encodeURIComponent(
    `Halo OneTap! Saya ingin order:\n*Produk:* ${productName}\n*Harga:* ${price}\n\nBoleh minta info lebih lanjut?`
  );
  return `https://wa.me/${WA_NUMBER}?text=${message}`;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      className={`card relative flex flex-col h-full ${
        product.popular ? "border-2" : ""
      }`}
      style={product.popular ? { borderColor: "var(--color-primary)" } : {}}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute -top-3.5 left-6 z-10">
          <span className={product.popular ? "badge-primary" : "badge-soft"}>
            {product.badge}
          </span>
        </div>
      )}

      {/* Product Image Placeholder */}
      <div className="relative w-full aspect-square mb-6 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-contain p-8"
        />
      </div>

      <h3
        className="text-xl font-bold"
        style={{ color: "var(--color-text-dark)" }}
      >
        {product.name}
      </h3>
      <p
        className="mt-1 text-sm leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}
      >
        {product.description}
      </p>

      <ul className="mt-6 space-y-2.5 flex-1">
        {product.features.slice(0, 4).map((f, fi) => (
          <li key={fi} className="flex items-center gap-2.5 text-sm">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--color-primary-light)" }}
            >
              <Check
                className="w-3 h-3"
                style={{ color: "var(--color-primary)" }}
              />
            </span>
            <span style={{ color: "var(--color-text-body)" }}>{f}</span>
          </li>
        ))}
      </ul>

      <div
        className="mt-8 pt-6 border-t flex flex-col gap-3"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center justify-between">
            <p
                className="text-xl font-bold"
                style={{ color: "var(--color-primary)" }}
            >
                {product.formattedPrice}
            </p>
            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                {product.category}
            </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
            <Link
                href={`/product/${product.slug}`}
                className="btn-secondary text-xs px-4 py-2.5 justify-center flex items-center gap-1"
            >
                Detail <ArrowRight className="w-3 h-3" />
            </Link>
            <motion.a
                href={getOrderLink(product.name, product.formattedPrice)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs px-4 py-2.5 justify-center flex items-center gap-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <MessageCircle className="w-3 h-3" />
                Order
            </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
