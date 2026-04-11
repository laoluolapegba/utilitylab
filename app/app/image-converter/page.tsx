import ProductPageLayout from "@/components/layouts/ProductPageLayout";
import ImageConverterTool from "@/components/products/image-converter/ImageConverterTool";

export const metadata = {
    title: "Image Converter — free image format conversion in your browser | UtilityLab",
    description: "Convert images between PNG, JPG, WEBP, AVIF, and 15+ formats instantly — fully client-side, nothing uploaded to any server.",
};

export default function ImageConverterPage() {
    return (
        <ProductPageLayout className="bg-gradient-to-br from-slate-50 via-white to-indigo-50">
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
        </ProductPageLayout>
    );
}
