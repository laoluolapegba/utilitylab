"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Sparkles, Zap, Shield } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// ── Plan definitions ──────────────────────────────────────────────────────────

const PLANS = [
    {
        key:         "free",
        name:        "Free",
        monthly:     0,
        yearly:      0,
        description: "Try every tool, no card needed.",
        cta:         "Get started free",
        ctaVariant:  "outline" as const,
        popular:     false,
        comingSoon:  false,
        features: [
            "3 uses per day across all tools",
            "All 6 tools included",
            "All file formats",
            "Privacy-first — zero data retention",
            "Standard processing speed",
        ],
    },
    {
        key:        "starter",
        name:       "Starter",
        monthly:    5,
        yearly:     4,
        description: "For individuals who use tools daily.",
        cta:        "Upgrade to Starter",
        ctaVariant: "primary" as const,
        popular:    true,
        comingSoon: false,
        badge:      "Most popular",
        features: [
            "50 uses per day across all tools",
            "All 6 tools included",
            "All file formats",
            "Privacy-first — zero data retention",
            "Priority processing speed",
            "Email support",
        ],
    },
    {
        key:        "pro",
        name:       "Pro",
        monthly:    12,
        yearly:     10,
        description: "Unlimited power for heavy workflows.",
        cta:        "Coming soon",
        ctaVariant: "outline" as const,
        popular:    false,
        comingSoon: true,
        features: [
            "Unlimited uses per day",
            "All 6 tools included",
            "All file formats",
            "Privacy-first — zero data retention",
            "Priority processing speed",
            "Batch processing (50 files)",
            "API access",
            "Priority support",
        ],
    },
];

// ── Feature comparison table ──────────────────────────────────────────────────

const COMPARISON = [
    {
        category: "Usage",
        rows: [
            { label: "Daily uses",            free: "30 / day",   starter: "50 / day",   pro: "Unlimited" },
            { label: "All 6 tools",            free: true,        starter: true,          pro: true },
            { label: "All file formats",       free: true,        starter: true,          pro: true },
        ],
    },
    {
        category: "Performance",
        rows: [
            { label: "Processing speed",       free: "Standard", starter: "Priority",    pro: "Priority" },
            { label: "Batch processing",       free: false,      starter: false,          pro: "50 files" },
            { label: "API access",             free: false,      starter: false,          pro: true },
        ],
    },
    {
        category: "Privacy & Security",
        rows: [
            { label: "Zero data retention",    free: true,       starter: true,           pro: true },
            { label: "GDPR compliant",         free: true,       starter: true,           pro: true },
            { label: "Files processed in-memory", free: true,    starter: true,           pro: true },
        ],
    },
    {
        category: "Support",
        rows: [
            { label: "Community support",      free: true,       starter: true,           pro: true },
            { label: "Email support",          free: false,      starter: true,           pro: true },
            { label: "Priority support",       free: false,      starter: false,          pro: true },
        ],
    },
];

const FAQS = [
    {
        q: "What counts as a 'use'?",
        a: "One file processed by any tool counts as one use. For example, uploading a single image to Image to Text, or converting one image — each is one use. Your counter resets at midnight UTC every day.",
    },
    {
        q: "Do I need a credit card to start?",
        a: "No. The Free plan requires no payment details. You only need a card when you choose to upgrade to Starter.",
    },
    {
        q: "Can I cancel my Starter plan anytime?",
        a: "Yes — cancel any time from your account settings. You keep Starter access until the end of the billing period. No questions asked.",
    },
    {
        q: "Are my files stored or shared?",
        a: "Never. All files are processed in-memory and immediately discarded. We never store your content, and our servers never log it. Only anonymised metadata (file size, processing time) is retained for reliability monitoring.",
    },
    {
        q: "What happens when I hit my daily limit?",
        a: "You'll see a prompt to upgrade. Your existing results stay accessible — nothing is deleted. Limits reset at midnight UTC, so you can always wait for the free reset.",
    },
    {
        q: "Is the yearly discount applied automatically?",
        a: "Yes — when you select yearly billing at checkout, Stripe applies the discounted rate automatically. You're billed once per year.",
    },
];

