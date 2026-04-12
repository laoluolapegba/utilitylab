/**
 * Integration tests for POST /api/billing/webhook
 * Mocks: Supabase, Stripe
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.hoisted(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL  = "https://test.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key";
    process.env.STRIPE_SECRET_KEY         = "sk_test_xxx";
    process.env.STRIPE_WEBHOOK_SECRET     = "whsec_test";
    process.env.STRIPE_PRICE_STARTER      = "price_starter_test";
    process.env.STRIPE_PRICE_PRO          = "price_pro_test";
});

// ── Hoist mocks ───────────────────────────────────────────────────────────────
const {
    mockConstructEvent,
    mockListLineItems,
    mockUpsert,
    mockInsert,
    mockMaybySingle,
} = vi.hoisted(() => ({
    mockConstructEvent: vi.fn(),
    mockListLineItems:  vi.fn().mockResolvedValue({
        data: [{ price: { id: "price_starter_test" } }],
    }),
    mockUpsert:     vi.fn().mockResolvedValue({ error: null }),
    mockInsert:     vi.fn().mockResolvedValue({ error: null }),
    mockMaybySingle: vi.fn().mockResolvedValue({ data: null }),
}));

vi.mock("@/lib/supabaseServer", () => ({
    supabaseAdmin: {
        from: vi.fn().mockReturnValue({
            select:      vi.fn().mockReturnThis(),
            eq:          vi.fn().mockReturnThis(),
            maybeSingle: mockMaybySingle,
            insert:      mockInsert,
            upsert:      mockUpsert,
        }),
    },
}));

vi.mock("stripe", () => ({
    default: function StripeConstructor() {
        return {
            webhooks: { constructEvent: mockConstructEvent },
            checkout: { sessions: { listLineItems: mockListLineItems } },
        };
    },
}));

import { NextRequest } from "next/server";
import { POST } from "@/app/api/billing/webhook/route";

function makeRequest(body: string, sig = "valid-sig"): NextRequest {
    return new NextRequest("http://localhost/api/billing/webhook", {
        method:  "POST",
        body,
        headers: { "stripe-signature": sig },
    });
}

function checkoutEvent(eventId = "evt_001", priceId = "price_starter_test", userId = "user-123") {
    return {
        id:   eventId,
        type: "checkout.session.completed",
        data: {
            object: {
                id:           "cs_test",
                metadata:     { userId },
                customer:     "cus_test",
                subscription: "sub_test",
            },
        },
    };
}

beforeEach(() => {
    vi.clearAllMocks();
    mockMaybySingle.mockResolvedValue({ data: null });          // not a duplicate
    mockInsert.mockResolvedValue({ error: null });
    mockUpsert.mockResolvedValue({ error: null });
    mockListLineItems.mockResolvedValue({ data: [{ price: { id: "price_starter_test" } }] });
});

describe("POST /api/billing/webhook", () => {
    it("returns 400 when stripe-signature header is missing", async () => {
        const req = new NextRequest("http://localhost/api/billing/webhook", {
            method: "POST",
            body:   "{}",
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
    });

    it("returns 400 when signature verification fails", async () => {
        mockConstructEvent.mockImplementation(() => { throw new Error("Signature mismatch"); });
        const res = await POST(makeRequest("{}", "bad-sig"));
        expect(res.status).toBe(400);
    });

    it("returns 200 silently for duplicate event (idempotency)", async () => {
        mockConstructEvent.mockReturnValue(checkoutEvent("evt_001"));
        mockMaybySingle.mockResolvedValue({ data: { event_id: "evt_001" } }); // already seen

        const res = await POST(makeRequest("raw"));
        expect(res.status).toBe(200);
        expect(mockUpsert).not.toHaveBeenCalled();
    });

    it("upserts starter plan on checkout.session.completed", async () => {
        mockConstructEvent.mockReturnValue(checkoutEvent("evt_002", "price_starter_test"));

        const res = await POST(makeRequest("raw"));
        expect(res.status).toBe(200);
        expect(mockUpsert).toHaveBeenCalledWith(
            expect.objectContaining({ plan: "starter" }),
            expect.any(Object),
        );
    });

    it("upserts pro plan for pro price ID", async () => {
        mockConstructEvent.mockReturnValue(checkoutEvent("evt_003", "price_pro_test"));
        mockListLineItems.mockResolvedValue({ data: [{ price: { id: "price_pro_test" } }] });

        const res = await POST(makeRequest("raw"));
        expect(res.status).toBe(200);
        expect(mockUpsert).toHaveBeenCalledWith(
            expect.objectContaining({ plan: "pro" }),
            expect.any(Object),
        );
    });

    it("returns 200 without upsert for unknown price ID", async () => {
        mockConstructEvent.mockReturnValue(checkoutEvent("evt_004"));
        mockListLineItems.mockResolvedValue({ data: [{ price: { id: "price_unknown" } }] });

        const res = await POST(makeRequest("raw"));
        expect(res.status).toBe(200);
        expect(mockUpsert).not.toHaveBeenCalled();
    });

    it("returns 200 without upsert when userId is absent from metadata", async () => {
        mockConstructEvent.mockReturnValue({
            id:   "evt_005",
            type: "checkout.session.completed",
            data: { object: { id: "cs_x", metadata: {}, customer: null, subscription: null } },
        });

        const res = await POST(makeRequest("raw"));
        expect(res.status).toBe(200);
        expect(mockUpsert).not.toHaveBeenCalled();
    });

    it("ignores unhandled event types", async () => {
        mockConstructEvent.mockReturnValue({ id: "evt_006", type: "customer.updated", data: {} });
        const res = await POST(makeRequest("raw"));
        expect(res.status).toBe(200);
        expect(mockUpsert).not.toHaveBeenCalled();
    });
});
