import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    test: {
        globals:     true,
        environment: "node",
        include:     ["**/*.test.ts"],
        exclude:     ["node_modules/**", "__tests__/e2e/**", "**/*.spec.ts"],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "."),
        },
    },
});
