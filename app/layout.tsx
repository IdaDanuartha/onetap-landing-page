import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "OneTap - NFC Keychain Indonesia | Everything Connected",
  description:
    "OneTap mengubah cara berbagi identitas dengan NFC keychain. Hubungkan dunia fisik dan digital dalam satu sentuhan. Tanpa aplikasi tambahan, informasi penting dapat diakses secara instan.",
  keywords: [
    "NFC keychain",
    "kartu nama digital",
    "smart keychain",
    "NFC Indonesia",
    "digital business card",
    "contactless",
    "OneTap",
  ],
  authors: [{ name: "OneTap Indonesia" }],
  openGraph: {
    title: "OneTap - NFC Keychain Indonesia | Everything Connected",
    description:
      "Berbagi identitas digital semudah satu sentuhan. Cek katalog produk NFC kami sekarang!",
    url: "https://onetap.id",
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
    description: "Solusi networking modern dengan teknologi NFC.",
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
    telephone: "+6281234567890",
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
      <body className={`${inter.variable} antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        {/* Tawk.to Chatbot Integration */}
        <script
          type="text/javascript"
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
