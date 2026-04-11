"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "Are my images uploaded to a server?",
        answer: "No. All conversion happens inside your browser using the Canvas API and WebAssembly. Your images never leave your device, which means conversion is both instant and completely private.",
    },
    {
        question: "Which formats are supported?",
        answer: "PNG, JPG/JPEG, WEBP, AVIF, GIF, BMP, TIFF, and ICO as output formats. You can convert from any common image format to any of these.",
    },
    {
        question: "Is there a file size or batch limit?",
        answer: "Because processing is client-side, limits depend on your device's memory rather than a server quota. In practice you can convert dozens of files at once on any modern device.",
    },
    {
        question: "Why should I convert to WEBP or AVIF?",
        answer: "WEBP is typically 25–35% smaller than JPG at equivalent quality, and AVIF is smaller still. Both formats are supported by all modern browsers and are the recommended formats for web images.",
    },
    {
        question: "Can I resize images while converting?",
        answer: "Yes — set a target width or height and the converter will scale the image proportionally (or to exact dimensions if you specify both). Resizing and format conversion happen in one step.",
    },
    {
        question: "How does the quality slider work?",
        answer: "For lossy formats (JPG, WEBP, AVIF), the quality slider sets the compression level from 1 (smallest file, most compression) to 100 (largest file, best quality). PNG is lossless so quality does not apply.",
    },
    {
        question: "Can I convert multiple files at once?",
        answer: "Yes — drop as many files as you like. They convert in parallel and you can download everything as a single ZIP or grab individual files.",
    },
];

export default function ProductFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-20 lg:py-28 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="block text-[#566AF0] mb-3 text-sm font-bold uppercase tracking-wider">
                        FAQ
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl mb-6">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Everything you need to know about Image Converter
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="text-lg font-semibold text-[#0F172A] pr-8">{faq.question}</span>
                                <ChevronDown
                                    className={`flex-shrink-0 w-5 h-5 text-slate-400 transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""}`}
                                />
                            </button>
                            <div className={`overflow-hidden transition-all duration-200 ${openIndex === index ? "max-h-96" : "max-h-0"}`}>
                                <div className="px-6 pb-6">
                                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-slate-600 mb-4">Still have questions?</p>
                    <a
                        href="mailto:support@getutilitylab.com"
                        className="inline-flex items-center gap-2 text-[#566AF0] font-semibold hover:underline"
                    >
                        Contact our support team
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
