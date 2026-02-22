import MarketingNavbar from "@/components/landing/MarketingNavbar";
import Footer from "@/components/landing/Footer";
import { Check, FileCheck, ShieldCheck, Sparkles, Clock3, CalendarClock, FileDown, Users, ArrowRight } from "lucide-react";

export const metadata = {
    title: "Compliance Form Generator | UtilityLab",
    description:
        "Generate HMRC and Companies House compliant forms in minutes with AI form discovery, plain-English guidance, auto-fill, and print-ready PDF export.",
};

const painPoints = [
    "I spent hours on gov.uk trying to work out which form I actually need.",
    "I hired my first employee and got lost in P45/P46/starter checklist confusion.",
    "HMRC asks for terms like 'Class 1A NICs' and I have no idea what they mean.",
    "I keep repeating company details on every form and worrying about typos.",
    "One wrong box can mean rejection, delays, and potential penalties.",
    "Accountants quote £150-£300 for forms I wish I could complete myself.",
];

const steps = [
    "Tell us what you need to do (for example: 'register for VAT' or 'change company address').",
    "AI identifies the exact forms and explains why they apply.",
    "Answer plain-English questions with examples and contextual help.",
    "We auto-fill repeated business details and validate your answers.",
    "Download print-ready PDF forms with submission guidance and deadlines.",
];

const features = [
    {
        title: "AI form discovery",
        description: "Describe your scenario in everyday language and get the correct HMRC/Companies House forms instantly.",
        icon: Sparkles,
    },
    {
        title: "Smart auto-fill profile",
        description: "Save your company number, UTR, VAT number, director details, and address once, then reuse everywhere.",
        icon: Users,
    },
    {
        title: "Plain-English guidance",
        description: "Every field includes non-jargon explanations, common examples, and links to official guidance when needed.",
        icon: FileCheck,
    },
    {
        title: "Validation before submission",
        description: "Catch missing fields, invalid formats, and common filing errors before you print or submit.",
        icon: ShieldCheck,
    },
    {
        title: "Deadline tracking",
        description: "Auto-calculate due dates and send reminders so you avoid late-filing penalties.",
        icon: CalendarClock,
    },
    {
        title: "Official PDF export",
        description: "Export clean, print-ready documents in official form layout with submission instructions.",
        icon: FileDown,
    },
];

const formBuckets = [
    {
        title: "HMRC Tax Forms",
        forms: ["SA100", "SA103S", "VAT1", "VAT484", "P11D", "P45/P46", "64-8", "CA5603"],
    },
    {
        title: "Companies House",
        forms: ["IN01 (guided)", "AP01", "TM01", "CH01", "AA01", "CS01 checklist", "DS01"],
    },
    {
        title: "Employment & HR",
        forms: ["New employee pack", "P60 template", "Contract template", "Holiday request", "Sickness form"],
    },
    {
        title: "GDPR & Operations",
        forms: ["Privacy notice", "Data processing agreement", "SAR form", "Data breach form", "Expense & mileage logs"],
    },
];

const faqs = [
    {
        q: "Are these forms HMRC and Companies House compliant?",
        a: "Yes. The generator uses official form structures and keeps versions updated when government forms change.",
    },
    {
        q: "Can you submit forms to HMRC for me automatically?",
        a: "Not directly. We generate completion-ready PDFs plus clear instructions for online submission, posting, or sharing with your accountant.",
    },
    {
        q: "Can this replace my accountant?",
        a: "For many routine forms, yes. For complex tax planning or investigations, use a qualified accountant for review and strategy.",
    },
    {
        q: "Do I need an account?",
        a: "You can try a first form without signup. Create an account for saved business profiles, reusable auto-fill, and deadline reminders.",
    },
];

