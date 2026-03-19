import Link from "next/link";
import { CheckCircle } from "lucide-react";

const TOOLS = [
    {
        id: "invoice-parser",
        title: "Invoice Parser",
        description: "Turn invoices into journal entries with VAT calculations.",
        icon: "📄→📊",
        href: "/tools/invoice-parser",
        color: "green",
        features: ["UK VAT ready", "Plain English", "Xero export"],
    },
    {
        id: "image-to-text",
        title: "Image to Text",
        description: "Extract text from images and scanned documents.",
        icon: "🖼️→📝",
        href: "/tools/image-to-text",
        color: "blue",
        features: ["OCR powered", "Multi-language", "Instant results"],
    },
    {
        id: "image-converter",
        title: "Image Format Converter",
        description: "Convert images to any format instantly.",
        icon: "🖼️→📁",
        href: "/tools/image-converter",
        color: "purple",
        features: ["20+ formats", "Batch convert", "Quality control"],
    },
    {
        id: "product-optimizer",
        title: "E-commerce Product Optimizer",
        description: "Generate optimized product listings with AI-powered SEO.",
        icon: "🏷️→💰",
        href: "/tools/product-optimizer",
        color: "orange",
        features: ["SEO optimized", "Multi-platform", "AI descriptions"],
    },
    {
        id: "repricing-alerts",
        title: "Re-Pricing Alerts",
        description: "Monitor competitor prices and get instant alerts.",
        icon: "🔔→💷",
        href: "/tools/repricing-alerts",
        color: "red",
        features: ["Real-time", "Multi-marketplace", "Custom thresholds"],
    },
    {
        id: "compliance-forms",
        title: "Compliance Form Generator",
        description: "Generate UK-compliant forms for micro-businesses instantly.",
        icon: "📋→✅",
        href: "/tools/compliance-forms",
        color: "indigo",
        features: ["HMRC compliant", "Auto-fill", "PDF export"],
    },
] as const;

function ToolTile({ tool }: { tool: typeof TOOLS[number] }) {
    const colorClasses = {
        green: "border-green-200 hover:border-green-400 bg-green-50",
        blue: "border-blue-200 hover:border-blue-400 bg-blue-50",
        purple: "border-purple-200 hover:border-purple-400 bg-purple-50",
        orange: "border-orange-200 hover:border-orange-400 bg-orange-50",
        red: "border-red-200 hover:border-red-400 bg-red-50",
        indigo: "border-indigo-200 hover:border-indigo-400 bg-indigo-50",
    };

    return (
        <Link href={tool.href} className={`block border-2 rounded-lg p-6 transition-all hover:shadow-lg ${colorClasses[tool.color]}`}>
            <div className="text-4xl mb-3">{tool.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{tool.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
            <ul className="space-y-1">
                {tool.features.map((feature) => (
                    <li key={feature} className="text-xs text-gray-500 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {feature}
                    </li>
                ))}
            </ul>
        </Link>
    );
}

export default function ProductsGrid() {
    return (
        <section id="products" className="py-20 lg:py-28 bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="block text-[#566AF0] mb-3 text-sm font-bold uppercase tracking-wider">Our Products</span>
                    <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl mb-6">Tools Built for Productivity</h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Six focused products, each built to solve one business task cleanly without bloated workflows.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {TOOLS.map((tool) => (
                        <ToolTile key={tool.id} tool={tool} />
                    ))}
                </div>
            </div>
        </section>
    );
}
