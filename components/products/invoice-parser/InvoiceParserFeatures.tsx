import { FileText, Percent, Table2, MessageSquare, Shield, Download } from "lucide-react";

const features = [
    {
        icon: FileText,
        title: "PDF & Image Support",
        description: "Works with scanned PDFs, photographed invoices, PNG, and JPG. OCR handles skewed or low-contrast scans.",
        stats: "PDF · PNG · JPG",
    },
    {
        icon: Percent,
        title: "UK VAT Guidance",
        description: "Identifies Input VAT, checks reclaimability, flags partial-use scenarios, and cites the relevant HMRC rule.",
        stats: "HMRC Compliant",
    },
    {
        icon: Table2,
        title: "Xero & CSV Export",
        description: "One-click Xero CSV import, double-entry journal entries, simple line-item CSV, or plain-English summary.",
        stats: "4 Export Formats",
    },
    {
        icon: MessageSquare,
        title: "Ask About Any Invoice",
        description: "Built-in Q&A lets you ask plain-English questions — 'Can I claim this if I work from home?' — and get instant answers.",
        stats: "AI Q&A",
    },
    {
        icon: Shield,
        title: "Zero Data Retention",
        description: "Files are processed in memory and immediately deleted. No invoice content is ever stored or logged.",
        stats: "GDPR Compliant",
    },
    {
        icon: Download,
        title: "Editable Before Export",
        description: "Every extracted field — vendor, date, line items, VAT — is editable before you download the final output.",
        stats: "Fully Editable",
    },
];

export default function InvoiceParserFeatures() {
    return (
        <section className="py-20 lg:py-28 bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="block text-[#566AF0] mb-3 text-sm font-bold uppercase tracking-wider">
                        Powerful Features
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl mb-6">
                        Everything a Freelancer Needs
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Skip the manual data entry. Get accounting-ready output with VAT guidance baked in.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-[#566AF0]/50 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#566AF0]/10 flex items-center justify-center group-hover:bg-[#566AF0] group-hover:scale-110 transition-all duration-300">
                                        <Icon className="w-6 h-6 text-[#566AF0] group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-[#0F172A] mb-2">{feature.title}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed mb-3">{feature.description}</p>
                                        <div className="inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
                                            {feature.stats}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
