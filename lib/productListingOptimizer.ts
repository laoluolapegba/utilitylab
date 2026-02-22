export type Tone = "professional" | "casual" | "luxury" | "playful";

export type ProductInput = {
    productName: string;
    brand: string;
    category: string;
    price: string;
    targetAudience: string;
    materials: string;
    keyFeatures: string[];
    uniqueSellingPoints: string[];
    seoKeywords: string[];
    competitorListing: string;
    tone: Tone;
};

export type AmazonOutput = {
    title: string;
    bullets: string[];
    description: string;
    backendKeywords: string;
};

export type EbayOutput = {
    title: string;
    subtitle: string;
    itemSpecifics: Array<{ label: string; value: string }>;
    htmlDescription: string;
};

export type ShopifyOutput = {
    title: string;
    htmlDescription: string;
    seoTitle: string;
    metaDescription: string;
    tags: string[];
};

export type EtsyOutput = {
    title: string;
    description: string;
    tags: string[];
    categories: string[];
};

export type WooOutput = {
    title: string;
    shortDescription: string;
    longDescription: string;
    seoMeta: string;
};

export type FacebookOutput = {
    title: string;
    description: string;
};

export type OptimizerOutput = {
    suggestedKeywords: string[];
    competitorOpportunities: string[];
    amazon: AmazonOutput;
    ebay: EbayOutput;
    shopify: ShopifyOutput;
    etsy: EtsyOutput;
    woocommerce: WooOutput;
    facebookMarketplace: FacebookOutput;
    genericCsv: Array<{ platform: string; title: string; description: string; tags: string }>;
};

const AMAZON_LIMITS = {
    title: 200,
    bullet: 500,
    description: 2000,
};

const EBAY_TITLE_LIMIT = 80;
const ETSY_TITLE_LIMIT = 140;

