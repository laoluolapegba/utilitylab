import { test, expect } from "@playwright/test";

/**
 * E2E: Authentication flow
 * Covers sign-up, sign-in, and sign-out through the UI.
 */

const TEST_EMAIL    = `e2e-${Date.now()}@mailinator.com`;
const TEST_PASSWORD = "TestP@ssword123!";

test.describe("Authentication", () => {
    test("sign up with a new account", async ({ page }) => {
        await page.goto("/auth");
        await page.getByRole("tab", { name: /sign up/i }).click();

        await page.getByLabel(/email/i).fill(TEST_EMAIL);
        await page.getByLabel(/password/i).fill(TEST_PASSWORD);
        await page.getByRole("button", { name: /sign up/i }).click();

        // Supabase email confirmation — expect either a success message or redirect
        await expect(
            page.getByText(/check your email|signed in|dashboard/i),
        ).toBeVisible({ timeout: 10_000 });
    });

    test("sign in with existing credentials and sign out", async ({ page }) => {
        // Navigate to auth page
        await page.goto("/auth");

        // Fill sign-in form
        await page.getByLabel(/email/i).fill(process.env.E2E_USER_EMAIL ?? "test@example.com");
        await page.getByLabel(/password/i).fill(process.env.E2E_USER_PASSWORD ?? "password123");
        await page.getByRole("button", { name: /sign in/i }).click();

        // Either redirected to app or stays on auth with a welcome state
        await expect(page).toHaveURL(/\/(app|dashboard)?/, { timeout: 10_000 });

        // Sign out via navbar
        await page.getByRole("button", { name: /sign out/i }).click();
        await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible({ timeout: 5_000 });
    });
});
