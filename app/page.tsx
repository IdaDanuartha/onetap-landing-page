import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import ProductsSection from "./components/ProductsSection";
import UseCasesSection from "./components/UseCasesSection";
// import NewFeaturesSection from "./components/NewFeaturesSection";
import AttendanceSection from "./components/AttendanceSection";
import TestimonialsSection from "./components/TestimonialsSection";
import FAQSection from "./components/FAQSection";
import CTABannerSection from "./components/CTABannerSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ProductsSection />
        <UseCasesSection />
        {/* NEW: Feature showcase */}
        {/* <NewFeaturesSection /> */}
        {/* NEW: Education / NFC Attendance showcase */}
        <AttendanceSection />
        <TestimonialsSection />
        <FAQSection />
        <CTABannerSection />
      </main>
      <Footer />
    </>
  );
}
