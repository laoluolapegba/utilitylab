import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: { user } } = await supabaseAdmin.auth.getUser(auth.slice(7));
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Last 30 days
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const { data, error } = await supabaseAdmin
        .from("usage_events")
        .select("tool_name, created_at")
        .eq("user_id", user.id)
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Aggregate: { "2026-04-09": { "image-to-text": 3, ... }, ... }
    const byDay: Record<string, Record<string, number>> = {};
    const byTool: Record<string, number> = {};

    for (const row of data ?? []) {
        const day = row.created_at.slice(0, 10);
        byDay[day] ??= {};
        byDay[day][row.tool_name] = (byDay[day][row.tool_name] ?? 0) + 1;
        byTool[row.tool_name] = (byTool[row.tool_name] ?? 0) + 1;
    }

    const total = (data ?? []).length;
    const days  = Object.keys(byDay).length || 1;

    return NextResponse.json({
        total,
        dailyAverage: +(total / days).toFixed(1),
        topTool: Object.entries(byTool).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null,
        byTool,
        byDay,
    });
}
