import Link from "next/link";
import { ArrowRight, ImageIcon, FileText, Layers, ShoppingCart, Bell, FileCheck, ReceiptText } from "lucide-react";

const products = [
    {
        id: "invoice-parser",
        name: "Invoice Parser",
        description: "Drop a PDF or image invoice to get VAT-aware journal entries and UK tax explanations.",
        icon: ReceiptText,
        status: "live",
        href: "/app/invoice-parser",
        color: "from-emerald-500 to-teal-600",
        features: ["UK VAT guidance", "Xero-ready CSV", "Plain-English insights"]
    },
    {
        id: "image-to-text",
        name: "Image to Text",
        description: "Extract text from images instantly with professional-grade OCR technology.",
        icon: ImageIcon,
        status: "live",
        href: "/app/image-to-text",
        color: "from-blue-500 to-indigo-600",
        features: ["Multi-language support", "High accuracy OCR", "Batch processing"]
    },
    {
        id: "pdf-to-accounting",
        name: "PDF to Accounting",
        description: "Convert invoices, receipts, and statements into structured accounting data.",
        icon: FileText,
        status: "coming-soon",
        href: "#",
        color: "from-green-500 to-emerald-600",
        features: ["Auto-categorization", "Multi-currency", "Excel export"]
    },
    {
        id: "image-converter",
        name: "Image → Multiple Formats",
        description: "Convert images to any format instantly. Support for PNG, JPG, WEBP, and more.",
        icon: Layers,
        status: "live",
        href: "/app/image-converter",
        color: "from-purple-500 to-pink-600",
        features: ["20+ formats", "Batch conversion", "Quality control"]
    },
    {
        id: "product-listing",
        name: "E-commerce Product Optimiser",
        description: "Generate optimized product listings with AI-powered descriptions and SEO.",
        icon: ShoppingCart,
        status: "live",
        href: "/app/product-listing-optimizer",
        color: "from-orange-500 to-red-600",
        features: ["Amazon/eBay/Shopify/Etsy", "Competitor gap analysis", "CSV export"]
    },
    {
        id: "repricing-alerts",
        name: "Re-Pricing Alerts",
        description: "Browser extension that monitors competitor prices and sends instant alerts.",
        icon: Bell,
        status: "live",
        href: "/repricing-alerts",
        color: "from-cyan-500 to-blue-600",
        features: ["Real-time monitoring", "Custom thresholds", "Multi-marketplace"]
    },
    {
        id: "compliance-forms",
        name: "Compliance Form Generator",
        description: "Generate UK-compliant forms for micro-businesses instantly.",
        icon: FileCheck,
        status: "live",
        href: "/compliance-form-generator",
        color: "from-indigo-500 to-purple-600",
        features: ["HMRC compliant", "Auto-fill", "PDF export"]
    }
];

export default function ProductsGrid() {
    return (
        <section id="products" className="py-20 lg:py-28 bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="block text-[#566AF0] mb-3 text-sm font-bold uppercase tracking-wider">
                        Our Products
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl mb-6">
                        Tools Built for Productivity
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Each tool solves one problem exceptionally well. Start with what you need today, expand as you grow.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {products.map((product) => {
                        const Icon = product.icon;
                        return (
                            <div
                                key={product.id}
                                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200"
                            >
                                {/* Status Badge */}
                                {product.status === "coming-soon" && (
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full uppercase tracking-wide">
                                        Coming Soon
                                    </div>
                                )}

                                {/* Icon with Gradient */}
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-full h-full text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-[#0F172A] mb-3 group-hover:text-[#566AF0] transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-slate-600 mb-6 leading-relaxed">
                                    {product.description}
                                </p>

                                {/* Features List */}
                                <ul className="space-y-2 mb-6">
                                    {product.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#566AF0]" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                {product.status === "live" ? (
                                    <Link
                                        href={product.href}
                                        className="inline-flex items-center gap-2 text-[#566AF0] font-semibold hover:gap-3 transition-all"
                                    >
                                        Try it now
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                ) : (
                                    <button
                                        disabled
                                        className="inline-flex items-center gap-2 text-slate-400 font-semibold cursor-not-allowed"
                                    >
                                        Coming soon
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}