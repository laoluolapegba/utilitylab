// app/api/admin/metrics/route.ts
//
// Internal endpoint — only callable by users whose email is in ADMIN_EMAILS.
// Never linked from public nav.
//
// Required env vars:
//   ADMIN_EMAILS   — comma-separated list, e.g. "alice@example.com,bob@example.com"
//   SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL (already set)

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const runtime = "nodejs";

function isAdmin(email: string | undefined): boolean {
    if (!email) return false;
    const allowed = (process.env.ADMIN_EMAILS ?? "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
    return allowed.includes(email.toLowerCase());
}

function todayRange() {
    const today = new Date().toISOString().slice(0, 10);
    return {
        start: `${today}T00:00:00.000Z`,
        end:   `${today}T23:59:59.999Z`,
    };
}

export async function GET(req: NextRequest) {
    // ── Auth ────────────────────────────────────────────────────────────────
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(auth.slice(7));
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAdmin(user.email)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ── Queries ─────────────────────────────────────────────────────────────
    const { start, end } = todayRange();

    const [eventsResult, profilesResult] = await Promise.all([
        supabaseAdmin
            .from("usage_events")
            .select("tool_name, user_id, anon_id")
            .gte("created_at", start)
            .lte("created_at", end),

        supabaseAdmin
            .from("profiles")
            .select("user_id, plan, updated_at")
            .in("plan", ["starter", "pro"])
            .gte("updated_at", start)
            .lte("updated_at", end),
    ]);

    if (eventsResult.error) {
        console.error("[admin/metrics] usage_events query failed:", eventsResult.error.message);
        return NextResponse.json({ error: "Query failed" }, { status: 500 });
    }

    const events   = eventsResult.data ?? [];
    const upgrades = profilesResult.data ?? [];

    // 1. Total uses today
    const totalToday = events.length;

    // 2. Uses per tool today
    const byTool: Record<string, number> = {};
    for (const e of events) {
        byTool[e.tool_name] = (byTool[e.tool_name] ?? 0) + 1;
    }

    // 3. Upgrade events today
    const upgradeCount = upgrades.length;
    const upgradesByPlan: Record<string, number> = {};
    for (const p of upgrades) {
        upgradesByPlan[p.plan] = (upgradesByPlan[p.plan] ?? 0) + 1;
    }

    // 4. Unique users + anon_ids today
    const uniqueUserIds = new Set(events.map((e) => e.user_id).filter(Boolean));
    const uniqueAnonIds = new Set(events.map((e) => e.anon_id).filter(Boolean));
    const uniqueTotal   = uniqueUserIds.size + uniqueAnonIds.size;

    return NextResponse.json({
        asOf: new Date().toISOString(),
        totalToday,
        byTool,
        upgradeCount,
        upgradesByPlan,
        uniqueTotal,
        uniqueUserIds:  uniqueUserIds.size,
        uniqueAnonIds:  uniqueAnonIds.size,
    });
}
