const tiers = [
    { name: "Free", price: "£0", details: "3 products · checks every 60 mins" },
    { name: "Starter", price: "£9/mo", details: "25 products · checks every 30 mins" },
    { name: "Pro", price: "£29/mo", details: "100 products · checks every 15 mins" },
    { name: "Business", price: "£79/mo", details: "Unlimited · checks every 5 mins" },
];

export default function PricingSection() {
    return (
        <section id="pricing" className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <h2 className="text-3xl font-bold mb-8 text-center">Simple pricing for every stage</h2>
                <div className="grid md:grid-cols-4 gap-4">
                    {tiers.map((tier) => (
                        <div key={tier.name} className="rounded-2xl border border-slate-200 p-6 bg-white">
                            <p className="text-sm uppercase tracking-wide text-slate-500 mb-2">{tier.name}</p>
                            <p className="text-3xl font-bold mb-2">{tier.price}</p>
                            <p className="text-slate-600 text-sm">{tier.details}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
