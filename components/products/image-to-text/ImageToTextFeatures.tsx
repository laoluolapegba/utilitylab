import { Globe, Gauge, FileStack, Wand2, Shield, Layout } from "lucide-react";

const features = [
    {
        icon: Globe,
        title: "Multi-Language Support",
        description: "Extract text in 50+ languages including English, Spanish, French, German, Chinese, Arabic, and more.",
        stats: "50+ Languages"
    },
    {
        icon: Gauge,
        title: "Lightning Fast",
        description: "Advanced OCR engine processes images in under 2 seconds with 99% accuracy rate.",
        stats: "< 2 Seconds"
    },
    {
        icon: FileStack,
        title: "Batch Processing",
        description: "Upload multiple images at once. Pro users can process up to 50 images simultaneously.",
        stats: "Up to 50 Files"
    },
    {
        icon: Wand2,
        title: "Smart Recognition",
        description: "Handles complex layouts, mathematical expressions, tables, and even handwritten text.",
        stats: "99% Accuracy"
    },
    {
        icon: Shield,
        title: "Privacy Protected",
        description: "Zero data retention. Images are processed in memory and immediately deleted after extraction.",
        stats: "GDPR Compliant"
    },
    {
        icon: Layout,
        title: "Format Retention",
        description: "Preserves text structure, paragraphs, and formatting from the original image.",
        stats: "Structure Preserved"
    }
];

export default function ImageToTextFeatures() {
    return (
        <section className="py-20 lg:py-28 bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="block text-[#566AF0] mb-3 text-sm font-bold uppercase tracking-wider">
                        Powerful Features
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl mb-6">
                        Professional-Grade OCR
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Advanced technology that handles complex layouts and various font types to give you the cleanest text possible.
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
                                        <h3 className="text-lg font-bold text-[#0F172A] mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-slate-600 text-sm leading-relaxed mb-3">
                                            {feature.description}
                                        </p>
                                        <div className="inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
                                            {feature.stats}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Format Support */}
                <div className="mt-16 max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl p-8 border border-slate-200">
                        <h3 className="text-center text-lg font-bold text-[#0F172A] mb-6">
                            Supported File Formats
                        </h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {["JPG", "PNG", "JPEG", "BMP", "GIF", "TIFF", "WEBP", "PDF", "HEIC"].map((format) => (
                                <div
                                    key={format}
                                    className="px-4 py-2 bg-slate-50 rounded-lg text-sm font-semibold text-slate-700 border border-slate-200"
                                >
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