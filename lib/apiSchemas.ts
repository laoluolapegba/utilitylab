/**
 * Zod schemas for all JSON-body API routes.
 * Import the relevant schema into each route and call `.safeParse(body)`.
 */

import { z } from "zod";

/** POST /api/invoice-analyze */
export const InvoiceAnalyzeSchema = z.object({
    rawText:  z.string().max(200_000).optional().default(""),
    invoice:  z.record(z.string(), z.unknown()).optional().default({}),
    analysis: z.record(z.string(), z.unknown()).optional(),
    question: z.string().max(2_000).optional(),
});

/** POST /api/billing/checkout */
export const CheckoutSchema = z.object({
    priceId: z.string().min(1, "priceId is required"),
    userId:  z.string().uuid("userId must be a UUID"),
});

/** POST /api/ideas */
export const IdeasSchema = z.object({
    tool:        z.string().min(1).max(100),
    description: z.string().min(1, "description is required").max(2_000),
    email:       z.string().email().nullable().optional(),
});
