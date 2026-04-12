// app/api/generate-insights/route.ts

import { NextRequest, NextResponse } from "next/server";
import { ProviderName } from "@/lib/ocr/getProvider";
import { createLogger, generateCorrelationId } from "@/lib/logger";
import { extractIdentity, checkAndRecord } from "@/lib/usageTracking";
import { runOcr } from "@/lib/ocrService";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    const correlationId = req.headers.get("x-correlation-id") ?? generateCorrelationId();
    const log = createLogger(correlationId);
    const requestStart = Date.now();

    log("request_received").info("POST /api/generate-insights", { durationMs: 0 });

    const { userId, anonId } = await extractIdentity(req);
    const { allowed, used, limit } = await checkAndRecord("generate-insights", userId, anonId);
    if (!allowed) {
        return NextResponse.json({ upgradeRequired: true, used, limit }, { status: 429 });
    }

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
            (req.headers.get("x-ocr-provider") as ProviderName | "auto" | null) ||
            (process.env.DEFAULT_OCR_PROVIDER as ProviderName | "auto" | undefined) ||
            "auto";

        const result = await runOcr({
            buffer,
            fileName: file.name,
            requestedProvider: requested,
            correlationId,
        });

        log("request_complete").info("Extraction succeeded", {
            durationMs: Date.now() - requestStart,
            providerUsed: result.providerUsed,
        });

        return NextResponse.json(
            {
                rawText: result.rawText,
                confidence: result.confidence,
                providerUsed: result.providerUsed,
                requestedProvider: requested,
                attemptedProviders: result.attemptedProviders,
            },
            { status: 200, headers: { "x-correlation-id": correlationId } },
        );
    } catch (err) {
        log("request_failed").error("OCR failed", {
            durationMs: Date.now() - requestStart,
            error: err instanceof Error ? err : new Error(String(err)),
        });

        return NextResponse.json(
            {
                error: "All OCR providers failed or found no text.",
                detail: err instanceof Error ? err.message : String(err),
                correlationId,
            },
            { status: 502, headers: { "x-correlation-id": correlationId } },
        );
    }
}
