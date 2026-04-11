# UtilityLab Codebase Audit — Roadmap Readiness

**Purpose:** Run this prompt in a Claude Code session to audit the codebase before adding new tools (e.g. Profit Margin Calculator, Listing Bulk Editor). It checks maintainability, consistency, and structural maturity across the existing 6 tools.

**Instructions for Claude Code:** Read each file listed, perform all 8 checks, and produce a structured pass/fail report at the end. Do NOT modify any files — this is read-only.

---

## Files to Read

```
app/app/image-to-text/page.tsx
app/app/invoice-parser/page.tsx
app/app/image-converter/page.tsx
app/app/product-listing-optimizer/page.tsx
app/compliance-form-generator/page.tsx
app/repricing-alerts/page.tsx

components/products/image-to-text/PricingSection.tsx
components/products/invoice-parser/PricingSection.tsx
components/products/image-converter/PricingSection.tsx
components/products/product-listing/PricingSection.tsx
components/products/compliance-form-generator/PricingSection.tsx
components/products/repricing-alerts/PricingSection.tsx

components/products/image-to-text/ImageUpload.tsx
components/products/invoice-parser/InvoiceParserTool.tsx

app/api/extract-text/route.ts
app/api/invoice-analyze/route.ts
app/api/generate-insights/route.ts

components/landing/ProductsGrid.tsx
components/landing/MarketingNavbar.tsx
lib/usageTracking.ts
package.json
```

---

## Check 1 — Product Page Scaffold Consistency

For each of the 6 product pages, confirm it follows this pattern:

**Required imports (in any order):**
- `MarketingNavbar` from `@/components/landing/MarketingNavbar`
- `Footer` from `@/components/landing/Footer`
- A `PricingSection` component
- A product-specific Hero component
- A `HowItWorks` component

**Required structure (in order):**
1. `<MarketingNavbar />`
2. `<main className="min-h-screen bg-white">`
3. Hero component
4. HowItWorks component
5. A `<section id="tool" ...>` containing the embedded tool component
6. Features component
7. `<PricingSection />`
8. FAQ component
9. `<Footer />`

**Required metadata export:**
- `export const metadata` or `export const metadata: Metadata` present at module level

**Report:** For each of the 6 pages, list which of the above elements are present and which are missing. Flag any page that deviates from the order.

---

## Check 2 — Component Folder Completeness

For each tool, check that `components/products/[tool]/` contains at minimum:

| File pattern | Required |
|---|---|
| `[Tool]Hero.tsx` or `*Hero.tsx` | Yes |
| `HowItWorks.tsx` | Yes |
| `[Tool]Features.tsx` or `*Features.tsx` | Yes |
| `PricingSection.tsx` | Yes |
| `ProductFAQ.tsx` or `*FAQ.tsx` | Yes |
| Main tool component (`*Tool.tsx` or `ImageUpload.tsx`) | Yes |

Check these 6 folders:
- `components/products/image-to-text/`
- `components/products/invoice-parser/`
- `components/products/image-converter/`
- `components/products/product-listing/`
- `components/products/compliance-form-generator/`
- `components/products/repricing-alerts/`

Use `Glob` to list files in each folder. Report which required files are missing per product.

---

## Check 3 — PricingSection Correctness

All 6 `PricingSection.tsx` files under `components/products/` must follow the "Included in your UtilityLab plan" pattern:
- No invented tier names with prices (e.g. no "Starter £9/mo", "Pro £29/mo")
- No `£` followed by a digit (e.g. `£9`, `£29`)
- No `$` followed by a digit (e.g. `$9`, `$29`)
- Must have a CTA pointing to `/pricing` or `/auth?mode=signup`

Use `Grep` to search for `£[0-9]` and `\$[0-9]` across all PricingSection files.

**Report:** Pass if none found. Fail with file name and line if any are found.

---

## Check 4 — Metadata Format Compliance

All 6 product pages must export metadata with:
- `title` matching the pattern: `"[Tool Name] — free [use case] | UtilityLab"`
  - Must contain ` — free ` (em dash, space, "free", space)
  - Must end with ` | UtilityLab`
