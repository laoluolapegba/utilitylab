// lib/ocr/ocrProvider.ts

export type OcrResult = {
    rawText: string;
    confidence: number | null;
};

export interface IOcrProvider {
    extract(buffer: Buffer): Promise<OcrResult>;
}
