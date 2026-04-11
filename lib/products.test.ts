import { describe, it, expect } from "vitest";
import { products, type Product } from "./products";

const REQUIRED_KEYS: (keyof Product)[] = [
    "id", "name", "description", "icon", "status", "href", "color", "features",
];

describe("products registry", () => {
    it("has at least one product", () => {
        expect(products.length).toBeGreaterThan(0);
    });

    it.each(products)("$name — has all required fields", (product) => {
        for (const key of REQUIRED_KEYS) {
            expect(product[key], `${product.id} is missing field: ${key}`).toBeDefined();
        }
    });

    it("has no duplicate ids", () => {
        const ids = products.map((p) => p.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it("has no duplicate hrefs", () => {
        const hrefs = products.map((p) => p.href);
        expect(new Set(hrefs).size).toBe(hrefs.length);
    });

    it("all hrefs start with /app/", () => {
        for (const p of products) {
            expect(p.href, `${p.id} href must start with /app/`).toMatch(/^\/app\//);
        }
    });

    it("all statuses are valid", () => {
        const valid = ["live", "coming-soon"];
        for (const p of products) {
            expect(valid, `${p.id} has unrecognised status "${p.status}"`).toContain(p.status);
        }
    });

    it("all features arrays have at least one item", () => {
        for (const p of products) {
            expect(
                p.features.length,
                `${p.id} has an empty features array`,
            ).toBeGreaterThan(0);
        }
    });

    it("all feature strings are non-empty", () => {
        for (const p of products) {
            for (const f of p.features) {
                expect(f.trim(), `${p.id} has a blank feature string`).not.toBe("");
            }
        }
    });
});
