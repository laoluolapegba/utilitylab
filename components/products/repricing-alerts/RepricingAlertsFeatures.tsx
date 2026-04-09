import { Check, Bell, Clock3, Globe2, LineChart, ShieldCheck, Zap } from "lucide-react";

const features = [
    {
        title: "Real-time monitoring",
        description: "Detects price changes quickly and delivers alerts before your competitors can react.",
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

const sellingPoints = [
    "Faster setup than full repricing suites",
    "Included in your UtilityLab plan",
    "More control than auto-repricing",
    "More reliable than manual checking",
    "Tracks stock + shipping + total price",
    "Works on virtually any e-commerce website",
];

export default function RepricingAlertsFeatures() {
    return (
        <>
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
                        {sellingPoints.map((item) => (
                            <li key={item} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4">
                                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                                <span className="text-slate-700">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </>
    );
}
