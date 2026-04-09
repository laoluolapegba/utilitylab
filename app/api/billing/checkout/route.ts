// app/api/billing/checkout/route.ts
// Creates a Stripe Checkout session for the requested price.
//
// Body: { priceId: string, userId: string }
// Returns: { url: string }  — redirect the user here to complete payment.
//
// success_url → /app?upgraded=true
// cancel_url  → /app

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const ALLOWED_PRICE_IDS = new Set([
    process.env.STRIPE_PRICE_STARTER,
    process.env.STRIPE_PRICE_PRO,
]);

export async function POST(req: NextRequest) {
    // ── Parse & validate body ─────────────────────────────────────────────────
    let priceId: string;
    let userId: string;

    try {
        ({ priceId, userId } = await req.json());
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!priceId || !userId) {
        return NextResponse.json({ error: "priceId and userId are required" }, { status: 400 });
    }

    // Guard against arbitrary price IDs being passed in
    if (!ALLOWED_PRICE_IDS.has(priceId)) {
        return NextResponse.json({ error: "Invalid priceId" }, { status: 400 });
    }

    // ── Look up the user's email ──────────────────────────────────────────────
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (userError || !user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ── Get or create Stripe customer ─────────────────────────────────────────
    const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("stripe_customer_id")
        .eq("user_id", userId)
        .single();

    let customerId: string = profile?.stripe_customer_id ?? "";

    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            metadata: { user_id: userId },
        });
        customerId = customer.id;

        await supabaseAdmin
            .from("profiles")
            .upsert({ user_id: userId, stripe_customer_id: customerId });
    }

    // ── Create Checkout session ───────────────────────────────────────────────
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${appUrl}/app/image-to-text?upgraded=true`,
        cancel_url: `${appUrl}/app/image-to-text`,
        metadata: { userId },
    });

    return NextResponse.json({ url: session.url });
}
