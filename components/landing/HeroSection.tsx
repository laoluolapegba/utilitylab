import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const highlights = [
    { icon: Zap, text: "Lightning fast" },
    { icon: Shield, text: "Privacy-first" },
    { icon: Clock, text: "Save hours daily" }
];

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Text Content */}
                <div className="mx-auto max-w-5xl text-center">
                    <span className="inline-block text-[#566AF0] mb-4 text-sm font-bold uppercase tracking-wider">
                        Privacy-first Productivity Tools
                    </span>

                    <h1 className="text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl mb-6 leading-tight">
                        Simple Utilities That{" "}
                        <span className="text-[#566AF0]">Just Work</span>
                    </h1>

                    <p className="text-lg text-slate-600 mb-6 leading-relaxed max-w-2xl mx-auto">
                        A collection of focused tools designed to save you time. No bloat, no complexity – just fast, reliable utilities for everyday tasks.
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
                        {highlights.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-[#566AF0]/10 flex items-center justify-center">
                                        <Icon className="w-4 h-4 text-[#566AF0]" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">
                                        {item.text}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link
                            href="/app/image-to-text"
                            className={cn(
                                "inline-flex items-center gap-2 rounded-full bg-[#566AF0] px-8 py-3.5 text-base font-semibold text-white transition-all hover:translate-y-[-1px] hover:bg-[#4355d6]",
                                "btn-shadow"
                            )}
                        >
                            Try Image to Text
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <a
                            href="#products"
                            className="inline-flex items-center gap-2 rounded-full bg-white border-2 border-slate-200 px-8 py-3.5 text-base font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
                        >
                            View All Tools
                        </a>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="relative mx-auto max-w-5xl">
                    <div className="relative overflow-hidden rounded-[32px] shadow-2xl border border-slate-200">
                        <Image
                            src="/heroImage.png"
                            alt="Utility Lab Dashboard"
                            width={1200}
                            height={800}
                            className="w-full h-auto object-cover"
                            priority
                        />
                    </div>
                    {/* Gradient glow behind image */}
                    <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-[#566AF0] opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
                </div>
            </div>
        </section>
    );
}