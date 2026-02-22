import Image from "next/image";

export default function ComingSoonSection() {
    return (
        <section className="py-20 lg:py-28 bg-[#0F172A] text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        More to Come
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* Card 1: PDF to Accounting */}
                    <div className="overflow-hidden rounded-[32px] bg-[#E3F3FF] text-slate-900 flex flex-col h-[400px]">
                        <div className="p-8 pb-0 flex-1">
                            <h3 className="text-2xl font-bold mb-3 text-[#0F172A]">PDF-to-Accounting</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Simply upload your invoices and receipts, and we'll extract the data into a format ready for your accounting software.
                            </p>
                        </div>
                        <div className="mt-4 relative h-48 w-full flex items-center justify-center p-6">
                            {/* Animated Flow: PDF -> Processing -> Table */}
                            <div className="flex items-center gap-4 relative z-10 w-full justify-center">

                                {/* PDF Icon */}
                                <div className="w-16 h-20 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col items-center justify-center relative group">
                                    <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center mb-1">
                                        <span className="text-xs font-bold text-red-500">PDF</span>
                                    </div>
                                    <div className="w-8 h-1 bg-slate-100 rounded"></div>
                                </div>

                                {/* Arrow / Processing */}
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                                </div>

                                {/* Table / CSV Icon */}
                                <div className="w-20 h-20 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col p-2 gap-1.5">
                                    <div className="h-3 w-full bg-green-50 rounded-sm"></div>
                                    <div className="h-2 w-full bg-slate-50 rounded-sm"></div>
                                    <div className="h-2 w-full bg-slate-50 rounded-sm"></div>
                                    <div className="h-2 w-3/4 bg-slate-50 rounded-sm"></div>
                                </div>

                            </div>
                            {/* Ambient Glow */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#E3F3FF] via-transparent to-transparent z-0"></div>
                        </div>
                    </div>

                    {/* Card 2: Review Widget */}
                    <div className="overflow-hidden rounded-[32px] bg-[#E3F3FF] text-slate-900 flex flex-col h-[400px] relative">
                        <div className="p-8 pb-0 flex-1 relative z-10">
                            <h3 className="text-2xl font-bold mb-3 text-[#0F172A]">Review Widget</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Embed testimonials and reviews directly on your site. customize the look and feel to match your brand perfectly.
                            </p>
                        </div>
                        <div className="mt-4 relative h-full w-full overflow-hidden">
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] space-y-3 pb-6">
                                {/* Review 1 */}
                                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex gap-3 items-start transform scale-95 opacity-60">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0"></div>
                                    <div className="space-y-1 flex-1">
                                        <div className="h-1.5 w-16 bg-slate-200 rounded"></div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded"></div>
                                    </div>
                                </div>
                                {/* Review 2 */}
                                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex gap-3 items-start transform scale-100 opacity-80">
                                    <div className="w-8 h-8 rounded-full bg-teal-100 flex-shrink-0"></div>
                                    <div className="space-y-1 flex-1">
                                        <div className="h-1.5 w-20 bg-slate-200 rounded"></div>
                                        <div className="h-1.5 w-3/4 bg-slate-100 rounded"></div>
                                    </div>
                                </div>
                                {/* Review 3 (Main) */}
                                <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex gap-3 items-start relative z-10 transform scale-105">
                                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center font-bold text-yellow-600 text-xs">JS</div>
                                    <div className="flex-1">
                                        <div className="flex text-yellow-400 text-xs mb-1">★★★★★</div>
                                        <p className="text-[10px] text-slate-500 leading-snug">"This widget boosted our conversions by 20%. Highly recommended!"</p>
                                    </div>
                                </div>
                            </div>
                            {/* Gradient fade at bottom */}
                            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#E3F3FF] to-transparent z-20 pointer-events-none"></div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
