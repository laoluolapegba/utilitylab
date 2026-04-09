import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest) {
    // Authenticate caller
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: { user } } = await supabaseAdmin.auth.getUser(auth.slice(7));
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get Stripe customer ID + plan from profiles
    const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("stripe_customer_id, stripe_subscription_id, plan")
        .eq("user_id", user.id)
        .single();

    if (!profile?.stripe_customer_id) {
        return NextResponse.json({ invoices: [], plan: profile?.plan ?? "free" });
    }

    const list = await stripe.invoices.list({
        customer: profile.stripe_customer_id,
        limit: 24,
    });

    const invoices = list.data.map((inv) => ({
        id:          inv.id,
        number:      inv.number,
        amount:      inv.amount_paid / 100,
        currency:    inv.currency.toUpperCase(),
        status:      inv.status,
        date:        inv.created,
        period_start: inv.period_start,
        period_end:   inv.period_end,
        pdf:         inv.invoice_pdf,
        plan:        inv.lines.data[0]?.description ?? "Starter",
    }));

    return NextResponse.json({ invoices, plan: profile.plan ?? "free" });
}
