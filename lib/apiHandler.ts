/**
 * Higher-order function that wraps an API route handler with:
 * - Correlation ID generation
 * - Optional identity extraction + auth guard
 * - Optional usage limit check + recording
 * - Catch-all 500 with standard error envelope
 *
 * Routes only need to contain their own business logic.
 */

import { NextRequest, NextResponse } from "next/server";
import { generateCorrelationId, createLogger } from "@/lib/logger";
import { extractIdentity, checkLimit, recordUsage } from "@/lib/usageTracking";
import { apiError } from "@/lib/apiError";

export type HandlerContext = {
    correlationId: string;
    log: ReturnType<typeof createLogger>;
    requestStart: number;
    userId?: string;
    anonId?: string;
};

export type HandlerOptions = {
    /** Return 401 if no valid Bearer JWT found. */
    requireAuth?: boolean;
    /** Check daily usage limit and record one event on success. */
    checkUsage?: boolean;
    /** Tool name written to usage_events (required when checkUsage is true). */
    tool?: string;
};

export function withApiHandler(
    options: HandlerOptions,
    handler: (req: NextRequest, ctx: HandlerContext) => Promise<NextResponse>,
): (req: NextRequest) => Promise<NextResponse> {
    return async (req: NextRequest): Promise<NextResponse> => {
        const correlationId = req.headers.get("x-correlation-id") ?? generateCorrelationId();
        const log = createLogger(correlationId);
        const requestStart = Date.now();

        try {
            // ── Identity ──────────────────────────────────────────────────────
            const { userId, anonId } = options.requireAuth || options.checkUsage
                ? await extractIdentity(req)
                : {};

            if (options.requireAuth && !userId) {
                return apiError("UNAUTHORIZED", "Authentication required", 401, correlationId);
            }

            // ── Usage limit ───────────────────────────────────────────────────
            if (options.checkUsage) {
                const { allowed, used, limit } = await checkLimit(userId, anonId);
                if (!allowed) {
                    return NextResponse.json(
                        { upgradeRequired: true, used, limit },
                        { status: 429, headers: { "x-correlation-id": correlationId } },
                    );
                }
                await recordUsage(options.tool ?? "unknown", userId, anonId);
            }

            return await handler(req, { correlationId, log, requestStart, userId, anonId });
        } catch (err) {
            log("unhandled_error").error("Unhandled route error", {
                durationMs: Date.now() - requestStart,
                error: err instanceof Error ? err : new Error(String(err)),
            });
            return apiError(
                "INTERNAL_ERROR",
                "An unexpected error occurred",
                500,
                correlationId,
            );
        }
    };
}
