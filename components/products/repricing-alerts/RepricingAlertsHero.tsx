import { Bell } from "lucide-react";

const painPoints = [
    "I lost the Buy Box over the weekend because a competitor dropped their price on Friday night.",
    "I spend 2+ hours manually checking competitor prices every morning.",
    "By the time I notice a price change, I've already lost sales.",
    "I sell on Amazon, eBay, and Shopify — checking all three is impossible.",
    "Repricing tools are expensive and overcomplicated for what I need.",
];

export default function RepricingAlertsHero() {
    return (
        <>
            <section className="bg-gradient-to-b from-cyan-50 via-white to-white py-16 lg:py-24 border-b border-slate-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center space-y-6">
                    <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-sm font-semibold">
                        <Bell className="w-4 h-4" /> Re-Pricing Alerts
                    </p>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                        Know the instant a competitor changes their price
                    </h1>
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
        </>
    );
}