// ── Cell renderer ─────────────────────────────────────────────────────────────

function Cell({ value }: { value: boolean | string }) {
    if (value === true)  return <Check className="w-4 h-4 text-[#566AF0] mx-auto" />;
    if (value === false) return <X     className="w-4 h-4 text-slate-300 mx-auto" />;
    return <span className="text-sm text-slate-700 font-medium">{value}</span>;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PricingPage() {
    const router   = useRouter();
    const [yearly, setYearly]   = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [loading, setLoading] = useState<string | null>(null);

    async function handleCTA(plan: typeof PLANS[number]) {
        if (plan.comingSoon || plan.key === "free") {
            router.push("/auth?mode=signup");
            return;
        }

        setLoading(plan.key);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/auth?mode=signup");
                return;
            }

            const priceId = yearly
                ? process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY ?? process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER
                : process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER;

            const res = await fetch("/api/billing/checkout", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ priceId, userId: session.user.id }),
            });

            if (!res.ok) throw new Error();
            const { url } = await res.json();
            if (url) window.location.href = url;
        } catch {
            // fall through — just stop spinning
        } finally {
            setLoading(null);
        }
    }

    return (
        <>
            {/* ── Hero ───────────────────────────────────────────────────────── */}
            <section className="pt-20 pb-4 text-center px-4">
                <span className="inline-block text-[#566AF0] text-sm font-bold uppercase tracking-widest mb-4">
                    Pricing
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A] mb-4">
                    Simple, transparent pricing
                </h1>
                <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10">
                    Start free. Upgrade when you need more. No hidden fees, no surprises.
                </p>

                {/* Billing toggle */}
                <div className="inline-flex items-center gap-3 bg-slate-100 rounded-full p-1">
                    <button
                        onClick={() => setYearly(false)}
                        className={[
                            "rounded-full px-5 py-2 text-sm font-semibold transition-all",
                            !yearly ? "bg-white text-[#0F172A] shadow-sm" : "text-slate-500 hover:text-slate-700",
                        ].join(" ")}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setYearly(true)}
                        className={[
                            "rounded-full px-5 py-2 text-sm font-semibold transition-all flex items-center gap-2",
                            yearly ? "bg-white text-[#0F172A] shadow-sm" : "text-slate-500 hover:text-slate-700",
                        ].join(" ")}
                    >
                        Yearly
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                            Save 20%
                        </span>
                    </button>
                </div>
            </section>

            {/* ── Plan cards ─────────────────────────────────────────────────── */}
            <section className="py-12 px-4">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {PLANS.map((plan) => {
                        const price = yearly ? plan.yearly : plan.monthly;
                        const isPopular = plan.popular;

                        return (
                            <div
                                key={plan.key}
                                className={[
                                    "relative rounded-3xl p-8 border-2 transition-all",
                                    isPopular
                                        ? "border-[#566AF0] shadow-2xl shadow-[#566AF0]/10 md:-mt-4"
                                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md",
                                    isPopular ? "bg-white" : "",
                                ].join(" ")}
                            >
                                {/* Popular badge */}
                                {isPopular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-gradient-to-r from-[#566AF0] to-[#4355d6] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                                        <Sparkles className="w-3 h-3" />
                                        {plan.badge}
                                    </div>
                                )}

                                <h2 className="text-base font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    {plan.name}
                                </h2>

                                <div className="flex items-end gap-1 mb-1">
                                    <span className="text-5xl font-extrabold text-[#0F172A]">
                                        £{price}
                                    </span>
                                    {price > 0 && (
                                        <span className="text-slate-500 text-base mb-2">
                                            / {yearly ? "mo, billed yearly" : "month"}
                                        </span>
                                    )}
                                    {price === 0 && (
                                        <span className="text-slate-500 text-base mb-2">/ forever</span>
                                    )}
                                </div>

                                <p className="text-sm text-slate-500 mb-6">{plan.description}</p>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                                            <Check className="w-4 h-4 text-[#566AF0] flex-shrink-0 mt-0.5" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleCTA(plan)}
                                    disabled={plan.comingSoon || loading === plan.key}
                                    className={[
                                        "w-full rounded-full py-3 text-sm font-bold transition-all",
                                        plan.comingSoon
                                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                            : plan.ctaVariant === "primary"
                                            ? "bg-[#566AF0] text-white hover:bg-[#4355d6] btn-shadow"
                                            : "border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                                        loading === plan.key ? "opacity-60 cursor-wait" : "",
                                    ].join(" ")}
                                >
                                    {loading === plan.key ? "Redirecting…" : plan.cta}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Trust strip */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-slate-500">
                    <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> No credit card for free plan</span>
                    <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Cancel anytime</span>
                    <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-500" /> GDPR compliant</span>
                    <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-emerald-500" /> Zero data retention</span>
                </div>
            </section>

            {/* ── Feature comparison ─────────────────────────────────────────── */}
            <section className="py-16 px-4 bg-slate-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-[#0F172A] text-center mb-10">
                        Full feature comparison
                    </h2>

                    <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                        {/* Header row */}
                        <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200">
                            <div className="p-4" />
                            {PLANS.map((p) => (
                                <div key={p.key} className={["p-4 text-center", p.popular ? "bg-[#566AF0]/5" : ""].join(" ")}>
                                    <p className={["text-sm font-bold", p.popular ? "text-[#566AF0]" : "text-slate-700"].join(" ")}>
                                        {p.name}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {p.monthly === 0 ? "Free" : `£${p.monthly}/mo`}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {COMPARISON.map((section, si) => (
                            <div key={si}>
                                {/* Category header */}
                                <div className="grid grid-cols-4 bg-slate-50/60 border-b border-slate-100">
                                    <div className="col-span-4 px-4 py-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            {section.category}
                                        </span>
                                    </div>
                                </div>

                                {section.rows.map((row, ri) => (
                                    <div
                                        key={ri}
                                        className={[
                                            "grid grid-cols-4 border-b border-slate-100 last:border-0",
                                            ri % 2 === 0 ? "bg-white" : "bg-slate-50/40",
                                        ].join(" ")}
                                    >
                                        <div className="px-4 py-3 text-sm text-slate-600">{row.label}</div>
                                        <div className="px-4 py-3 text-center"><Cell value={row.free} /></div>
                                        <div className="px-4 py-3 text-center bg-[#566AF0]/5"><Cell value={row.starter} /></div>
                                        <div className="px-4 py-3 text-center"><Cell value={row.pro} /></div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ────────────────────────────────────────────────────────── */}
            <section className="py-16 px-4">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-[#0F172A] text-center mb-10">
                        Frequently asked questions
                    </h2>

                    <div className="space-y-2">
                        {FAQS.map((faq, i) => (
                            <div
                                key={i}
                                className="border border-slate-200 rounded-2xl overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                                >
                                    <span className="text-sm font-semibold text-[#0F172A]">{faq.q}</span>
                                    <span className={["text-[#566AF0] text-lg font-light transition-transform flex-shrink-0 ml-4", openFaq === i ? "rotate-45" : ""].join(" ")}>
                                        +
                                    </span>
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-5">
                                        <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
            <section className="py-16 px-4 bg-gradient-to-br from-[#566AF0] to-[#4355d6] text-center">
                <h2 className="text-3xl font-extrabold text-white mb-3">
                    Ready to get more done?
                </h2>
                <p className="text-indigo-200 mb-8 max-w-md mx-auto text-base">
                    Start with 30 free uses a day — no card, no commitment.
                </p>
                <a
                    href="/auth?mode=signup"
                    className="inline-flex items-center justify-center rounded-full bg-white text-[#566AF0] font-bold px-8 py-3.5 text-sm hover:bg-indigo-50 transition-colors shadow-lg"
                >
                    Create free account
                </a>
            </section>
        </>
    );
}
