import MarketingNavbar from "@/components/landing/MarketingNavbar";
import RepricingAlertsHero from "@/components/products/repricing-alerts/RepricingAlertsHero";
import HowItWorks from "@/components/products/repricing-alerts/HowItWorks";
import RepricingAlertsFeatures from "@/components/products/repricing-alerts/RepricingAlertsFeatures";
import PricingSection from "@/components/products/repricing-alerts/PricingSection";
import ProductFAQ from "@/components/products/repricing-alerts/ProductFAQ";
import Footer from "@/components/landing/Footer";

export const metadata = {
    title: "Re-Pricing Alerts | UtilityLab",
    description:
        "Monitor competitor prices across Amazon, eBay, Shopify, and any website. Get instant alerts within minutes and react before you lose sales.",
};

export default function RepricingAlertsPage() {
    return (
        <>
            <MarketingNavbar />
            <main className="min-h-screen bg-white text-slate-900">
                <RepricingAlertsHero />
                <HowItWorks />
                <RepricingAlertsFeatures />
                <PricingSection />
                <ProductFAQ />
                <Footer />
            </main>
        </>
    );
}
