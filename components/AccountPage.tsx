"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
    User, Lock, CreditCard, BarChart2,
    CheckCircle, AlertCircle, ShieldCheck,
    ExternalLink, RefreshCw,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "profile" | "password" | "subscription" | "usage";

interface Invoice {
    id: string;
    number: string | null;
    amount: number;
    currency: string;
    status: string | null;
    date: number;
    period_start: number;
    period_end: number;
    pdf: string | null;
    plan: string;
}

interface UsageData {
    total: number;
    dailyAverage: number;
    topTool: string | null;
    byTool: Record<string, number>;
    byDay: Record<string, Record<string, number>>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const PLAN_LABEL: Record<string, string> = {
    free:    "Free",
    starter: "Starter",
    pro:     "Pro",
};

const PLAN_COLOR: Record<string, string> = {
    free:    "bg-slate-100 text-slate-600",
    starter: "bg-[#566AF0]/10 text-[#566AF0]",
    pro:     "bg-violet-100 text-violet-700",
};

const TOOL_LABEL: Record<string, string> = {
    "image-to-text":             "Image to Text",
    "image-converter":           "Image Converter",
    "invoice-parser":            "Invoice Parser",
    "generate-insights":         "Product Optimiser",
    "compliance-form":           "Compliance Forms",
    "repricing-alerts":          "Re-pricing Alerts",
};

function fmt(tool: string) {
    return TOOL_LABEL[tool] ?? tool;
}

function fmtDate(unix: number) {
    return new Date(unix * 1000).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
    });
}

function fmtPeriod(start: number, end: number) {
    const s = new Date(start * 1000).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    const e = new Date(end   * 1000).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    return `${s} – ${e}`;
}

function StatusBadge({ status }: { status: string | null }) {
    const s = status ?? "unknown";
    const map: Record<string, string> = {
        paid:   "bg-emerald-50 text-emerald-700 border-emerald-200",
        open:   "bg-amber-50 text-amber-700 border-amber-200",
        void:   "bg-slate-100 text-slate-500 border-slate-200",
        draft:  "bg-slate-100 text-slate-500 border-slate-200",
        uncollectible: "bg-red-50 text-red-600 border-red-200",
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${map[s] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
            {s}
        </span>
    );
}

// ── Section shells ────────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-white rounded-2xl border border-slate-200 p-6 ${className}`}>
            {children}
        </div>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-base font-bold text-[#0F172A] mb-5">{children}</h2>;
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "profile",      label: "Profile",       icon: User       },
    { key: "password",     label: "Password",      icon: Lock       },
    { key: "subscription", label: "Subscription",  icon: CreditCard },
    { key: "usage",        label: "Usage",         icon: BarChart2  },
];

// ── Profile tab ───────────────────────────────────────────────────────────────

