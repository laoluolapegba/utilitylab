import { ShoppingCart, Search, FileSpreadsheet, Wand2, Globe, Zap } from "lucide-react";

const features = [
    {
        icon: Globe,
        title: "7 Platforms at Once",
        description: "Amazon bullet points, eBay HTML description, Shopify meta title and description, Etsy tags, WooCommerce, Facebook Marketplace, and a generic CSV — all from a single brief.",
        stats: "7 Platforms",
    },
    {
        icon: Search,
        title: "SEO-Optimised by Default",
        description: "Copy is written to hit the search terms buyers use on each platform. Amazon A9 algorithm, Etsy tag limits, and Shopify title best practices are all factored in.",
        stats: "Platform-Native SEO",
    },
    {
        icon: Wand2,
        title: "Tone & Audience Targeting",
        description: "Specify your target customer and preferred tone — professional, conversational, luxury — and the AI adapts the copy accordingly across every platform.",
        stats: "Customisable Tone",
    },
    {
        icon: ShoppingCart,
        title: "Platform-Specific Formatting",
        description: "Amazon gets five bullet points. eBay gets structured HTML. Etsy gets exactly 13 tags. Each output matches the character limits and format rules of its platform.",
        stats: "Format Compliant",
    },
    {
        icon: FileSpreadsheet,
        title: "CSV Bulk Export",
        description: "Download all platform outputs as a single CSV — ready for bulk import into your inventory management system or store backend.",
        stats: "Bulk Import Ready",
    },
    {
        icon: Zap,
        title: "Under a Minute",
        description: "Full multi-platform copy generated in under 60 seconds. No back-and-forth prompting — one form, one click, seven outputs.",
        stats: "< 60 Seconds",
    },
];

const platforms = ["Amazon", "eBay", "Shopify", "Etsy", "WooCommerce", "Facebook", "CSV Export"];

export default function ProductListingFeatures() {
    return (
        <section className="py-20 lg:py-28 bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="block text-[#566AF0] mb-3 text-sm font-bold uppercase tracking-wider">
                        Powerful Features
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl mb-6">
                        One Brief. Seven Platforms.
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Stop rewriting the same listing for every marketplace. Generate all your platform copy in a single run.
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

                <div className="mt-16 max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl p-8 border border-slate-200">
                        <h3 className="text-center text-lg font-bold text-[#0F172A] mb-6">Supported Platforms</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {platforms.map((platform) => (
                                <div key={platform} className="px-4 py-2 bg-slate-50 rounded-lg text-sm font-semibold text-slate-700 border border-slate-200">
                                    {platform}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
