"use client";

import { Zap, Mail, Phone, MapPin } from "lucide-react";
import { Instagram, Twitter, Linkedin, Youtube } from "@/app/components/BrandIcons";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const { t } = useLanguage();
  
  const footerLinks = {
    [t('footer.quickLinks')]: [
      { label: t('nav.features'), href: "/#features" },
      { label: t('nav.howItWorks'), href: "/#how-it-works" },
      { label: t('products.badge'), href: "/pricing" },
      { label: t('education.badge'), href: "/#education" },
      { label: t('testimonials.badge'), href: "/#testimonials" },
    ],
    [t('footer.social')]: [
      { label: "Instagram", href: "https://instagram.com/onetap.charm" },
      { label: "TikTok", href: "https://tiktok.com/@onetap.charm" },
      { label: "WhatsApp", href: "https://wa.me/6283114227745?text=Halo%20OneTap%2C%20saya%20ingin%20bertanya%20mengenai%20detail%20produk%20NFC%20OneTap%20yang%20tersedia." },
    ],
    [t('footer.legal')]: [
      { label: t('footer.privacy'), href: "#" },
      { label: t('footer.terms'), href: "#" },
      { label: t('footer.cookie'), href: "#" },
    ],
  };

  const socials = [
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Instagram, label: "Instagram", href: "https://instagram.com/onetap.charm" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
    { icon: Youtube, label: "YouTube", href: "#" },
  ];

  return (
    <footer className="bg-[#18080F] pt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main footer */}
        <div className="pb-12 grid grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF5FA2] to-[#E8457E] flex items-center justify-center shadow-lg shadow-[#FF5FA2]/30">
                <Image src="/images/logo_simple.png" alt="OneTap" width={20} height={20} />
              </div>
              <span
                className="text-xl text-white font-bold tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                OneTap
              </span>
            </Link>
            <p className="text-[#F6B7C8]/50 text-sm leading-relaxed mb-6 max-w-xs">
              {t('footer.description')}
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-[#F6B7C8]/50 text-sm">
                <Mail className="w-4 h-4 text-[#FF5FA2]" />
                danuart14.dev@gmail.com
              </div>
              <div className="flex items-center gap-2.5 text-[#F6B7C8]/50 text-sm">
                <Phone className="w-4 h-4 text-[#FF5FA2]" />
                +62 831 1422 7745
              </div>
              <div className="flex items-center gap-2.5 text-[#F6B7C8]/50 text-sm">
                <MapPin className="w-4 h-4 text-[#FF5FA2]" />
                Bali, Indonesia
              </div>
            </div>

            {/* Social icons */}
            <div className="flex gap-3 mt-7">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F6B7C8]/50 hover:text-white hover:bg-[#FF5FA2] hover:border-[#FF5FA2] transition-all duration-200"
                    aria-label={s.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                className="text-white text-sm mb-5 font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[#F6B7C8]/40 text-sm hover:text-[#FF5FA2] transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 py-7 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-[#F6B7C8]/30 text-sm">
            © {new Date().getFullYear()} OneTap Charm. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span className="text-[#F6B7C8]/30 text-sm">{t('footer.madeWith')}</span>
            <span className="text-[#FF5FA2] text-sm">♥</span>
            <span className="text-[#F6B7C8]/30 text-sm">{t('footer.in')} Bali, Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
