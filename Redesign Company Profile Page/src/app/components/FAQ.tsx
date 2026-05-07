import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What is OneTap and how does it work?",
    answer:
      "OneTap is an all-in-one digital identity platform that lets you share your profile, manage attendance, and showcase your links through NFC cards, QR codes, or a direct URL. Simply tap your card or scan your code — your full profile is instantly accessible on any device.",
  },
  {
    question: "Do I need to install an app to use OneTap?",
    answer:
      "No app needed for the receiver! Anyone can view your OneTap profile directly in their browser — no downloads, no sign-ups. Only you as the profile owner need an account to manage your content.",
  },
  {
    question: "How does the NFC card work?",
    answer:
      "Your OneTap NFC card is a physical smart card embedded with an NFC chip. When someone taps it with their smartphone (Android or iPhone with NFC enabled), it instantly opens your digital profile in their browser. The card is linked to your account and can be updated anytime without replacing the physical card.",
  },
  {
    question: "Can I use OneTap for team attendance tracking?",
    answer:
      "Absolutely. OneTap's attendance system works by assigning each team member a unique NFC card or QR code. When they tap in, the system logs their name, time, and location. You get real-time reports, export options, and integrations with your HR system.",
  },
  {
    question: "What happens if I upgrade or downgrade my plan?",
    answer:
      "Plan changes take effect immediately. When upgrading, you get instant access to new features. When downgrading, you retain access to premium features until your current billing cycle ends, then switch to the lower plan.",
  },
  {
    question: "Is my data secure on OneTap?",
    answer:
      "Security is our top priority. All data is encrypted in transit and at rest using AES-256. We're GDPR-compliant, host on ISO 27001-certified infrastructure, and never sell your personal data. You can export or delete your data at any time.",
  },
  {
    question: "Can I customize my profile with my own branding?",
    answer:
      "Yes! Professional and Business plans let you use custom colors, fonts, logos, and your own domain name. Business plans also allow white-label options for enterprise deployments.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer:
      "Yes, all paid plans come with a 14-day free trial — no credit card required. You'll have full access to all features in your chosen plan during the trial period.",
  },
];

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 lg:py-32 bg-[#FFF8F2]">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#F6B7C8] text-[#FF5FA2] text-sm font-semibold mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5FA2]" />
            FAQ
          </div>
          <h2
            className="text-4xl lg:text-5xl text-[#18080F] mb-5"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
          >
            Frequently asked{" "}
            <span className="bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] bg-clip-text text-transparent">
              questions
            </span>
          </h2>
          <p className="text-gray-500 text-lg">
            Can't find the answer you're looking for? Reach out to our support team.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                openIdx === i
                  ? "border-[#FF5FA2]/40 bg-white shadow-lg shadow-[#FF5FA2]/8"
                  : "border-[#F6B7C8]/30 bg-white hover:border-[#FF5FA2]/25 shadow-sm"
              }`}
            >
              <button
                className="w-full flex items-center justify-between px-7 py-5 text-left"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                <span
                  className={`pr-4 text-[15px] transition-colors ${
                    openIdx === i ? "text-[#FF5FA2]" : "text-[#18080F]"
                  }`}
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                >
                  {faq.question}
                </span>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                    openIdx === i
                      ? "bg-[#FF5FA2] text-white"
                      : "bg-[#FFF8F2] text-[#FF5FA2] border border-[#F6B7C8]"
                  }`}
                >
                  {openIdx === i ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
              </button>

              {openIdx === i && (
                <div className="px-7 pb-6">
                  <p className="text-gray-500 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact link */}
        <div className="text-center mt-10">
          <p className="text-gray-500 text-sm">
            Still have questions?{" "}
            <a href="#" className="text-[#FF5FA2] font-semibold hover:underline">
              Contact our support team →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
