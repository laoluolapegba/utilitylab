import ProductPageLayout from "@/components/layouts/ProductPageLayout";
import ComplianceFormGeneratorHero from "@/components/products/compliance-form-generator/ComplianceFormGeneratorHero";
import HowItWorks from "@/components/products/compliance-form-generator/HowItWorks";
import ComplianceFormGeneratorFeatures from "@/components/products/compliance-form-generator/ComplianceFormGeneratorFeatures";
import PricingSection from "@/components/products/compliance-form-generator/PricingSection";
import ProductFAQ from "@/components/products/compliance-form-generator/ProductFAQ";

export const metadata = {
    title: "Compliance Form Generator — free UK business form builder | UtilityLab",
    description: "Generate HMRC-compliant forms for UK micro-businesses with AI-guided auto-fill and print-ready PDF export, free to start.",
};

export default function ComplianceFormGeneratorPage() {
    return (
        <ProductPageLayout>
            <ComplianceFormGeneratorHero />
            <HowItWorks />
            <ComplianceFormGeneratorFeatures />
            <PricingSection />
            <ProductFAQ />
        </ProductPageLayout>
    );
}
