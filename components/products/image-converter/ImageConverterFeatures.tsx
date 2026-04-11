import { Layers, Zap, Archive, SlidersHorizontal, Shield, Maximize2 } from "lucide-react";

const features = [
    {
        icon: Layers,
        title: "20+ Output Formats",
        description: "PNG, JPG, WEBP, AVIF, GIF, BMP, TIFF, ICO, and more. Convert from any format to any other format in a single step.",
        stats: "20+ Formats",
    },
    {
        icon: Zap,
        title: "Instant Batch Conversion",
        description: "Drop multiple files at once and convert them all simultaneously. No queue, no waiting — all processed in parallel in your browser.",
        stats: "Unlimited Files",
    },
    {
        icon: SlidersHorizontal,
        title: "Quality Control",
        description: "Dial in compression level per format. See estimated output size before you download so you can fine-tune the quality/size trade-off.",
        stats: "Per-File Control",
    },
    {
        icon: Maximize2,
        title: "Resize on Convert",
        description: "Optionally scale images to a target width or height while converting. Maintain aspect ratio or set exact dimensions.",
        stats: "Smart Resize",
    },
    {
        icon: Archive,
        title: "ZIP Download",
        description: "Download all converted images in a single ZIP with one click. Individual file downloads also available for quick single-file access.",
        stats: "Batch ZIP",
    },
    {
        icon: Shield,
        title: "Fully Private",
        description: "All conversion happens inside your browser using the Canvas API. No image data is ever sent to a server. Works offline.",
        stats: "Zero Upload",
    },
];

const formats = ["PNG", "JPG", "JPEG", "WEBP", "AVIF", "GIF", "BMP", "TIFF", "ICO", "SVG"];

export default function ImageConverterFeatures() {
    return (
        <section className="py-20 lg:py-28 bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="block text-[#566AF0] mb-3 text-sm font-bold uppercase tracking-wider">
                        Powerful Features
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl mb-6">
                        Every Format. Zero Uploads.
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Professional image conversion that runs entirely in your browser — fast, private, and free.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-[#566AF0]/50 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#566AF0]/10 flex items-center justify-center group-hover:bg-[#566AF0] group-hover:scale-110 transition-all duration-300">
                                        <Icon className="w-6 h-6 text-[#566AF0] group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-[#0F172A] mb-2">{feature.title}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed mb-3">{feature.description}</p>
                                        <div className="inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
                                            {feature.stats}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-16 max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl p-8 border border-slate-200">
                        <h3 className="text-center text-lg font-bold text-[#0F172A] mb-6">Supported Formats</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {formats.map((format) => (
                                <div key={format} className="px-4 py-2 bg-slate-50 rounded-lg text-sm font-semibold text-slate-700 border border-slate-200">
                                    .{format}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
