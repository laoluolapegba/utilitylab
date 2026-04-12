/**
 * Integration tests for POST /api/billing/checkout
 * Mocks: Supabase, Stripe
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.hoisted runs before imports, so ALLOWED_PRICE_IDS in the route is
// evaluated after these env vars are set.
vi.hoisted(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL  = "https://test.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key";
    process.env.STRIPE_SECRET_KEY         = "sk_test_xxx";
    process.env.STRIPE_WEBHOOK_SECRET     = "whsec_test";
    process.env.STRIPE_PRICE_STARTER      = "price_starter_test";
    process.env.STRIPE_PRICE_PRO          = "price_pro_test";
    process.env.NEXT_PUBLIC_APP_URL       = "http://localhost:3000";
});

// ── Hoist mocks ───────────────────────────────────────────────────────────────
const {
    mockGetUserById,
    mockProfilesSelect,
    mockProfilesUpsert,
    mockCreateCustomer,
    mockCreateSession,
} = vi.hoisted(() => ({
    mockGetUserById:    vi.fn(),
    mockProfilesSelect: vi.fn(),
    mockProfilesUpsert: vi.fn().mockResolvedValue({ error: null }),
    mockCreateCustomer: vi.fn(),
    mockCreateSession:  vi.fn(),
}));

vi.mock("@/lib/supabaseServer", () => ({
    supabaseAdmin: {
        auth: {
            admin: { getUserById: mockGetUserById },
        },
        from: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnThis(),
            eq:     vi.fn().mockReturnThis(),
            single: mockProfilesSelect,
            upsert: mockProfilesUpsert,
        }),
    },
}));

vi.mock("stripe", () => ({
    default: function StripeConstructor() {
        return {
            customers: { create: mockCreateCustomer },
            checkout:  { sessions: { create: mockCreateSession } },
        };
    },
}));

import { NextRequest } from "next/server";
import { POST } from "@/app/api/billing/checkout/route";

const VALID_UUID = "123e4567-e89b-12d3-a456-426614174000";

function makeRequest(body: unknown): NextRequest {
    return new NextRequest("http://localhost/api/billing/checkout", {
        method:  "POST",
        body:    JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
    });
}

beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserById.mockResolvedValue({
        data: { user: { id: VALID_UUID, email: "user@example.com" } }, error: null,
    });
    mockProfilesSelect.mockResolvedValue({ data: { stripe_customer_id: "cus_existing" } });
    mockCreateSession.mockResolvedValue({ url: "https://checkout.stripe.com/test" });
    mockProfilesUpsert.mockResolvedValue({ error: null });
});

describe("POST /api/billing/checkout", () => {
    it("returns 400 VALIDATION_ERROR for missing priceId", async () => {
        const res = await POST(makeRequest({ userId: VALID_UUID }));
        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body.code).toBe("VALIDATION_ERROR");
    });

    it("returns 400 for non-UUID userId", async () => {
        const res = await POST(makeRequest({ priceId: "price_starter_test", userId: "bad-id" }));
        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body.error).toMatch(/uuid/i);
    });

    it("returns 400 for priceId not in allowlist", async () => {
        const res = await POST(makeRequest({ priceId: "price_evil", userId: VALID_UUID }));
        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body.error).toMatch(/invalid priceid/i);
    });

    it("returns 404 when Supabase user lookup fails", async () => {
        mockGetUserById.mockResolvedValue({ data: { user: null }, error: null });
        const res = await POST(makeRequest({ priceId: "price_starter_test", userId: VALID_UUID }));
        expect(res.status).toBe(404);
    });

    it("returns checkout URL using existing Stripe customer", async () => {
        const res = await POST(makeRequest({ priceId: "price_starter_test", userId: VALID_UUID }));
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.url).toBe("https://checkout.stripe.com/test");
        expect(mockCreateCustomer).not.toHaveBeenCalled();
    });

    it("creates a new Stripe customer when none exists", async () => {
        mockProfilesSelect.mockResolvedValue({ data: { stripe_customer_id: null } });
        mockCreateCustomer.mockResolvedValue({ id: "cus_new" });

        const res = await POST(makeRequest({ priceId: "price_pro_test", userId: VALID_UUID }));
        expect(res.status).toBe(200);
        expect(mockCreateCustomer).toHaveBeenCalledWith(
            expect.objectContaining({ email: "user@example.com" }),
        );
    });

    it("returns 400 for invalid JSON body", async () => {
        const req = new NextRequest("http://localhost/api/billing/checkout", {
            method:  "POST",
            body:    "not json {{",
            headers: { "Content-Type": "application/json" },
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
    });
});
