import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "OneTap - NFC Keychain & Digital Business Card Indonesia",
  description:
    "Solusi networking masa depan. Bagikan profil, kontak, dan sosial mediamu hanya dengan satu sentuhan NFC OneTap. Everything Connected.",
  keywords: [
    "NFC keychain",
    "kartu nama digital",
    "smart keychain",
    "NFC Indonesia",
    "digital business card",
    "contactless",
    "OneTap",
    "Linktree alternative",
  ],
  authors: [{ name: "OneTap Indonesia" }],
  icons: {
    icon: "/images/logo_simple.png",
    shortcut: "/images/logo_simple.png",
    apple: "/images/logo_simple.png",
  },
  openGraph: {
    title: "OneTap - Bagikan Semuanya dengan Satu Sentuhan",
    description:
      "Transformasi networking fisik ke digital. Cek profil digital dan koleksi NFC kami sekarang!",
    url: "https://onetap-charm.com",
    siteName: "OneTap Indonesia",
    images: [
      {
        url: "/images/logo_simple.png",
        width: 1200,
        height: 630,
        alt: "OneTap NFC Keychain",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OneTap - Everything Connected",
    description: "Solusi networking modern dengan teknologi NFC. Bagikan duniamu instan.",
    images: ["/images/logo_simple.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "OneTap Indonesia",
    image: "https://onetap-landing-page.vercel.app/images/logo_simple.png",
    "@id": "https://onetap-landing-page.vercel.app",
    url: "https://onetap-landing-page.vercel.app",
    telephone: "+6283114227745",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jln. Tukad Badung, Denpasar",
      addressLocality: "Bali",
      postalCode: "12345",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -6.2088,
      longitude: 106.8456,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
    sameAs: ["https://www.instagram.com/onetap.charm", "https://twitter.com/onetap.charm"],
  };

  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <meta name="color-scheme" content="light only" />
        <meta name="theme-color" content="#FF5FA2" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Force light mode even if OS uses dark mode — intentional brand decision */}
      </head>
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>

        <Script
          id="tawk-to"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/69eeeffa5559ee1c3cb4053c/1jn6lir7o';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
