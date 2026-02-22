// components/ImageUpload.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const DAILY_LIMIT = 3;
const SUPPORTED_FORMATS = "PNG, JPG, JPEG, WEBP";

type ToastType = "success" | "error" | "info";
type ProviderName = "google" | "textract";
type ItemStatus = "pending" | "processing" | "done" | "error" | "limit";

interface UploadItem {
    id: string;
    fileName: string;
    fileSize: number;
    previewUrl: string;
    status: ItemStatus;
    text?: string;
    confidence?: number | null;
    error?: string | null;
    provider?: ProviderName;
    retryCount?: number;
    createdAt?: string;
}

function todayISO() {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    const url = URL.createObjectURL(file);
    try {
        const img = new Image();
        img.src = url;

        await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error("Failed to load image for dimension detection."));
        });

        return { width: img.naturalWidth, height: img.naturalHeight };
    } finally {
        URL.revokeObjectURL(url);
    }
}

function toBaseName(fileName: string) {
    const idx = fileName.lastIndexOf(".");
    return idx > 0 ? fileName.slice(0, idx) : fileName;
}

function downloadBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function formatBytes(bytes: number) {
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
}

function formatConfidence(confidence: number | null | undefined) {
    if (confidence == null) return null;
    // If returned as 0..1
    if (confidence >= 0 && confidence <= 1) return `${Math.round(confidence * 100)}%`;
    // If returned as 0..100
    if (confidence > 1 && confidence <= 100) return `${Math.round(confidence)}%`;
    return null;
}

