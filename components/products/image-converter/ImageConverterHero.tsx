"use client";

import { Layers, Check } from "lucide-react";

const benefits = [
    "20+ output formats",
    "100% client-side",
    "Batch conversion",
    "No file size limits",
];

export default function ImageConverterHero() {
    const scrollToTool = () => {
        document.getElementById("tool")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-24 bg-gradient-to-b from-slate-50 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
                    {/* Left: Text Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full mb-6">
                            <Layers className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-semibold text-purple-700">
                                Runs Entirely in Your Browser
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] mb-6 leading-tight">
                            Convert Images to{" "}
                            <span className="text-[#566AF0]">Any Format, Instantly</span>
                        </h1>

                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Convert between PNG, JPG, WEBP, AVIF, and 20+ formats with compression controls and batch processing. Your images never leave your device.
                        </p>

                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {benefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-green-600" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={scrollToTool}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#566AF0] px-8 py-4 text-base font-semibold text-white transition-all hover:translate-y-[-1px] hover:bg-[#4355d6] btn-shadow"
                            >
                                Convert Images Now
                            </button>
                            <a
                                href="#how-it-works"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-white border-2 border-slate-200 px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
                            >
                                See How It Works
                            </a>
                        </div>

                        <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span>Free forever</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span>No uploads</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span>No account needed</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Visual */}
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-2xl p-8">
                            <div className="space-y-5">
                                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                    <span className="text-sm font-semibold text-slate-900">3 files selected</span>
                                    <span className="text-xs text-slate-500">Converting to WEBP</span>
                                </div>
                                {[
                                    { name: "photo-01.png", from: "PNG", to: "WEBP", saving: "68%" },
                                    { name: "banner.jpg",   from: "JPG", to: "WEBP", saving: "54%" },
                                    { name: "avatar.jpeg",  from: "JPEG", to: "WEBP", saving: "61%" },
                                ].map((f) => (
                                    <div key={f.name} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                            <Layers className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate">{f.name}</p>
                                            <p className="text-xs text-slate-500">{f.from} → {f.to}</p>
                                        </div>
                                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                            −{f.saving}
                                        </span>
                                    </div>
                                ))}
                                <button className="w-full mt-2 rounded-xl bg-[#566AF0] text-white text-sm font-semibold py-2.5 text-center">
                                    Download all (ZIP)
                                </button>
                            </div>
                        </div>
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-500 opacity-10 blur-[100px] rounded-full" />
                    </div>
                </div>
            </div>
        </section>
    );
}
