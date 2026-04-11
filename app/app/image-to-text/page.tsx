import ProductPageLayout from "@/components/layouts/ProductPageLayout";
import ImageToTextHero from "@/components/products/image-to-text/ImageToTextHero";
import HowItWorks from "@/components/products/image-to-text/HowItWorks";
import ImageUpload from "@/components/products/image-to-text/ImageUpload";
import ImageToTextFeatures from "@/components/products/image-to-text/ImageToTextFeatures";
import UseCases from "@/components/products/image-to-text/UseCases";
import PricingSection from "@/components/products/image-to-text/PricingSection";
import ProductFAQ from "@/components/products/image-to-text/ProductFAQ";

export const metadata = {
    title: "Image to Text — free OCR for receipts and documents | UtilityLab",
    description: "Extract text from any image instantly — receipts, screenshots, handwritten notes — with professional-grade OCR, free to start.",
};

export default function ImageToTextPage() {
    return (
        <ProductPageLayout>
            <ImageToTextHero />
            <section id="tool" className="py-20 lg:py-28 bg-gradient-to-br from-slate-50 via-white to-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl mb-6">
                            Try It Now
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                            Upload your images below and see instant results. Get 3 free conversions daily.
                        </p>
                    </div>
                    <div className="max-w-5xl mx-auto">
                        <ImageUpload />
                    </div>
                </div>
            </section>
            <HowItWorks />
            <ImageToTextFeatures />
            <UseCases />
            <PricingSection />
            <ProductFAQ />
        </ProductPageLayout>
    );
}
