// lib/ocr/tesseractProvider.ts

import { IOcrProvider, OcrResult } from "./ocrProvider";
import Tesseract from "tesseract.js";

export class TesseractProvider implements IOcrProvider {
    async extract(buffer: Buffer): Promise<OcrResult> {
        const { data } = await Tesseract.recognize(buffer, "eng", {
            logger: (m) => console.log(m),
        });

        return {
            rawText: data.text || "",
            confidence: typeof data.confidence === "number" ? data.confidence : null,
        };
    }
}
