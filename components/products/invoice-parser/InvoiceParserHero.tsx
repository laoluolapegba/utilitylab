"use client";

import { ReceiptText, Check } from "lucide-react";

const benefits = [
    "PDF & image invoices",
    "UK VAT guidance",
    "Xero-ready CSV export",
    "Privacy-first processing",
];

export default function InvoiceParserHero() {
    const scrollToTool = () => {
        document.getElementById("tool")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-24 bg-gradient-to-b from-slate-50 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
                    {/* Left: Text Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full mb-6">
                            <ReceiptText className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-semibold text-emerald-700">
                                UK Accounting Ready
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] mb-6 leading-tight">
                            Turn Invoices Into{" "}
                            <span className="text-[#566AF0]">Accounting Entries</span>
                        </h1>

                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Drop a PDF or image invoice and get VAT-aware journal entries, UK tax guidance, and Xero-ready CSV output in seconds. Built for freelancers and small businesses.
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
                                Parse Your Invoice
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
                                <span>Files never stored</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Visual */}
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-2xl p-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <ReceiptText className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Invoice_March2024.pdf</p>
                                        <p className="text-xs text-slate-500">Extracted in 1.2s</p>
                                    </div>
                                    <span className="ml-auto px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">Done</span>
                                </div>
                                {[
                                    ["Vendor", "Acme Supplies Ltd"],
                                    ["Invoice #", "INV-2024-0312"],
                                    ["Net amount", "£840.00"],
                                    ["VAT (20%)", "£168.00"],
                                    ["Total", "£1,008.00"],
                                ].map(([label, value]) => (
                                    <div key={label} className="flex justify-between text-sm">
                                        <span className="text-slate-500">{label}</span>
                                        <span className="font-medium text-slate-900">{value}</span>
                                    </div>
                                ))}
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                                        <Check className="w-3 h-3 flex-shrink-0" />
                                        Fully deductible · Input VAT reclaimable · Code 400
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500 opacity-10 blur-[100px] rounded-full" />
                    </div>
                </div>
            </div>
        </section>
    );
}
