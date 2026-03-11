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
}): { primary: ProviderName; reason: string } {
    const name = (input.fileName || "").toLowerCase();
    const w = input.width ?? 0;
    const h = input.height ?? 0;
    const bytes = input.bytes ?? 0;

    const textractHints = ["receipt", "invoice", "bill", "statement", "vat", "tax", "total", "order", "payment"];
    if (textractHints.some((k) => name.includes(k))) {
        return { primary: "textract", reason: "filename_hint" };
    }

    const longestSide = Math.max(w, h);
    const shortestSide = Math.min(w, h) || 1;
    const aspect = longestSide / shortestSide;

    const isHighRes = longestSide >= 1400;
    const isPortraitish = h >= w;
    const isPageLike = aspect >= 1.2 && aspect <= 1.8;
    const isLargeFile = bytes >= 1_000_000;

    if ((isHighRes && isPageLike && isPortraitish) || (isHighRes && isLargeFile && isPageLike)) {
        return { primary: "textract", reason: "document_heuristic" };
    }

    return { primary: "google", reason: "default_general_image" };
}

function buildChain(primary: ProviderName): ProviderName[] {
    const allowed = allowedProviders();
    const chain = [primary, ...allowed.filter((p) => p !== primary)];
    return allowed.includes(primary) ? chain : allowed;
}

export async function POST(req: NextRequest) {
    const requestId = `ocr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    console.log(`[OCR][${requestId}] Request received`);

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            console.warn(`[OCR][${requestId}] No file provided`);
            return NextResponse.json({ error: "No file provided." }, { status: 400 });
        }

        console.log(`[OCR][${requestId}] File received`, {
            name: file.name,
            type: file.type,
            size: file.size,
        });

        const buffer = Buffer.from(await file.arrayBuffer());

        const w = Number(req.headers.get("x-image-width") || 0) || undefined;
        const h = Number(req.headers.get("x-image-height") || 0) || undefined;
        const bytes = Number(req.headers.get("x-file-bytes") || 0) || undefined;
        const fileName = (req.headers.get("x-file-name") || file.name) as string;

        console.log(`[OCR][${requestId}] Header metadata`, {
            width: w,
            height: h,
            bytes,
            fileName,
        });

        const primary = pickAutoProvider({ fileName, width: w, height: h, bytes });
        const chain = buildChain(primary);

        console.log(`[OCR][${requestId}] Provider selection`, {
            primary,
            attemptedProviders: chain,
        });

        let lastError: unknown = null;

        for (const providerName of chain) {
            const start = Date.now();
            console.log(`[OCR][${requestId}] Trying provider`, providerName);

            try {
                const provider = await getProvider(providerName);

                console.log(`[OCR][${requestId}] Provider instance created`, providerName);

                const result = await provider.extract(buffer);
                const text = (result.rawText || "").trim();

                console.log(`[OCR][${requestId}] Provider result`, {
                    providerName,
                    durationMs: Date.now() - start,
                    textLength: text.length,
                    confidence: result.confidence ?? null,
                    hasText: text.length > 0,
                });

                if (text.length > 0) {
                    console.log(`[OCR][${requestId}] Success`, {
                        providerUsed: providerName,
                        attemptedProviders: chain,
                    });

                    return NextResponse.json(
                        {
                            rawText: result.rawText,
                            confidence: result.confidence,
                            providerUsed: providerName,
                            attemptedProviders: chain,
                        },
                        { status: 200 }
                    );
                }

                lastError = new Error(`No text found by ${providerName}`);
            } catch (err) {
                console.error(`[OCR][${requestId}] Provider ${providerName} failed`, err);

                if (err instanceof Error) {
                    console.error(`[OCR][${requestId}] Provider error details`, {
                        providerName,
                        message: err.message,
                        stack: err.stack,
                    });
                }

                lastError = err;
            }
        }

        console.warn(`[OCR][${requestId}] All providers failed`, {
            attemptedProviders: chain,
            lastError: lastError instanceof Error ? lastError.message : String(lastError),
        });

        return NextResponse.json(
            {
                error: "All OCR providers failed or found no text.",
                detail: lastError instanceof Error ? lastError.message : String(lastError),
                attemptedProviders: chain,
            },
            { status: 502 }
        );
    } catch (err) {
        console.error(`[OCR][${requestId}] Route-level failure`, err);

        if (err instanceof Error) {
            console.error(`[OCR][${requestId}] Route error details`, {
                message: err.message,
                stack: err.stack,
            });
        }

        return NextResponse.json(
            { error: "OCR error", detail: err instanceof Error ? err.message : "Unknown error" },
            { status: 500 }
        );
    }
}