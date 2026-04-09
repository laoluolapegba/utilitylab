import MarketingNavbar from "@/components/landing/MarketingNavbar";
import ComplianceFormGeneratorHero from "@/components/products/compliance-form-generator/ComplianceFormGeneratorHero";
import HowItWorks from "@/components/products/compliance-form-generator/HowItWorks";
import ComplianceFormGeneratorFeatures from "@/components/products/compliance-form-generator/ComplianceFormGeneratorFeatures";
import PricingSection from "@/components/products/compliance-form-generator/PricingSection";
import ProductFAQ from "@/components/products/compliance-form-generator/ProductFAQ";
import Footer from "@/components/landing/Footer";

export const metadata = {
    title: "Compliance Form Generator — free UK business form builder | UtilityLab",
    description: "Generate HMRC-compliant forms for UK micro-businesses with AI-guided auto-fill and print-ready PDF export, free to start.",
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
