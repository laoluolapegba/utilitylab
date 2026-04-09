"use client";

// components/UpgradeModal.tsx
//
// Shown when any API route returns 429 { upgradeRequired: true }.
// Portals into #modal-root (a sibling of #scroll-area inside #faux-viewport)
// and uses position:absolute so CSS transforms on ancestor elements can never
// break the overlay — the faux-viewport pattern.
//
// Required env var (client-visible):
//   NEXT_PUBLIC_STRIPE_PRICE_STARTER — the Stripe price ID for the £5/mo plan

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabaseClient";

// ── Constants ─────────────────────────────────────────────────────────────────

const DISMISS_KEY         = "upgradeModal_dismissedAt";
const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000;

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UpgradeModalProps {
    open:    boolean;
    onClose: () => void;
    /** Values forwarded from the 429 response body */
    used?:   number;
    limit?:  number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function UpgradeModal({
    open,
    onClose,
    used  = 3,
    limit = 3,
}: UpgradeModalProps) {
    const [portalRoot, setPortalRoot] = useState<Element | null>(null);
    const [loading,    setLoading]    = useState(false);
    const dialogRef                   = useRef<HTMLDivElement>(null);

    // Resolve #modal-root after mount (SSR-safe)
    useEffect(() => {
        setPortalRoot(document.getElementById("modal-root"));
    }, []);

    // Check "remind me tomorrow" dismissal
    const isDismissed = (): boolean => {
        try {
            const raw = localStorage.getItem(DISMISS_KEY);
            if (!raw) return false;
            return Date.now() - Number(raw) < DISMISS_DURATION_MS;
        } catch {
            return false;
        }
    };

    // Trap focus inside dialog when open
    useEffect(() => {
        if (!open) return;
        const previous = document.activeElement as HTMLElement | null;
        dialogRef.current?.focus();
        return () => previous?.focus();
    }, [open]);

    // ── Handlers ──────────────────────────────────────────────────────────────

    async function handleUpgrade() {
        setLoading(true);
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            const res = await fetch("/api/billing/checkout", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({
                    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER,
                    userId:  session?.user?.id,
                }),
            });

            if (!res.ok) throw new Error(`Checkout failed: ${res.status}`);

            const { url } = await res.json();
            if (url) window.location.href = url;
        } catch (err) {
            console.error("[UpgradeModal] checkout error:", err);
            setLoading(false);
        }
        // Leave loading=true while redirecting so button stays disabled
    }

    function handleDismiss() {
        try {
            localStorage.setItem(DISMISS_KEY, String(Date.now()));
        } catch {
            // ignore — private browsing may block writes
        }
        onClose();
    }

    // ── Render ────────────────────────────────────────────────────────────────

    if (!portalRoot || !open || isDismissed()) return null;

    return createPortal(
        /*
         * Faux-viewport overlay.
         * position:absolute fills #faux-viewport (position:relative, h-screen)
         * without touching position:fixed, so ancestor CSS transforms are safe.
         */
        <div
            className="absolute inset-0 flex items-start justify-center pt-[15vh] bg-black/50"
            aria-hidden="false"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="upgrade-modal-title"
                tabIndex={-1}
                className="relative w-full max-w-sm mx-4 bg-white rounded-2xl shadow-2xl p-8 outline-none"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close ×  */}
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                    </svg>
                </button>

                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-[#566AF0]/10 flex items-center justify-center mb-5">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                        <path
                            d="M11 2l2.5 6.5H20l-5.5 4 2 6.5L11 15l-5.5 3.5 2-6.5L2 8.5h6.5L11 2z"
                            fill="#566AF0"
                        />
                    </svg>
                </div>

                {/* Heading */}
                <h2
                    id="upgrade-modal-title"
                    className="text-xl font-bold tracking-tight text-[#0F172A] mb-2"
                >
                    You&apos;ve used your {limit} free tools today
                </h2>

                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    Upgrade to Starter for 50 uses per day across every tool — resets at midnight UTC.
                </p>

                {/* Price callout */}
                <div className="flex items-baseline gap-1 bg-slate-50 rounded-xl px-4 py-3 mb-6">
                    <span className="text-3xl font-bold text-[#0F172A]">£5</span>
                    <span className="text-base text-slate-500 font-medium">/month</span>
                </div>

                {/* Primary CTA */}
                <button
                    onClick={handleUpgrade}
                    disabled={loading}
                    className="
                        w-full rounded-full py-3 font-semibold text-white
                        bg-[#566AF0] hover:bg-[#4355d6]
                        disabled:opacity-60 disabled:cursor-not-allowed
                        transition-colors btn-shadow mb-3
                    "
                >
                    {loading ? "Redirecting…" : "Upgrade to Starter — £5/mo"}
                </button>

                {/* Secondary CTA */}
                <button
                    onClick={handleDismiss}
                    className="w-full py-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
                >
                    Remind me tomorrow
                </button>
            </div>
        </div>,
        portalRoot,
    );
}
