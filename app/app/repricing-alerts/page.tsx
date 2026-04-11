import ProductPageLayout from "@/components/layouts/ProductPageLayout";
import RepricingAlertsHero from "@/components/products/repricing-alerts/RepricingAlertsHero";
import HowItWorks from "@/components/products/repricing-alerts/HowItWorks";
import RepricingAlertsFeatures from "@/components/products/repricing-alerts/RepricingAlertsFeatures";
import PricingSection from "@/components/products/repricing-alerts/PricingSection";
import ProductFAQ from "@/components/products/repricing-alerts/ProductFAQ";

export const metadata = {
    title: "Re-Pricing Alerts — free competitor price monitoring for sellers | UtilityLab",
    description: "Monitor competitor prices across Amazon, eBay, and Shopify and get instant alerts the moment they change — free for online sellers.",
};

export default function RepricingAlertsPage() {
    return (
        <ProductPageLayout>
            <RepricingAlertsHero />
            <HowItWorks />
            <RepricingAlertsFeatures />
            <PricingSection />
            <ProductFAQ />
        </ProductPageLayout>
    );
}
