import { test, expect } from "@playwright/test";

/**
 * E2E: Anonymous usage limit
 * Verifies that an unauthenticated user hitting the API 31× gets a 429 on the 31st request.
 * Uses the API directly so the test is fast and deterministic.
 */

test.describe("Anonymous usage limit", () => {
    test("returns 429 after 30 uses for an anonymous user", async ({ request }) => {
        const anonId = `e2e-anon-${Date.now()}`;

        // Helper to send one OCR request
        async function sendRequest() {
            const fd = new FormData();
            fd.append("file", new Blob(["x"], { type: "image/png" }), "test.png");

            return request.post("/api/extract-text", {
                headers: { "x-anon-id": anonId },
                multipart: {
                    file: {
                        name:     "test.png",
                        mimeType: "image/png",
                        buffer:   Buffer.from("x"),
                    },
                },
            });
        }

        // First 30 requests should be allowed (may succeed or fail with 502 if no providers,
        // but must NOT be 429)
        for (let i = 0; i < 30; i++) {
            const res = await sendRequest();
            expect(res.status(), `Request ${i + 1} should not be rate-limited`).not.toBe(429);
        }

        // 31st request must be rate-limited
        const thirtyFirst = await sendRequest();
        expect(thirtyFirst.status()).toBe(429);
        const body = await thirtyFirst.json();
        expect(body.upgradeRequired).toBe(true);
        expect(body.used).toBe(30);
    });
});
