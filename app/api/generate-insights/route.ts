// app/api/extract-text/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getProvider, ProviderName } from "@/lib/ocr/getProvider";

type ProviderRequest = ProviderName | "auto";

function getFallbackChain(primary: ProviderName): ProviderName[] {
    const all: ProviderName[] = ["google", "textract"];
    return [primary, ...all.filter((p) => p !== primary)];
}

function pickAutoProvider(fileName: string): ProviderName {
    const name = (fileName || "").toLowerCase();

    // Strong signals for "document/receipt"
    const textractHints = [
        "receipt",
        "invoice",
        "bill",
        "statement",
        "order",
        "payment",
        "total",
        "vat",
        "tax",
        "pos",
    ];

    // Signals for "photo/handwriting"
    const visionHints = ["whiteboard", "note", "notes", "handwritten", "scan"];

    if (textractHints.some((k) => name.includes(k))) return "textract";
    if (visionHints.some((k) => name.includes(k))) return "google";

    // Default safe pick
    return "google";
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const requested =
            (req.headers.get("x-ocr-provider") as ProviderRequest | null) ||
            (process.env.DEFAULT_OCR_PROVIDER as ProviderRequest | undefined) ||
            "auto";

        const primary: ProviderName =
            requested === "auto" ? pickAutoProvider(file.name) : requested;

        const chain = getFallbackChain(primary);

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
                            primaryChosen: primary,
                            requestedProvider: requested,
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
                requestedProvider: requested,
                primaryChosen: primary,
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
