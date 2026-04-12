import { describe, it, expect } from "vitest";
import { InvoiceAnalyzeSchema, CheckoutSchema, IdeasSchema } from "./apiSchemas";

// ── InvoiceAnalyzeSchema ──────────────────────────────────────────────────────

describe("InvoiceAnalyzeSchema", () => {
    it("accepts empty object (all fields optional)", () => {
        expect(InvoiceAnalyzeSchema.safeParse({}).success).toBe(true);
    });

    it("accepts full valid input", () => {
        const result = InvoiceAnalyzeSchema.safeParse({
            rawText:  "Invoice total £120",
            invoice:  { total: 120 },
            analysis: { deductibleStatus: "fully" },
            question: "Is this deductible?",
        });
        expect(result.success).toBe(true);
    });

    it("rejects rawText longer than 200k chars", () => {
        const result = InvoiceAnalyzeSchema.safeParse({ rawText: "x".repeat(200_001) });
        expect(result.success).toBe(false);
    });

    it("rejects question longer than 2000 chars", () => {
        const result = InvoiceAnalyzeSchema.safeParse({ question: "q".repeat(2_001) });
        expect(result.success).toBe(false);
    });

    it("defaults rawText to empty string", () => {
        const result = InvoiceAnalyzeSchema.safeParse({});
        expect(result.success && result.data.rawText).toBe("");
    });

    it("defaults invoice to empty object", () => {
        const result = InvoiceAnalyzeSchema.safeParse({});
        expect(result.success && result.data.invoice).toEqual({});
    });
});

// ── CheckoutSchema ────────────────────────────────────────────────────────────

describe("CheckoutSchema", () => {
    it("accepts valid priceId + UUID userId", () => {
        const result = CheckoutSchema.safeParse({
            priceId: "price_abc123",
            userId:  "123e4567-e89b-12d3-a456-426614174000",
        });
        expect(result.success).toBe(true);
    });

    it("rejects missing priceId", () => {
        const result = CheckoutSchema.safeParse({
            userId: "123e4567-e89b-12d3-a456-426614174000",
        });
        expect(result.success).toBe(false);
    });

    it("rejects empty priceId", () => {
        const result = CheckoutSchema.safeParse({
            priceId: "",
            userId:  "123e4567-e89b-12d3-a456-426614174000",
        });
        expect(result.success).toBe(false);
    });

    it("rejects non-UUID userId", () => {
        const result = CheckoutSchema.safeParse({
            priceId: "price_abc",
            userId:  "not-a-uuid",
        });
        expect(result.success).toBe(false);
        expect(result.error?.issues[0]?.message).toBe("userId must be a UUID");
    });

    it("rejects missing userId", () => {
        const result = CheckoutSchema.safeParse({ priceId: "price_abc" });
        expect(result.success).toBe(false);
    });
});

// ── IdeasSchema ───────────────────────────────────────────────────────────────

describe("IdeasSchema", () => {
    it("accepts minimal valid input", () => {
        const result = IdeasSchema.safeParse({ tool: "ocr", description: "Add PDF support" });
        expect(result.success).toBe(true);
    });

    it("accepts with optional email", () => {
        const result = IdeasSchema.safeParse({
            tool:        "ocr",
            description: "Add PDF support",
            email:       "user@example.com",
        });
        expect(result.success).toBe(true);
    });

    it("accepts null email", () => {
        const result = IdeasSchema.safeParse({
            tool:        "ocr",
            description: "Add PDF support",
            email:       null,
        });
        expect(result.success).toBe(true);
    });

    it("rejects invalid email format", () => {
        const result = IdeasSchema.safeParse({
            tool:        "ocr",
            description: "Add PDF support",
            email:       "not-an-email",
        });
        expect(result.success).toBe(false);
    });

    it("rejects empty tool", () => {
        const result = IdeasSchema.safeParse({ tool: "", description: "something" });
        expect(result.success).toBe(false);
    });

    it("rejects empty description", () => {
        const result = IdeasSchema.safeParse({ tool: "ocr", description: "" });
        expect(result.success).toBe(false);
    });

    it("rejects description over 2000 chars", () => {
        const result = IdeasSchema.safeParse({
            tool:        "ocr",
            description: "x".repeat(2_001),
        });
        expect(result.success).toBe(false);
    });

    it("rejects tool over 100 chars", () => {
        const result = IdeasSchema.safeParse({
            tool:        "x".repeat(101),
            description: "some idea",
        });
        expect(result.success).toBe(false);
    });
});
