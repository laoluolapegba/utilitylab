"use client";

import { ShoppingCart, Check } from "lucide-react";

const benefits = [
    "Amazon, eBay, Shopify, Etsy",
    "SEO-optimised copy",
    "Bullet points & meta tags",
    "CSV bulk export",
];

export default function ProductListingHero() {
    const scrollToTool = () => {
        document.getElementById("tool")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-24 bg-gradient-to-b from-slate-50 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
                    {/* Left: Text Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-full mb-6">
                            <ShoppingCart className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-semibold text-orange-700">
                                AI-Powered for Sellers
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] mb-6 leading-tight">
                            Turn Specs Into{" "}
                            <span className="text-[#566AF0]">Platform-Ready Listings</span>
                        </h1>

                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Paste your product details once and get SEO-optimised copy for Amazon, eBay, Shopify, Etsy, and WooCommerce in under a minute.
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
                                Generate Listings Now
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
                                <span>30 free daily</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span>No credit card</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span>7 platforms</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Visual */}
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-2xl p-8">
                            <div className="space-y-4">
                                <div className="pb-4 border-b border-slate-100">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Amazon — Bullet Points</p>
                                    <ul className="space-y-1.5 text-sm text-slate-700">
                                        {[
                                            "✦ Premium stainless steel — rust-proof and dishwasher safe",
                                            "✦ Ergonomic grip handle reduces wrist strain by 40%",
                                            "✦ Compatible with all hob types including induction",
                                        ].map((b) => <li key={b}>{b}</li>)}
                                    </ul>
                                </div>
                                <div className="pb-4 border-b border-slate-100">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Etsy — Tags</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {["kitchen tools", "stainless pan", "induction hob", "eco cookware", "gift for chef"].map((t) => (
                                            <span key={t} className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded-full border border-orange-100">{t}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Shopify — Meta Description</p>
                                    <p className="text-sm text-slate-700">Shop our premium stainless steel frying pan — induction-ready, dishwasher safe, and built to last. Free UK delivery over £40.</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-500 opacity-10 blur-[100px] rounded-full" />
                    </div>
                </div>
            </div>
        </section>
    );
}
