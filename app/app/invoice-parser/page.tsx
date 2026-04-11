import ProductPageLayout from "@/components/layouts/ProductPageLayout";
import InvoiceParserHero from "@/components/products/invoice-parser/InvoiceParserHero";
import HowItWorks from "@/components/products/invoice-parser/HowItWorks";
import InvoiceParserTool from "@/components/products/invoice-parser/InvoiceParserTool";
import InvoiceParserFeatures from "@/components/products/invoice-parser/InvoiceParserFeatures";
import PricingSection from "@/components/products/invoice-parser/PricingSection";
import ProductFAQ from "@/components/products/invoice-parser/ProductFAQ";

export const metadata = {
    title: "Invoice Parser — free invoice OCR and tax analysis | UtilityLab",
    description: "Upload PDF or image invoices to extract line items, VAT details, and accounting-ready exports — free for freelancers and small businesses.",
};

export default function InvoiceParserPage() {
    return (
        <ProductPageLayout>
            <InvoiceParserHero />
            <HowItWorks />
            <section id="tool" className="py-20 lg:py-28 bg-gradient-to-br from-slate-50 via-white to-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl mb-6">
                            Try It Now
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                            Drop a PDF or image invoice below. Get VAT guidance and accounting-ready output in seconds.
                        </p>
                    </div>
                    <div className="max-w-5xl mx-auto">
                        <InvoiceParserTool />
                    </div>
                </div>
            </section>
            <InvoiceParserFeatures />
            <PricingSection />
            <ProductFAQ />
        </ProductPageLayout>
    );
}
