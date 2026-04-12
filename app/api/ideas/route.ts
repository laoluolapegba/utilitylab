import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { IdeasSchema } from "@/lib/apiSchemas";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    let tool: string, description: string, email: string | null | undefined;

    try {
        const raw = await req.json();
        const parsed = IdeasSchema.safeParse(raw);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message ?? "Invalid request", code: "VALIDATION_ERROR" },
                { status: 400 },
            );
        }
        ({ tool, description, email } = parsed.data);
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
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
