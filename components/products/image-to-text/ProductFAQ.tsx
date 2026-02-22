"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "How accurate is the OCR extraction?",
        answer: "Our OCR engine achieves 99% accuracy on clear images. For best results, use high-resolution images with good contrast. The tool handles printed text, typed documents, and even handwritten notes with impressive accuracy."
    },
    {
        question: "What image formats are supported?",
        answer: "We support all major image formats including JPG, PNG, JPEG, BMP, GIF, TIFF, WEBP, PDF, and HEIC. You can also paste images directly from your clipboard."
    },
    {
        question: "Is my data stored on your servers?",
        answer: "No. We process your images in memory and immediately delete them after extraction. Nothing is stored on our servers. We're GDPR compliant and take privacy seriously."
    },
    {
        question: "Can I extract text in multiple languages?",
        answer: "Yes! We support 50+ languages including English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Russian, and many more. The tool automatically detects the language."
    },
    {
        question: "How many images can I convert for free?",
        answer: "Free users get 3 conversions per day. No credit card required. Pro users (coming soon) will get unlimited conversions with additional features like batch processing and API access."
    },
    {
        question: "Can I extract text from handwritten notes?",
        answer: "Yes, our OCR engine can handle handwritten text, though accuracy depends on handwriting clarity. For best results with handwritten content, ensure the image is well-lit and the writing is legible."
    },
    {
        question: "Do you have an API for developers?",
        answer: "API access will be available with the Pro plan (coming soon). It will include full API documentation, webhooks, and higher rate limits for integration into your applications."
    },
    {
        question: "What happens if the extraction isn't perfect?",
        answer: "You can simply edit the extracted text directly in the output box before copying or downloading. For complex layouts or low-quality images, try adjusting the image quality or contrast before uploading."
    }
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
                        Everything you need to know about Image to Text converter
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
                                <span className="text-lg font-semibold text-[#0F172A] pr-8">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`flex-shrink-0 w-5 h-5 text-slate-400 transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-200 ${openIndex === index ? "max-h-96" : "max-h-0"
                                    }`}
                            >
                                <div className="px-6 pb-6">
                                    <p className="text-slate-600 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
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