export default function ImageUpload() {
    const [items, setItems] = useState<UploadItem[]>([]);
    const [uploadsUsedToday, setUploadsUsedToday] = useState<number | null>(null);
    const [limitError, setLimitError] = useState<string | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);

    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

    // Mobile: show actions by toggling ⋯
    const [openActionsId, setOpenActionsId] = useState<string | null>(null);

    // In-memory file store for retries (session-only)
    const fileMap = useMemo(() => new Map<string, File>(), []);

    const showToast = (message: string, type: ToastType = "info") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2500);
    };

    // Close modal on ESC
    useEffect(() => {
        if (!expandedItemId) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setExpandedItemId(null);
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [expandedItemId]);

    // Load authoritative daily usage from DB (cross-device)
    useEffect(() => {
        const loadUsage = async () => {
            setLimitError(null);
            try {
                const { data: auth } = await supabase.auth.getUser();
                const user = auth.user;
                if (!user) {
                    setUploadsUsedToday(0);
                    return;
                }

                const { data, error } = await supabase
                    .from("usage_daily")
                    .select("used_count")
                    .eq("user_id", user.id)
                    .eq("usage_date", todayISO())
                    .maybeSingle();

                if (error) {
                    console.error("Error loading usage_daily:", error);
                    setLimitError("Could not load usage info. You can still upload.");
                    setUploadsUsedToday(0);
                    return;
                }

                setUploadsUsedToday(data?.used_count ?? 0);
            } catch (e) {
                console.error("Unexpected error loading usage:", e);
                setLimitError("Could not load usage info. You can still upload.");
                setUploadsUsedToday(0);
            }
        };

        loadUsage();
    }, []);

    const limitReached = uploadsUsedToday !== null && uploadsUsedToday >= DAILY_LIMIT;

    // ---------- File handling ----------
    const createItemId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    const handleFiles = useCallback(
        (files: FileList | null) => {
            if (!files || files.length === 0) return;

            const arr = Array.from(files);

            setItems((prev) => {
                const newItems = [...prev];

                arr.forEach((file) => {
                    if (!file.type.startsWith("image/")) {
                        showToast("Only image files are supported.", "error");
                        return;
                    }

                    const id = createItemId();
                    const previewUrl = URL.createObjectURL(file);

                    // store for retry (session-only)
                    fileMap.set(id, file);

                    const used = uploadsUsedToday ?? 0;

                    let status: ItemStatus = "pending";
                    let error: string | null = null;

                    if (used >= DAILY_LIMIT) {
                        status = "limit";
                        error = "Daily limit reached.";
                    }

                    const item: UploadItem = {
                        id,
                        fileName: file.name,
                        fileSize: file.size,
                        previewUrl,
                        status,
                        error,
                        retryCount: 0,
                        createdAt: new Date().toISOString(),
                    };

                    newItems.push(item);

                    if (status !== "limit") {
                        // start immediately
                        processFile(id, file);
                    }
                });

                return newItems;
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [uploadsUsedToday, fileMap]
    );

    // Drag-drop handlers
    const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(false);
        if (limitReached) return;
        handleFiles(event.dataTransfer.files);
    };

    const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const onDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (limitReached) return;
        setIsDragActive(true);
    };

    const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(false);
    };

    const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(event.target.files);
        // allow selecting same file again
        event.target.value = "";
    };

    // Paste images support (Ctrl+V)
    useEffect(() => {
        const onPaste = (e: ClipboardEvent) => {
            if (limitReached) return;

            const clipItems = e.clipboardData?.items;
            if (!clipItems) return;

            const files: File[] = [];
            for (const it of clipItems) {
                if (it.kind === "file" && it.type.startsWith("image/")) {
                    const f = it.getAsFile();
                    if (f) files.push(f);
                }
            }

            if (files.length === 0) return;

            const dt = new DataTransfer();
            files.forEach((f) => dt.items.add(f));
            handleFiles(dt.files);
        };

        window.addEventListener("paste", onPaste);
        return () => window.removeEventListener("paste", onPaste);
    }, [handleFiles, limitReached]);

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            items.forEach((i) => URL.revokeObjectURL(i.previewUrl));
            fileMap.clear();
        };
    }, [items, fileMap]);

    // ---------- OCR processing ----------
    const updateItem = (id: string, partial: Partial<UploadItem>) => {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...partial } : item)));
    };

    const logOcrEvent = async (args: {
        file: File;
        width: number;
        height: number;
        provider: ProviderName | null;
        confidence: number | null;
        hasText: boolean | null;
        textLength: number | null;
        isSuccess: boolean;
        errorMessage: string | null;
    }) => {
        try {
            const { data: auth } = await supabase.auth.getUser();
            const user = auth.user;
            if (!user) return;

            const { error } = await supabase.from("ocr_results").insert({
                user_id: user.id,
                file_name: args.file.name,
                raw_text: null, // ✅ privacy
                confidence: args.confidence,
                provider: args.provider,
                has_text: args.hasText,
                text_length: args.textLength,
                image_bytes: args.file.size,
                image_width: args.width,
                image_height: args.height,
                is_success: args.isSuccess,
                error_message: args.errorMessage,
            });

            if (error) console.error("Failed to log ocr_results:", error);
        } catch (e) {
            console.error("Failed to log analytics:", e);
        }
    };

    const bumpDailyUsage = async (): Promise<number | null> => {
        try {
            const { data: auth } = await supabase.auth.getUser();
            const user = auth.user;
            if (!user) return null;

            const next = (uploadsUsedToday ?? 0) + 1;

            const { error } = await supabase
                .from("usage_daily")
                .upsert({ user_id: user.id, usage_date: todayISO(), used_count: next }, { onConflict: "user_id,usage_date" });

            if (error) {
                console.error("Failed to update usage_daily:", error);
                return null;
            }

            setUploadsUsedToday(next);
            return next;
        } catch (e) {
            console.error("Failed to update usage_daily:", e);
            return null;
        }
    };

    const processFile = async (id: string, file: File) => {
        // hard block if daily limit already reached
        if (uploadsUsedToday !== null && uploadsUsedToday >= DAILY_LIMIT) {
            updateItem(id, { status: "limit", error: "Daily limit reached." });
            return;
        }

        updateItem(id, { status: "processing", error: null });

        const form = new FormData();
        form.append("file", file);

        let width = 0;
        let height = 0;

        try {
            const dims = await getImageDimensions(file);
            width = dims.width;
            height = dims.height;

            const res = await fetch("/api/extract-text", {
                method: "POST",
                headers: {
                    "x-image-width": String(width),
                    "x-image-height": String(height),
                    "x-file-bytes": String(file.size),
                    "x-file-name": file.name,
                },
                body: form,
            });

            const json = await res.json();

            if (!res.ok || json.error) {
                const msg = json?.error || "OCR failed. Try a clearer image.";
                console.error("OCR failed:", json);

                updateItem(id, { status: "error", error: msg });
                showToast("OCR failed for one of the images.", "error");

                await logOcrEvent({
                    file,
                    width,
                    height,
                    provider: null,
                    confidence: null,
                    hasText: null,
                    textLength: null,
                    isSuccess: false,
                    errorMessage: msg,
                });

                return;
            }

            const rawText: string = json.rawText || "";
            const confidence: number | null = json.confidence ?? null;
            const providerUsed: ProviderName = (json.providerUsed as ProviderName) || "google";

            if (!rawText.trim()) {
                updateItem(id, {
                    status: "done",
                    text: "",
                    confidence,
                    error: "No text found.",
                    provider: providerUsed,
                });
                showToast("No text found in one image.", "info");

                await logOcrEvent({
                    file,
                    width,
                    height,
                    provider: providerUsed,
                    confidence,
                    hasText: false,
                    textLength: 0,
                    isSuccess: false,
                    errorMessage: "No text found",
                });

                return;
            }

            // success in UI
            updateItem(id, {
                status: "done",
                text: rawText,
                confidence,
                error: null,
                provider: providerUsed,
            });

            // enforce quota across devices (only on success)
            await bumpDailyUsage();

            // log analytics (no content)
            await logOcrEvent({
                file,
                width,
                height,
                provider: providerUsed,
                confidence,
                hasText: true,
                textLength: rawText.length,
                isSuccess: true,
                errorMessage: null,
            });

            showToast(`Text extracted (${providerUsed === "google" ? "Vision" : "Textract"}).`, "success");
        } catch (err) {
            console.error("Upload error", err);

            updateItem(id, { status: "error", error: "Something went wrong uploading this file." });
            showToast("Something went wrong processing one of the files.", "error");

            // best-effort analytics for unexpected errors
            try {
                await logOcrEvent({
                    file,
                    width,
                    height,
                    provider: null,
                    confidence: null,
                    hasText: null,
                    textLength: null,
                    isSuccess: false,
                    errorMessage: "Unexpected client error",
                });
            } catch {
                // ignore
            }
        }
    };

    const retryItem = async (id: string) => {
        const item = items.find((i) => i.id === id);
        if (!item) return;

        if (uploadsUsedToday !== null && uploadsUsedToday >= DAILY_LIMIT) {
            showToast("Daily limit reached. Try again tomorrow.", "error");
            updateItem(id, { status: "limit", error: "Daily limit reached." });
            return;
        }

        const file = fileMap.get(id);
        if (!file) {
            showToast("Original file not available. Please re-upload.", "error");
            return;
        }

        updateItem(id, { retryCount: (item.retryCount ?? 0) + 1 });
        await processFile(id, file);
    };

    // ---------- Delete tile + clear all ----------
    const deleteItem = (id: string) => {
        setItems((prev) => {
            const item = prev.find((p) => p.id === id);
            if (item) URL.revokeObjectURL(item.previewUrl);
            return prev.filter((p) => p.id !== id);
        });

        fileMap.delete(id);

        if (expandedItemId === id) setExpandedItemId(null);
        if (openActionsId === id) setOpenActionsId(null);
    };

    const clearAll = () => {
        items.forEach((i) => URL.revokeObjectURL(i.previewUrl));
        fileMap.clear();
        setItems([]);
        setExpandedItemId(null);
        setOpenActionsId(null);
        showToast("Cleared all items.", "info");
    };

    // ---------- Export ----------
    const exportTxt = (item: UploadItem) => {
        if (!item.text) return;
        const base = toBaseName(item.fileName || "extracted");
        const blob = new Blob([item.text], { type: "text/plain;charset=utf-8" });
        downloadBlob(blob, `${base}.txt`);
        showToast("Exported .txt", "success");
    };

    const exportJson = (item: UploadItem) => {
        if (!item.text) return;

        const payload = {
            id: item.id,
            file: { name: item.fileName, sizeBytes: item.fileSize },
            ocr: {
                provider: item.provider ?? null,
                confidence: item.confidence ?? null,
                text: item.text,
            },
            status: item.status,
            error: item.error ?? null,
            createdAt: item.createdAt ?? null,
            exportedAt: new Date().toISOString(),
        };

        const base = toBaseName(item.fileName || "extracted");
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
        downloadBlob(blob, `${base}.json`);
        showToast("Exported .json", "success");
    };

    // ---------- Controls ----------
    const handleCopy = async (item: UploadItem) => {
        if (!item.text) return;
        try {
            await navigator.clipboard.writeText(item.text);
            showToast("Text copied to clipboard.", "success");
        } catch (err) {
            console.error("Copy failed:", err);
            showToast("Copy failed.", "error");
        }
    };

    const handleDownload = (item: UploadItem) => {
        const link = document.createElement("a");
        link.href = item.previewUrl;
        link.download = item.fileName || "image";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const expandedItem = items.find((i) => i.id === expandedItemId) || null;

    return (
        <div className="relative space-y-6">
            {/* Usage header */}
            <div className="rounded-2xl bg-white/40 border border-white/40 backdrop-blur-xl px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h2 className="text-sm font-semibold text-slate-900">Daily usage</h2>
                    <p className="text-xs text-slate-600">Free tier: {DAILY_LIMIT} successful image-to-text conversions per day.</p>
                    <p className="text-xs text-slate-500 mt-1">
                        Provider: <span className="font-medium">Auto (Vision ↔ Textract)</span>
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <p className="text-xs text-slate-900 font-medium">
                        {uploadsUsedToday === null ? "Loading..." : `${uploadsUsedToday}/${DAILY_LIMIT} used today`}
                    </p>

                    {limitError && <p className="text-[11px] text-amber-700 text-right">{limitError}</p>}

                    {limitReached && (
                        <p className="text-[11px] text-red-600 text-right">Limit reached for today. New uploads will be blocked.</p>
                    )}

                    {items.length > 0 && (
                        <button
                            type="button"
                            onClick={clearAll}
                            className="text-[11px] px-3 py-1 rounded-xl border border-white/60 bg-white/60 hover:bg-white text-slate-700"
                        >
                            Clear all
                        </button>
                    )}
                </div>
            </div>

            {/* Upload area */}
            <div
                onDrop={limitReached ? undefined : onDrop}
                onDragOver={limitReached ? undefined : onDragOver}
                onDragEnter={limitReached ? undefined : onDragEnter}
                onDragLeave={limitReached ? undefined : onDragLeave}
                className={[
                    "rounded-3xl border p-10 text-center",
                    "backdrop-blur-2xl transition",
                    "bg-white/35 border-white/50",
                    "hover:bg-white/45",
                    "min-h-[240px] flex flex-col items-center justify-center gap-4",
                    limitReached ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
                    isDragActive ? "scale-[1.01] shadow-2xl border-sky-300 bg-white/55" : "",
                ].join(" ")}
                onClick={() => {
                    if (limitReached) return;
                    document.getElementById("multi-file-input")?.click();
                }}
            >
                <div className="space-y-2">
                    <p className="text-base font-semibold text-slate-900">
                        {limitReached ? "Daily limit reached — come back tomorrow" : "Drop images here to extract text"}
                    </p>

                    <p className="text-xs text-slate-700">
                        Supports <span className="font-medium">{SUPPORTED_FORMATS}</span>
                    </p>

                    <p className="text-[11px] text-slate-600">
                        Tip: you can <span className="font-medium">drag & drop</span>, <span className="font-medium">browse</span>, or{" "}
                        <span className="font-medium">paste</span> images.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (limitReached) return;
                        document.getElementById("multi-file-input")?.click();
                    }}
                    className="px-6 py-3 rounded-2xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 active:scale-[0.98] transition shadow-sm"
                    disabled={limitReached}
                >
                    Browse
                </button>

                <input
                    id="multi-file-input"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    className="hidden"
                    onChange={onFileInputChange}
                    disabled={limitReached}
                />
            </div>

            {/* Tiles list */}
            {items.length > 0 && (
                <div className="space-y-3">
                    {items.map((item) => {
                        const sizeLabel = formatBytes(item.fileSize);
                        const preview =
                            (item.text || item.error || "")?.length > 140
                                ? (item.text || item.error || "").slice(0, 140) + "…"
                                : item.text || item.error || "";

                        const canExport = Boolean(item.text && item.status === "done");
                        const actionsOpen = openActionsId === item.id;

                        return (
                            <div
                                key={item.id}
                                className="group rounded-2xl border border-white/60 bg-white/70 backdrop-blur-lg px-3 py-3 transition hover:bg-white/80 hover:shadow-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/70 bg-white/80 flex-shrink-0">
                                        <img src={item.previewUrl} alt={item.fileName} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-xs font-medium text-slate-900 truncate">{item.fileName}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-slate-500 whitespace-nowrap">{sizeLabel}</span>

                                                {/* Mobile actions toggle */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenActionsId((cur) => (cur === item.id ? null : item.id));
                                                    }}
                                                    className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white/80 text-slate-700 hover:bg-white active:scale-[0.98]"
                                                    aria-label="More actions"
                                                >
                                                    ⋯
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                                            {item.status === "processing" && (
                                                <div className="flex items-center gap-2 w-full">
                                                    <span className="inline-block h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                                                    <span>Extracting…</span>
                                                    <span className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                                                        <span className="block h-full w-1/2 bg-slate-300 animate-pulse" />
                                                    </span>
                                                </div>
                                            )}

                                            {item.status === "done" &&
                                                (() => {
                                                    const conf = formatConfidence(item.confidence);
                                                    return conf ? <span>Confidence {conf}</span> : null;
                                                })()}

                                            {item.status === "error" && <span className="text-red-600">Error</span>}
                                            {item.status === "limit" && <span className="text-red-600">Daily limit</span>}

                                            {item.provider && (
                                                <span className="text-[10px] text-slate-500">• {item.provider === "google" ? "Vision" : "Textract"}</span>
                                            )}

                                            {item.status === "error" && (
                                                <button
                                                    type="button"
                                                    onClick={() => retryItem(item.id)}
                                                    className="px-2 py-0.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
                                                >
                                                    Retry
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions row: hover/focus (desktop) OR ⋯ toggle (mobile) */}
                                <div
                                    className={[
                                        "mt-3 flex items-center gap-2 text-[10px] flex-wrap justify-end",
                                        "transition",
                                        actionsOpen
                                            ? "opacity-100 pointer-events-auto"
                                            : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto",
                                    ].join(" ")}
                                >
                                    <button
                                        type="button"
                                        onClick={() => deleteItem(item.id)}
                                        className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
                                    >
                                        Delete
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDownload(item)}
                                        className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
                                    >
                                        Download
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleCopy(item)}
                                        disabled={!item.text}
                                        className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40"
                                    >
                                        Copy
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => exportTxt(item)}
                                        disabled={!canExport}
                                        className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40"
                                    >
                                        Export TXT
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => exportJson(item)}
                                        disabled={!canExport}
                                        className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40"
                                    >
                                        Export JSON
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setExpandedItemId(item.id)}
                                        className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
                                    >
                                        Expand
                                    </button>
                                </div>

                                {/* Preview: tap to expand */}
                                <div
                                    className="mt-2 border-t border-white/70 pt-2 cursor-pointer"
                                    onClick={() => setExpandedItemId(item.id)}
                                >
                                    {item.status === "processing" && <p className="text-[11px] text-slate-500">Extracting text…</p>}
                                    {preview && <p className="text-[11px] text-slate-700">{preview}</p>}
                                    {!preview && item.status === "done" && (
                                        <p className="text-[11px] text-slate-500">{item.error || "No text preview available."}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50">
                    <div
                        className={`
              rounded-xl px-4 py-2 text-sm shadow-lg 
              backdrop-blur-xl border
              ${toast.type === "success"
                                ? "bg-emerald-50/80 border-emerald-200 text-emerald-800"
                                : toast.type === "error"
                                    ? "bg-red-50/80 border-red-200 text-red-800"
                                    : "bg-slate-50/80 border-slate-200 text-slate-800"
                            }
            `}
                    >
                        {toast.message}
                    </div>
                </div>
            )}

            {/* Expand modal */}
            {expandedItem && (
                <div
                    className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
                    onClick={() => setExpandedItemId(null)}
                >
                    <div
                        className="max-w-lg w-full mx-4 rounded-2xl bg-white shadow-2xl border border-slate-200 p-4 space-y-3"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-sm font-semibold text-slate-900">Full extracted text</h3>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (!expandedItem.text) return;
                                        try {
                                            await navigator.clipboard.writeText(expandedItem.text);
                                            showToast("Text copied to clipboard.", "success");
                                        } catch {
                                            showToast("Copy failed.", "error");
                                        }
                                    }}
                                    disabled={!expandedItem.text}
                                    className="text-xs px-3 py-1 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40"
                                >
                                    Copy
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setExpandedItemId(null)}
                                    className="text-xs text-slate-500 hover:text-slate-900"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        <p className="text-xs text-slate-500">
                            {expandedItem.fileName} • {formatBytes(expandedItem.fileSize)}
                            {expandedItem.provider && ` • ${expandedItem.provider === "google" ? "Vision" : "Textract"}`}
                        </p>

                        <div className="border border-slate-200 rounded-xl bg-slate-50 p-3 max-h-80 overflow-auto">
                            {expandedItem.text ? (
                                <pre className="whitespace-pre-wrap text-xs text-slate-800">{expandedItem.text}</pre>
                            ) : (
                                <p className="text-xs text-slate-500">{expandedItem.error || "No text available."}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
