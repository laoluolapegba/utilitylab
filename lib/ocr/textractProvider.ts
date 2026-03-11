// lib/ocr/textractProvider.ts

import { IOcrProvider, OcrResult } from "./ocrProvider";

export class TextractProvider implements IOcrProvider {
    async extract(buffer: Buffer): Promise<OcrResult> {
        const region = process.env.AWS_REGION;
        const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

        console.log("[Textract] Starting extraction", {
            bufferBytes: buffer.length,
            hasRegion: !!region,
            hasAccessKeyId: !!accessKeyId,
            hasSecretAccessKey: !!secretAccessKey,
        });

        if (!region || !accessKeyId || !secretAccessKey) {
            throw new Error("Textract configuration missing: AWS_REGION / AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY");
        }

        const {
            TextractClient,
            AnalyzeDocumentCommand,
        } = await import("@aws-sdk/client-textract");

        console.log("[Textract] AWS SDK loaded");

        const client = new TextractClient({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });

        console.log("[Textract] Client created");

        const command = new AnalyzeDocumentCommand({
            Document: { Bytes: buffer },
            FeatureTypes: ["TABLES", "FORMS"],
        });

        console.log("[Textract] Sending AnalyzeDocument request");

        const response = await client.send(command);

        console.log("[Textract] Response received", {
            blockCount: response.Blocks?.length ?? 0,
        });

        const blocks = response.Blocks || [];
        const lineBlocks = blocks.filter((b) => b.BlockType === "LINE");
        const text = lineBlocks.map((l) => l.Text).filter(Boolean).join("\n");

        let confidence: number | null = null;

        if (lineBlocks.length > 0) {
            confidence =
                lineBlocks.reduce((sum, b) => sum + (b.Confidence ?? 0), 0) /
                lineBlocks.length;
        }

        console.log("[Textract] Extraction complete", {
            lineCount: lineBlocks.length,
            textLength: text.length,
            confidence,
        });

        return {
            rawText: text || "",
            confidence,
        };
    }
}