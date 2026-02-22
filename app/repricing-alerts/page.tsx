import MarketingNavbar from "@/components/landing/MarketingNavbar";
import Footer from "@/components/landing/Footer";
import { Bell, Check, Clock3, Globe2, LineChart, ShieldCheck, Zap } from "lucide-react";

export const metadata = {
    title: "Re-Pricing Alerts | UtilityLab",
    description:
        "Monitor competitor prices across Amazon, eBay, Shopify, and any website. Get instant alerts within minutes and react before you lose sales.",
};

const painPoints = [
    "I lost the Buy Box over the weekend because a competitor dropped their price on Friday night.",
    "I spend 2+ hours manually checking competitor prices every morning.",
    "By the time I notice a price change, I've already lost sales.",
    "I sell on Amazon, eBay, and Shopify — checking all three is impossible.",
    "Repricing tools are expensive and overcomplicated for what I need.",
];

const steps = [
    "Install the extension in Chrome, Firefox, or Edge.",
    "Visit any competitor product page (Amazon, eBay, Shopify, or any e-commerce site).",
    "Click the extension and choose Add to monitoring.",
    "Set your alert threshold (example: alert me below £22.99).",
    "Receive instant email, browser, and SMS alerts (plan dependent).",
];

const features = [
    {
        title: "Real-time monitoring",
        description: "Detects price changes in minutes with checks every 5-15 minutes depending on your plan.",
        icon: Clock3,
    },
    {
        title: "Custom thresholds",
        description: "Alert by absolute price, percentage change, stock status, or distance from your own price.",
        icon: Bell,
    },
    {
        title: "Multi-marketplace support",
        description: "Track competitors across Amazon, eBay, Shopify, WooCommerce, and custom storefronts.",
        icon: Globe2,
    },
    {
        title: "Full price intelligence",
        description: "Monitor base price, shipping, total price, seller identity, Buy Box status, and availability.",
        icon: ShieldCheck,
    },
    {
        title: "History and analytics",
        description: "Visualize trends, compare competitors, and export historical data to CSV in seconds.",
        icon: LineChart,
    },
    {
        title: "Fast setup, fast action",
        description: "No APIs and no technical setup. Install, monitor, and respond in under 5 minutes.",
        icon: Zap,
    },
];

const faqs = [
    {
        q: "Do I need API keys or technical setup?",
        a: "No. Re-Pricing Alerts is browser-extension first. Install once, add competitors from product pages, and monitoring starts automatically.",
    },
    {
        q: "Which marketplaces do you support?",
        a: "Amazon, eBay, Shopify, WooCommerce, Magento, BigCommerce, and most custom product pages with visible price data.",
    },
    {
        q: "Does this auto-change my prices?",
        a: "No. This is an alerts + intelligence tool. You stay in control of every pricing decision.",
    },
    {
        q: "How do I get alerts?",
        a: "Email and browser notifications on all plans, with SMS/advanced channels on higher tiers.",
    },
];

export default function RepricingAlertsPage() {
    return (
        <>
            <MarketingNavbar />
            <main className="min-h-screen bg-white text-slate-900">
                <section className="bg-gradient-to-b from-cyan-50 via-white to-white py-16 lg:py-24 border-b border-slate-100">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center space-y-6">
                        <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-sm font-semibold">
                            <Bell className="w-4 h-4" /> Re-Pricing Alerts
                        </p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">Know the instant a competitor changes their price</h1>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            Browser extension + dashboard built for sellers who need to react quickly, protect Buy Box share, and stop losing profit to delayed manual checks.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="#pricing" className="px-6 py-3 rounded-xl bg-[#566AF0] text-white font-semibold hover:opacity-95 transition-opacity">
                                Start Free Trial
                            </a>
                            <a href="#how-it-works" className="px-6 py-3 rounded-xl border border-slate-300 font-semibold hover:bg-slate-50">
                                See How It Works
                            </a>
                        </div>
                    </div>
                </section>

                <section className="py-14">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                        <h2 className="text-3xl font-bold mb-6">Sound familiar?</h2>
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
                        <h2 className="text-3xl font-bold mb-6">Get started in 5 minutes</h2>
                        <ol className="space-y-4">
                            {steps.map((step, index) => (
                                <li key={step} className="bg-white border border-slate-200 rounded-xl p-5 flex gap-4">
                                    <span className="w-8 h-8 rounded-full bg-[#566AF0] text-white font-bold flex items-center justify-center shrink-0">{index + 1}</span>
                                    <p className="text-slate-700">{step}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                <section className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                        <h2 className="text-3xl font-bold mb-8">Your 24/7 price intelligence system</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {features.map((feature) => {
                                const Icon = feature.icon;
                                return (
                                    <article key={feature.title} className="rounded-2xl border border-slate-200 p-6 bg-white">
                                        <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center mb-4">
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
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                        <h2 className="text-3xl font-bold mb-6">Why sellers choose Re-Pricing Alerts</h2>
                        <ul className="grid sm:grid-cols-2 gap-4">
                            {[
                                "Faster setup than repricing suites",
                                "Affordable monthly plans starting at £9",
                                "More control than auto-repricing",
                                "More reliable than manual checking",
                                "Tracks stock + shipping + total price",
                                "Works on virtually any e-commerce website",
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4">
                                    <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                                    <span className="text-slate-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section id="pricing" className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                        <h2 className="text-3xl font-bold mb-8 text-center">Simple pricing for every stage</h2>
                        <div className="grid md:grid-cols-4 gap-4">
                            {[
                                { name: "Free", price: "£0", details: "3 products · checks every 60 mins" },
                                { name: "Starter", price: "£9/mo", details: "25 products · checks every 30 mins" },
                                { name: "Pro", price: "£29/mo", details: "100 products · checks every 15 mins" },
                                { name: "Business", price: "£79/mo", details: "Unlimited · checks every 5 mins" },
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
                            <h2 className="text-3xl font-bold mb-3">Stop losing sales to competitor price changes</h2>
                            <p className="text-slate-300 mb-6">Start monitoring in minutes with a 14-day free trial and no API setup.</p>
                            <a href="#pricing" className="inline-flex px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:opacity-90">
                                Install Browser Extension - Free
                            </a>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
}
