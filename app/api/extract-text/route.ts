// app/api/extract-text/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getProvider, ProviderName } from "@/lib/ocr/getProvider";
export const runtime = "nodejs";

function allowedProviders(): ProviderName[] {
    return ["google", "textract"];
}

function pickAutoProvider(input: {
    fileName: string;
    width?: number;
    height?: number;
    bytes?: number;
}): ProviderName {
    const name = (input.fileName || "").toLowerCase();
    const w = input.width ?? 0;
    const h = input.height ?? 0;

    // Filename hints → strong signal for Textract
    const textractHints = ["receipt", "invoice", "bill", "statement", "vat", "tax", "total", "order", "payment"];
    if (textractHints.some((k) => name.includes(k))) return "textract";

    // Document-ish heuristic:
    // - high resolution AND
    // - portrait-ish (typical scan/photo of a page)
    const isHighRes = Math.max(w, h) >= 1400;
    const aspect = w > 0 && h > 0 ? Math.max(w, h) / Math.min(w, h) : 1;
    const isPageLike = aspect >= 1.2 && aspect <= 1.7; // rough A4-ish / phone doc-ish

    if (isHighRes && isPageLike) return "textract";

    // Otherwise default to Vision (best general OCR incl handwriting)
    return "google";
}


function buildChain(primary: ProviderName): ProviderName[] {
    const allowed = allowedProviders();
    // ensure primary is first, then the remaining allowed providers
    const chain = [primary, ...allowed.filter((p) => p !== primary)];
    // also ensure primary is allowed; if not, fallback to first allowed
    return allowed.includes(primary) ? chain : allowed;
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Always AUTO (no header needed)
        const w = Number(req.headers.get("x-image-width") || 0) || undefined;
        const h = Number(req.headers.get("x-image-height") || 0) || undefined;
        const bytes = Number(req.headers.get("x-file-bytes") || 0) || undefined;
        const fileName = (req.headers.get("x-file-name") || file.name) as string;

        const primary = pickAutoProvider({ fileName, width: w, height: h, bytes });
        const chain = buildChain(primary);

        let lastError: any = null;

        for (const providerName of chain) {
            try {
                const provider = getProvider(providerName);
                const result = await provider.extract(buffer);
                const text = (result.rawText || "").trim();

                if (text.length > 0) {
                    return NextResponse.json(
                        {
                            rawText: result.rawText,
                            confidence: result.confidence,
                            providerUsed: providerName,
                            attemptedProviders: chain,
                        },
                        { status: 200 }
                    );
                } else {
                    lastError = new Error("No text found by " + providerName);
                }
            } catch (err) {
                console.error(`[OCR] Provider ${providerName} failed:`, err);
                lastError = err;
            }
        }

        return NextResponse.json(
            {
                error: "All OCR providers failed or found no text.",
                detail: lastError instanceof Error ? lastError.message : String(lastError),
                attemptedProviders: chain,
            },
            { status: 502 }
        );
    } catch (err: any) {
        console.error("OCR route error:", err);
        return NextResponse.json(
            { error: "OCR error", detail: err?.message ?? "Unknown error" },
            { status: 500 }
        );
    }
}
