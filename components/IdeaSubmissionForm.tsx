"use client";

import { useState } from "react";

const TOOLS = [
    "Image to Text",
    "PDF to Accounting",
    "Image Converter",
    "E-commerce Product Optimiser",
    "Re-Pricing Alerts",
    "Compliance Form Generator",
    "New tool idea",
] as const;

type FormState = "idle" | "submitting" | "success" | "error";

export default function IdeaSubmissionForm() {
    const [tool, setTool]               = useState("");
    const [description, setDescription] = useState("");
    const [email, setEmail]             = useState("");
    const [state, setState]             = useState<FormState>("idle");
    const [errorMsg, setErrorMsg]       = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!tool || !description.trim()) return;

        setState("submitting");
        setErrorMsg(null);

        try {
            const res = await fetch("/api/ideas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tool, description: description.trim(), email: email.trim() || null }),
            });

            if (!res.ok) throw new Error(`${res.status}`);
            setState("success");
        } catch {
            setState("error");
            setErrorMsg("Something went wrong — please try again.");
        }
    }

    if (state === "success") {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <path d="M3.5 9.5l4 4 7-8" stroke="#16a34a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <p className="text-sm font-semibold text-slate-800">Thanks — we review every suggestion.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            {/* Tool category */}
            <div>
                <label htmlFor="idea-tool" className="block text-xs font-medium text-slate-500 mb-1">
                    Which tool?
                </label>
                <select
                    id="idea-tool"
                    value={tool}
                    onChange={(e) => setTool(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#566AF0]/40"
                >
                    <option value="" disabled>Select a tool…</option>
                    {TOOLS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </div>

            {/* Description */}
            <div>
                <label htmlFor="idea-description" className="block text-xs font-medium text-slate-500 mb-1">
                    Your idea
                </label>
                <textarea
                    id="idea-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={3}
                    placeholder="Describe what you'd love to see…"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#566AF0]/40 resize-none"
                />
            </div>

            {/* Email (optional) */}
            <div>
                <label htmlFor="idea-email" className="block text-xs font-medium text-slate-500 mb-1">
                    Email <span className="text-slate-400 font-normal">(optional — we'll let you know when it's built)</span>
                </label>
                <input
                    id="idea-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#566AF0]/40"
                />
            </div>

            {errorMsg && (
                <p className="text-xs text-red-600">{errorMsg}</p>
            )}

            <button
                type="submit"
                disabled={state === "submitting" || !tool || !description.trim()}
                className="w-full rounded-full bg-[#566AF0] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4355d6] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {state === "submitting" ? "Sending…" : "Submit idea"}
            </button>
        </form>
    );
}
