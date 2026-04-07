// app/api/extract-text/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getProvider, ProviderName } from "@/lib/ocr/getProvider";
import { createLogger, generateCorrelationId } from "@/lib/logger";
import { extractIdentity, checkLimit, recordUsage } from "@/lib/usageTracking";

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
    const correlationId = req.headers.get("x-correlation-id") ?? generateCorrelationId();
    const log = createLogger(correlationId);
    const requestStart = Date.now();

    log("request_received").info("POST /api/extract-text", { durationMs: 0 });

    const { userId, anonId } = await extractIdentity(req);
    const { allowed, used, limit } = await checkLimit(userId, anonId);
    if (!allowed) {
        return NextResponse.json({ upgradeRequired: true, used, limit }, { status: 429 });
    }
    await recordUsage("image-to-text", userId, anonId);

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            log("request_parsed").warn("No file provided", { durationMs: Date.now() - requestStart });
            return NextResponse.json(
                { error: "No file provided.", correlationId },
                { status: 400, headers: { "x-correlation-id": correlationId } },
            );
        }

        log("request_parsed").info("File received", {
            durationMs: Date.now() - requestStart,
            name: file.name,
            type: file.type,
            size: file.size,
        });

        const buffer = Buffer.from(await file.arrayBuffer());

        const w = Number(req.headers.get("x-image-width") || 0) || undefined;
        const h = Number(req.headers.get("x-image-height") || 0) || undefined;
        const bytes = Number(req.headers.get("x-file-bytes") || 0) || undefined;
        const fileName = (req.headers.get("x-file-name") || file.name) as string;

        log("header_parsed").info("Header metadata extracted", {
            durationMs: Date.now() - requestStart,
            width: w,
            height: h,
            bytes,
            fileName,
        });

        const primary = pickAutoProvider({ fileName, width: w, height: h, bytes });
        const chain = buildChain(primary);

        log("provider_selected").info("Provider chain built", {
            durationMs: Date.now() - requestStart,
            primary: primary.primary,
            reason: primary.reason,
            chain,
        });

        let lastError: unknown = null;

        for (const providerName of chain) {
            const providerStart = Date.now();

            log("provider_attempt").info("Trying provider", {
                durationMs: Date.now() - requestStart,
                providerName,
            });

            try {
                const provider = await getProvider(providerName);
                const result = await provider.extract(buffer);
                const text = (result.rawText || "").trim();

                log("provider_result").info("Provider returned result", {
                    durationMs: Date.now() - providerStart,
                    providerName,
                    textLength: text.length,
                    confidence: result.confidence ?? null,
                    hasText: text.length > 0,
                });

                if (text.length > 0) {
                    log("request_complete").info("OCR succeeded", {
                        durationMs: Date.now() - requestStart,
                        providerUsed: providerName,
                        chain,
                    });

                    return NextResponse.json(
                        {
                            rawText: result.rawText,
                            confidence: result.confidence,
                            providerUsed: providerName,
                            attemptedProviders: chain,
                        },
                        { status: 200, headers: { "x-correlation-id": correlationId } },
                    );
                }

                lastError = new Error(`No text found by ${providerName}`);
            } catch (err) {
                log("provider_failed").error("Provider threw an error", {
                    durationMs: Date.now() - providerStart,
                    providerName,
                    error: err instanceof Error ? err : new Error(String(err)),
                });
                lastError = err;
            }
        }

        log("request_failed").warn("All providers exhausted", {
            durationMs: Date.now() - requestStart,
            chain,
            error: lastError instanceof Error ? lastError : new Error(String(lastError)),
        });

        return NextResponse.json(
            {
                error: "All OCR providers failed or found no text.",
                detail: lastError instanceof Error ? lastError.message : String(lastError),
                attemptedProviders: chain,
                correlationId,
            },
            { status: 502, headers: { "x-correlation-id": correlationId } },
        );
    } catch (err) {
        log("request_failed").error("Unhandled route-level error", {
            durationMs: Date.now() - requestStart,
            error: err instanceof Error ? err : new Error(String(err)),
        });

        return NextResponse.json(
            {
                error: "OCR error",
                detail: err instanceof Error ? err.message : "Unknown error",
                correlationId,
            },
            { status: 500, headers: { "x-correlation-id": correlationId } },
        );
    }
}
