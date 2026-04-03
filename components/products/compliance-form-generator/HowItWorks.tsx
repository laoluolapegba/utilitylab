const steps = [
    "Tell us what you need to do (for example: 'register for VAT' or 'change company address').",
    "AI identifies the exact forms and explains why they apply.",
    "Answer plain-English questions with examples and contextual help.",
    "We auto-fill repeated business details and validate your answers.",
    "Download print-ready PDF forms with submission guidance and deadlines.",
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-14 bg-slate-50 border-y border-slate-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                <h2 className="text-3xl font-bold mb-6">From confusion to completed forms in 5 steps</h2>
                <ol className="space-y-4">
                    {steps.map((step, index) => (
                        <li key={step} className="flex items-start gap-4 bg-white rounded-xl border border-slate-200 p-4">
                            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold inline-flex items-center justify-center shrink-0">
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
