"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "Which platforms does it generate copy for?",
        answer: "Amazon (5 bullet points + title), eBay (HTML description), Shopify (meta title, meta description, product description), Etsy (title + 13 tags), WooCommerce (short + long description), Facebook Marketplace, and a generic CSV export.",
    },
    {
        question: "How does it know what keywords to use?",
        answer: "The AI is trained on platform-specific listing patterns and search behaviour. For Amazon it targets A9-relevant keywords; for Etsy it maximises the 13-tag allowance with buyer search terms; for Shopify it follows meta title best practices. You can also specify additional keywords in the brief.",
    },
    {
        question: "Can I customise the tone of the copy?",
        answer: "Yes — the input form includes a tone field (e.g. professional, conversational, luxury, playful) and a target audience field. Both are used across all platform outputs.",
    },
    {
        question: "Does my product data get stored?",
        answer: "No. Product details are sent to the AI to generate the copy and then discarded. Nothing is saved on our servers.",
    },
    {
        question: "Can I edit the generated copy?",
        answer: "Yes — all outputs are rendered in editable text areas so you can tweak copy before copying or downloading.",
    },
    {
        question: "What is the CSV export for?",
        answer: "The CSV export contains all platform outputs in a single file. You can import it into your own tools, share it with a VA, or use it as the basis for bulk product uploads.",
    },
    {
        question: "How many listings can I generate for free?",
        answer: "3 per day on the free plan, shared across all UtilityLab tools. No credit card required. Upgrade to generate more listings and access priority AI.",
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
                        Everything you need to know about the Product Listing Optimiser
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
