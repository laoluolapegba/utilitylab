"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

type Mode = "signin" | "signup";

const TOOLS = [
    "Image to Text — OCR in 2 seconds",
    "PDF to Accounting — structured invoice data",
    "Image Converter — 20+ formats, client-side",
    "Product Listing Optimiser — AI-powered SEO",
    "Re-Pricing Alerts — competitor monitoring",
    "Compliance Forms — HMRC-ready, auto-fill",
];

export default function AuthForm() {
    const router       = useRouter();
    const searchParams = useSearchParams();

    const [mode,     setMode]     = useState<Mode>("signin");
    const [email,    setEmail]    = useState("");
    const [password, setPassword] = useState("");
    const [loading,  setLoading]  = useState(false);
    const [message,  setMessage]  = useState<string | null>(null);
    const [error,    setError]    = useState<string | null>(null);
    const [showPw,   setShowPw]   = useState(false);

    useEffect(() => {
        const modeParam = searchParams.get("mode");
        if (modeParam === "signin" || modeParam === "signup") setMode(modeParam);
    }, [searchParams]);

    // Clear feedback when switching modes
    useEffect(() => {
        setError(null);
        setMessage(null);
        setEmail("");
        setPassword("");
    }, [mode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (mode === "signup") {
                const { data, error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;

                if (data.session) {
                    router.replace("/app/image-to-text");
                    router.refresh();
                    return;
                }

                setMessage("Check your email to confirm your account, then sign in.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;

                router.replace("/app/image-to-text");
                router.refresh();
                return;
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Authentication error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">

            {/* ── Left panel (desktop only) ─────────────────────────────────── */}
            <div className="hidden lg:flex lg:w-[52%] flex-col justify-between bg-[#0F172A] px-14 py-12 relative overflow-hidden">
                {/* Subtle radial glow */}
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#566AF0] opacity-10 blur-[120px] rounded-full -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#566AF0] opacity-10 blur-[100px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

                {/* Logo */}
                <Link href="/" className="relative z-10 inline-block">
                    <Image
                        src="/imageLab_dark.png"
                        alt="UtilityLab"
                        width={140}
                        height={36}
                        className="h-8 w-auto brightness-0 invert"
                        priority
                    />
                </Link>

                {/* Centre copy */}
                <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
                    <p className="text-[#566AF0] text-sm font-semibold uppercase tracking-widest mb-4">
                        All tools. One account.
                    </p>
                    <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
                        Focused tools for<br />focused people.
                    </h2>
                    <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-sm">
                        Sign up once and get access to every tool in the lab — free tier included, no card required.
                    </p>

                    <ul className="space-y-3">
                        {TOOLS.map((tool) => (
                            <li key={tool} className="flex items-start gap-3">
                                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#566AF0]/20 border border-[#566AF0]/40 flex items-center justify-center">
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                        <path d="M2 5.5l2 2 4-4" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <span className="text-sm text-slate-300">{tool}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Bottom trust */}
                <div className="relative z-10 flex items-center gap-6 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        3 free uses/day
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Zero data retention
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        GDPR compliant
                    </span>
                </div>
            </div>

            {/* ── Right panel — form ────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col items-center justify-center bg-white px-6 py-12 sm:px-12">

                {/* Mobile logo */}
                <div className="lg:hidden mb-8">
                    <Link href="/">
                        <Image
                            src="/imageLab_dark.png"
                            alt="UtilityLab"
                            width={120}
                            height={32}
                            className="h-7 w-auto"
                        />
                    </Link>
                </div>

                <div className="w-full max-w-sm">

                    {/* Heading */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-[#0F172A] mb-1">
                            {mode === "signin" ? "Welcome back" : "Create your account"}
                        </h1>
                        <p className="text-sm text-slate-500">
                            {mode === "signin"
                                ? "Sign in to access your tools."
                                : "Free to start — no credit card needed."}
                        </p>
                    </div>

                    {/* Mode tabs */}
                    <div className="flex rounded-xl bg-slate-100 p-1 mb-8">
                        {(["signin", "signup"] as Mode[]).map((m) => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => setMode(m)}
                                className={[
                                    "flex-1 rounded-lg py-2 text-sm font-semibold transition-all",
                                    mode === m
                                        ? "bg-white text-[#0F172A] shadow-sm"
                                        : "text-slate-500 hover:text-slate-700",
                                ].join(" ")}
                            >
                                {m === "signin" ? "Sign in" : "Sign up"}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        <div>
                            <label htmlFor="auth-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Email address
                            </label>
                            <input
                                id="auth-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                                placeholder="you@example.com"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#566AF0]/40 focus:border-[#566AF0] transition"
                            />
                        </div>

                        <div>
                            <label htmlFor="auth-password" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="auth-password"
                                    type={showPw ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                                    required
                                    placeholder={mode === "signup" ? "Min. 8 characters" : "••••••••"}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#566AF0]/40 focus:border-[#566AF0] transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                    aria-label={showPw ? "Hide password" : "Show password"}
                                >
                                    {showPw ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                                            <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018 4.5zm0 7a.875.875 0 110-1.75.875.875 0 010 1.75z" />
                                </svg>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {message && (
                            <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                                <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm3.28 5.28l-4 4a.75.75 0 01-1.06 0l-2-2a.75.75 0 111.06-1.06l1.47 1.47 3.47-3.47a.75.75 0 011.06 1.06z" />
                                </svg>
                                <p className="text-sm text-emerald-700">{message}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-full bg-[#566AF0] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4355d6] disabled:opacity-50 disabled:cursor-not-allowed btn-shadow"
                        >
                            {loading
                                ? "Please wait…"
                                : mode === "signin" ? "Sign in" : "Create account"}
                        </button>
                    </form>

                    {/* Footer links */}
                    <p className="mt-6 text-center text-xs text-slate-400">
                        By continuing you agree to our{" "}
                        <Link href="#" className="underline hover:text-slate-600">Terms</Link>
                        {" "}and{" "}
                        <Link href="#" className="underline hover:text-slate-600">Privacy Policy</Link>.
                    </p>

                    <p className="mt-4 text-center text-xs text-slate-400">
                        <Link href="/" className="hover:text-slate-600 transition">
                            ← Back to home
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
