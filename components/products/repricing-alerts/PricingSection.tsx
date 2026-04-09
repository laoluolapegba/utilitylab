import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const included = [
    "Monitor up to 3 products on the Free plan",
    "Instant email alerts on price changes",
    "Multi-marketplace tracking (Amazon, eBay, Shopify)",
    "Price history and trend visualisation",
    "Upgrade for more products and faster checks",
];

export default function PricingSection() {
    return (
        <section className="py-16 bg-slate-50 border-y border-slate-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-[#566AF0] mb-3">Pricing</p>
                <h2 className="text-3xl font-bold text-[#0F172A] mb-4">
                    Included in your UtilityLab plan
                </h2>
                <p className="text-slate-500 max-w-xl mx-auto mb-10 text-base leading-relaxed">
                    Re-Pricing Alerts is part of the UtilityLab suite — one subscription unlocks every tool.
                    Start free, no card required.
                </p>

                <div className="inline-flex flex-col items-start gap-3 mb-10 text-left">
                    {included.map((item) => (
                        <div key={item} className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-[#566AF0]/10 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-[#566AF0]" />
                            </span>
                            <span className="text-sm text-slate-700">{item}</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/auth?mode=signup"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#566AF0] text-white font-semibold px-7 py-3 text-sm hover:bg-[#4355d6] transition-colors btn-shadow"
                    >
                        Get started free
                    </Link>
                    <Link
                        href="/pricing"
                        className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 text-slate-700 font-semibold px-7 py-3 text-sm hover:border-slate-300 hover:bg-slate-50 transition-colors"
                    >
                        See all plans <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
