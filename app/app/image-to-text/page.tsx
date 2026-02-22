import MarketingNavbar from "@/components/landing/MarketingNavbar";
import ImageToTextHero from "@/components/products/image-to-text/ImageToTextHero";
import HowItWorks from "@/components/products/image-to-text/HowItWorks";
import ImageUpload from "@/components/products/image-to-text/ImageUpload";
import ImageToTextFeatures from "@/components/products/image-to-text/ImageToTextFeatures";
import UseCases from "@/components/products/image-to-text/UseCases";
import PricingSection from "@/components/products/image-to-text/PricingSection";
import ProductFAQ from "@/components/products/image-to-text/ProductFAQ";
import Footer from "@/components/landing/Footer";

export default function ImageToTextPage() {
    return (
        <>
            <MarketingNavbar />
            <main className="min-h-screen bg-white">
                <ImageToTextHero />
                <HowItWorks />
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
                <ImageToTextFeatures />
                <UseCases />
                <PricingSection />
                <ProductFAQ />
                <Footer />
            </main>
        </>
    );
}

export const metadata = {
    title: "Image to Text Converter - Extract Text from Images | Utility Lab",
    description: "Professional OCR tool to extract text from images instantly. Multi-language support, high accuracy, and privacy-first. Free 3 conversions daily.",
};