- `description` as a single sentence (no newlines, ends with `.`)

Read each page file and check the metadata export.

**Expected titles:**
- image-to-text: `"Image to Text — free OCR for receipts and documents | UtilityLab"`
- invoice-parser: `"Invoice Parser — free invoice OCR and tax analysis | UtilityLab"`
- image-converter: `"Image Converter — free image format conversion in your browser | UtilityLab"`
- product-listing-optimizer: `"Product Listing Optimiser — free AI listing generator for sellers | UtilityLab"`
- compliance-form-generator: `"Compliance Form Generator — free UK business form builder | UtilityLab"`
- repricing-alerts: `"Re-Pricing Alerts — free competitor price monitoring for sellers | UtilityLab"`

**Report:** Pass/fail per page, with the actual title if it doesn't match.

---

## Check 5 — API Route Usage Tracking Pattern

Every POST route under `app/api/` that is NOT a billing or webhook route must call all three of:
1. `extractIdentity(req)` — to identify the caller
2. `checkLimit(userId, anonId)` — and return 429 if `!allowed`
3. `recordUsage(toolName, userId, anonId)` — after the limit check passes

Routes to check:
- `app/api/extract-text/route.ts`
- `app/api/invoice-analyze/route.ts`
- `app/api/generate-insights/route.ts`

For each route, confirm:
- `extractIdentity` is called and destructured
- `checkLimit` is called and the result tested with `if (!allowed) return 429`
- `recordUsage` is called before the main processing begins

**Report:** Pass/fail per route. Flag the exact missing call if any step is skipped.

---

## Check 6 — CorrelationId Surfacing in Tool Components

The two tool components that call the OCR/analysis APIs must handle errors correctly:

**`components/products/image-to-text/ImageUpload.tsx`**
- Must have a `generateCorrelationId()` function or import
- Must send `x-correlation-id` header on `fetch()` calls
- Must store the correlationId from the response header or generate one on error
- Must display `Ref: {correlationId}` in `text-xs text-slate-400` below error messages

**`components/products/invoice-parser/InvoiceParserTool.tsx`**
- Must have separate correlationId state variables for each API call (extract, analyze, QA)
- Must display `Ref: {id}` below each respective error
- Must clear all correlationIds in any "process another" / reset function

Read both files and confirm each requirement above.

**Report:** Pass/fail per requirement per file. Quote the relevant lines for any that pass so they can be confirmed.

---

## Check 7 — Missing Shared Abstractions (Roadmap Blockers)

Flag the following gaps that must be resolved before a 7th tool can be added cleanly:

### 7a. No `ProductPageLayout` shell
Check if a shared layout wrapper exists at:
- `components/layouts/ProductPageLayout.tsx`
- `components/ProductPageLayout.tsx`
- Any similar path

If absent: **flag as BLOCKER** — each new product will repeat the same 5 imports (Navbar, Footer, Hero, HowItWorks, PricingSection pattern).

### 7b. No product registry
Read `components/landing/ProductsGrid.tsx`. Check if the product list is hardcoded (array literal in the file) or loaded from a shared config/registry.

If hardcoded: **flag as BLOCKER** — adding a 7th product requires editing two places (page + ProductsGrid). Recommend extracting to `lib/products.ts`.

### 7c. MarketingNavbar "Go to Tool" hardcodes a single product
Read `components/landing/MarketingNavbar.tsx`. Search for the "Go to Tool" button/link. Check if its `href` is hardcoded to `/app/image-to-text` (or any single product URL).

If hardcoded: **flag as TECH DEBT** — the nav will silently send all logged-in users to one tool regardless of what they were doing.

### 7d. No test framework
Read `package.json`. Check for presence of any of: `jest`, `vitest`, `@testing-library/react`, `playwright`, `cypress` in `dependencies` or `devDependencies`.

If none found: **flag as RISK** — no automated tests means regressions during new tool additions will only be caught manually.

**Report:** For each of 7a–7d, state whether it's present or absent, and include the exact line/value if found.

---

## Check 8 — TOOL_LABEL Map Coverage

When a new tool is added, its name must appear in usage display maps. Check these two files for a `TOOL_LABEL` object or equivalent label map:

