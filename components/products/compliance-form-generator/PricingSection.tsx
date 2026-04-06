const tiers = [
    { name: "Free", price: "£0", details: "1 form/month · basic completion" },
    { name: "Starter", price: "£9/mo", details: "10 forms/month · auto-fill + validation" },
    { name: "Pro", price: "£19/mo", details: "Unlimited forms · reminders + form history" },
    { name: "Business", price: "£49/mo", details: "Multi-business + team access + priority support" },
];

export default function PricingSection() {
    return (
        <section id="pricing" className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <h2 className="text-3xl font-bold mb-8 text-center">Simple pricing for UK businesses</h2>
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
