import MarketingNavbar from "@/components/landing/MarketingNavbar";
import Footer from "@/components/landing/Footer";
import ImageConverterTool from "@/components/products/image-converter/ImageConverterTool";

export const metadata = {
    title: "Image Format Converter - 100% Client-side | UtilityLab",
    description:
        "Convert images between PNG, JPG, WEBP, GIF, BMP, TIFF, ICO, and AVIF instantly in your browser. Batch conversion, quality control, resize, and ZIP downloads.",
};

export default function ImageConverterPage() {
    return (
        <>
            <MarketingNavbar />
            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
                <section className="py-16 lg:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                        <div className="max-w-3xl">
                            <p className="text-sm font-semibold tracking-wider uppercase text-[#566AF0]">New Tool</p>
                            <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-[#0F172A]">Image Format Converter</h1>
                            <p className="mt-4 text-lg text-slate-600">
                                Convert 20+ image formats instantly with batch processing, compression controls, and resizing. 100% client-side — your images never leave your browser.
                            </p>
                        </div>

                        <ImageConverterTool />
                    </div>
                </section>
                <Footer />
            </main>
        </>
    );
}
