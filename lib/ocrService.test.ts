import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the provider factory before importing the service
vi.mock("@/lib/ocr/getProvider", () => ({
    getProvider: vi.fn(),
}));

// Mock the logger so tests stay silent
vi.mock("@/lib/logger", () => ({
    createLogger:         () => (stage: string) => ({
        info:  vi.fn(),
        warn:  vi.fn(),
        error: vi.fn(),
    }),
    generateCorrelationId: () => "test-correlation-id",
}));

import { getProvider } from "@/lib/ocr/getProvider";
import { runOcr } from "./ocrService";

const mockGetProvider = vi.mocked(getProvider);

function makeProvider(text: string, confidence = 0.95) {
    return { extract: vi.fn().mockResolvedValue({ rawText: text, confidence }) };
}

function makeFailingProvider(msg = "Provider error") {
    return { extract: vi.fn().mockRejectedValue(new Error(msg)) };
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe("runOcr — provider selection", () => {
    it("prefers textract for invoice filenames", async () => {
        const textract = makeProvider("Invoice #123");
        const google   = makeProvider("some text");

        mockGetProvider.mockImplementation(async (name) =>
            name === "textract" ? textract : google,
        );

        const result = await runOcr({
            buffer: Buffer.from("data"),
            fileName: "invoice_2024.jpg",
            correlationId: "test",
        });

        expect(result.providerUsed).toBe("textract");
        expect(textract.extract).toHaveBeenCalledOnce();
        expect(google.extract).not.toHaveBeenCalled();
    });

    it("prefers google for generic image filenames", async () => {
        const google   = makeProvider("some text");
        const textract = makeProvider("Invoice #123");

        mockGetProvider.mockImplementation(async (name) =>
            name === "google" ? google : textract,
        );

        const result = await runOcr({
            buffer: Buffer.from("data"),
            fileName: "photo.jpg",
            correlationId: "test",
        });

        expect(result.providerUsed).toBe("google");
        expect(textract.extract).not.toHaveBeenCalled();
    });

    it("respects an explicit requestedProvider", async () => {
        const textract = makeProvider("text from textract");
        const google   = makeProvider("text from google");

        mockGetProvider.mockImplementation(async (name) =>
            name === "textract" ? textract : google,
        );

        const result = await runOcr({
            buffer: Buffer.from("data"),
            fileName: "photo.jpg",
            requestedProvider: "textract",
            correlationId: "test",
        });

        expect(result.providerUsed).toBe("textract");
    });
});

describe("runOcr — fallback chain", () => {
    it("falls back to the next provider when primary fails", async () => {
        const failingGoogle = makeFailingProvider("Vision unavailable");
        const textract      = makeProvider("fallback text");

        mockGetProvider.mockImplementation(async (name) =>
            name === "google" ? failingGoogle : textract,
        );

        const result = await runOcr({
            buffer: Buffer.from("data"),
            fileName: "photo.jpg",
            correlationId: "test",
        });

        expect(result.providerUsed).toBe("textract");
        expect(failingGoogle.extract).toHaveBeenCalledOnce();
        expect(textract.extract).toHaveBeenCalledOnce();
        expect(result.attemptedProviders).toEqual(["google", "textract"]);
    });

    it("falls back when primary returns empty text", async () => {
        const emptyGoogle = makeProvider(""); // returns empty string
        const textract    = makeProvider("real text");

        mockGetProvider.mockImplementation(async (name) =>
            name === "google" ? emptyGoogle : textract,
        );

        const result = await runOcr({
            buffer: Buffer.from("data"),
            fileName: "photo.jpg",
            correlationId: "test",
        });

        expect(result.providerUsed).toBe("textract");
    });

    it("throws when all providers fail", async () => {
        const fail1 = makeFailingProvider("google down");
        const fail2 = makeFailingProvider("textract down");

        mockGetProvider.mockImplementation(async (name) =>
            name === "google" ? fail1 : fail2,
        );

        await expect(
            runOcr({ buffer: Buffer.from("data"), fileName: "photo.jpg", correlationId: "test" }),
        ).rejects.toThrow("textract down");
    });

    it("throws when all providers return empty text", async () => {
        const emptyGoogle   = makeProvider("");
        const emptyTextract = makeProvider("");

        mockGetProvider.mockImplementation(async (name) =>
            name === "google" ? emptyGoogle : emptyTextract,
        );

        await expect(
            runOcr({ buffer: Buffer.from("data"), fileName: "photo.jpg", correlationId: "test" }),
        ).rejects.toThrow();
    });
});

describe("runOcr — result shape", () => {
    it("returns rawText, confidence, providerUsed, attemptedProviders", async () => {
        const google = makeProvider("Hello World", 0.98);
        mockGetProvider.mockImplementation(async () => google);

        const result = await runOcr({
            buffer: Buffer.from("data"),
            fileName: "photo.jpg",
            correlationId: "test",
        });

        expect(result.rawText).toBe("Hello World");
        expect(result.confidence).toBe(0.98);
        expect(result.providerUsed).toBe("google");
        expect(Array.isArray(result.attemptedProviders)).toBe(true);
    });
});
