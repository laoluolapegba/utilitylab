/**
 * Central OCR service: provider selection heuristics + fallback chain.
 * Both /api/extract-text and /api/generate-insights delegate here so the
 * provider logic lives in exactly one place.
 */

import { getProvider, ProviderName } from "@/lib/ocr/getProvider";
import { OcrResult } from "@/lib/ocr/ocrProvider";
import { createLogger } from "@/lib/logger";

export type OcrInput = {
    buffer: Buffer;
    fileName: string;
    /** Pixel width — used for document heuristics. */
    width?: number;
    /** Pixel height — used for document heuristics. */
    height?: number;
    /** Byte size of the original file — used for document heuristics. */
    bytes?: number;
    /** Explicit provider requested by the caller ("auto" = heuristic). */
    requestedProvider?: ProviderName | "auto";
    correlationId: string;
};

export type OcrServiceResult = OcrResult & {
    providerUsed: ProviderName;
    attemptedProviders: ProviderName[];
};

const ALLOWED: ProviderName[] = ["google", "textract"];

/** Filename + dimension heuristics to pick the best primary provider. */
function pickProvider(input: {
    fileName: string;
    width?: number;
    height?: number;
    bytes?: number;
    requestedProvider?: ProviderName | "auto";
}): { primary: ProviderName; reason: string } {
    const { requestedProvider } = input;

    if (requestedProvider && requestedProvider !== "auto") {
        return { primary: requestedProvider, reason: "explicit_request" };
    }

    const name = (input.fileName || "").toLowerCase();
    const textractHints = ["receipt", "invoice", "bill", "statement", "vat", "tax", "total", "order", "payment", "pos"];
    if (textractHints.some((k) => name.includes(k))) {
        return { primary: "textract", reason: "filename_hint" };
    }

    const w = input.width ?? 0;
    const h = input.height ?? 0;
    const bytes = input.bytes ?? 0;
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
    return [primary, ...ALLOWED.filter((p) => p !== primary)];
}

/** Run OCR with automatic provider selection and fallback. */
export async function runOcr(input: OcrInput): Promise<OcrServiceResult> {
    const log = createLogger(input.correlationId);
    const requestStart = Date.now();

    const { primary, reason } = pickProvider(input);
    const chain = buildChain(primary);

    log("ocr_provider_selected").info("Provider chain built", {
        durationMs: 0,
        provider: primary,
        reason,
        chain,
    });

    let lastError: unknown = null;

    for (const providerName of chain) {
        const providerStart = Date.now();

        log("ocr_provider_attempt").info("Trying provider", {
            durationMs: Date.now() - requestStart,
            providerName,
        });

        try {
            const provider = await getProvider(providerName);
            const result = await provider.extract(input.buffer, input.correlationId);
            const text = (result.rawText || "").trim();

            log("ocr_provider_result").info("Provider returned result", {
                durationMs: Date.now() - providerStart,
                providerName,
                textLength: text.length,
                confidence: result.confidence ?? null,
                hasText: text.length > 0,
            });

            if (text.length > 0) {
                log("ocr_complete").info("OCR succeeded", {
                    durationMs: Date.now() - requestStart,
                    providerUsed: providerName,
                    chain,
                });

                return {
                    rawText: result.rawText,
                    confidence: result.confidence,
                    providerUsed: providerName,
                    attemptedProviders: chain,
                };
            }

            lastError = new Error(`No text found by ${providerName}`);
        } catch (err) {
            log("ocr_provider_failed").error("Provider threw an error", {
                durationMs: Date.now() - providerStart,
                providerName,
                error: err instanceof Error ? err : new Error(String(err)),
            });
            lastError = err;
        }
    }

    log("ocr_all_failed").warn("All providers exhausted", {
        durationMs: Date.now() - requestStart,
        chain,
        error: lastError instanceof Error ? lastError : new Error(String(lastError)),
    });

    throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
