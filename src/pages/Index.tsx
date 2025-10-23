import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <TrustBadges />
      <Features />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
