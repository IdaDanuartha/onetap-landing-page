"use client";
import Image from "next/image";
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { label: t('nav.catalog'), href: "/catalog" },
    { label: t('nav.about'), href: "/about" },
    { label: t('nav.blog'), href: "/blog" },
    { label: t('nav.howItWorks'), href: "/#howitworks" },
    { label: t('faq.badge'), href: "/#contact" },
  ];

  return (
    <footer className="bg-navy text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image
                src="/images/logo_simple.png"
                alt="OneTap Logo"
                width={40}
                height={40}
                className="brightness-0 invert"
              />
              <span className="text-2xl font-bold">OneTap</span>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-pink-500 flex-shrink-0" />
                <span className="text-sm text-gray-400">Jln. Tukad Badung, Denpasar, Bali</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-pink-500 flex-shrink-0" />
                <span className="text-sm text-gray-400">+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-pink-500 flex-shrink-0" />
                <span className="text-sm text-gray-400">hello@onetap.id</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">
              {t('footer.social')}
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Ikuti kami untuk update terbaru.
            </p>
            <div className="flex flex-col gap-2">
              <a href="https://instagram.com/onetap.id" target="_blank" className="text-sm text-gray-400 hover:text-pink-500">@onetap.id</a>
              <a href="https://tiktok.com/@onetap.id" target="_blank" className="text-sm text-gray-400 hover:text-pink-500">@onetap.nfc</a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} OneTap Indonesia. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-500 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-500 hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
