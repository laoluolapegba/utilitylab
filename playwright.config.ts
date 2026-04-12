import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./__tests__/e2e",
    timeout:     30_000,
    retries:     process.env.CI ? 2 : 0,
    workers:     process.env.CI ? 1 : undefined,
    reporter:    "line",
    use: {
        baseURL:           process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
        trace:             "on-first-retry",
        screenshot:        "only-on-failure",
    },
    projects: [
        {
            name: "chromium",
            use:  { ...devices["Desktop Chrome"] },
        },
    ],
    webServer: process.env.CI ? undefined : {
        command: "npm run dev",
        url:     "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120_000,
    },
});
