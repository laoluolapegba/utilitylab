import MarketingNavbar from "@/components/landing/MarketingNavbar";
import ComplianceFormGeneratorHero from "@/components/products/compliance-form-generator/ComplianceFormGeneratorHero";
import HowItWorks from "@/components/products/compliance-form-generator/HowItWorks";
import ComplianceFormGeneratorFeatures from "@/components/products/compliance-form-generator/ComplianceFormGeneratorFeatures";
import PricingSection from "@/components/products/compliance-form-generator/PricingSection";
import ProductFAQ from "@/components/products/compliance-form-generator/ProductFAQ";
import Footer from "@/components/landing/Footer";

export const metadata = {
    title: "Compliance Form Generator | UtilityLab",
    description:
        "Generate HMRC and Companies House compliant forms in minutes with AI form discovery, plain-English guidance, auto-fill, and print-ready PDF export.",
};

export default function ComplianceFormGeneratorPage() {
    return (
        <>
            <MarketingNavbar />
            <main className="min-h-screen bg-white text-slate-900">
                <ComplianceFormGeneratorHero />
                <HowItWorks />
                <ComplianceFormGeneratorFeatures />
                <PricingSection />
                <ProductFAQ />
                <Footer />
            </main>
        </>
    );
}
