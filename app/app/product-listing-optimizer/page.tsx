import ProductPageLayout from "@/components/layouts/ProductPageLayout";
import ProductListingHero from "@/components/products/product-listing/ProductListingHero";
import HowItWorks from "@/components/products/product-listing/HowItWorks";
import ProductListingOptimizerTool from "@/components/products/product-listing/ProductListingOptimizerTool";
import ProductListingFeatures from "@/components/products/product-listing/ProductListingFeatures";
import PricingSection from "@/components/products/product-listing/PricingSection";
import ProductFAQ from "@/components/products/product-listing/ProductFAQ";

export const metadata = {
    title: "Product Listing Optimiser — free AI listing generator for sellers | UtilityLab",
    description: "Turn product specs into SEO-optimised listings for Amazon, eBay, Shopify, and Etsy in seconds — free for online sellers.",
};

export default function ProductListingOptimizerPage() {
    return (
        <ProductPageLayout>
            <ProductListingHero />
            <HowItWorks />
            <section id="tool" className="py-20 lg:py-28 bg-gradient-to-br from-slate-50 via-white to-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl mb-6">
                            Try It Now
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                            Describe your product once and get SEO-ready copy for every major marketplace in under a minute.
                        </p>
                    </div>
                    <div className="max-w-5xl mx-auto">
                        <ProductListingOptimizerTool />
                    </div>
                </div>
            </section>
            <ProductListingFeatures />
            <PricingSection />
            <ProductFAQ />
        </ProductPageLayout>
    );
}
