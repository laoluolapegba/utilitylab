import MarketingNavbar from "@/components/landing/MarketingNavbar";
import PricingPage from "@/components/PricingPage";
import Footer from "@/components/landing/Footer";

export const metadata = {
    title: "Pricing — UtilityLab",
    description: "Simple, transparent pricing. Start free, upgrade when you need more. No hidden fees.",
};

export default function Pricing() {
    return (
        <>
            <MarketingNavbar />
            <main className="min-h-screen bg-white">
                <PricingPage />
            </main>
            <Footer />
        </>
    );
}
