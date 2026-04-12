import { test, expect } from "@playwright/test";

/**
 * E2E: Billing checkout flow (Stripe test mode)
 * Requires:
 *   E2E_USER_EMAIL / E2E_USER_PASSWORD — a logged-in test account
 *   STRIPE_PRICE_STARTER              — the test-mode Stripe price ID
 */

test.describe("Billing checkout", () => {
    test.beforeEach(async ({ page }) => {
        // Sign in so we can trigger the checkout
        await page.goto("/auth");
        await page.getByLabel(/email/i).fill(process.env.E2E_USER_EMAIL ?? "");
        await page.getByLabel(/password/i).fill(process.env.E2E_USER_PASSWORD ?? "");
        await page.getByRole("button", { name: /sign in/i }).click();
        await page.waitForURL(/\/(app|dashboard)?/, { timeout: 10_000 });
    });

    test("clicking upgrade redirects to Stripe Checkout", async ({ page }) => {
        await page.goto("/app/image-to-text");

        // Click the Upgrade / Get Started CTA that triggers the checkout flow
        await page.getByRole("button", { name: /upgrade|get started|starter/i }).first().click();

        // Should redirect to Stripe's checkout domain
        await expect(page).toHaveURL(/checkout\.stripe\.com/, { timeout: 15_000 });
    });

    test("Stripe test checkout completes and redirects back", async ({ page }) => {
        // Navigate directly to the checkout session creation
        const response = await page.request.post("/api/billing/checkout", {
            data: {
                priceId: process.env.STRIPE_PRICE_STARTER ?? "",
                userId:  process.env.E2E_USER_ID ?? "",
            },
        });
        expect(response.status()).toBe(200);
        const { url } = await response.json();
        expect(url).toMatch(/checkout\.stripe\.com/);

        // Navigate to the checkout URL and fill in test card
        await page.goto(url);
        await page.getByPlaceholder(/card number/i).fill("4242 4242 4242 4242");
        await page.getByPlaceholder(/mm \/ yy/i).fill("12/34");
        await page.getByPlaceholder(/cvc/i).fill("123");
        await page.getByPlaceholder(/zip/i).fill("10001");
        await page.getByRole("button", { name: /subscribe|pay/i }).click();

        // Should redirect back to our success URL
        await expect(page).toHaveURL(/upgraded=true/, { timeout: 20_000 });
    });
});
