"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const WA_LINK =
  "https://wa.me/6283114227745?text=Halo+Min!+Saya+ingin+order+Keychain.";

export default function Header() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: t('nav.catalog'), href: "/catalog" },
    { label: t('nav.blog'), href: "/blog" },
    { label: t('nav.about'), href: "/about" },
    { label: t('nav.howItWorks'), href: "/#howitworks" },
    { label: t('nav.features'), href: "/#features" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen ? "navbar shadow-sm bg-white" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo_simple.png"
              alt="OneTap Logo"
              width={36}
              height={36}
              className="object-contain"
            />
            <span
              className="text-xl font-bold"
              style={{ color: "var(--color-text-dark)" }}
            >
              OneTap
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-medium transition-colors"
                style={{ color: "var(--color-text-muted)" }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--color-primary)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--color-text-muted)")
                }
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <motion.a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !hidden md:!inline-flex text-sm px-5 py-2.5 whitespace-nowrap"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {t('nav.orderNow')}
            </motion.a>
            <div className="hidden lg:block ml-4">
              <LanguageSwitcher />
            </div>
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-6 h-6" style={{ color: "var(--color-text-dark)" }} />
              ) : (
                <Menu className="w-6 h-6" style={{ color: "var(--color-text-dark)" }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="md:hidden py-4 border-t overflow-hidden bg-white px-2"
              style={{ borderColor: "var(--color-border)" }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block py-3 px-2 font-medium hover:bg-pink-50 rounded-lg transition-colors"
                  style={{ color: "var(--color-text-muted)" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100 px-2">
                <span className="text-sm font-medium text-gray-500">Bahasa</span>
                <LanguageSwitcher />
              </div>

              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-6 w-full justify-center flex"
              >
                {t('nav.orderNow')}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
