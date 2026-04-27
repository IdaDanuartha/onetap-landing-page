"use client";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FloatingWA from "../components/FloatingWA";
import { blogPosts } from "@/lib/blog";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Header />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="badge-soft mb-4">Blog & Tips</span>
            <h1 className="text-4xl md:text-5xl font-extrabold" style={{ color: "var(--color-text-dark)" }}>
              Wawasan <span className="gradient-text">NFC & Networking</span>
            </h1>
            <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
              Temukan tips, trik, dan berita terbaru seputar teknologi NFC dan cara meningkatkan personal branding Anda.
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card group flex flex-col h-full overflow-hidden hover:border-pink-300 transition-all"
              >
                <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-50 to-transparent opacity-60" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-pink-500 shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </Link>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readingTime}
                    </div>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-500 transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {post.excerpt}
                  </p>

                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-pink-500 group/link"
                  >
                    Baca Selengkapnya
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWA />
    </div>
  );
}
