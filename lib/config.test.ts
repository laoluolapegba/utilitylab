import { describe, it, expect, vi, afterEach } from "vitest";

const REQUIRED = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
];

function setAllRequired() {
    REQUIRED.forEach((k) => vi.stubEnv(k, "test-value"));
}

afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
});

describe("lib/config", () => {
    it("does not throw when all required vars are set", async () => {
        setAllRequired();
        await expect(import("./config")).resolves.not.toThrow();
    });

    it("throws when NEXT_PUBLIC_SUPABASE_URL is missing", async () => {
        setAllRequired();
        vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
        vi.resetModules();
        await expect(import("./config")).rejects.toThrow("NEXT_PUBLIC_SUPABASE_URL");
    });

    it("throws when SUPABASE_SERVICE_ROLE_KEY is missing", async () => {
        setAllRequired();
        vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
        vi.resetModules();
        await expect(import("./config")).rejects.toThrow("SUPABASE_SERVICE_ROLE_KEY");
    });

    it("throws when STRIPE_SECRET_KEY is missing", async () => {
        setAllRequired();
        vi.stubEnv("STRIPE_SECRET_KEY", "");
        vi.resetModules();
        await expect(import("./config")).rejects.toThrow("STRIPE_SECRET_KEY");
    });

    it("throws when STRIPE_WEBHOOK_SECRET is missing", async () => {
        setAllRequired();
        vi.stubEnv("STRIPE_WEBHOOK_SECRET", "");
        vi.resetModules();
        await expect(import("./config")).rejects.toThrow("STRIPE_WEBHOOK_SECRET");
    });

    it("throws listing all missing vars when multiple are absent", async () => {
        // No env vars set — should list all required
        try {
            vi.resetModules();
            await import("./config");
            expect.fail("should have thrown");
        } catch (err) {
            const msg = (err as Error).message;
            expect(msg).toContain("Missing required environment variables");
            REQUIRED.forEach((k) => expect(msg).toContain(k));
        }
    });
});
