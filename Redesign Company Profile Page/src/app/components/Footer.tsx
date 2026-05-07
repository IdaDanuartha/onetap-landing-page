import { Zap, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  Product: [
    "Digital Profile",
    "NFC Business Card",
    "Attendance System",
    "Analytics Dashboard",
    "Team Management",
    "API & Integrations",
  ],
  Solutions: [
    "For Professionals",
    "For Creators",
    "For Education",
    "For Enterprise",
    "For Events",
    "For Healthcare",
  ],
  Company: [
    "About Us",
    "Blog",
    "Careers",
    "Press Kit",
    "Partners",
    "Contact",
  ],
  Legal: [
    "Privacy Policy",
    "Terms of Service",
    "Cookie Policy",
    "GDPR Compliance",
    "Security",
  ],
};

const socials = [
  { icon: Twitter, label: "Twitter" },
  { icon: Instagram, label: "Instagram" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Youtube, label: "YouTube" },
];

export function Footer() {
  return (
    <footer style={{ background: "#18080F" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main footer */}
        <div className="pt-16 pb-12 grid grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF5FA2] to-[#E8457E] flex items-center justify-center shadow-lg shadow-[#FF5FA2]/30">
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
              <span
                className="text-xl text-white tracking-tight"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
              >
                OneTap
              </span>
            </a>
            <p className="text-[#F6B7C8]/50 text-sm leading-relaxed mb-6 max-w-xs">
              The all-in-one digital identity platform. Share, connect, and track — all with a single tap.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-[#F6B7C8]/50 text-sm">
                <Mail className="w-4 h-4 text-[#FF5FA2]" />
                hello@onetap.me
              </div>
              <div className="flex items-center gap-2.5 text-[#F6B7C8]/50 text-sm">
                <Phone className="w-4 h-4 text-[#FF5FA2]" />
                +62 21 1234 5678
              </div>
              <div className="flex items-center gap-2.5 text-[#F6B7C8]/50 text-sm">
                <MapPin className="w-4 h-4 text-[#FF5FA2]" />
                Bali, Indonesia
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-3 mt-7">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href="#"
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
                className="text-white text-sm mb-5"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
              >
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[#F6B7C8]/40 text-sm hover:text-[#FF5FA2] transition-colors duration-150"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 py-7 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#F6B7C8]/30 text-sm">
            © {new Date().getFullYear()} OneTap Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span className="text-[#F6B7C8]/30 text-sm">Made with</span>
            <span className="text-[#FF5FA2] text-sm">♥</span>
            <span className="text-[#F6B7C8]/30 text-sm">in Bali, Indonesia</span>
          </div>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Cookies"].map((l) => (
              <a key={l} href="#" className="text-[#F6B7C8]/30 text-sm hover:text-[#FF5FA2] transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
