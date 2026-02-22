"use client";

import { useMemo, useState } from "react";

type LineItem = {
    description: string;
    amount: string;
};

type InvoiceDraft = {
    vendorName: string;
    invoiceNumber: string;
    invoiceDate: string;
    totalAmount: string;
    vatAmount: string;
    lineItems: LineItem[];
};

type AnalysisResult = {
    deductibleStatus: "fully" | "partial";
    reason: string;
    vatReclaimableAmount: string;
    category: string;
    ukAccountingCode: string;
    warnings: string[];
    summary: string;
};

type ChatMessage = { role: "user" | "assistant"; content: string };
type OutputFormat = "journal" | "xero" | "csv" | "summary";

const MAX_MB = 10;

function parseAmount(value: string): number {
    const cleaned = value.replace(/[^\d.-]/g, "");
    const amount = Number.parseFloat(cleaned);
    return Number.isNaN(amount) ? 0 : amount;
}

function buildFallbackDraft(rawText: string): InvoiceDraft {
    const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const firstLine = lines[0] || "Unknown Vendor";

    const invoiceNumber = rawText.match(/(?:invoice\s*(?:number|no\.?|#)\s*[:\-]?\s*)([A-Z0-9\-\/]+)/i)?.[1] ?? "";
    const invoiceDate = rawText.match(/(?:date\s*[:\-]?\s*)(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\-]\d{2}[\-]\d{2})/i)?.[1] ?? "";
    const totalAmount = rawText.match(/(?:total\s*(?:due|amount)?\s*[:\-]?\s*)(£?\s?\d+[\d,.]*)/i)?.[1] ?? "";
    const vatAmount = rawText.match(/(?:vat\s*(?:amount)?\s*[:\-]?\s*)(£?\s?\d+[\d,.]*)/i)?.[1] ?? "";

    const lineItems = lines
        .filter((line) => /£?\s?\d+[\d,.]*$/.test(line))
        .slice(0, 8)
        .map((line) => {
            const amountMatch = line.match(/(£?\s?\d+[\d,.]*)$/);
            return {
                description: line.replace(/(£?\s?\d+[\d,.]*)$/, "").trim() || "Item",
                amount: amountMatch?.[1] ?? "",
            };
        });

    return {
        vendorName: firstLine,
        invoiceNumber,
        invoiceDate,
        totalAmount,
        vatAmount,
        lineItems: lineItems.length ? lineItems : [{ description: "General expense", amount: totalAmount || "" }],
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

export default function InvoiceParserTool() {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [rawText, setRawText] = useState("");
    const [confidence, setConfidence] = useState<number | null>(null);
    const [provider, setProvider] = useState<string>("");
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractError, setExtractError] = useState<string | null>(null);

    const [draft, setDraft] = useState<InvoiceDraft | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);

    const [question, setQuestion] = useState("");
    const [chat, setChat] = useState<ChatMessage[]>([]);
    const [asking, setAsking] = useState(false);
    const [outputFormat, setOutputFormat] = useState<OutputFormat>("journal");

    const outputPreview = useMemo(() => {
        if (!draft) return "";

        const total = parseAmount(draft.totalAmount);
        const vat = parseAmount(draft.vatAmount);
        const net = Math.max(total - vat, 0);

        if (outputFormat === "journal") {
            return [
                "Date,Account,Debit,Credit,Description",
                `${draft.invoiceDate || ""},Expense (${analysis?.category || "General"}),${net.toFixed(2)},,${draft.vendorName}`,
                `${draft.invoiceDate || ""},VAT Input,${vat.toFixed(2)},,Reclaimable VAT`,
                `${draft.invoiceDate || ""},Bank/Payables,,${total.toFixed(2)},Invoice ${draft.invoiceNumber || ""}`,
            ].join("\n");
        }

        if (outputFormat === "xero") {
            return [
                "Date,Amount,Payee,Description,Reference,TaxType,AccountCode",
                `${csvEscape(draft.invoiceDate || "")},${total.toFixed(2)},${csvEscape(draft.vendorName)},${csvEscape(analysis?.category || "Expense")},${csvEscape(draft.invoiceNumber || "")},${vat > 0 ? "INPUT2" : "NONE"},${analysis?.ukAccountingCode || "400"}`,
            ].join("\n");
        }

        if (outputFormat === "csv") {
            const header = "Vendor,Invoice Number,Date,Line Description,Line Amount,VAT,Total";
            const rows = draft.lineItems.map((item) =>
                [
                    csvEscape(draft.vendorName),
                    csvEscape(draft.invoiceNumber),
                    csvEscape(draft.invoiceDate),
                    csvEscape(item.description),
                    csvEscape(item.amount),
                    csvEscape(draft.vatAmount),
                    csvEscape(draft.totalAmount),
                ].join(",")
            );
            return [header, ...rows].join("\n");
        }

        return [
            `Invoice from ${draft.vendorName}`,
            `Invoice #: ${draft.invoiceNumber || "N/A"}`,
            `Date: ${draft.invoiceDate || "N/A"}`,
            `Total: ${draft.totalAmount || "N/A"}`,
            `VAT: ${draft.vatAmount || "N/A"}`,
            "",
            analysis?.summary || "No AI summary generated.",
            "",
            ...(analysis?.warnings?.length ? ["Warnings:", ...analysis.warnings.map((w) => `- ${w}`)] : ["Warnings: None"]),
        ].join("\n");
    }, [analysis, draft, outputFormat]);

    const onFilePick = async (file: File) => {
        setExtractError(null);
        if (!["application/pdf", "image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
            setExtractError("Please upload a PDF, PNG, or JPG file.");
            return;
        }
        if (file.size > MAX_MB * 1024 * 1024) {
            setExtractError("File must be 10MB or smaller.");
            return;
        }

        setSelectedFile(file);
        setIsExtracting(true);

        try {
            const form = new FormData();
            form.append("file", file);

            const res = await fetch("/api/extract-text", { method: "POST", body: form, headers: { "x-file-name": file.name } });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.detail || data?.error || "Failed to extract text.");

            const extractedText = data.rawText || "";
            setRawText(extractedText);
            setConfidence(typeof data.confidence === "number" ? data.confidence : null);
            setProvider(data.providerUsed || "ocr");
            setDraft(buildFallbackDraft(extractedText));
            setStep(2);
        } catch (err) {
            setExtractError(err instanceof Error ? err.message : "Extraction failed.");
        } finally {
            setIsExtracting(false);
        }
    };

    const analyzeInvoice = async () => {
        if (!draft) return;
        setIsAnalyzing(true);
        setAnalysisError(null);
        try {
            const res = await fetch("/api/invoice-analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rawText, invoice: draft }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Analysis failed.");
            setAnalysis(data.analysis);
            setStep(3);
        } catch (err) {
            setAnalysisError(err instanceof Error ? err.message : "Failed to analyze invoice.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const askQuestion = async () => {
        if (!question.trim() || !draft) return;
        const q = question.trim();
        setQuestion("");
        setAsking(true);
        setChat((prev) => [...prev, { role: "user", content: q }]);

        try {
            const res = await fetch("/api/invoice-analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rawText, invoice: draft, question: q, analysis }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Unable to answer right now.");
            setChat((prev) => [...prev, { role: "assistant", content: data.answer || "I couldn't generate an answer." }]);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unable to answer right now.";
            setChat((prev) => [...prev, { role: "assistant", content: message }]);
        } finally {
            setAsking(false);
        }
    };

    const processAnother = () => {
        setStep(1);
        setSelectedFile(null);
        setRawText("");
        setConfidence(null);
        setProvider("");
        setDraft(null);
        setAnalysis(null);
        setChat([]);
        setExtractError(null);
        setAnalysisError(null);
        setOutputFormat("journal");
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="mb-6 text-sm text-slate-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
                🔒 Privacy-first: Processed in-memory and never stored.
            </div>

            <div className="mb-8 flex flex-wrap gap-2 text-sm">
                {[1, 2, 3, 4].map((n) => (
                    <span key={n} className={`px-3 py-1 rounded-full border ${step >= n ? "bg-[#566AF0] text-white border-[#566AF0]" : "bg-white text-slate-500 border-slate-300"}`}>
                        Step {n}
                    </span>
                ))}
            </div>

            {step === 1 && (
                <div>
                    <label
                        htmlFor="invoice-file"
                        className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-10 text-center hover:border-[#566AF0] transition"
                    >
                        <p className="text-lg font-semibold text-slate-800">Drop invoice PDF/image here</p>
                        <p className="mt-2 text-sm text-slate-500">PDF, PNG, JPG up to 10MB. Tap to choose file.</p>
                        {selectedFile && <p className="mt-4 text-sm text-slate-600">Selected: {selectedFile.name}</p>}
                    </label>
                    <input id="invoice-file" type="file" accept="application/pdf,image/png,image/jpeg" className="hidden" onChange={(e) => e.target.files?.[0] && onFilePick(e.target.files[0])} capture="environment" />
                    {isExtracting && <p className="mt-4 text-sm text-slate-600">Processing invoice...</p>}
                    {extractError && <p className="mt-4 text-sm text-red-600">{extractError}</p>}
                </div>
            )}

            {step >= 2 && draft && (
                <div className="space-y-5">
                    <h3 className="text-xl font-semibold text-slate-900">Preview extracted data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {([
                            ["Vendor name", "vendorName"],
                            ["Invoice number", "invoiceNumber"],
                            ["Date", "invoiceDate"],
                            ["Total amount", "totalAmount"],
                            ["VAT amount", "vatAmount"],
                        ] as const).map(([label, key]) => (
                            <label key={key} className="text-sm text-slate-600">
                                {label}
                                <input
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                                    value={draft[key]}
                                    onChange={(e) => setDraft((prev) => (prev ? { ...prev, [key]: e.target.value } : prev))}
                                />
                            </label>
                        ))}
                    </div>

                    <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">Line items</p>
                        <div className="space-y-2">
                            {draft.lineItems.map((item, idx) => (
                                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <input
                                        className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                        value={item.description}
                                        onChange={(e) =>
                                            setDraft((prev) => {
                                                if (!prev) return prev;
                                                const lineItems = [...prev.lineItems];
                                                lineItems[idx] = { ...lineItems[idx], description: e.target.value };
                                                return { ...prev, lineItems };
                                            })
                                        }
                                    />
                                    <input
                                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                        value={item.amount}
                                        onChange={(e) =>
                                            setDraft((prev) => {
                                                if (!prev) return prev;
                                                const lineItems = [...prev.lineItems];
                                                lineItems[idx] = { ...lineItems[idx], amount: e.target.value };
                                                return { ...prev, lineItems };
                                            })
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-sm text-slate-500">OCR confidence: {confidence != null ? `${Math.round((confidence <= 1 ? confidence * 100 : confidence))}%` : "N/A"} {provider ? `• via ${provider}` : ""}</p>

                    {step === 2 && (
                        <button onClick={analyzeInvoice} disabled={isAnalyzing} className="rounded-full bg-[#566AF0] px-6 py-2.5 text-white font-semibold hover:bg-[#4355d6] disabled:opacity-70">
                            {isAnalyzing ? "Analyzing..." : "Analyze invoice"}
                        </button>
                    )}

                    {analysisError && <p className="text-sm text-red-600">{analysisError}</p>}
                </div>
            )}

            {step >= 3 && analysis && (
                <div className="mt-8 space-y-4 border-t border-slate-200 pt-6">
                    <h3 className="text-xl font-semibold text-slate-900">AI explanation</h3>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                        <p className="font-semibold text-slate-900">{analysis.deductibleStatus === "fully" ? "✓ Fully deductible" : "⚠️ Partially deductible"}</p>
                        <p className="text-slate-700 text-sm">{analysis.reason}</p>
                        <p className="text-sm"><span className="font-medium">VAT reclaimable:</span> {analysis.vatReclaimableAmount}</p>
                        <p className="text-sm"><span className="font-medium">Category:</span> {analysis.category}</p>
                        <p className="text-sm"><span className="font-medium">UK accounting code:</span> {analysis.ukAccountingCode}</p>
                        {analysis.warnings.length > 0 && (
                            <ul className="list-disc ml-5 text-sm text-amber-700">
                                {analysis.warnings.map((w) => <li key={w}>{w}</li>)}
                            </ul>
                        )}
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4">
                        <p className="font-medium text-slate-900 mb-3">Ask a question about this invoice</p>
                        <div className="flex gap-2">
                            <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. Can I claim this if I work from home?" className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                            <button onClick={askQuestion} disabled={asking} className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm disabled:opacity-70">Ask</button>
                        </div>
                        <div className="mt-4 space-y-3">
                            {chat.map((m, idx) => (
                                <div key={idx} className={`rounded-lg px-3 py-2 text-sm ${m.role === "user" ? "bg-blue-50 text-blue-900" : "bg-slate-100 text-slate-800"}`}>
                                    <strong className="mr-1">{m.role === "user" ? "You:" : "AI:"}</strong>
                                    {m.content}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button onClick={() => setStep(4)} className="rounded-full border border-slate-300 px-6 py-2.5 text-slate-700 font-semibold hover:bg-slate-50">Continue to outputs</button>
                </div>
            )}

            {step === 4 && draft && (
                <div className="mt-8 space-y-4 border-t border-slate-200 pt-6">
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

                    <pre className="max-h-64 overflow-auto rounded-xl bg-slate-900 text-slate-100 p-4 text-xs whitespace-pre-wrap">{outputPreview}</pre>
                    <div className="flex flex-wrap gap-3">
                        <button onClick={() => downloadText(outputPreview, `invoice-${outputFormat}.${outputFormat === "summary" ? "txt" : "csv"}`, outputFormat === "summary" ? "text/plain" : "text/csv")}
                            className="rounded-full bg-[#566AF0] text-white px-6 py-2.5 font-semibold hover:bg-[#4355d6]">
                            Download output
                        </button>
                        <button className="rounded-full border border-slate-300 px-6 py-2.5 text-slate-600" disabled title="Requires login integration">
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
