// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock supabase before importing the module under test.
// All tests in this file simulate an anonymous (unauthenticated) user
// so the only logic under test is the localStorage snapshot path.
vi.mock("@/lib/supabaseClient", () => ({
    supabase: {
        auth: {
            getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        },
    },
}));

import { getUsageLimitState, recordAnonymousUsage } from "./usageLimits";

const STORAGE_KEY = "utilitylab:anon-usage:v1";

describe("usageLimits — anonymous user", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("returns zero usage on first visit", async () => {
        const state = await getUsageLimitState();
        expect(state.isAuthenticated).toBe(false);
        expect(state.usedToday).toBe(0);
        expect(state.limit).toBe(30);
        expect(state.remaining).toBe(30);
        expect(state.limitReached).toBe(false);
        expect(state.loading).toBe(false);
    });

    it("remaining + usedToday always equals limit", async () => {
        await recordAnonymousUsage();
        await recordAnonymousUsage();
        const state = await getUsageLimitState();
        expect(state.usedToday + state.remaining).toBe(state.limit);
    });

    it("increments usedToday on each recordAnonymousUsage call", async () => {
        await recordAnonymousUsage();
        expect((await getUsageLimitState()).usedToday).toBe(1);

        await recordAnonymousUsage();
        expect((await getUsageLimitState()).usedToday).toBe(2);
    });

    it("sets limitReached after 30 uses", async () => {
        for (let i = 0; i < 30; i++) await recordAnonymousUsage();
        const state = await getUsageLimitState();
        expect(state.usedToday).toBe(30);
        expect(state.remaining).toBe(0);
        expect(state.limitReached).toBe(true);
    });

    it("does not exceed the cap on extra calls", async () => {
        for (let i = 0; i < 32; i++) await recordAnonymousUsage();
        const state = await getUsageLimitState();
        expect(state.usedToday).toBe(30);
    });

    it("resets count when the stored date is yesterday", async () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ date: yesterday.toISOString().slice(0, 10), count: 30 }),
        );
        const state = await getUsageLimitState();
        expect(state.usedToday).toBe(0);
        expect(state.limitReached).toBe(false);
    });

    it("handles malformed localStorage JSON gracefully", async () => {
        localStorage.setItem(STORAGE_KEY, "not-json{{{{");
        const state = await getUsageLimitState();
        expect(state.usedToday).toBe(0);
        expect(state.limitReached).toBe(false);
    });

    it("handles missing count field in stored snapshot", async () => {
        const today = new Date().toISOString().slice(0, 10);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today }));
        const state = await getUsageLimitState();
        expect(state.usedToday).toBe(0);
    });
});
