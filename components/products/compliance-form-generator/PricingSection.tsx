import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const included = [
    "3 free form generations per day — no card required",
    "HMRC and Companies House compliant templates",
    "AI-guided plain-English form completion",
    "Auto-fill from your saved business details",
    "Upgrade for 50 uses per day across every tool",
];

export default function PricingSection() {
    return (
        <section className="py-16 bg-slate-50 border-y border-slate-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
                <span className="block text-[#566AF0] text-sm font-bold uppercase tracking-wider mb-3">
                    Pricing
                </span>
                <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] mb-4">
                    Included in your UtilityLab plan
                </h2>
                <p className="text-slate-500 max-w-xl mx-auto mb-10 text-base leading-relaxed">
                    Compliance Form Generator is part of the UtilityLab suite — one subscription unlocks every tool.
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
                        className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 text-slate-700 font-semibold px-7 py-3 text-sm hover:border-slate-300 hover:bg-white transition-colors"
                    >
                        See all plans <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
