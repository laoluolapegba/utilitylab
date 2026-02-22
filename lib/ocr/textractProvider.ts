// lib/ocr/textractProvider.ts

import { IOcrProvider, OcrResult } from "./ocrProvider";
import {
    TextractClient,
    AnalyzeDocumentCommand,
    Block,
} from "@aws-sdk/client-textract";

export class TextractProvider implements IOcrProvider {
    private client: TextractClient;

    constructor() {
        this.client = new TextractClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });
    }

    async extract(buffer: Buffer): Promise<OcrResult> {
        const command = new AnalyzeDocumentCommand({
            Document: { Bytes: buffer },
            FeatureTypes: ["TABLES", "FORMS"],
        });

        const response = await this.client.send(command);

        const blocks: Block[] = response.Blocks || [];

        // Extract text lines (Textract LINE blocks)
        const lineBlocks = blocks.filter((b) => b.BlockType === "LINE");

        const text = lineBlocks.map((l) => l.Text).filter(Boolean).join("\n");

        let confidence: number | null = null;

        if (lineBlocks.length > 0) {
            confidence =
                lineBlocks.reduce((sum, b) => sum + (b.Confidence ?? 0), 0) /
                lineBlocks.length;
        }

        return {
            rawText: text || "",
            confidence,
        };
    }
}