function ProfileTab({ user, plan }: { user: any; plan: string }) {
    const initials = (user?.email ?? "?").slice(0, 2).toUpperCase();
    const verified = !!user?.email_confirmed_at;
    const joined   = user?.created_at
        ? new Date(user.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
        : "—";

    return (
        <div className="space-y-4">
            <Card>
                <SectionTitle>Account details</SectionTitle>
                <div className="flex items-center gap-5 mb-6">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#566AF0] to-[#4355d6] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                        {initials}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-[#0F172A]">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                            {verified ? (
                                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                                    <CheckCircle className="w-3 h-3" /> Verified
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                                    <AlertCircle className="w-3 h-3" /> Not verified
                                </span>
                            )}
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${PLAN_COLOR[plan] ?? PLAN_COLOR.free}`}>
                                {PLAN_LABEL[plan] ?? "Free"} plan
                            </span>
                        </div>
                    </div>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { label: "Email",        value: user?.email ?? "—" },
                        { label: "Member since", value: joined },
                        { label: "User ID",      value: <span className="font-mono text-[11px] text-slate-400 break-all">{user?.id}</span> },
                        { label: "Current plan", value: PLAN_LABEL[plan] ?? "Free" },
                    ].map(({ label, value }) => (
                        <div key={label} className="rounded-xl bg-slate-50 px-4 py-3">
                            <dt className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</dt>
                            <dd className="text-sm text-slate-800">{value}</dd>
                        </div>
                    ))}
                </dl>
            </Card>

            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-[#0F172A]">Privacy — zero data retention</p>
                        <p className="text-xs text-slate-500">Your uploaded files are never stored. Processed in-memory and immediately discarded.</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}

// ── Password tab ──────────────────────────────────────────────────────────────

function PasswordTab() {
    const [newPw,     setNewPw]     = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [loading,   setLoading]   = useState(false);
    const [msg,       setMsg]       = useState<{ type: "ok" | "err"; text: string } | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMsg(null);

        if (newPw.length < 8) {
            setMsg({ type: "err", text: "Password must be at least 8 characters." });
            return;
        }
        if (newPw !== confirmPw) {
            setMsg({ type: "err", text: "Passwords don't match." });
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password: newPw });
        setLoading(false);

        if (error) {
            setMsg({ type: "err", text: error.message });
        } else {
            setMsg({ type: "ok", text: "Password updated successfully." });
            setNewPw("");
            setConfirmPw("");
        }
    }

    return (
        <Card className="max-w-md">
            <SectionTitle>Change password</SectionTitle>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
                    <input
                        type="password"
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        placeholder="Min. 8 characters"
                        autoComplete="new-password"
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#566AF0]/40 focus:border-[#566AF0]"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm new password</label>
                    <input
                        type="password"
                        value={confirmPw}
                        onChange={(e) => setConfirmPw(e.target.value)}
                        placeholder="Repeat password"
                        autoComplete="new-password"
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#566AF0]/40 focus:border-[#566AF0]"
                    />
                </div>

                {msg && (
                    <div className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${msg.type === "ok" ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
                        {msg.type === "ok"
                            ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                        {msg.text}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-[#566AF0] text-white text-sm font-semibold py-3 hover:bg-[#4355d6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors btn-shadow"
                >
                    {loading ? "Updating…" : "Update password"}
                </button>
            </form>
        </Card>
    );
}

// ── Subscription tab ──────────────────────────────────────────────────────────

function SubscriptionTab({ token }: { token: string }) {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [plan,     setPlan]     = useState("free");
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/account/invoices", { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((d) => { setInvoices(d.invoices ?? []); setPlan(d.plan ?? "free"); })
            .catch(() => setError("Could not load billing data."))
            .finally(() => setLoading(false));
    }, [token]);

    return (
        <div className="space-y-4">
            {/* Current plan card */}
            <Card>
                <SectionTitle>Current plan</SectionTitle>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#566AF0]/10 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-[#566AF0]" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-[#0F172A]">{PLAN_LABEL[plan] ?? "Free"} plan</p>
                            <p className="text-xs text-slate-500">
                                {plan === "free" && "3 uses/day · Free forever"}
                                {plan === "starter" && "50 uses/day · £5/month"}
                                {plan === "pro" && "Unlimited · £12/month"}
                            </p>
                        </div>
                    </div>
                    {plan === "free" && (
                        <a
                            href="/pricing"
                            className="rounded-full bg-[#566AF0] text-white text-xs font-bold px-4 py-2 hover:bg-[#4355d6] transition-colors btn-shadow"
                        >
                            Upgrade
                        </a>
                    )}
                </div>
            </Card>

            {/* Invoices */}
            <Card>
                <SectionTitle>Billing history</SectionTitle>

                {loading && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 py-4">
                        <RefreshCw className="w-4 h-4 animate-spin" /> Loading invoices…
                    </div>
                )}

                {error && <p className="text-sm text-red-600">{error}</p>}

                {!loading && !error && invoices.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-sm text-slate-400 mb-1">No invoices yet.</p>
                        <p className="text-xs text-slate-400">Invoices appear here after your first payment.</p>
                    </div>
                )}

                {!loading && invoices.length > 0 && (
                    <div className="overflow-x-auto -mx-6">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    {["Invoice", "Plan", "Period", "Amount", "Status", "Date", ""].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv, i) => (
                                    <tr key={inv.id} className={`border-b border-slate-50 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                                        <td className="px-6 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">
                                            {inv.number ?? inv.id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${PLAN_COLOR.starter}`}>
                                                {inv.plan.includes("Starter") || inv.plan.includes("starter") ? "Starter" : inv.plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-slate-600 text-xs whitespace-nowrap">
                                            {fmtPeriod(inv.period_start, inv.period_end)}
                                        </td>
                                        <td className="px-6 py-3 font-semibold text-[#0F172A] whitespace-nowrap">
                                            {inv.currency === "GBP" ? "£" : inv.currency + " "}
                                            {inv.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-3">
                                            <StatusBadge status={inv.status} />
                                        </td>
                                        <td className="px-6 py-3 text-slate-500 text-xs whitespace-nowrap">
                                            {fmtDate(inv.date)}
                                        </td>
                                        <td className="px-6 py-3">
                                            {inv.pdf && (
                                                <a
                                                    href={inv.pdf}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-[#566AF0] hover:underline"
                                                >
                                                    PDF <ExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}

// ── Usage tab ─────────────────────────────────────────────────────────────────

function UsageTab({ token }: { token: string }) {
    const [data,    setData]    = useState<UsageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/account/usage", { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((d) => setData(d))
            .catch(() => setError("Could not load usage data."))
            .finally(() => setLoading(false));
    }, [token]);

    if (loading) return (
        <Card>
            <div className="flex items-center gap-2 text-sm text-slate-500 py-4">
                <RefreshCw className="w-4 h-4 animate-spin" /> Loading usage…
            </div>
        </Card>
    );

    if (error) return <Card><p className="text-sm text-red-600">{error}</p></Card>;

    if (!data) return null;

    const sortedDays = Object.keys(data.byDay).sort((a, b) => b.localeCompare(a));
    const allTools   = Array.from(new Set(sortedDays.flatMap((d) => Object.keys(data.byDay[d]))));

    return (
        <div className="space-y-4">
            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total uses (30d)", value: data.total },
                    { label: "Daily average",    value: data.dailyAverage },
                    { label: "Top tool",         value: data.topTool ? fmt(data.topTool) : "—" },
                ].map(({ label, value }) => (
                    <Card key={label} className="text-center !py-5">
                        <p className="text-2xl font-extrabold text-[#0F172A] mb-1">{value}</p>
                        <p className="text-xs text-slate-500 font-medium">{label}</p>
                    </Card>
                ))}
            </div>

            {/* Per-tool breakdown */}
            <Card>
                <SectionTitle>Uses by tool (last 30 days)</SectionTitle>
                {Object.keys(data.byTool).length === 0 ? (
                    <p className="text-sm text-slate-400 py-4 text-center">No usage recorded in the last 30 days.</p>
                ) : (
                    <div className="space-y-3">
                        {Object.entries(data.byTool)
                            .sort((a, b) => b[1] - a[1])
                            .map(([tool, count]) => {
                                const pct = data.total > 0 ? (count / data.total) * 100 : 0;
                                return (
                                    <div key={tool}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-slate-700">{fmt(tool)}</span>
                                            <span className="text-sm font-semibold text-[#0F172A]">{count}</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-[#566AF0] transition-all"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </Card>

            {/* Daily breakdown table */}
            {sortedDays.length > 0 && (
                <Card>
                    <SectionTitle>Daily breakdown</SectionTitle>
                    <div className="overflow-x-auto -mx-6">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Date</th>
                                    {allTools.map((t) => (
                                        <th key={t} className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                                            {fmt(t)}
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedDays.map((day, i) => {
                                    const rowTotal = Object.values(data.byDay[day]).reduce((s, v) => s + v, 0);
                                    return (
                                        <tr key={day} className={`border-b border-slate-50 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                                            <td className="px-6 py-2.5 text-slate-600 whitespace-nowrap">
                                                {new Date(day).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                            </td>
                                            {allTools.map((t) => (
                                                <td key={t} className="px-4 py-2.5 text-center">
                                                    {data.byDay[day][t] ? (
                                                        <span className="font-semibold text-[#566AF0]">{data.byDay[day][t]}</span>
                                                    ) : (
                                                        <span className="text-slate-300">—</span>
                                                    )}
                                                </td>
                                            ))}
                                            <td className="px-6 py-2.5 text-center font-bold text-[#0F172A]">{rowTotal}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
}

// ── Root component ────────────────────────────────────────────────────────────

export default function AccountPage() {
    const router  = useRouter();
    const [tab,   setTab]   = useState<Tab>("profile");
    const [user,  setUser]  = useState<any>(null);
    const [plan,  setPlan]  = useState("free");
    const [token, setToken] = useState<string>("");
    const [ready, setReady] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (!session) { router.replace("/auth?mode=signin"); return; }

            setUser(session.user);
            setToken(session.access_token);

            // Fetch plan from profiles
            const { data: profile } = await supabase
                .from("profiles")
                .select("plan")
                .eq("user_id", session.user.id)
                .single();

            setPlan(profile?.plan ?? "free");
            setReady(true);
        });
    }, [router]);

    if (!ready) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Page header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-extrabold text-[#0F172A]">Account</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your profile, billing, and usage.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-white rounded-2xl border border-slate-200 p-1 mb-6 overflow-x-auto">
                    {TABS.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            className={[
                                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex-1 justify-center",
                                tab === key
                                    ? "bg-[#566AF0] text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50",
                            ].join(" ")}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                {tab === "profile"      && <ProfileTab user={user} plan={plan} />}
                {tab === "password"     && <PasswordTab />}
                {tab === "subscription" && <SubscriptionTab token={token} />}
                {tab === "usage"        && <UsageTab token={token} />}
            </div>
        </div>
    );
}
