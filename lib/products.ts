import { ImageIcon, Layers, ShoppingCart, Bell, FileCheck, ReceiptText, type LucideIcon } from "lucide-react";

export type ProductStatus = "live" | "coming-soon";

export type Product = {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    status: ProductStatus;
    href: string;
    color: string;
    features: string[];
};

/** Single source of truth for all UtilityLab products. Update here when adding or changing a tool. */
export const products: Product[] = [
    {
        id: "invoice-parser",
        name: "Invoice Parser",
        description: "Drop a PDF or image invoice to get VAT-aware journal entries and UK tax explanations.",
        icon: ReceiptText,
        status: "live",
        href: "/app/invoice-parser",
        color: "from-emerald-500 to-teal-600",
        features: ["UK VAT guidance", "Xero-ready CSV", "Plain-English insights"],
    },
    {
        id: "image-to-text",
        name: "Image to Text",
        description: "Extract text from images instantly with professional-grade OCR technology.",
        icon: ImageIcon,
        status: "live",
        href: "/app/image-to-text",
        color: "from-blue-500 to-indigo-600",
        features: ["Multi-language support", "High accuracy OCR", "Batch processing"],
    },
    {
        id: "image-converter",
        name: "Image → Multiple Formats",
        description: "Convert images to any format instantly. Support for PNG, JPG, WEBP, and more.",
        icon: Layers,
        status: "live",
        href: "/app/image-converter",
        color: "from-purple-500 to-pink-600",
        features: ["20+ formats", "Batch conversion", "Quality control"],
    },
    {
        id: "product-listing",
        name: "E-commerce Product Optimiser",
        description: "Generate optimized product listings with AI-powered descriptions and SEO.",
        icon: ShoppingCart,
        status: "live",
        href: "/app/product-listing-optimizer",
        color: "from-orange-500 to-red-600",
        features: ["Amazon/eBay/Shopify/Etsy", "Competitor gap analysis", "CSV export"],
    },
    {
        id: "repricing-alerts",
        name: "Re-Pricing Alerts",
        description: "Browser extension that monitors competitor prices and sends instant alerts.",
        icon: Bell,
        status: "live",
        href: "/app/repricing-alerts",
        color: "from-cyan-500 to-blue-600",
        features: ["Real-time monitoring", "Custom thresholds", "Multi-marketplace"],
    },
    {
        id: "compliance-forms",
        name: "Compliance Form Generator",
        description: "Generate UK-compliant forms for micro-businesses instantly.",
        icon: FileCheck,
        status: "live",
        href: "/app/compliance-form-generator",
        color: "from-indigo-500 to-purple-600",
        features: ["HMRC compliant", "Auto-fill", "PDF export"],
    },
];
