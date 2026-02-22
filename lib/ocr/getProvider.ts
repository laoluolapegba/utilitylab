// lib/ocr/getProvider.ts

import { IOcrProvider } from "./ocrProvider";
import { TesseractProvider } from "./tesseractProvider";
import { GoogleVisionProvider } from "./googleVisionProvider";
import { TextractProvider } from "./textractProvider";

export type ProviderName = "tesseract" | "google" | "textract";

export function getProvider(name: ProviderName): IOcrProvider {
    switch (name) {
        case "google":
            return new GoogleVisionProvider();
        case "textract":
            return new TextractProvider();
        case "tesseract":
        default:
            return new TesseractProvider();
    }
}
