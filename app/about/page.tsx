"use client";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FloatingWA from "../components/FloatingWA";
import AnimatedSection, { fadeInUp } from "../components/AnimatedSection";
import { Target, Users, Heart, Sparkles, Wifi } from "lucide-react";
import Image from "next/image";
import ThreeDKeychain from "../components/ThreeDKeychain";

const values = [
  {
    icon: Target,
    title: "Visi",
    text: "Menjadi jembatan utama yang menghubungkan interaksi fisik dan digital di Indonesia melalui teknologi NFC yang inovatif dan terjangkau.",
  },
  {
    icon: Sparkles,
    title: "Misi",
    text: "Menyediakan produk NFC berkualitas tinggi dengan desain personal yang mendukung efisiensi networking dan identitas digital pengguna.",
  },
  {
    icon: Heart,
    title: "Nilai Kami",
    text: "Inovasi, Kualitas, dan Kepuasan Pelanggan adalah inti dari setiap produk OneTap yang kami ciptakan.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Header />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <span className="badge-soft mb-4">Tentang OneTap</span>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6" style={{ color: "var(--color-text-dark)" }}>
                Menghubungkan Dunia dalam <span className="gradient-text">Satu Sentuhan</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                OneTap lahir dari ide sederhana: bagaimana jika berbagi informasi bisa semudah bersalaman? 
                Di era digital yang serba cepat, kami percaya bahwa teknologi harus memudahkan, bukan mempersulit.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mt-4">
                Didirikan pada tahun 2024, OneTap telah membantu ratusan profesional, pelaku bisnis, 
                dan komunitas untuk bertransformasi ke identitas digital yang lebih modern, efisien, dan ramah lingkungan.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full rounded-3xl overflow-hidden flex items-center justify-center"
            >
               <ThreeDKeychain />
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 py-12 border-y border-gray-100">
            {[
                { label: "Produk Terjual", value: "2,000+" },
                { label: "Kota Terjangkau", value: "50+" },
                { label: "Rating Rata-rata", value: "5/5" },
                { label: "Partner Bisnis", value: "100+" },
            ].map((s, i) => (
                <div key={i} className="text-center">
                    <p className="text-3xl font-bold text-pink-500 mb-1">{s.value}</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{s.label}</p>
                </div>
            ))}
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {values.map((v, i) => (
              <div key={i} className="card bg-white p-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center mb-6">
                    <v.icon className="w-8 h-8 text-pink-500" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {v.text}
                </p>
              </div>
            ))}
          </div>

          {/* Team - Optional/Placeholder */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-12">Tim di Balik <span className="gradient-text">OneTap</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
                {[1, 2, 3].map((t) => (
                    <div key={t} className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-pink-100 to-pink-200" />
                        </div>
                        <h4 className="font-bold text-gray-900">Team Member {t}</h4>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Founder / Role</p>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWA />
    </div>
  );
}
