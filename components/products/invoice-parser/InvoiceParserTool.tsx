"use client";

import { useEffect, useMemo, useState } from "react";

import UsageLimitGate from "@/components/UsageLimitGate";
import { getUsageLimitState, recordAnonymousUsage, type UsageLimitState } from "@/lib/usageLimits";
import type { InvoiceExtraction } from "@/lib/invoice/schema";
import { classifyVAT, type VATClassification } from "@/lib/invoice/vatRules";
import { categoriseExpense, type ExpenseCategory } from "@/lib/invoice/expenseRules";

// ── pure helpers ──────────────────────────────────────────────────────────────

function generateCorrelationId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function parseAmount(value: string): number {
    const cleaned = value.replace(/[^\d.-]/g, "");
    const amount = Number.parseFloat(cleaned);
    return Number.isNaN(amount) ? 0 : amount;
}

function buildFallbackDraft(rawText: string): InvoiceExtraction {
    const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const firstLine = lines[0] || "Unknown Vendor";

    const invoiceNumber = rawText.match(/(?:invoice\s*(?:number|no\.?|#)\s*[:\-]?\s*)([A-Z0-9\-\/]+)/i)?.[1] ?? "";
    const invoiceDate = rawText.match(/(?:date\s*[:\-]?\s*)(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\-]\d{2}[\-]\d{2})/i)?.[1] ?? "";
    const totalStr = rawText.match(/(?:total\s*(?:due|amount)?\s*[:\-]?\s*)(£?\s?\d+[\d,.]*)/i)?.[1] ?? "";
    const vatStr = rawText.match(/(?:vat\s*(?:amount)?\s*[:\-]?\s*)(£?\s?\d+[\d,.]*)/i)?.[1] ?? "";

    const total_amount = parseAmount(totalStr);
    const vat_amount = parseAmount(vatStr);
    const subtotal = Math.max(total_amount - vat_amount, 0);

    const line_items = lines
        .filter((line) => /£?\s?\d+[\d,.]*$/.test(line))
        .slice(0, 8)
        .map((line) => {
            const amountMatch = line.match(/(£?\s?\d+[\d,.]*)$/);
            return {
                description: line.replace(/(£?\s?\d+[\d,.]*)$/, "").trim() || "Item",
                quantity: null,
                unit_price: null,
                vat_rate: null,
                line_total: parseAmount(amountMatch?.[1] ?? "0"),
            };
        });

    return {
        supplier_name: firstLine,
        supplier_vat_number: null,
        invoice_number: invoiceNumber,
        invoice_date: invoiceDate,
        due_date: null,
        currency: "GBP",
        subtotal,
        vat_amount,
        vat_rate: null,
        total_amount,
        line_items: line_items.length
            ? line_items
            : [{ description: "General expense", quantity: null, unit_price: null, vat_rate: null, line_total: total_amount }],
        extraction_confidence: {
            overall: "low",
            per_field: {
                supplier_name: "low",
                invoice_number: invoiceNumber ? "medium" : "missing",
                invoice_date: invoiceDate ? "medium" : "missing",
                total_amount: totalStr ? "medium" : "missing",
                vat_amount: vatStr ? "medium" : "missing",
            },
        },
        raw_ocr_text: rawText,
    };
}

function csvEscape(value: string): string {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}

function downloadText(content: string, filename: string, mime = "text/plain;charset=utf-8") {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ── VAT badge helpers ─────────────────────────────────────────────────────────

const VAT_LABEL: Record<string, string> = {
    standard: "Standard VAT",
    zero_rated: "Zero-rated",
    reverse_charge: "Reverse Charge",
    exempt: "Exempt",
    outside_scope: "Outside Scope",
    unknown: "VAT Unknown",
};

function vatBadgeVariant(vat: VATClassification): "green" | "amber" | "red" {
    if (vat.treatment === "unknown" || vat.treatment === "outside_scope" || vat.confidence === "low") return "red";
    if (vat.treatment === "zero_rated" || vat.treatment === "reverse_charge" || vat.treatment === "exempt" || vat.confidence === "medium") return "amber";
    return "green";
}

const BADGE_CLASSES = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
};

const BADGE_ICON = { green: "✓", amber: "⚠", red: "✗" };

// ── sub-components ────────────────────────────────────────────────────────────

function ConfidenceDot({ level }: { level: "high" | "medium" | "low" | "missing" | undefined }) {
    if (!level || level === "missing" || level === "low") {
        return <span className="inline-block w-2 h-2 rounded-full bg-red-400 shrink-0" title={level ?? "unknown"} />;
    }
    if (level === "medium") {
        return <span className="inline-block w-2 h-2 rounded-full bg-amber-400 shrink-0" title="medium confidence" />;
    }
    return <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="high confidence" />;
}

// ── summary builder ───────────────────────────────────────────────────────────

function buildSummary(
    extraction: InvoiceExtraction,
    vat: VATClassification,
    expense: ExpenseCategory,
): string {
    const supplier = extraction.supplier_name || "Unknown supplier";
    const total = `${extraction.currency} ${extraction.total_amount.toFixed(2)}`;
    const date = extraction.invoice_date ? ` dated ${extraction.invoice_date}` : "";
    const cat = expense.matched ? expense.category : "general expense";
    return (
        `Invoice from ${supplier} for ${total}${date}, categorised as ${cat}. ` +
        vat.reasoning
    );
}

// ── output types ──────────────────────────────────────────────────────────────

type OutputFormat = "journal" | "xero" | "csv" | "summary";

// ── component ─────────────────────────────────────────────────────────────────

export default function InvoiceParserTool() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [confidence, setConfidence] = useState<number | null>(null);
    const [provider, setProvider] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [processStage, setProcessStage] = useState<"extracting" | "analyzing" | null>(null);
    const [processError, setProcessError] = useState<string | null>(null);
    const [processCorrelationId, setProcessCorrelationId] = useState<string | null>(null);

    const [draft, setDraft] = useState<InvoiceExtraction | null>(null);
    const [copied, setCopied] = useState(false);
    const [outputFormat, setOutputFormat] = useState<OutputFormat>("journal");
    const [usage, setUsage] = useState<UsageLimitState>({
        loading: true,
        isAuthenticated: false,
        usedToday: 0,
        limit: 30,
        remaining: 30,
        limitReached: false,
    });

    useEffect(() => {
        getUsageLimitState().then(setUsage).catch(() => {
            setUsage((prev) => ({ ...prev, loading: false }));
        });
    }, []);

    // Derived state — recomputes whenever the user edits any field
    const vatClass = useMemo(() => (draft ? classifyVAT(draft) : null), [draft]);
    const expenseCategory = useMemo(() => (draft ? categoriseExpense(draft) : null), [draft]);
    const summary = useMemo(() => {
        if (!draft || !vatClass || !expenseCategory) return "";
        return buildSummary(draft, vatClass, expenseCategory);
    }, [draft, vatClass, expenseCategory]);

    // Always journal format — used by the copy button regardless of selected output
    const journalLines = useMemo(() => {
        if (!draft || !expenseCategory) return "";
        const total = draft.total_amount;
        const vat = draft.vat_amount;
        const net = Math.max(total - vat, 0);
        const cat = expenseCategory.matched ? expenseCategory.category : "General";
        return [
            "Date,Account,Debit,Credit,Description",
            `${draft.invoice_date || ""},Expense (${cat}),${net.toFixed(2)},,${draft.supplier_name}`,
            `${draft.invoice_date || ""},VAT Input,${vat.toFixed(2)},,Reclaimable VAT`,
            `${draft.invoice_date || ""},Bank/Payables,,${total.toFixed(2)},Invoice ${draft.invoice_number || ""}`,
        ].join("\n");
    }, [draft, expenseCategory]);

    const outputPreview = useMemo(() => {
        if (!draft || !vatClass || !expenseCategory) return "";
        const total = draft.total_amount;
        const vat = draft.vat_amount;
        const net = Math.max(total - vat, 0);
        const cat = expenseCategory.matched ? expenseCategory.category : "General";
        const code = expenseCategory.matched ? expenseCategory.code : "7000";

        if (outputFormat === "journal") return journalLines;

        if (outputFormat === "xero") {
            return [
                "Date,Amount,Payee,Description,Reference,TaxType,AccountCode",
                `${csvEscape(draft.invoice_date || "")},${total.toFixed(2)},${csvEscape(draft.supplier_name)},${csvEscape(cat)},${csvEscape(draft.invoice_number || "")},${vat > 0 ? "INPUT2" : "NONE"},${code}`,
            ].join("\n");
        }

        if (outputFormat === "csv") {
            const header = "Vendor,Invoice Number,Date,Line Description,Line Amount,VAT,Total";
            const rows = draft.line_items.map((item) =>
                [
                    csvEscape(draft.supplier_name),
                    csvEscape(draft.invoice_number),
                    csvEscape(draft.invoice_date),
                    csvEscape(item.description),
                    csvEscape(item.line_total.toString()),
                    csvEscape(vat.toString()),
                    csvEscape(total.toString()),
                ].join(",")
            );
            return [header, ...rows].join("\n");
        }

        // summary
        return [
            `Invoice from ${draft.supplier_name}`,
            `Invoice #: ${draft.invoice_number || "N/A"}`,
            `Date: ${draft.invoice_date || "N/A"}`,
            `Total: ${draft.currency} ${total.toFixed(2)}`,
            `VAT: ${draft.currency} ${vat.toFixed(2)} (${VAT_LABEL[vatClass.treatment] ?? vatClass.treatment})`,
            `Net: ${draft.currency} ${net.toFixed(2)}`,
            `Category: ${cat} · code ${code}`,
            "",
            summary,
            "",
            ...(vatClass.flags.length ? ["VAT notes:", ...vatClass.flags.map((f) => `- ${f}`)] : []),
        ].join("\n");
    }, [draft, vatClass, expenseCategory, outputFormat, journalLines, summary]);

    // ── upload handler — OCR then AI extraction in one user wait ─────────────

    const onFilePick = async (file: File) => {
        const correlationId = generateCorrelationId();
        setProcessError(null);
        setProcessCorrelationId(null);

        if (!usage.isAuthenticated && usage.limitReached) {
            setProcessError("Daily free limit reached. Please sign up to continue.");
            return;
        }
        if (!["application/pdf", "image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
            setProcessError("Please upload a PDF, PNG, or JPG file.");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setProcessError("File must be 10MB or smaller.");
            return;
        }

        setSelectedFile(file);
        setIsProcessing(true);
        setProcessStage("extracting");

        try {
            if (!usage.isAuthenticated) {
                await recordAnonymousUsage().then(setUsage);
            }

            // Phase 1 — OCR text extraction
            const form = new FormData();
            form.append("file", file);
            console.info("[invoice-parser]", {
                stage: "extract_fetch", correlationId,
                payload: { fileName: file.name, fileSize: file.size, fileType: file.type },
            });

            const extractRes = await fetch("/api/extract-text", {
                method: "POST",
                body: form,
                headers: { "x-file-name": file.name, "x-correlation-id": correlationId },
            });
            const extractData = await extractRes.json();
            if (!extractRes.ok) throw new Error(extractData?.detail || extractData?.error || "Failed to extract text.");

            const rawText: string = extractData.rawText || "";
            setConfidence(typeof extractData.confidence === "number" ? extractData.confidence : null);
            setProvider(extractData.providerUsed || "ocr");

            console.info("[invoice-parser]", {
                stage: "extract_ok", correlationId,
                rawTextLength: rawText.length, status: extractRes.status,
                serverCorrelationId: extractRes.headers.get("x-correlation-id"),
            });

            // Phase 2 — AI field extraction into InvoiceExtraction schema
            setProcessStage("analyzing");
            console.info("[invoice-parser]", { stage: "analyze_fetch", correlationId, rawTextLength: rawText.length });

            const analyzeRes = await fetch("/api/invoice-analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-correlation-id": correlationId },
                body: JSON.stringify({ rawText }),
            });
            const analyzeData = await analyzeRes.json();

            console.info("[invoice-parser]", {
                stage: "analyze_ok", correlationId,
                status: analyzeRes.status,
                serverCorrelationId: analyzeRes.headers.get("x-correlation-id"),
            });

            if (!analyzeRes.ok) throw new Error(analyzeData?.error || "Analysis failed.");

            // Prefer AI extraction; fall back to regex if extraction is absent
            setDraft(analyzeData.extraction ?? buildFallbackDraft(rawText));
            setStep(2);
        } catch (err) {
            const errorType = err instanceof TypeError ? "network" : "http";
            const message = err instanceof Error ? err.message : "Processing failed.";
            console.error("[invoice-parser]", {
                stage: "process_error", correlationId, errorType, message,
                hint: errorType === "network"
                    ? "Request never reached the server — check connectivity or CORS"
                    : "Server returned a non-OK response",
            });
            setProcessError(message);
            setProcessCorrelationId(correlationId);
        } finally {
            setIsProcessing(false);
            setProcessStage(null);
        }
    };

    const copyJournal = async () => {
        try {
            await navigator.clipboard.writeText(journalLines);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard unavailable — silent fail
        }
    };

    const processAnother = () => {
        setStep(1);
        setSelectedFile(null);
        setConfidence(null);
        setProvider("");
        setDraft(null);
        setProcessError(null);
        setProcessCorrelationId(null);
        setCopied(false);
        setOutputFormat("journal");
    };

    // ── render ────────────────────────────────────────────────────────────────

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="mb-6 text-sm text-slate-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
                🔒 Privacy-first: Processed in-memory and never stored.
            </div>

            {!usage.loading && !usage.isAuthenticated && (
                <p className="mb-4 text-xs text-slate-500">
                    Free usage: {usage.usedToday}/{usage.limit} used today across all tools.
                </p>
            )}

            {!usage.loading && !usage.isAuthenticated && usage.limitReached && (
                <div className="mb-4"><UsageLimitGate /></div>
            )}

            {/* Step indicators */}
            <div className="mb-8 flex flex-wrap gap-2 text-sm">
                {([1, 2, 3] as const).map((n) => (
                    <span key={n} className={`px-3 py-1 rounded-full border ${step >= n ? "bg-[#566AF0] text-white border-[#566AF0]" : "bg-white text-slate-500 border-slate-300"}`}>
                        Step {n}
                    </span>
                ))}
            </div>

            {/* ── Step 1: Upload ─────────────────────────────────────────────── */}
            {step === 1 && (
                <div>
                    <label
                        htmlFor="invoice-file"
                        className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-10 text-center hover:border-[#566AF0] transition"
                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-[#566AF0]"); }}
                        onDragLeave={(e) => { e.currentTarget.classList.remove("border-[#566AF0]"); }}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove("border-[#566AF0]");
                            const file = e.dataTransfer.files?.[0];
                            if (file) onFilePick(file);
                        }}
                    >
                        <p className="text-lg font-semibold text-slate-800">Drop invoice PDF/image here</p>
                        <p className="mt-2 text-sm text-slate-500">PDF, PNG, JPG up to 10MB. Tap to choose file.</p>
                        {selectedFile && <p className="mt-4 text-sm text-slate-600">Selected: {selectedFile.name}</p>}
                    </label>
                    <input
                        id="invoice-file"
                        type="file"
                        accept="application/pdf,image/png,image/jpeg"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && onFilePick(e.target.files[0])}
                        disabled={!usage.loading && !usage.isAuthenticated && usage.limitReached}
                    />
                    {isProcessing && (
                        <p className="mt-4 text-sm text-slate-600 animate-pulse">
                            {processStage === "extracting" ? "Extracting text from invoice…" : "Analysing invoice fields…"}
                        </p>
                    )}
                    {processError && (
                        <div className="mt-4">
                            <p className="text-sm text-red-600">{processError}</p>
                            {processCorrelationId && <p className="text-xs text-slate-400 mt-0.5">Ref: {processCorrelationId}</p>}
                        </div>
                    )}
                </div>
            )}

            {/* ── Step 2: Instant result ─────────────────────────────────────── */}
            {step === 2 && draft && vatClass && expenseCategory && (
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-slate-900">Review extracted data</h3>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                        {(() => {
                            const variant = vatBadgeVariant(vatClass);
                            return (
                                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${BADGE_CLASSES[variant]}`}>
                                    <span>{BADGE_ICON[variant]}</span>
                                    {VAT_LABEL[vatClass.treatment] ?? vatClass.treatment}
                                </span>
                            );
                        })()}
                        {expenseCategory.matched ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
                                {expenseCategory.category}
                                <span className="text-xs text-slate-400">· {expenseCategory.code}</span>
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-500">
                                Category: needs review
                            </span>
                        )}
                    </div>

                    {/* Plain English summary */}
                    <p className="text-sm text-slate-600 leading-relaxed rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                        {summary}
                    </p>

                    {/* VAT flags */}
                    {vatClass.flags.length > 0 && (
                        <ul className="space-y-1">
                            {vatClass.flags.map((flag, i) => (
                                <li key={i} className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                                    {flag}
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Editable fields with per-field confidence dots */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {([
                            ["Supplier name", "supplier_name"],
                            ["Invoice number", "invoice_number"],
                            ["Date", "invoice_date"],
                        ] as const).map(([label, key]) => {
                            const conf = draft.extraction_confidence.per_field[key];
                            return (
                                <label key={key} className="text-sm text-slate-600">
                                    <span className="flex items-center gap-1.5 mb-1">
                                        {label}
                                        <ConfidenceDot level={conf} />
                                    </span>
                                    <input
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                                        value={draft[key] ?? ""}
                                        onChange={(e) => setDraft((prev) => (prev ? { ...prev, [key]: e.target.value } : prev))}
                                    />
                                </label>
                            );
                        })}
                        {([
                            ["Total amount", "total_amount"],
                            ["VAT amount", "vat_amount"],
                        ] as const).map(([label, key]) => {
                            const conf = draft.extraction_confidence.per_field[key];
                            return (
                                <label key={key} className="text-sm text-slate-600">
                                    <span className="flex items-center gap-1.5 mb-1">
                                        {label}
                                        <ConfidenceDot level={conf} />
                                    </span>
                                    <input
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                                        value={draft[key].toString()}
                                        onChange={(e) => setDraft((prev) => (prev ? { ...prev, [key]: parseAmount(e.target.value) } : prev))}
                                    />
                                </label>
                            );
                        })}
                    </div>

                    {/* Line items */}
                    <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">Line items</p>
                        <div className="space-y-2">
                            {draft.line_items.map((item, idx) => (
                                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <input
                                        className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                        value={item.description}
                                        onChange={(e) =>
                                            setDraft((prev) => {
                                                if (!prev) return prev;
                                                const line_items = [...prev.line_items];
                                                line_items[idx] = { ...line_items[idx], description: e.target.value };
                                                return { ...prev, line_items };
                                            })
                                        }
                                    />
                                    <input
                                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                        value={item.line_total.toString()}
                                        onChange={(e) =>
                                            setDraft((prev) => {
                                                if (!prev) return prev;
                                                const line_items = [...prev.line_items];
                                                line_items[idx] = { ...line_items[idx], line_total: parseAmount(e.target.value) };
                                                return { ...prev, line_items };
                                            })
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-sm text-slate-500">
                        OCR confidence: {confidence != null ? `${Math.round(confidence <= 1 ? confidence * 100 : confidence)}%` : "N/A"}
                        {provider ? ` · via ${provider}` : ""}
                    </p>

                    <button
                        onClick={() => setStep(3)}
                        className="rounded-full bg-[#566AF0] px-6 py-2.5 text-white font-semibold hover:bg-[#4355d6]"
                    >
                        Looks right →
                    </button>
                </div>
            )}

            {/* ── Step 3: Outputs ────────────────────────────────────────────── */}
            {step === 3 && draft && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900">Generate outputs</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        {([
                            ["journal", "Journal Entries"],
                            ["xero", "Xero CSV import"],
                            ["csv", "Simple CSV"],
                            ["summary", "Plain English summary"],
                        ] as const).map(([id, label]) => (
                            <label key={id} className="rounded-lg border border-slate-300 px-3 py-2 cursor-pointer">
                                <input type="radio" className="mr-2" checked={outputFormat === id} onChange={() => setOutputFormat(id)} />
                                {label}
                            </label>
                        ))}
                    </div>

                    <pre className="max-h-64 overflow-auto rounded-xl bg-slate-900 text-slate-100 p-4 text-xs whitespace-pre-wrap">
                        {outputPreview}
                    </pre>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={copyJournal}
                            className="rounded-full border border-[#566AF0] text-[#566AF0] px-6 py-2.5 font-semibold hover:bg-[#566AF0] hover:text-white transition-colors"
                        >
                            {copied ? "Copied!" : "Copy journal entry"}
                        </button>
                        <button
                            onClick={() => downloadText(
                                outputPreview,
                                `invoice-${outputFormat}.${outputFormat === "summary" ? "txt" : "csv"}`,
                                outputFormat === "summary" ? "text/plain" : "text/csv",
                            )}
                            className="rounded-full bg-[#566AF0] text-white px-6 py-2.5 font-semibold hover:bg-[#4355d6]"
                        >
                            Download output
                        </button>
                        <button
                            className="rounded-full border border-slate-300 px-6 py-2.5 text-slate-600"
                            disabled
                            title="Requires login integration"
                        >
                            Save to history (optional)
                        </button>
                        <button onClick={processAnother} className="rounded-full border border-slate-300 px-6 py-2.5 text-slate-700">
                            Process another invoice
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
