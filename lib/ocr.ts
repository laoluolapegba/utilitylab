// lib/ocr.ts
import Tesseract from "tesseract.js";

export type OcrProvider = "tesseract"; // later: "google-vision" | "textract" | etc.

export interface OcrResult {
    rawText: string;
    confidence: number;
    provider: OcrProvider;
}

export async function extractTextWithTesseract(buffer: Buffer): Promise<OcrResult> {
    const result = await Tesseract.recognize(buffer, "eng", {
        logger: (m) => console.log("[Tesseract]", m),
    });

    // Tesseract's overall confidence is not always present, so we fall back to 0 if missing
    const confidence = result.data.confidence ?? 0;

    return {
        rawText: result.data.text || "",
        confidence,
        provider: "tesseract",
    };
}

// Generic entry point so you can switch providers later
export async function extractText(
    buffer: Buffer,
    provider: OcrProvider = "tesseract"
): Promise<OcrResult> {
    switch (provider) {
        case "tesseract":
        default:
            return extractTextWithTesseract(buffer);
    }
}
