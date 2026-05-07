import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { OurProduct } from "./components/OurProduct";
import { HowItWorks } from "./components/HowItWorks";
import { UseCases } from "./components/UseCases";
import { NewFeatures } from "./components/NewFeatures";
import { ForEducation } from "./components/ForEducation";
import { Testimonials } from "./components/Testimonials";
import { FAQ } from "./components/FAQ";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <Hero />
      <WhyChooseUs />
      <HowItWorks />
      <OurProduct />
      <UseCases />
      <NewFeatures />
      <ForEducation />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
