"use client";
import { motion } from "framer-motion";
import { Product } from "@/lib/products";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FloatingWA from "../../components/FloatingWA";
import { 
  ArrowLeft, 
  Check, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  Zap 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const WA_NUMBER = "6283114227745";

function getOrderLink(productName: string, price: string, variant?: string) {
  const message = encodeURIComponent(
    `Halo OneTap! Saya ingin order:\n*Produk:* ${productName}\n${variant ? `*Varian:* ${variant}\n` : ""}*Harga:* ${price}\n\nBoleh minta info lebih lanjut?`
  );
  return `https://wa.me/${WA_NUMBER}?text=${message}`;
}

export default function ProductDetailContent({ product }: { product: Product }) {
  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Header />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link 
            href="/catalog" 
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pink-500 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Katalog
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Image Gallery */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="relative aspect-square rounded-3xl bg-white border border-gray-100 flex items-center justify-center shadow-sm overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-contain p-12"
                />
                {product.badge && (
                    <div className="absolute top-6 left-6">
                        <span className="badge-primary px-4 py-1.5 text-sm">
                            {product.badge}
                        </span>
                    </div>
                )}
              </div>
              {/* Thumbnail placeholders */}
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square rounded-xl bg-white border border-gray-100 flex items-center justify-center cursor-pointer hover:border-pink-300 transition-all opacity-50">
                        <Image src={product.images[0]} alt="" width={40} height={40} />
                    </div>
                ))}
              </div>
            </motion.div>

            {/* Content */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-pink-500 mb-2 block">
                  {product.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: "var(--color-text-dark)" }}>
                  {product.name}
                </h1>
                <p className="text-2xl font-bold mt-4" style={{ color: "var(--color-primary)" }}>
                  {product.formattedPrice}
                </p>
              </div>

              <div className="space-y-6 mb-10">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Deskripsi</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {product.fullDescription}
                  </p>
                </div>

                {product.variants && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Varian</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <button 
                          key={v}
                          className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:border-pink-500 hover:text-pink-500 transition-all"
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Fitur Utama</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {product.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--color-primary-light)" }}>
                          <Check className="w-3.5 h-3.5" style={{ color: "var(--color-primary)" }} />
                        </div>
                        <span className="text-sm text-gray-700">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <motion.a
                  href={getOrderLink(product.name, product.formattedPrice)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex-grow justify-center gap-3 py-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Pesan Sekarang via WhatsApp
                </motion.a>
              </div>

              {/* Trust markers */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
                <div className="flex flex-col items-center text-center">
                  <ShieldCheck className="w-6 h-6 text-green-500 mb-2" />
                  <span className="text-[10px] font-bold uppercase text-gray-500">Garansi 30 Hari</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Truck className="w-6 h-6 text-blue-500 mb-2" />
                  <span className="text-[10px] font-bold uppercase text-gray-500">Pengiriman Cepat</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Zap className="w-6 h-6 text-yellow-500 mb-2" />
                  <span className="text-[10px] font-bold uppercase text-gray-500">Chip NFC Premium</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWA />
    </div>
  );
}
