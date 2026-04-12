// lib/usageTracking.ts
// Two-function usage accounting layer for all API routes.
//
//   extractIdentity(req)                     — resolves userId or anonId
//   checkAndRecord(tool, userId?, anonId?)   — atomic check+insert via RPC
//
// Legacy exports (checkLimit, recordUsage) kept for compatibility during migration.

import { NextRequest } from "next/server";
import { supabaseAdmin } from "./supabaseServer";

// ── Plan limits (requests per calendar day, UTC) ──────────────────────────────

const PLAN_LIMIT: Record<string, number> = {
    anon:    3,
    free:    3,
    starter: 50,
    pro:     2_147_483_647, // pg INTEGER max — treated as unlimited in the RPC
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

// ── Plan resolution ───────────────────────────────────────────────────────────

async function resolvePlanLimit(userId?: string): Promise<number> {
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

    return PLAN_LIMIT[planKey] ?? PLAN_LIMIT.free;
}

// ── Atomic check-and-record (preferred) ──────────────────────────────────────

/**
 * Atomically checks the daily usage limit and records one event if allowed.
 * Uses a Postgres advisory lock to prevent race conditions under concurrent requests.
 * Returns { allowed, used, limit }.
 */
export async function checkAndRecord(
    toolName: string,
    userId?: string,
    anonId?: string,
): Promise<{ allowed: boolean; used: number; limit: number }> {
    const limit = await resolvePlanLimit(userId);

    const { data, error } = await supabaseAdmin.rpc("check_and_record_usage", {
        p_user_id: userId  ?? null,
        p_anon_id: anonId  ?? null,
        p_tool:    toolName,
        p_limit:   limit,
    });

    if (error || !data?.[0]) {
        // RPC unavailable — fall back to non-atomic path so the request isn't blocked
        process.stdout.write(
            JSON.stringify({
                level: "warn",
                stage: "check_and_record",
                message: "RPC check_and_record_usage failed, using fallback",
                error: error?.message,
                timestamp: new Date().toISOString(),
            }) + "\n",
        );
        return fallbackCheckAndRecord(toolName, userId, anonId, limit);
    }

    const row = data[0] as { allowed: boolean; used_count: number };
    return { allowed: row.allowed, used: row.used_count, limit };
}

// ── Fallback (non-atomic) ─────────────────────────────────────────────────────

async function fallbackCheckAndRecord(
    toolName: string,
    userId?: string,
    anonId?: string,
    limit?: number,
): Promise<{ allowed: boolean; used: number; limit: number }> {
    const resolvedLimit = limit ?? await resolvePlanLimit(userId);
    const { allowed, used } = await checkLimit(userId, anonId, resolvedLimit);
    if (allowed) await recordUsage(toolName, userId, anonId);
    return { allowed, used, limit: resolvedLimit };
}

// ── Legacy: separate check + record ──────────────────────────────────────────

/**
 * Returns the caller's current daily usage and whether they may proceed.
 * Does NOT write anything — call recordUsage separately.
 * @deprecated Prefer checkAndRecord for atomic behaviour.
 */
export async function checkLimit(
    userId?: string,
    anonId?: string,
    limitOverride?: number,
): Promise<{ allowed: boolean; used: number; limit: number }> {
    const limit = limitOverride ?? await resolvePlanLimit(userId);

    if (limit === PLAN_LIMIT.pro) {
        return { allowed: true, used: 0, limit };
    }

    const today    = new Date().toISOString().slice(0, 10);
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

/**
 * Inserts one row into usage_events.
 * @deprecated Prefer checkAndRecord for atomic behaviour.
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
