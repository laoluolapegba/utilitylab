// app/api/billing/webhook/route.ts
//
// Register in Stripe Dashboard → Webhooks:
//   URL:    https://<your-domain>/api/billing/webhook
//   Events: checkout.session.completed
//
// Required env vars:
//   STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
//   STRIPE_PRICE_STARTER, STRIPE_PRICE_PRO

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // keep raw body intact for signature verification

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function planFromPriceId(priceId: string): "starter" | "pro" | null {
    if (priceId === process.env.STRIPE_PRICE_STARTER) return "starter";
    if (priceId === process.env.STRIPE_PRICE_PRO)     return "pro";
    return null;
}

export async function POST(req: NextRequest) {
    // ── 1. Verify Stripe webhook signature ────────────────────────────────────
    const sig = req.headers.get("stripe-signature");
    if (!sig) {
        return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    const rawBody = await req.text();

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Signature verification failed" },
            { status: 400 },
        );
    }

    // ── 2. Idempotency — skip already-processed events ────────────────────────
    const { data: existing } = await supabaseAdmin
        .from("processed_webhooks")
        .select("event_id")
        .eq("event_id", event.id)
        .maybeSingle();

    if (existing) {
        return NextResponse.json({ received: true });
    }

    await supabaseAdmin
        .from("processed_webhooks")
        .insert({ event_id: event.id });

    // ── 3. Handle checkout.session.completed ──────────────────────────────────
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        // userId stored in metadata when the checkout session was created
        const userId = session.metadata?.userId;
        if (!userId) {
            return NextResponse.json({ received: true });
        }

        // Fetch the line items to resolve which price was purchased
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
        const priceId   = lineItems.data[0]?.price?.id ?? "";
        const plan      = planFromPriceId(priceId);

        if (plan) {
            await supabaseAdmin
                .from("profiles")
                .upsert(
                    {
                        user_id:                 userId,
                        plan,
                        stripe_customer_id:      session.customer as string | null,
                        stripe_subscription_id:  session.subscription as string | null,
                        updated_at:              new Date().toISOString(),
                    },
                    { onConflict: "user_id" },
                );
        }
    }

    return NextResponse.json({ received: true });
}
