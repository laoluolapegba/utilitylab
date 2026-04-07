// lib/usageTracking.ts
// Two-function usage accounting layer for all API routes.
//
//   extractIdentity(req)           — resolves userId (from JWT) or anonId (from header)
//   checkLimit(userId?, anonId?)   — { allowed, used, limit } — does NOT record
//   recordUsage(tool, userId?, anonId?) — inserts one row into usage_events
//
// Call order in every route handler:
//   1. extractIdentity
//   2. checkLimit  → return 429 if not allowed
//   3. recordUsage
//   4. actual processing

import { NextRequest } from "next/server";
import { supabaseAdmin } from "./supabaseServer";

// ── Plan limits (requests per calendar day, UTC) ──────────────────────────────

const PLAN_LIMIT: Record<string, number> = {
    anon:    3,
    free:    3,
    starter: 50,
    pro:     Infinity,
};

// ── Identity resolution ───────────────────────────────────────────────────────

/**
 * Extracts the caller's identity from the request.
 * - Authenticated: validates the Bearer JWT with Supabase, returns `userId`.
 * - Anonymous: reads the `x-anon-id` header set by the client, returns `anonId`.
 */
export async function extractIdentity(
    req: NextRequest,
): Promise<{ userId?: string; anonId?: string }> {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
        const { data } = await supabaseAdmin.auth.getUser(authHeader.slice(7));
        if (data.user) return { userId: data.user.id };
    }
    const anonId = req.headers.get("x-anon-id") ?? undefined;
    return { anonId };
}

// ── Limit check ───────────────────────────────────────────────────────────────

/**
 * Returns the caller's current daily usage and whether they may proceed.
 * Does NOT write anything — call recordUsage separately.
 */
export async function checkLimit(
    userId?: string,
    anonId?: string,
): Promise<{ allowed: boolean; used: number; limit: number }> {
    // ── Resolve plan ──────────────────────────────────────────────────────────
    let planKey = userId ? "free" : "anon";

    if (userId) {
        const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("plan")
            .eq("user_id", userId)
            .single();

        const plan = profile?.plan as string | undefined;
        if (plan === "starter" || plan === "pro") planKey = plan;
    }

    const limit = PLAN_LIMIT[planKey] ?? PLAN_LIMIT.free;

    // Pro users are never blocked — skip the DB read entirely
    if (limit === Infinity) {
        return { allowed: true, used: 0, limit: Infinity };
    }

    // ── Count today's events ──────────────────────────────────────────────────
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    const dayStart = `${today}T00:00:00.000Z`;
    const dayEnd   = `${today}T23:59:59.999Z`;

    let used = 0;

    if (userId) {
        const { count } = await supabaseAdmin
            .from("usage_events")
            .select("id", { count: "exact", head: true })
            .eq("user_id", userId)
            .gte("created_at", dayStart)
            .lte("created_at", dayEnd);
        used = count ?? 0;
    } else if (anonId) {
        const { count } = await supabaseAdmin
            .from("usage_events")
            .select("id", { count: "exact", head: true })
            .eq("anon_id", anonId)
            .gte("created_at", dayStart)
            .lte("created_at", dayEnd);
        used = count ?? 0;
    }

    return { allowed: used < limit, used, limit };
}

// ── Usage recording ───────────────────────────────────────────────────────────

/**
 * Inserts one row into usage_events using the service-role client.
 * Fire-and-forget safe — awaited in routes so errors surface normally.
 */
export async function recordUsage(
    toolName: string,
    userId?: string,
    anonId?: string,
): Promise<void> {
    await supabaseAdmin.from("usage_events").insert({
        user_id:   userId  ?? null,
        anon_id:   anonId  ?? null,
        tool_name: toolName,
    });
}
