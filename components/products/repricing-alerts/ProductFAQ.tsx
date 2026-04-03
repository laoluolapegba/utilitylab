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

export default function ProductFAQ() {
    return (
        <>
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
        </>
    );
}
