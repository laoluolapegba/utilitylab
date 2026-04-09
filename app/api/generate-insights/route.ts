// app/api/generate-insights/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getProvider, ProviderName } from "@/lib/ocr/getProvider";
import { createLogger, generateCorrelationId } from "@/lib/logger";
import { extractIdentity, checkLimit, recordUsage } from "@/lib/usageTracking";

type ProviderRequest = ProviderName | "auto";

function getFallbackChain(primary: ProviderName): ProviderName[] {
    const all: ProviderName[] = ["google", "textract"];
    return [primary, ...all.filter((p) => p !== primary)];
}

function pickAutoProvider(fileName: string): ProviderName {
    const name = (fileName || "").toLowerCase();

    const textractHints = ["receipt", "invoice", "bill", "statement", "order", "payment", "total", "vat", "tax", "pos"];
    const visionHints = ["whiteboard", "note", "notes", "handwritten", "scan"];

    if (textractHints.some((k) => name.includes(k))) return "textract";
    if (visionHints.some((k) => name.includes(k))) return "google";

    return "google";
}

export async function POST(req: NextRequest) {
    const correlationId = req.headers.get("x-correlation-id") ?? generateCorrelationId();
    const log = createLogger(correlationId);
    const requestStart = Date.now();

    log("request_received").info("POST /api/generate-insights", { durationMs: 0 });

    const { userId, anonId } = await extractIdentity(req);
    const { allowed, used, limit } = await checkLimit(userId, anonId);
    if (!allowed) {
        return NextResponse.json({ upgradeRequired: true, used, limit }, { status: 429 });
    }
    await recordUsage("generate-insights", userId, anonId);

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

        const requested =
            (req.headers.get("x-ocr-provider") as ProviderRequest | null) ||
            (process.env.DEFAULT_OCR_PROVIDER as ProviderRequest | undefined) ||
            "auto";

        const primary: ProviderName =
            requested === "auto" ? pickAutoProvider(file.name) : requested;

        const chain = getFallbackChain(primary);

        log("provider_selected").info("Provider chain built", {
            durationMs: Date.now() - requestStart,
            requested,
            primary,
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
                const provider = await getProvider(providerName); // This may throw if provider is misconfigured
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
                    log("request_complete").info("Extraction succeeded", {
                        durationMs: Date.now() - requestStart,
                        providerUsed: providerName,
                        chain,
                    });

                    return NextResponse.json(
                        {
                            rawText: result.rawText,
                            confidence: result.confidence,
                            providerUsed: providerName,
                            primaryChosen: primary,
                            requestedProvider: requested,
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
                requestedProvider: requested,
                primaryChosen: primary,
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
