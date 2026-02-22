"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
    {
        question: "What is Utility Lab?",
        answer: "Utility Lab is a collection of privacy-first productivity tools designed to solve everyday tasks. Each tool is focused on doing one thing exceptionally well, from extracting text from images to generating compliance forms."
    },
    {
        question: "Which tools are currently available?",
        answer: "Image to Text is live and ready to use with 3 free conversions daily. We're actively developing PDF to Accounting, Image Format Converter, E-commerce tools, and UK Compliance Form Generator."
    },
    {
        question: "Is my data safe and private?",
        answer: "Absolutely. We process your files in memory and immediately delete them after processing. Nothing is stored on our servers. All tools are GDPR compliant with zero data retention."
    },
    {
        question: "Do I need to create an account?",
        answer: "You can try our tools without an account, but creating a free account gives you access to usage tracking, history, and additional daily conversions."
    },
    {
        question: "What's included in the free tier?",
        answer: "Free users get 3 daily conversions for Image to Text, access to all file formats, and standard processing speed. No credit card required."
    },
    {
        question: "When will Pro plans be available?",
        answer: "Pro plans with unlimited conversions, batch processing, API access, and priority support are coming soon. Sign up to get notified when they launch."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 lg:py-28 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <div className="text-center mb-12">
                    <span className="block text-[#566AF0] mb-3 text-sm font-bold uppercase tracking-wider">
                        FAQ
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border-b border-slate-200"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="flex w-full items-center justify-between py-6 text-left focus:outline-none"
                            >
                                <span className="text-lg font-semibold text-[#0F172A]">
                                    {faq.question}
                                </span>
                                <span className="ml-6 flex-shrink-0 text-slate-500">
                                    {openIndex === index ? (
                                        <div className="bg-slate-900 text-white rounded-full p-1">
                                            <Minus className="h-4 w-4" />
                                        </div>
                                    ) : (
                                        <div className="bg-slate-100 text-slate-900 rounded-full p-1">
                                            <Plus className="h-4 w-4" />
                                        </div>
                                    )}
                                </span>
                            </button>
                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-300 ease-in-out",
                                    openIndex === index ? "max-h-48 opacity-100 pb-6" : "max-h-0 opacity-0"
                                )}
                            >
                                <p className="text-slate-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}