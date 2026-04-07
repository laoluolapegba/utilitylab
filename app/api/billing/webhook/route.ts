// app/api/billing/webhook/route.ts
// Stripe webhook handler.
//
// Register in Stripe Dashboard → Webhooks:
//   URL: https://<your-domain>/api/billing/webhook
//   Events: checkout.session.completed
//
// On checkout.session.completed:
//   Resolves the plan from the purchased priceId, then sets profiles.plan
//   to 'starter' or 'pro' in Supabase.

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // Stripe needs the raw body for sig verification

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/** Maps a Stripe price ID to the plan name stored in profiles.plan. */
function planFromPriceId(priceId: string): "starter" | "pro" | null {
    if (priceId === process.env.STRIPE_PRICE_STARTER) return "starter";
    if (priceId === process.env.STRIPE_PRICE_PRO) return "pro";
    return null;
}

export async function POST(req: NextRequest) {
    // ── Verify Stripe signature ───────────────────────────────────────────────
    const sig = req.headers.get("stripe-signature");
    if (!sig) {
        return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    const body = await req.text();

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Webhook verification failed" },
            { status: 400 },
        );
    }

    // ── checkout.session.completed ────────────────────────────────────────────
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId) {
            // Nothing we can do without the userId stored in metadata
            return NextResponse.json({ received: true });
        }

        // Retrieve the subscription to get the purchased price ID
        const subscriptionId = session.subscription as string | null;
        let plan: "starter" | "pro" | null = null;

        if (subscriptionId) {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const priceId = subscription.items.data[0]?.price?.id ?? "";
            plan = planFromPriceId(priceId);
        }

        // Fallback: derive from the session's line items if subscription fetch fails
        if (!plan) {
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
            const priceId = lineItems.data[0]?.price?.id ?? "";
            plan = planFromPriceId(priceId);
        }

        if (plan) {
            await supabaseAdmin.from("profiles").upsert(
                {
                    user_id: userId,
                    plan,
                    stripe_customer_id: session.customer as string | null,
                    stripe_subscription_id: subscriptionId,
                    updated_at: new Date().toISOString(),
                },
                { onConflict: "user_id" },
            );
        }
    }

    return NextResponse.json({ received: true });
}