1. Search `components/AccountPage.tsx` for a `TOOL_LABEL` or similar mapping object
2. Search `app/api/account/usage/route.ts` for the same

For each, list which tool keys are present. The expected keys are:
- `extract-text`
- `invoice-analyze`
- `generate-insights`
- Any others found

**Report:** List all keys found in each file. Flag any mismatch between the two files.

---

## Output Format

Produce the report in this exact structure:

```
## Audit Report — UtilityLab Roadmap Readiness
Date: [today]

### Check 1 — Page Scaffold Consistency
[PASS/FAIL] image-to-text: ...
[PASS/FAIL] invoice-parser: ...
[PASS/FAIL] image-converter: ...
[PASS/FAIL] product-listing-optimizer: ...
[PASS/FAIL] compliance-form-generator: ...
[PASS/FAIL] repricing-alerts: ...

### Check 2 — Component Folder Completeness
[PASS/FAIL] image-to-text: missing: [list or "none"]
... (repeat for all 6)

### Check 3 — PricingSection Correctness
[PASS/FAIL] — [details if fail]

### Check 4 — Metadata Format Compliance
[PASS/FAIL] image-to-text: [actual title if fail]
... (repeat for all 6)

### Check 5 — API Route Usage Tracking
[PASS/FAIL] extract-text: [missing step if fail]
[PASS/FAIL] invoice-analyze: [missing step if fail]
[PASS/FAIL] generate-insights: [missing step if fail]

### Check 6 — CorrelationId Surfacing
[PASS/FAIL] ImageUpload.tsx: [details]
[PASS/FAIL] InvoiceParserTool.tsx: [details]

### Check 7 — Missing Shared Abstractions
[PRESENT/ABSENT] 7a. ProductPageLayout shell
[PRESENT/ABSENT] 7b. Product registry (ProductsGrid)
[PRESENT/ABSENT] 7c. MarketingNavbar "Go to Tool" hardcode
[PRESENT/ABSENT] 7d. Test framework in package.json

### Check 8 — TOOL_LABEL Map Coverage
AccountPage.tsx keys: [list]
account/usage/route.ts keys: [list]
[PASS/FAIL] Keys are in sync

---

## Summary

Checks passed: X / 8
Blockers to resolve before adding a 7th tool:
- [list]

---

## New Tool Checklist — Profit Margin Calculator / Listing Bulk Editor

Use this checklist when adding any new tool:

- [ ] Create `app/app/[tool-slug]/page.tsx` with metadata: `"[Tool Name] — free [use case] | UtilityLab"`
- [ ] Create `components/products/[tool-slug]/` containing:
  - [ ] `[Tool]Hero.tsx` — hero with scroll-to-tool CTA
  - [ ] `HowItWorks.tsx` — 3-step process
  - [ ] `[Tool]Tool.tsx` — main interactive component
  - [ ] `[Tool]Features.tsx` — feature grid
  - [ ] `PricingSection.tsx` — "Included in your UtilityLab plan" pattern (no invented prices)
  - [ ] `ProductFAQ.tsx` — product-specific FAQs
- [ ] Add entry to `components/landing/ProductsGrid.tsx` product array
- [ ] Create `app/api/[tool-slug]/route.ts` with:
  - [ ] `extractIdentity(req)`
  - [ ] `checkLimit(userId, anonId)` → 429 if `!allowed`
  - [ ] `recordUsage("[tool-slug]", userId, anonId)`
  - [ ] `createLogger(correlationId)` + `generateCorrelationId()`
  - [ ] Return `x-correlation-id` response header
- [ ] Add tool key to `TOOL_LABEL` map in `components/AccountPage.tsx`
- [ ] Add tool key to label map in `app/api/account/usage/route.ts`
- [ ] Confirm `<section id="tool" ...>` exists in the page for scroll-to-tool to work
- [ ] Test: anonymous user → 3 uses → 429 → UpgradeModal appears
- [ ] Test: signed-in free user → same 3/day limit applies
- [ ] Test: correlationId appears in error UI as `Ref: xxx` in `text-xs text-slate-400`
```
