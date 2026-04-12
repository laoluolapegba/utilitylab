"use client";

// app/error.tsx
// Catches runtime errors in the React component tree below the root layout.
// Shown instead of a blank screen when a component throws.

import { useEffect } from "react";

type Props = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function Error({ error, reset }: Props) {
    useEffect(() => {
        // Log to stdout via a fire-and-forget fetch so we get server-side
        // structured logs without exposing PII — only the digest and message.
        void fetch("/api/health", { method: "HEAD" }).catch(() => undefined);
        console.error("[app/error]", error.digest ?? "no-digest", error.message);
    }, [error]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <h1 className="text-2xl font-bold text-[#0F172A] mb-3">
                    Something went wrong
                </h1>
                <p className="text-slate-600 mb-6">
                    An unexpected error occurred. Our team has been notified.
                </p>
                <button
                    onClick={reset}
                    className="px-6 py-3 bg-[#566AF0] text-white rounded-full font-medium hover:bg-[#4355d6] transition-colors btn-shadow"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
