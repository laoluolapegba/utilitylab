"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "What file types does the invoice parser accept?",
        answer: "PDF, PNG, and JPG files up to 10 MB. This covers the vast majority of invoices — scanned PDFs, emailed supplier invoices, and photographs taken on your phone all work.",
    },
    {
        question: "How accurate is the data extraction?",
        answer: "On clear, standard-format invoices accuracy is very high. OCR confidence is shown after each extraction so you know when to double-check. Every field is editable before export — you stay in control.",
    },
    {
        question: "Is my invoice data stored on your servers?",
        answer: "No. Files are processed in memory and immediately discarded. No invoice content, vendor names, or amounts are ever logged or stored. We're GDPR compliant.",
    },
    {
        question: "Does it work for UK VAT invoices?",
        answer: "Yes — that's the primary use case. The AI identifies Input VAT, checks reclaimability rules (including partial business/personal use), and cites the relevant HMRC guidance for sole traders and limited companies.",
    },
    {
        question: "Can I import the output into Xero?",
        answer: "Yes. The Xero CSV export format matches Xero's bank statement import template so you can import it directly. You can also download a double-entry journal or plain-English summary.",
    },
    {
        question: "What is the Q&A feature?",
        answer: "After analysis, you can type plain-English questions about the invoice — e.g. 'Can I claim this if I also use my home office for personal use?' — and get a plain-English answer based on UK tax rules. It is guidance, not legal advice.",
    },
    {
        question: "How many invoices can I parse for free?",
        answer: "3 per day on the free plan, shared across all UtilityLab tools. No credit card required. Upgrade to process more invoices and access priority OCR.",
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
                        Everything you need to know about Invoice Parser
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
