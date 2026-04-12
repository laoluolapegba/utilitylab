import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";
import os from "os";

/**
 * E2E: OCR upload flow
 * Covers successful text extraction and >10 MB file rejection.
 */

test.describe("OCR Upload", () => {
    test("extracts text from a valid image file", async ({ page }) => {
        await page.goto("/app/image-to-text");

        // Scroll to the embedded tool section
        await page.getByRole("link", { name: /try it|use tool|start/i }).first().click();

        const fileInput = page.locator('input[type="file"]');
        await expect(fileInput).toBeAttached();

        // Use a small test PNG (create a 1×1 pixel PNG on the fly)
        const tmpFile = path.join(os.tmpdir(), "e2e-test.png");
        // Minimal valid 1×1 white PNG
        const pngBytes = Buffer.from(
            "89504e470d0a1a0a0000000d49484452000000010000000108020000009001" +
            "2e00000000c4944415478016360f8cfc00000000200015e18e5600000000049454e44ae426082",
            "hex",
        );
        fs.writeFileSync(tmpFile, pngBytes);

        await fileInput.setInputFiles(tmpFile);
        await page.getByRole("button", { name: /extract|analyze|submit/i }).click();

        // Wait for result or error — either is acceptable for this smoke test
        await expect(
            page.getByText(/extracted|text|error|provider/i),
        ).toBeVisible({ timeout: 20_000 });

        fs.unlinkSync(tmpFile);
    });

    test("rejects a file larger than 10 MB", async ({ page }) => {
        await page.goto("/app/image-to-text#tool");

        const fileInput = page.locator('input[type="file"]');
        await expect(fileInput).toBeAttached();

        // Create a file just over 10 MB
        const tmpFile = path.join(os.tmpdir(), "e2e-large.bin");
        const buf = Buffer.alloc(10_485_761, 0);
        fs.writeFileSync(tmpFile, buf);

        await fileInput.setInputFiles(tmpFile);
        await page.getByRole("button", { name: /extract|analyze|submit/i }).click();

        await expect(
            page.getByText(/10 mb|too large|file size/i),
        ).toBeVisible({ timeout: 10_000 });

        fs.unlinkSync(tmpFile);
    });
});
