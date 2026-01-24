import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OneTap - NFC Keychain Indonesia | Everything Connected",
  description: "OneTap mengubah cara berbagi identitas dengan NFC keychain. Hubungkan dunia fisik dan digital dalam satu sentuhan. Tanpa aplikasi tambahan, informasi penting dapat diakses secara instan.",
  keywords: ["NFC keychain", "kartu nama digital", "smart keychain", "NFC Indonesia", "digital business card", "contactless", "OneTap"],
  authors: [{ name: "OneTap Indonesia" }],
  openGraph: {
    title: "OneTap - NFC Keychain Indonesia | Everything Connected",
    description: "NFC keychain solusi modern untuk kebutuhan personal, komunitas, dan event. Satu sentuhan, terhubung selamanya.",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "OneTap - NFC Keychain Indonesia",
    description: "Hubungkan dunia fisik dan digital dalam satu sentuhan",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
