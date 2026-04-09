import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    let tool: string, description: string, email: string | null;

    try {
        ({ tool, description, email = null } = await req.json());
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (!tool || !description?.trim()) {
        return NextResponse.json({ error: "tool and description are required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("ideas").insert({
        tool,
        description: description.trim(),
        email: email?.trim() || null,
    });

    if (error) {
        console.error("[POST /api/ideas]", error.message);
        return NextResponse.json({ error: "Failed to save idea" }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
}
