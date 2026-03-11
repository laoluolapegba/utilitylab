// lib/ocr/getProvider.ts

import { IOcrProvider } from "./ocrProvider";

export type ProviderName = "google" | "textract";

export async function getProvider(name: ProviderName): Promise<IOcrProvider> {
    switch (name) {
        case "google": {
            const { GoogleVisionProvider } = await import("./googleVisionProvider");
            return new GoogleVisionProvider();
        }
        case "textract": {
            const { TextractProvider } = await import("./textractProvider");
            return new TextractProvider();
        }
        default: {
            const { GoogleVisionProvider } = await import("./googleVisionProvider");
            return new GoogleVisionProvider();
        }
    }
}