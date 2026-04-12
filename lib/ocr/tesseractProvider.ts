// lib/ocr/tesseractProvider.ts

import { IOcrProvider, OcrResult } from "./ocrProvider";
import Tesseract from "tesseract.js";
import { createLogger, generateCorrelationId } from "@/lib/logger";

export class TesseractProvider implements IOcrProvider {
    async extract(buffer: Buffer, correlationId?: string): Promise<OcrResult> {
        const log   = createLogger(correlationId ?? generateCorrelationId());
        const start = Date.now();

        log("tesseract_start").info("Starting Tesseract extraction", {
            durationMs: 0,
            bufferBytes: buffer.length,
        });

        const { data } = await Tesseract.recognize(buffer, "eng", {
            logger: (m) => {
                if (m.status === "recognizing text") {
                    log("tesseract_progress").info("Tesseract progress", {
                        durationMs: Date.now() - start,
                        progress: Math.round((m.progress ?? 0) * 100),
                    });
                }
            },
        });

        log("tesseract_complete").info("Tesseract extraction complete", {
            durationMs: Date.now() - start,
            textLength: (data.text || "").length,
            confidence: data.confidence,
        });

        return {
            rawText: data.text || "",
            confidence: typeof data.confidence === "number" ? data.confidence : null,
        };
    }
}
