const steps = [
    "Install the extension in Chrome, Firefox, or Edge.",
    "Visit any competitor product page (Amazon, eBay, Shopify, or any e-commerce site).",
    "Click the extension and choose Add to monitoring.",
    "Set your alert threshold (example: alert me below £22.99).",
    "Receive instant email, browser, and SMS alerts (plan dependent).",
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-14 bg-slate-50 border-y border-slate-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                <h2 className="text-3xl font-bold mb-6">Get started in 5 minutes</h2>
                <ol className="space-y-4">
                    {steps.map((step, index) => (
                        <li key={step} className="bg-white border border-slate-200 rounded-xl p-5 flex gap-4">
                            <span className="w-8 h-8 rounded-full bg-[#566AF0] text-white font-bold flex items-center justify-center shrink-0">
                                {index + 1}
                            </span>
                            <p className="text-slate-700">{step}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
