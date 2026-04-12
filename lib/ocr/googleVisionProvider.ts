// lib/ocr/googleVisionProvider.ts

import { IOcrProvider, OcrResult } from "./ocrProvider";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import { createLogger, generateCorrelationId } from "@/lib/logger";

function getPrivateKey() {
    const key = process.env.GCP_PRIVATE_KEY;
    if (!key) return undefined;
    return key.replace(/\\n/g, "\n");
}

export class GoogleVisionProvider implements IOcrProvider {
    private client: ImageAnnotatorClient;

    constructor() {
        const projectId   = process.env.GCP_PROJECT_ID;
        const clientEmail = process.env.GCP_CLIENT_EMAIL;
        const privateKey  = getPrivateKey();

        if (!projectId || !clientEmail || !privateKey) {
            process.stdout.write(
                JSON.stringify({
                    level: "warn",
                    stage: "google_vision_init",
                    message: "Missing GCP credentials — GCP_PROJECT_ID, GCP_CLIENT_EMAIL, GCP_PRIVATE_KEY",
                    timestamp: new Date().toISOString(),
                }) + "\n",
            );
        }

        this.client = new ImageAnnotatorClient({
            projectId,
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
        });
    }

    async extract(buffer: Buffer, correlationId?: string): Promise<OcrResult> {
        const log   = createLogger(correlationId ?? generateCorrelationId());
        const start = Date.now();

        log("google_vision_start").info("Calling Google Vision textDetection", {
            durationMs: 0,
            bufferBytes: buffer.length,
        });

        const [result] = await this.client.textDetection(buffer);

        const text    = result.fullTextAnnotation?.text || "";
        const pages   = result.fullTextAnnotation?.pages || [];
        const blocks  = pages.flatMap((p) => p.blocks || []);
        const confs   = blocks
            .map((b) => b.confidence)
            .filter((c): c is number => typeof c === "number");

        const confidence =
            confs.length > 0 ? confs.reduce((a, b) => a + b, 0) / confs.length : null;

        log("google_vision_complete").info("Google Vision returned result", {
            durationMs: Date.now() - start,
            textLength: text.length,
            confidence,
        });

        return { rawText: text, confidence };
    }
}
