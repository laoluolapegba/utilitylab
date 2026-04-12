/**
 * Integration tests for POST /api/extract-text
 * Mocks: Supabase rpc, OCR providers
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Env vars must be declared before any module imports ──────────────────────
vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL",  "https://test.supabase.co");
vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-service-key");
vi.stubEnv("STRIPE_SECRET_KEY",         "sk_test_xxx");
vi.stubEnv("STRIPE_WEBHOOK_SECRET",     "whsec_test");

// ── Hoist mock refs so factories can reference them ──────────────────────────
const { mockRpc, mockFromChain } = vi.hoisted(() => ({
    mockRpc: vi.fn().mockResolvedValue({
        data:  [{ allowed: true, used_count: 0 }],
        error: null,
    }),
    mockFromChain: {
        select:  vi.fn().mockReturnThis(),
        eq:      vi.fn().mockReturnThis(),
        gte:     vi.fn().mockReturnThis(),
        lte:     vi.fn().mockReturnThis(),
        insert:  vi.fn().mockResolvedValue({ error: null }),
        single:  vi.fn().mockResolvedValue({ data: { plan: "free" } }),
    },
}));

vi.mock("@/lib/supabaseServer", () => ({
    supabaseAdmin: {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
        from: vi.fn().mockReturnValue(mockFromChain),
        rpc:  mockRpc,
    },
}));

const { mockGetProvider } = vi.hoisted(() => ({
    mockGetProvider: vi.fn().mockResolvedValue({
        extract: vi.fn().mockResolvedValue({ rawText: "Extracted text", confidence: 0.95 }),
    }),
}));

vi.mock("@/lib/ocr/getProvider", () => ({
    getProvider: mockGetProvider,
}));

vi.mock("@/lib/logger", () => ({
    createLogger:          () => () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn() }),
    generateCorrelationId: () => "test-id",
}));

import { NextRequest } from "next/server";
import { POST } from "@/app/api/extract-text/route";

// Patch req.formData() to avoid Node/multipart stream issues in tests
function makeRequest(file?: File): NextRequest {
    const req = new NextRequest("http://localhost/api/extract-text", {
        method:  "POST",
        body:    "placeholder",
        headers: { "x-anon-id": "anon-123" },
    });

    // Override formData() to return our controlled file
    const fd = new FormData();
    if (file) fd.append("file", file);
    Object.defineProperty(req, "formData", { value: async () => fd });

    return req;
}

beforeEach(() => {
    vi.clearAllMocks();
    mockRpc.mockResolvedValue({ data: [{ allowed: true, used_count: 0 }], error: null });
    mockGetProvider.mockResolvedValue({
        extract: vi.fn().mockResolvedValue({ rawText: "Extracted text", confidence: 0.95 }),
    });
});

describe("POST /api/extract-text", () => {
    it("returns 400 when no file is provided", async () => {
        const res = await POST(makeRequest()); // no file
        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body.error).toMatch(/no file/i);
    });

    it("returns 413 for files over 10 MB", async () => {
        const bigFile = new File(["x"], "large.jpg", { type: "image/jpeg" });
        Object.defineProperty(bigFile, "size", { value: 10_485_761 });
        const res = await POST(makeRequest(bigFile));
        expect(res.status).toBe(413);
        const body = await res.json();
        expect(body.code).toBe("FILE_TOO_LARGE");
    });

    it("returns 200 with OCR result for valid file", async () => {
        const file = new File(["img"], "photo.jpg", { type: "image/jpeg" });
        const res  = await POST(makeRequest(file));
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.rawText).toBe("Extracted text");
        expect(body.confidence).toBe(0.95);
        expect(body.providerUsed).toBeDefined();
    });

    it("returns 502 when all providers fail", async () => {
        mockGetProvider.mockResolvedValue({
            extract: vi.fn().mockRejectedValue(new Error("provider down")),
        });
        const file = new File(["img"], "photo.jpg", { type: "image/jpeg" });
        const res  = await POST(makeRequest(file));
        expect(res.status).toBe(502);
    });

    it("returns 429 when usage limit is exceeded", async () => {
        mockRpc.mockResolvedValueOnce({
            data:  [{ allowed: false, used_count: 3 }],
            error: null,
        });
        const file = new File(["img"], "photo.jpg", { type: "image/jpeg" });
        const res  = await POST(makeRequest(file));
        expect(res.status).toBe(429);
        const body = await res.json();
        expect(body.upgradeRequired).toBe(true);
    });
});
