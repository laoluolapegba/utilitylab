// app/api/extract-text/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createLogger, generateCorrelationId } from "@/lib/logger";
import { extractIdentity, checkAndRecord } from "@/lib/usageTracking";
import { runOcr } from "@/lib/ocrService";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    const correlationId = req.headers.get("x-correlation-id") ?? generateCorrelationId();
    const log = createLogger(correlationId);
    const requestStart = Date.now();

    log("request_received").info("POST /api/extract-text", { durationMs: 0 });

    const { userId, anonId } = await extractIdentity(req);
    const { allowed, used, limit } = await checkAndRecord("image-to-text", userId, anonId);
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

        if (file.size > 10_485_760) {
            log("file_too_large").warn("File exceeds 10 MB limit", {
                durationMs: Date.now() - requestStart,
                size: file.size,
            });
            return NextResponse.json(
                { error: "File exceeds the 10 MB limit.", code: "FILE_TOO_LARGE", correlationId },
                { status: 413, headers: { "x-correlation-id": correlationId } },
            );
        }

        log("request_parsed").info("File received", {
            durationMs: Date.now() - requestStart,
            name: file.name,
            type: file.type,
            size: file.size,
        });

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = (req.headers.get("x-file-name") || file.name) as string;
        const width    = Number(req.headers.get("x-image-width")  || 0) || undefined;
        const height   = Number(req.headers.get("x-image-height") || 0) || undefined;
        const bytes    = Number(req.headers.get("x-file-bytes")   || 0) || undefined;

        const result = await runOcr({ buffer, fileName, width, height, bytes, correlationId });

        log("request_complete").info("OCR succeeded", {
            durationMs: Date.now() - requestStart,
            providerUsed: result.providerUsed,
        });

        return NextResponse.json(
            {
                rawText: result.rawText,
                confidence: result.confidence,
                providerUsed: result.providerUsed,
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
