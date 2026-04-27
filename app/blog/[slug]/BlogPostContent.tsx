"use client";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User,
  Share2,
  Bookmark
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/lib/blog";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FloatingWA from "../../components/FloatingWA";

export default function BlogPostContent({ post }: { post: BlogPost }) {
  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Header />
      
      <main className="flex-grow pt-32 pb-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pink-500 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Blog
          </Link>

          {/* Meta */}
          <div className="mb-8">
            <span className="badge-soft mb-4">{post.category}</span>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight" style={{ color: "var(--color-text-dark)" }}>
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 py-6 border-y border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-pink-500" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{post.author}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {post.readingTime}
                </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 bg-pink-50">
             <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover opacity-20"
             />
          </div>

          {/* Content */}
          <div 
            className="prose prose-pink max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer of article */}
          <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-pink-500 transition-colors">
                    <Share2 className="w-4 h-4" /> Bagikan
                </button>
                <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-pink-500 transition-colors">
                    <Bookmark className="w-4 h-4" /> Simpan
                </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 bg-pink-50 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
                <h4 className="font-bold text-gray-900 mb-1">Butuh NFC Keychain?</h4>
                <p className="text-sm text-gray-600">Mulai networking modern Anda hari ini bersama OneTap.</p>
            </div>
            <Link href="/catalog" className="btn-primary whitespace-nowrap">
                Lihat Produk Kami
            </Link>
          </div>
        </article>
      </main>

      <Footer />
      <FloatingWA />
    </div>
  );
}
