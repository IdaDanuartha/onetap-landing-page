import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "Features", href: "#features" },
  { label: "Use Cases", href: "#usecases" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg shadow-[#FF5FA2]/5 border-b border-[#F6B7C8]/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF5FA2] to-[#E8457E] flex items-center justify-center shadow-lg shadow-[#FF5FA2]/30">
              <Image src="/images/logo_simple.png" alt="OneTap" width={20} height={20} />
            </div>
            <span
              className={`text-xl tracking-tight transition-colors ${
                isScrolled ? "text-[#18080F]" : "text-white"
              }`}
              style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
            >
              OneTap
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#FF5FA2] ${
                  isScrolled ? "text-gray-600" : "text-white/80"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#"
              className={`text-sm font-medium transition-colors ${
                isScrolled ? "text-gray-600 hover:text-[#FF5FA2]" : "text-white/80 hover:text-white"
              }`}
            >
              Log in
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white text-sm font-semibold shadow-lg shadow-[#FF5FA2]/25 hover:shadow-[#FF5FA2]/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? "text-gray-700 hover:bg-[#FFF8F2]" : "text-white hover:bg-white/10"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-[#F6B7C8]/30 py-4 px-2 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-4 py-2.5 text-sm text-gray-700 font-medium rounded-lg hover:bg-[#FFF8F2] hover:text-[#FF5FA2] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 px-4 flex flex-col gap-2">
              <a href="#" className="text-center py-2.5 text-sm text-gray-600 font-medium border border-[#F6B7C8] rounded-xl hover:border-[#FF5FA2] hover:text-[#FF5FA2] transition-colors">
                Log in
              </a>
              <a href="#" className="text-center py-2.5 text-sm text-white font-semibold rounded-xl bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] shadow-lg shadow-[#FF5FA2]/25">
                Get Started
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
