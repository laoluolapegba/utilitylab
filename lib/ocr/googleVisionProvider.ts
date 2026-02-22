// lib/ocr/googleVisionProvider.ts

import { IOcrProvider, OcrResult } from "./ocrProvider";
import { ImageAnnotatorClient } from "@google-cloud/vision";

function getPrivateKey() {
    const key = process.env.GCP_PRIVATE_KEY;
    if (!key) return undefined;
    // handle \n in env var
    return key.replace(/\\n/g, "\n");
}

export class GoogleVisionProvider implements IOcrProvider {
    private client: ImageAnnotatorClient;

    constructor() {
        const projectId = process.env.GCP_PROJECT_ID;
        const clientEmail = process.env.GCP_CLIENT_EMAIL;
        const privateKey = getPrivateKey();

        if (!projectId || !clientEmail || !privateKey) {
            console.warn(
                "[GoogleVisionProvider] Missing GCP credentials env vars. " +
                "Make sure GCP_PROJECT_ID, GCP_CLIENT_EMAIL, GCP_PRIVATE_KEY are set."
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

    async extract(buffer: Buffer): Promise<OcrResult> {
        const [result] = await this.client.textDetection(buffer);

        const text = result.fullTextAnnotation?.text || "";

        const pages = result.fullTextAnnotation?.pages || [];
        const blocks = pages.flatMap((p) => p.blocks || []);
        const confidences = blocks
            .map((b) => b.confidence)
            .filter((c): c is number => typeof c === "number");

        const confidence =
            confidences.length > 0
                ? confidences.reduce((a, b) => a + b, 0) / confidences.length
                : null;

        return {
            rawText: text,
            confidence,
        };
    }
}
