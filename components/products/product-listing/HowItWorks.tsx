import { ClipboardList, Sparkles, Download } from "lucide-react";

const steps = [
    {
        number: "01",
        icon: ClipboardList,
        title: "Describe Your Product",
        description: "Enter your product name, key features, materials, target audience, and any platform-specific details. The more you add, the better the output.",
        color: "from-orange-500 to-red-600",
    },
    {
        number: "02",
        icon: Sparkles,
        title: "AI Generates Platform Copy",
        description: "Our AI writes SEO-optimised Amazon bullet points, eBay HTML, Shopify meta, Etsy tags, WooCommerce descriptions, and a Facebook listing simultaneously.",
        color: "from-purple-500 to-pink-600",
    },
    {
        number: "03",
        icon: Download,
        title: "Copy or Export",
        description: "Copy listings for individual platforms directly, or download everything as a CSV for bulk import into your store.",
        color: "from-blue-500 to-indigo-600",
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 lg:py-28 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="block text-[#566AF0] mb-3 text-sm font-bold uppercase tracking-wider">
                        Simple Process
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl mb-6">
                        How It Works
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        From product brief to multi-platform copy in three steps.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        <div
                            className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500 opacity-20"
                            style={{ width: "calc(100% - 8rem)", left: "4rem" }}
                        />
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={index} className="relative">
                                    <div className="absolute -top-4 -left-4 text-7xl font-bold text-slate-100 select-none">
                                        {step.number}
                                    </div>
                                    <div className="relative bg-white rounded-2xl p-8 border-2 border-slate-100 hover:border-slate-200 transition-colors">
                                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} p-4 mb-6 mx-auto`}>
                                            <Icon className="w-full h-full text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#0F172A] mb-3 text-center">{step.title}</h3>
                                        <p className="text-slate-600 leading-relaxed text-center">{step.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-full">
                        <svg className="w-5 h-5 text-[#566AF0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-sm font-medium text-slate-700">
                            No product data is stored. Outputs are generated and discarded.
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
