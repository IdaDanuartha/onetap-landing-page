import Header from "../components/Header";
import ProductsSection from "../components/ProductsSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - OneTap",
  description: "Pilih paket yang sesuai untuk kebutuhan networking digitalmu. Dari paket Starter gratis hingga Professional dan Education dengan fitur lengkap.",
};

export default function PricingPage() {
  return (
    <>
      <Header />
      <main> {/* Add padding top to account for fixed header */}
        <ProductsSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
