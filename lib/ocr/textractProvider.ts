// lib/ocr/textractProvider.ts

import { IOcrProvider, OcrResult } from "./ocrProvider";
import { createLogger, generateCorrelationId } from "@/lib/logger";

export class TextractProvider implements IOcrProvider {
    async extract(buffer: Buffer, correlationId?: string): Promise<OcrResult> {
        const log   = createLogger(correlationId ?? generateCorrelationId());
        const start = Date.now();

        const region          = process.env.AWS_REGION;
        const accessKeyId     = process.env.AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

        log("textract_start").info("Starting Textract extraction", {
            durationMs: 0,
            bufferBytes: buffer.length,
            hasRegion: !!region,
            hasCredentials: !!(accessKeyId && secretAccessKey),
        });

        if (!region || !accessKeyId || !secretAccessKey) {
            throw new Error(
                "Textract configuration missing: AWS_REGION / AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY",
            );
        }

        const { TextractClient, AnalyzeDocumentCommand } = await import("@aws-sdk/client-textract");

        const client = new TextractClient({
            region,
            credentials: { accessKeyId, secretAccessKey },
        });

        const command = new AnalyzeDocumentCommand({
            Document: { Bytes: buffer },
            FeatureTypes: ["TABLES", "FORMS"],
        });

        const response = await client.send(command);

        const blocks     = response.Blocks || [];
        const lineBlocks = blocks.filter((b) => b.BlockType === "LINE");
        const text       = lineBlocks.map((l) => l.Text).filter(Boolean).join("\n");

        const confidence =
            lineBlocks.length > 0
                ? lineBlocks.reduce((sum, b) => sum + (b.Confidence ?? 0), 0) / lineBlocks.length
                : null;

        log("textract_complete").info("Textract extraction complete", {
            durationMs: Date.now() - start,
            blockCount: blocks.length,
            lineCount: lineBlocks.length,
            textLength: text.length,
            confidence,
        });

        return { rawText: text || "", confidence };
    }
}