function trimToLimit(value: string, limit: number): string {
    if (value.length <= limit) return value;
    return `${value.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
}

function dedupe(values: string[]): string[] {
    return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function normaliseKeyword(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function withTone(base: string, tone: Tone): string {
    if (tone === "casual") return `Meet your new favourite ${base}`;
    if (tone === "luxury") return `Experience elevated ${base}`;
    if (tone === "playful") return `Say hello to fun, fuss-free ${base}`;
    return base;
}

function featureBenefitLine(feature: string, audience: string): string {
    const opener = feature.length > 40 ? "Designed to" : "Helps you";
    return `${feature} — ${opener} ${audience ? `${audience} ` : ""}save time, reduce hassle, and enjoy better everyday results.`;
}

function extractCompetitorTerms(text: string): string[] {
    const words = text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length >= 5);

    const frequency = new Map<string, number>();
    for (const word of words) {
        frequency.set(word, (frequency.get(word) || 0) + 1);
    }

    return [...frequency.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([term]) => term);
}

function buildKeywordSet(input: ProductInput): string[] {
    const seed = [
        input.productName,
        input.brand,
        input.category,
        ...input.keyFeatures,
        ...input.uniqueSellingPoints,
        ...input.seoKeywords,
    ]
        .map(normaliseKeyword)
        .filter(Boolean);

    const split = seed.flatMap((item) => item.split(",")).map((part) => part.trim());
    return dedupe(split).slice(0, 18);
}

export function generateListings(input: ProductInput): OptimizerOutput {
    const keywords = buildKeywordSet(input);
    const mainKeywords = keywords.slice(0, 8);
    const competitorTerms = input.competitorListing ? extractCompetitorTerms(input.competitorListing) : [];

    const audience = input.targetAudience || "modern shoppers";
    const features = input.keyFeatures.length ? input.keyFeatures : ["Reliable daily performance", "Easy setup", "Built to last"];
    const usps = input.uniqueSellingPoints.length
        ? input.uniqueSellingPoints
        : ["Fast shipping", "Quality materials", "Trusted by returning buyers"];

    const primaryTitle = trimToLimit(
        `${input.brand || "UtilityLab"} ${input.productName} - ${features[0]} for ${audience}`,
        AMAZON_LIMITS.title,
    );

    const amazonBullets = [
        featureBenefitLine(features[0], audience),
        featureBenefitLine(features[1] || usps[0], audience),
        featureBenefitLine(features[2] || usps[1], audience),
        `${usps[0]} — crafted with ${input.materials || "durable materials"} for dependable long-term use.`,
        `${usps[1]} — ideal for ${input.category || "everyday use"} and backed by ${input.brand || "a customer-first brand"}.`,
    ].map((line) => trimToLimit(line, AMAZON_LIMITS.bullet));

    const amazonDescription = trimToLimit(
        `${withTone(`${input.productName} by ${input.brand || "UtilityLab"}`, input.tone)} is built for ${audience}. ` +
            `You get ${features.join(", ").toLowerCase()} and ${usps.join(", ").toLowerCase()}, so every use feels simpler and more rewarding. ` +
            `Whether you're upgrading your current setup or buying your first ${input.category || "product"}, this listing is optimized for discoverability with keywords including ${mainKeywords.join(", ")}.`,
        AMAZON_LIMITS.description,
    );

    const ebayTitle = trimToLimit(`${input.productName} ${features[0]} | ${input.brand || "UtilityLab"}`, EBAY_TITLE_LIMIT);
    const ebaySubtitle = trimToLimit(`${usps[0]} • ${usps[1]} • ${usps[2] || "Great value"}`, 55);

    const htmlList = features
        .map((feature) => `<li>${featureBenefitLine(feature, audience)}</li>`)
        .join("\n");

    const ebayHtml = [
        `<h2>${input.productName}</h2>`,
        `<p>${withTone(`Designed for ${audience}`, input.tone)} with ${input.materials || "quality materials"} and practical details that help your customers buy with confidence.</p>`,
        `<ul>${htmlList}</ul>`,
        `<p><strong>Best for:</strong> ${input.category || "General retail"}. <strong>Price point:</strong> ${input.price || "Competitive"}.</p>`,
    ].join("\n");

    const shopifyMeta = trimToLimit(
        `${input.productName}: ${features[0]}. ${usps[0]}. Built for ${audience}.`,
        160,
    );

    const etsyTags = dedupe([
        ...mainKeywords,
        input.category,
        input.materials,
        input.brand,
    ]).slice(0, 13);

    const competitorOpportunities = competitorTerms.length
        ? [
            `Emphasise benefits competitors underplay: ${features[0].toLowerCase()}.`,
            `Out-rank common terms by adding long-tail variants: ${competitorTerms.slice(0, 3).join(", ")}.`,
            `Differentiate with trust signals such as guarantees, delivery speed, and material transparency.`,
        ]
        : [
            "Add a competitor listing to unlock gap analysis and underused keyword opportunities.",
            "Lead with customer outcomes instead of feature-only statements.",
        ];

    const output: OptimizerOutput = {
        suggestedKeywords: keywords,
        competitorOpportunities,
        amazon: {
            title: primaryTitle,
            bullets: amazonBullets,
            description: amazonDescription,
            backendKeywords: trimToLimit(keywords.join(" "), 249),
        },
        ebay: {
            title: ebayTitle,
            subtitle: ebaySubtitle,
            itemSpecifics: [
                { label: "Brand", value: input.brand || "Generic" },
                { label: "Type", value: input.category || "General" },
                { label: "Material", value: input.materials || "Not specified" },
                { label: "Target Audience", value: audience },
            ],
            htmlDescription: ebayHtml,
        },
        shopify: {
            title: primaryTitle,
            htmlDescription: ebayHtml,
            seoTitle: trimToLimit(`${input.productName} | ${input.brand || "UtilityLab"}`, 70),
            metaDescription: shopifyMeta,
            tags: dedupe(mainKeywords).slice(0, 12),
        },
        etsy: {
            title: trimToLimit(`${input.productName} - ${features[0]} - ${input.brand || "UtilityLab"}`, ETSY_TITLE_LIMIT),
            description: trimToLimit(
                `${withTone(input.productName, input.tone)} crafted for ${audience}. Features include ${features.join(", ").toLowerCase()}. ${usps.join(". ")}.`,
                2000,
            ),
            tags: etsyTags,
            categories: dedupe([input.category, "Handmade", "Gifts", "Home & Living"]).slice(0, 3),
        },
        woocommerce: {
            title: primaryTitle,
            shortDescription: trimToLimit(`${features[0]}. ${usps[0]}. Perfect for ${audience}.`, 320),
            longDescription: `${amazonDescription}\n\nKey Features:\n- ${features.join("\n- ")}`,
            seoMeta: shopifyMeta,
        },
        facebookMarketplace: {
            title: trimToLimit(`${input.productName} | ${input.brand || "UtilityLab"}`, 100),
            description: trimToLimit(`${features[0]}. ${features[1] || usps[0]}. Great for ${audience}.`, 5000),
        },
        genericCsv: [
            {
                platform: "Amazon",
                title: primaryTitle,
                description: amazonDescription,
                tags: keywords.slice(0, 12).join("|"),
            },
            {
                platform: "eBay",
                title: ebayTitle,
                description: ebayHtml,
                tags: keywords.slice(0, 12).join("|"),
            },
            {
                platform: "Shopify",
                title: primaryTitle,
                description: ebayHtml,
                tags: keywords.slice(0, 12).join(","),
            },
        ],
    };

    return output;
}
