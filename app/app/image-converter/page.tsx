import ProductPageLayout from "@/components/layouts/ProductPageLayout";
import ImageConverterHero from "@/components/products/image-converter/ImageConverterHero";
import HowItWorks from "@/components/products/image-converter/HowItWorks";
import ImageConverterTool from "@/components/products/image-converter/ImageConverterTool";
import ImageConverterFeatures from "@/components/products/image-converter/ImageConverterFeatures";
import PricingSection from "@/components/products/image-converter/PricingSection";
import ProductFAQ from "@/components/products/image-converter/ProductFAQ";

export const metadata = {
    title: "Image Converter — free image format conversion in your browser | UtilityLab",
    description: "Convert images between PNG, JPG, WEBP, AVIF, and 15+ formats instantly — fully client-side, nothing uploaded to any server.",
};

export default function ImageConverterPage() {
    return (
        <ProductPageLayout>
            <ImageConverterHero />
            <HowItWorks />
            <section id="tool" className="py-20 lg:py-28 bg-gradient-to-br from-slate-50 via-white to-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl mb-6">
                            Try It Now
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                            Drop your images below. Convert to any format instantly — no upload, no account needed.
                        </p>
                    </div>
                    <div className="max-w-5xl mx-auto">
                        <ImageConverterTool />
                    </div>
                </div>
            </section>
            <ImageConverterFeatures />
            <PricingSection />
            <ProductFAQ />
        </ProductPageLayout>
    );
}
