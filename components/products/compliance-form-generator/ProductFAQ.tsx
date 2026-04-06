import { ArrowRight, Clock3 } from "lucide-react";

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
        </>
    );
}
