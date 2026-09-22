import CTASection from "@/components/home/Ctasection";
import FAQSection from "@/components/home/Faqsection";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/Howitworks";
import PricingSection from "@/components/home/Pricingsection";
import QuickSend from "@/components/home/Quicksend";
import ReviewGap from "@/components/home/Reviewgap";
import Footer from "@/share/Footer";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <HowItWorks />
      <ReviewGap />
      <QuickSend />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
