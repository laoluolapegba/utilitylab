import MarketingNavbar from "@/components/landing/MarketingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import ProductsGrid from "@/components/landing/ProductsGrid";
import PrivacySection from "@/components/landing/PrivacySection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function Home() {
    return (
        <>
            <MarketingNavbar />
            <main className="min-h-screen bg-white flex flex-col">
                <HeroSection />
                <ProductsGrid />
                <PrivacySection />
                <CTASection />
                <FAQSection />
                <Footer />
            </main>
        </>
    );
}