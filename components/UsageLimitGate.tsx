"use client";

import Link from "next/link";

export default function UsageLimitGate() {
    return (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
            <p className="text-sm font-semibold text-indigo-900">You have used your 3 free daily tool runs.</p>
            <p className="mt-1 text-sm text-indigo-800">
                Create a free account to keep using all UtilityLab tools with unlimited runs, saved history, and cross-device sync.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
                <Link
                    href="/auth"
                    className="inline-flex items-center justify-center rounded-full bg-[#566AF0] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4355d6]"
                >
                    Sign up free
                </Link>
                <Link href="/auth" className="inline-flex items-center justify-center rounded-full border border-indigo-300 px-5 py-2.5 text-sm font-semibold text-indigo-800 hover:bg-indigo-100">
                    Log in
                </Link>
            </div>
        </div>
    );
}
