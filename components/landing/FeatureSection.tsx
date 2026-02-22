import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export default function FeatureSection() {
    return (
        <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                {/* Top Row: Title/Text + Checkmarks */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
                    {/* Left Column: Text */}
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl mb-6">
                            Image-to-Text
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Extract text from images instantly. Whether it's a scanned document, a screenshot, or a photo, our tool accurately captures the text so you can copy, edit, and share it.
                        </p>
                        <div className="mt-8">
                            <Link href="/image-to-text" className="inline-flex items-center gap-2 rounded-full bg-[#566AF0] px-8 py-3.5 text-base font-semibold text-white transition-all hover:translate-y-[-1px] hover:bg-[#4355d6] btn-shadow">
                                Try Image-to-Text
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Checkmarks List */}
                    <div className="flex flex-col gap-4">
                        {[
                            "Multi-language Support",
                            "High Accuracy OCR",
                            "Format Retention",
                            "Instant Export"
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
                                    <Check className="w-4 h-4" />
                                </div>
                                <span className="text-base font-medium text-slate-700">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Row: Full Width Image */}
                <div className="relative w-full overflow-hidden">
                    <Image
                        src="/image2Text_PI.png"
                        alt="Image to Text Interface Interface"
                        width={1200}
                        height={600}
                        className="w-full h-auto object-cover"
                    />
                </div>

            </div>
        </section>
    );
}
