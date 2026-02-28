// lib/ocr/getProvider.ts

import { IOcrProvider } from "./ocrProvider";
import { GoogleVisionProvider } from "./googleVisionProvider";
import { TextractProvider } from "./textractProvider";

export type ProviderName = "google" | "textract";

export function getProvider(name: ProviderName): IOcrProvider {
    switch (name) {
        case "google":
            return new GoogleVisionProvider();
        case "textract":
            return new TextractProvider();
        default:
            return new GoogleVisionProvider();
    }
}
