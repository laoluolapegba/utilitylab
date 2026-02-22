import MarketingNavbar from "@/components/landing/MarketingNavbar";
import Footer from "@/components/landing/Footer";
import ProductListingOptimizerTool from "@/components/products/product-listing/ProductListingOptimizerTool";

export const metadata = {
    title: "E-commerce Product Listing Optimizer | UtilityLab",
    description:
        "Turn product specs into SEO-optimized listings for Amazon, eBay, Shopify, Etsy, WooCommerce, and Facebook Marketplace in seconds.",
};

export default function ProductListingOptimizerPage() {
    return (
        <>
            <MarketingNavbar />
            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
                <section className="py-16 lg:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                        <div className="max-w-4xl space-y-4">
                            <p className="text-sm font-semibold tracking-wider uppercase text-[#566AF0]">New Tool</p>
                            <h1 className="text-4xl sm:text-5xl font-bold text-[#0F172A]">E-commerce Product Listing Optimizer</h1>
                            <p className="text-lg text-slate-600">
                                Transform basic product specs into platform-ready copy in under a minute. Generate Amazon bullets, eBay HTML, Shopify meta,
                                Etsy tags, WooCommerce descriptions, Facebook listings, and a generic CSV export from one brief.
                            </p>
                        </div>

                        <ProductListingOptimizerTool />
                    </div>
                </section>
                <Footer />
            </main>
        </>
    );
}
