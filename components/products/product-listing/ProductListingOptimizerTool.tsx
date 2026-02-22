"use client";

import { useMemo, useState } from "react";
import { Copy, Sparkles } from "lucide-react";
import { generateListings, type OptimizerOutput, type Tone } from "@/lib/productListingOptimizer";

type FormState = {
    productName: string;
    brand: string;
    category: string;
    price: string;
    targetAudience: string;
    materials: string;
    keyFeatures: string;
    uniqueSellingPoints: string;
    seoKeywords: string;
    competitorListing: string;
    tone: Tone;
};

const defaultForm: FormState = {
    productName: "Portable Blender Bottle",
    brand: "BlendNest",
    category: "Kitchen Appliance",
    price: "£39.99",
    targetAudience: "busy professionals and gym-goers",
    materials: "BPA-free Tritan with stainless steel blades",
    keyFeatures: "USB-C rechargeable\nOne-touch blending\nLeak-proof travel lid",
    uniqueSellingPoints: "20-second blend cycle\nFits cup holders\nEasy self-clean mode",
    seoKeywords: "portable blender, travel smoothie maker, USB blender",
    competitorListing: "Powerful blender with rechargeable battery. Lightweight and compact. Great for shakes.",
    tone: "professional",
};

function splitLines(value: string): string[] {
    return value
        .split(/\n|,/)
        .map((item) => item.trim())
        .filter(Boolean);
}

function Metric({ label, value, limit }: { label: string; value: string; limit: number }) {
    const length = value.length;
    const safe = length <= limit;

    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase font-semibold tracking-wide text-slate-500">{label}</p>
            <p className={`text-sm font-medium ${safe ? "text-emerald-700" : "text-rose-700"}`}>
                {length}/{limit}
            </p>
        </div>
    );
}

