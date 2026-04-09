"use client";

// Internal admin page — no public nav link, no indexing.
// Access: /admin/usage
// Gate: user email must be in ADMIN_EMAILS env var, enforced server-side.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { RefreshCw } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Metrics {
    asOf:            string;
    totalToday:      number;
    byTool:          Record<string, number>;
    upgradeCount:    number;
    upgradesByPlan:  Record<string, number>;
    uniqueTotal:     number;
    uniqueUserIds:   number;
    uniqueAnonIds:   number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const TOOL_LABEL: Record<string, string> = {
    "image-to-text":             "Image to Text",
    "image-converter":           "Image Converter",
    "invoice-analyze":           "Invoice Parser",
    "product-listing-optimizer": "Product Optimiser",
    "compliance-form":           "Compliance Forms",
    "repricing-alerts":          "Re-pricing Alerts",
};

function fmt(key: string) {
    return TOOL_LABEL[key] ?? key;
}

function fmtTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-GB", {
        hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function Stat({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
            <p className="text-3xl font-extrabold text-slate-900">{value}</p>
            {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
    );
}

// ── Bar row ───────────────────────────────────────────────────────────────────

function BarRow({ label, count, max }: { label: string; count: number; max: number }) {
    const pct = max > 0 ? (count / max) * 100 : 0;
    return (
        <div className="flex items-center gap-3">
            <span className="w-44 shrink-0 text-sm text-slate-600 truncate">{label}</span>
            <div className="flex-1 h-5 rounded-full bg-slate-100 overflow-hidden">
                <div
                    className="h-full rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="w-8 text-right text-sm font-semibold text-slate-800">{count}</span>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminUsagePage() {
    const router = useRouter();

    const [metrics,  setMetrics]  = useState<Metrics | null>(null);
    const [status,   setStatus]   = useState<"loading" | "forbidden" | "error" | "ok">("loading");
    const [lastFetch, setLastFetch] = useState<string | null>(null);

    async function load(token: string) {
        setStatus("loading");
        try {
            const res = await fetch("/api/admin/metrics", {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            });

            if (res.status === 401) { router.replace("/auth?mode=signin"); return; }
            if (res.status === 403) { setStatus("forbidden"); return; }
            if (!res.ok)            { setStatus("error");     return; }

            const data: Metrics = await res.json();
            setMetrics(data);
            setLastFetch(new Date().toLocaleTimeString("en-GB"));
            setStatus("ok");
        } catch {
            setStatus("error");
        }
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) { router.replace("/auth?mode=signin"); return; }
            load(session.access_token);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function refresh() {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) load(session.access_token);
    }

    // ── Error states ─────────────────────────────────────────────────────────

    if (status === "forbidden") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <p className="text-6xl font-black text-slate-200 mb-4">403</p>
                    <p className="text-slate-600 font-semibold">You don&apos;t have access to this page.</p>
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center space-y-3">
                    <p className="text-slate-600">Failed to load metrics.</p>
                    <button onClick={refresh} className="text-sm text-indigo-600 underline">Retry</button>
                </div>
            </div>
        );
    }

    if (status === "loading" || !metrics) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
            </div>
        );
    }

    // ── Data ─────────────────────────────────────────────────────────────────

    const toolEntries = Object.entries(metrics.byTool).sort((a, b) => b[1] - a[1]);
    const maxToolCount = toolEntries[0]?.[1] ?? 1;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                            Internal · Admin
                        </p>
                        <h1 className="text-2xl font-extrabold text-slate-900">Usage — today</h1>
                    </div>
                    <button
                        onClick={refresh}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>

                {/* Last fetched */}
                {lastFetch && (
                    <p className="text-xs text-slate-400 mb-6">
                        Last fetched at {lastFetch} · data as of {fmtTime(metrics.asOf)}
                    </p>
                )}

                {/* ── 4 stat cards ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <Stat
                        label="Total uses today"
                        value={metrics.totalToday}
                    />
                    <Stat
                        label="Unique actors today"
                        value={metrics.uniqueTotal}
                        sub={`${metrics.uniqueUserIds} users · ${metrics.uniqueAnonIds} anon`}
                    />
                    <Stat
                        label="Upgrades today"
                        value={metrics.upgradeCount}
                        sub={
                            Object.entries(metrics.upgradesByPlan)
                                .map(([p, n]) => `${n} ${p}`)
                                .join(" · ") || "none"
                        }
                    />
                    <Stat
                        label="Tools active"
                        value={Object.keys(metrics.byTool).length}
                        sub="distinct tools used"
                    />
                </div>

                {/* ── Uses per tool bar breakdown ── */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 mb-8">
                    <h2 className="text-sm font-bold text-slate-700 mb-5">Uses per tool today</h2>

                    {toolEntries.length === 0 ? (
                        <p className="text-sm text-slate-400">No usage recorded today.</p>
                    ) : (
                        <div className="space-y-3">
                            {toolEntries.map(([tool, count]) => (
                                <BarRow
                                    key={tool}
                                    label={fmt(tool)}
                                    count={count}
                                    max={maxToolCount}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Raw table ── */}
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Tool</th>
                                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">Uses</th>
                                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">% of total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {toolEntries.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-5 py-6 text-center text-slate-400 text-sm">
                                        No data for today yet.
                                    </td>
                                </tr>
                            ) : (
                                toolEntries.map(([tool, count], i) => (
                                    <tr key={tool} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                                        <td className="px-5 py-3 text-slate-700">{fmt(tool)}</td>
                                        <td className="px-5 py-3 text-right font-semibold text-slate-900">{count}</td>
                                        <td className="px-5 py-3 text-right text-slate-500">
                                            {metrics.totalToday > 0
                                                ? `${((count / metrics.totalToday) * 100).toFixed(1)}%`
                                                : "—"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {toolEntries.length > 0 && (
                            <tfoot className="border-t border-slate-200 bg-slate-50">
                                <tr>
                                    <td className="px-5 py-3 text-sm font-bold text-slate-700">Total</td>
                                    <td className="px-5 py-3 text-right font-bold text-slate-900">{metrics.totalToday}</td>
                                    <td className="px-5 py-3 text-right font-bold text-slate-900">100%</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>

            </div>
        </div>
    );
}