export default function ComplianceFormGeneratorPage() {
    return (
        <>
            <MarketingNavbar />
            <main className="min-h-screen bg-white text-slate-900">
                <section className="bg-gradient-to-b from-indigo-50 via-white to-white py-16 lg:py-24 border-b border-slate-100">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center space-y-6">
                        <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-semibold">
                            <FileCheck className="w-4 h-4" /> UK Compliance Form Generator
                        </p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                            Stop wasting hours on government paperwork
                        </h1>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            Answer a few questions, get the exact forms you need, auto-filled and ready to download in minutes.
                            Built for UK sole traders, micro-businesses, and small limited companies.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="#pricing" className="px-6 py-3 rounded-xl bg-[#566AF0] text-white font-semibold hover:opacity-95 transition-opacity">
                                Generate Your First Form - Free
                            </a>
                            <a href="#how-it-works" className="px-6 py-3 rounded-xl border border-slate-300 font-semibold hover:bg-slate-50">
                                See How It Works
                            </a>
                        </div>
                        <p className="text-sm text-slate-500">✓ HMRC-aware guidance ✓ Auto-fill profile ✓ Print-ready PDF export</p>
                    </div>
                </section>

                <section className="py-14">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                        <h2 className="text-3xl font-bold mb-6">If you run a UK business, this probably sounds familiar...</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {painPoints.map((point) => (
                                <div key={point} className="rounded-xl border border-slate-200 p-5 bg-slate-50">
                                    <p className="text-slate-700">😤 {point}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="how-it-works" className="py-14 bg-slate-50 border-y border-slate-100">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                        <h2 className="text-3xl font-bold mb-6">From confusion to completed forms in 5 steps</h2>
                        <ol className="space-y-4">
                            {steps.map((step, index) => (
                                <li key={step} className="flex items-start gap-4 bg-white rounded-xl border border-slate-200 p-4">
                                    <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold inline-flex items-center justify-center shrink-0">{index + 1}</span>
                                    <p className="text-slate-700">{step}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                <section className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                        <h2 className="text-3xl font-bold mb-8">Everything needed for routine compliance</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {features.map((feature) => {
                                const Icon = feature.icon;
                                return (
                                    <article key={feature.title} className="rounded-2xl border border-slate-200 p-6 bg-white">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="py-14 bg-slate-50 border-y border-slate-100">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                        <h2 className="text-3xl font-bold mb-8">Launch form coverage</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {formBuckets.map((bucket) => (
                                <article key={bucket.title} className="rounded-xl bg-white border border-slate-200 p-5">
                                    <h3 className="font-semibold text-lg mb-3">{bucket.title}</h3>
                                    <ul className="space-y-2">
                                        {bucket.forms.map((form) => (
                                            <li key={form} className="flex items-center gap-2 text-slate-700 text-sm">
                                                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                                {form}
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="pricing" className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                        <h2 className="text-3xl font-bold mb-8 text-center">Simple pricing for UK businesses</h2>
                        <div className="grid md:grid-cols-4 gap-4">
                            {[
                                { name: "Free", price: "£0", details: "1 form/month · basic completion" },
                                { name: "Starter", price: "£9/mo", details: "10 forms/month · auto-fill + validation" },
                                { name: "Pro", price: "£19/mo", details: "Unlimited forms · reminders + form history" },
                                { name: "Business", price: "£49/mo", details: "Multi-business + team access + priority support" },
                            ].map((tier) => (
                                <div key={tier.name} className="rounded-2xl border border-slate-200 p-6 bg-white">
                                    <p className="text-sm uppercase tracking-wide text-slate-500 mb-2">{tier.name}</p>
                                    <p className="text-3xl font-bold mb-2">{tier.price}</p>
                                    <p className="text-slate-600 text-sm">{tier.details}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-14 bg-slate-50 border-y border-slate-100">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                        <h2 className="text-3xl font-bold mb-8">Frequently asked questions</h2>
                        <div className="space-y-4">
                            {faqs.map((faq) => (
                                <article key={faq.q} className="rounded-xl bg-white border border-slate-200 p-5">
                                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                                    <p className="text-slate-600">{faq.a}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                        <div className="rounded-3xl bg-[#0F172A] text-white p-10 text-center">
                            <h2 className="text-3xl font-bold mb-3">Get the right forms and complete them with confidence</h2>
                            <p className="text-slate-300 mb-6">Built for UK business owners who want to stay compliant without spending hours on admin.</p>
                            <a href="#pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:opacity-90">
                                Generate Your First Form - Free
                                <ArrowRight className="w-4 h-4" />
                            </a>
                            <p className="text-xs text-slate-400 mt-4 inline-flex items-center gap-2 justify-center">
                                <Clock3 className="w-4 h-4" /> Usually completed in under 10 minutes.
                            </p>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
}
