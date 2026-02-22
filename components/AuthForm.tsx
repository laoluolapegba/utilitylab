// components/AuthForm.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Mode = "signin" | "signup";

export default function AuthForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [mode, setMode] = useState<Mode>("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const modeParam = searchParams.get("mode");
        if (modeParam === "signin" || modeParam === "signup") {
            setMode(modeParam);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (mode === "signup") {
                const { data, error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;

                // If email confirmation is OFF, Supabase may return a session immediately
                if (data.session) {
                    router.replace("/app");
                    router.refresh();
                    return;
                }

                setMessage("Sign up successful. Check your email, then sign in.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;

                router.replace("/app");
                router.refresh();
                return;
            }
        } catch (err: any) {
            setError(err?.message ?? "Authentication error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-sm mx-auto border border-slate-200 rounded-xl p-6 bg-white mt-10">
            <h1 className="text-xl font-semibold text-slate-900 mb-4">
                {mode === "signin" ? "Sign in" : "Sign up"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="block text-sm text-slate-700">Email</label>
                    <input
                        type="email"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm text-slate-700">Password</label>
                    <input
                        type="password"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={
                            mode === "signin" ? "current-password" : "new-password"
                        }
                        required
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                {message && (
                    <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                        {message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center rounded-lg bg-slate-900 text-white text-sm font-medium px-4 py-2.5 disabled:opacity-50 hover:bg-slate-800 transition"
                >
                    {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Sign up"}
                </button>
            </form>

            <button
                type="button"
                className="mt-4 text-xs text-slate-600 hover:text-slate-900 underline"
                onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
            >
                {mode === "signin"
                    ? "Need an account? Sign up"
                    : "Already have an account? Sign in"}
            </button>
        </div>
    );
}