function CopyBlock({ text }: { text: string }) {
    return (
        <button
            type="button"
            onClick={() => navigator.clipboard.writeText(text)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
        >
            <Copy className="h-3.5 w-3.5" /> Copy
        </button>
    );
}

export default function ProductListingOptimizerTool() {
    const [form, setForm] = useState<FormState>(defaultForm);
    const [output, setOutput] = useState<OptimizerOutput | null>(null);

    const generatedAt = useMemo(() => (output ? new Date().toLocaleTimeString() : null), [output]);

    const handleGenerate = () => {
        const result = generateListings({
            productName: form.productName,
            brand: form.brand,
            category: form.category,
            price: form.price,
            targetAudience: form.targetAudience,
            materials: form.materials,
            keyFeatures: splitLines(form.keyFeatures),
            uniqueSellingPoints: splitLines(form.uniqueSellingPoints),
            seoKeywords: splitLines(form.seoKeywords),
            competitorListing: form.competitorListing,
            tone: form.tone,
        });

        setOutput(result);
    };

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Product Brief</h2>
                <p className="text-sm text-slate-600">Add your product details once and generate sales-ready listings for every marketplace.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        ["Product name", "productName"],
                        ["Brand", "brand"],
                        ["Category", "category"],
                        ["Price", "price"],
                        ["Target audience", "targetAudience"],
                        ["Materials", "materials"],
                    ].map(([label, key]) => (
                        <label key={key} className="text-sm text-slate-700 space-y-1">
                            <span className="font-medium">{label}</span>
                            <input
                                value={form[key as keyof FormState] as string}
                                onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
                                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </label>
                    ))}
                </div>

                <label className="text-sm text-slate-700 space-y-1 block">
                    <span className="font-medium">Tone</span>
                    <select
                        value={form.tone}
                        onChange={(event) => setForm((prev) => ({ ...prev, tone: event.target.value as Tone }))}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="luxury">Luxury</option>
                        <option value="playful">Playful</option>
                    </select>
                </label>

                <label className="text-sm text-slate-700 space-y-1 block">
                    <span className="font-medium">Key features (comma or new line)</span>
                    <textarea
                        rows={3}
                        value={form.keyFeatures}
                        onChange={(event) => setForm((prev) => ({ ...prev, keyFeatures: event.target.value }))}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </label>

                <label className="text-sm text-slate-700 space-y-1 block">
                    <span className="font-medium">Unique selling points</span>
                    <textarea
                        rows={3}
                        value={form.uniqueSellingPoints}
                        onChange={(event) => setForm((prev) => ({ ...prev, uniqueSellingPoints: event.target.value }))}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </label>

                <label className="text-sm text-slate-700 space-y-1 block">
                    <span className="font-medium">SEO keywords</span>
                    <textarea
                        rows={2}
                        value={form.seoKeywords}
                        onChange={(event) => setForm((prev) => ({ ...prev, seoKeywords: event.target.value }))}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </label>

                <label className="text-sm text-slate-700 space-y-1 block">
                    <span className="font-medium">Competitor listing (optional)</span>
                    <textarea
                        rows={4}
                        value={form.competitorListing}
                        onChange={(event) => setForm((prev) => ({ ...prev, competitorListing: event.target.value }))}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </label>

                <button
                    type="button"
                    onClick={handleGenerate}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#566AF0] px-5 py-2.5 text-white font-semibold hover:bg-indigo-700"
                >
                    <Sparkles className="h-4 w-4" /> Generate listings
                </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                {!output ? (
                    <div className="h-full min-h-[420px] flex items-center justify-center text-center text-slate-500">
                        Generate your first listing set to preview Amazon, eBay, Shopify, Etsy, WooCommerce, and Facebook outputs.
                    </div>
                ) : (
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Generated Listings</h2>
                            {generatedAt && <p className="text-xs text-slate-500">Updated at {generatedAt}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <Metric label="Amazon title" value={output.amazon.title} limit={200} />
                            <Metric label="eBay title" value={output.ebay.title} limit={80} />
                            <Metric label="Etsy title" value={output.etsy.title} limit={140} />
                        </div>

                        <section className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-slate-900">Amazon</h3>
                                <CopyBlock text={`${output.amazon.title}\n${output.amazon.bullets.join("\n")}\n${output.amazon.description}`} />
                            </div>
                            <p className="text-sm"><span className="font-semibold">Title:</span> {output.amazon.title}</p>
                            <ul className="list-disc ml-5 text-sm text-slate-700 space-y-1">
                                {output.amazon.bullets.map((bullet, idx) => <li key={idx}>{bullet}</li>)}
                            </ul>
                        </section>

                        <section className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-slate-900">eBay</h3>
                                <CopyBlock text={`${output.ebay.title}\n${output.ebay.subtitle}\n${output.ebay.htmlDescription}`} />
                            </div>
                            <p className="text-sm"><span className="font-semibold">Title:</span> {output.ebay.title}</p>
                            <p className="text-sm"><span className="font-semibold">Subtitle:</span> {output.ebay.subtitle}</p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold text-slate-900">Shopify, Etsy, WooCommerce, Facebook</h3>
                            <p className="text-sm text-slate-700">Shopify meta: {output.shopify.metaDescription}</p>
                            <p className="text-sm text-slate-700">Etsy tags: {output.etsy.tags.join(", ")}</p>
                            <p className="text-sm text-slate-700">Woo short description: {output.woocommerce.shortDescription}</p>
                            <p className="text-sm text-slate-700">Facebook title: {output.facebookMarketplace.title}</p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold text-slate-900">SEO and Competitor Insights</h3>
                            <p className="text-sm text-slate-700">Suggested keywords: {output.suggestedKeywords.join(", ")}</p>
                            <ul className="list-disc ml-5 text-sm text-slate-700 space-y-1">
                                {output.competitorOpportunities.map((item, idx) => <li key={idx}>{item}</li>)}
                            </ul>
                        </section>

                        <section className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-slate-900">Generic CSV Preview</h3>
                                <CopyBlock
                                    text={[
                                        "platform,title,description,tags",
                                        ...output.genericCsv.map((row) =>
                                            [row.platform, row.title, row.description.replace(/\n/g, " "), row.tags]
                                                .map((cell) => `\"${cell.replace(/\"/g, '\"\"')}\"`)
                                                .join(","),
                                        ),
                                    ].join("\n")}
                                />
                            </div>
                            <div className="overflow-x-auto border border-slate-200 rounded-xl">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50 text-slate-600">
                                        <tr>
                                            <th className="text-left p-2">Platform</th>
                                            <th className="text-left p-2">Title</th>
                                            <th className="text-left p-2">Tags</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {output.genericCsv.map((row) => (
                                            <tr key={row.platform} className="border-t border-slate-100">
                                                <td className="p-2">{row.platform}</td>
                                                <td className="p-2">{row.title}</td>
                                                <td className="p-2">{row.tags}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
