"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full border border-gray-200">
      <button
        onClick={() => setLocale('id')}
        className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${
          locale === 'id' 
            ? "bg-white text-pink-500 shadow-sm" 
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        ID
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${
          locale === 'en' 
            ? "bg-white text-pink-500 shadow-sm" 
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        EN
      </button>
    </div>
  );
}
