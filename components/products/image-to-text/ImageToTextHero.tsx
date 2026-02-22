"use client";

import Image from "next/image";
import { Sparkles, Check } from "lucide-react";

const benefits = [
    "Extract in 2 seconds",
    "Multi-language support",
    "99% accuracy",
    "Privacy protected"
];

export default function ImageToTextHero() {
    const scrollToTool = () => {
        const toolSection = document.getElementById('tool');
        if (toolSection) {
            toolSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-24 bg-gradient-to-b from-slate-50 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
                    {/* Left: Text Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#566AF0]/10 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-[#566AF0]" />
                            <span className="text-sm font-semibold text-[#566AF0]">
                                Professional OCR Technology
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] mb-6 leading-tight">
                            Turn Any Image Into{" "}
                            <span className="text-[#566AF0]">Clean, Editable Text</span>
                        </h1>

                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Upload screenshots, receipts, or handwritten notes and get accurate OCR results instantly. Built for speed, accuracy, and privacy.
                        </p>

                        {/* Benefits List */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {benefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-green-600" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">
                                        {benefit}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={scrollToTool}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#566AF0] px-8 py-4 text-base font-semibold text-white transition-all hover:translate-y-[-1px] hover:bg-[#4355d6] btn-shadow"
                            >
                                Start Converting Now
                            </button>
                            <a
                                href="#how-it-works"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-white border-2 border-slate-200 px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
                            >
                                See How It Works
                            </a>
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span>3 free daily</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span>No credit card</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span>GDPR compliant</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Preview */}
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                            <Image
                                src="/image2Text_PI.png"
                                alt="Image to Text Converter Interface"
                                width={800}
                                height={600}
                                className="w-full h-auto"
                                priority
                            />
                        </div>
                        {/* Decorative gradient */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#566AF0] opacity-20 blur-[100px] rounded-full" />
                    </div>
                </div>
            </div>
        </section>
    );
}