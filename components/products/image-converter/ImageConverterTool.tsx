"use client";

import { useMemo, useState } from "react";
import UploadZone from "@/components/products/image-converter/UploadZone";
import FormatSelector from "@/components/products/image-converter/FormatSelector";
import Preview from "@/components/products/image-converter/Preview";
import DownloadPanel from "@/components/products/image-converter/DownloadPanel";
import { processBatch, type BatchProgress } from "@/lib/image-converter/batchProcessor";
import { type ConversionResult, type OutputFormat } from "@/lib/image-converter/converter";
import UsageLimitGate from "@/components/UsageLimitGate";
import { getUsageLimitState, recordAnonymousUsage, type UsageLimitState } from "@/lib/usageLimits";
import { useEffect } from "react";

export default function ImageConverterTool() {
    const [files, setFiles] = useState<File[]>([]);
    const [results, setResults] = useState<ConversionResult[]>([]);
    const [errors, setErrors] = useState<Array<{ fileName: string; error: string }>>([]);
    const [progress, setProgress] = useState<BatchProgress | null>(null);
    const [isConverting, setIsConverting] = useState(false);

    const [outputFormat, setOutputFormat] = useState<OutputFormat>("webp");
    const [quality, setQuality] = useState(0.85);
    const [maxWidth, setMaxWidth] = useState("");
    const [maxHeight, setMaxHeight] = useState("");
    const [usage, setUsage] = useState<UsageLimitState>({
        loading: true,
        isAuthenticated: false,
        usedToday: 0,
        limit: 3,
        remaining: 3,
        limitReached: false,
    });

    useEffect(() => {
        getUsageLimitState().then(setUsage);
    }, []);

    const hasFiles = files.length > 0;

    const convert = async () => {
        if (!files.length) return;

        if (!usage.isAuthenticated && usage.limitReached) {
            return;
        }

        if (!usage.isAuthenticated) {
            const next = await recordAnonymousUsage();
            setUsage(next);
        }

        setIsConverting(true);
        setResults([]);
        setErrors([]);

        const batch = await processBatch(
            files,
            {
                outputFormat,
                quality,
                maxWidth: maxWidth ? Number(maxWidth) : undefined,
                maxHeight: maxHeight ? Number(maxHeight) : undefined,
            },
            setProgress,
        );

        setResults(batch.successful);
        setErrors(batch.failed);
        setIsConverting(false);
    };

    const totalInputSize = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);

    return (
        <div className="space-y-6">
            <UploadZone
                onFilesSelected={(nextFiles) => {
                    setFiles(nextFiles);
                    setResults([]);
                    setErrors([]);
                    setProgress(null);
                }}
            />

            <FormatSelector
                outputFormat={outputFormat}
                quality={quality}
                maxWidth={maxWidth}
                maxHeight={maxHeight}
                onChange={(updates) => {
                    if (updates.outputFormat) setOutputFormat(updates.outputFormat);
                    if (typeof updates.quality === "number") setQuality(updates.quality);
                    if (typeof updates.maxWidth === "string") setMaxWidth(updates.maxWidth.replace(/[^\d]/g, ""));
                    if (typeof updates.maxHeight === "string") setMaxHeight(updates.maxHeight.replace(/[^\d]/g, ""));
                }}
            />

            <div className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-slate-900 font-semibold">Batch conversion</p>
                    <p className="text-sm text-slate-600">
                        {files.length} file(s) selected • {(totalInputSize / 1024 / 1024).toFixed(2)} MB total
                    </p>
                    {!usage.loading && !usage.isAuthenticated && (
                        <p className="text-xs text-slate-500 mt-1">Free usage: {usage.usedToday}/{usage.limit} today</p>
                    )}
                </div>

                <button
                    type="button"
                    disabled={!hasFiles || isConverting || (!usage.loading && !usage.isAuthenticated && usage.limitReached)}
                    onClick={convert}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#566AF0] text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isConverting ? "Converting..." : "Convert images"}
                </button>
            </div>

            {!usage.loading && !usage.isAuthenticated && usage.limitReached && <UsageLimitGate />}

            {progress && (
                <div className="rounded-2xl bg-white border border-slate-200 p-4">
                    <p className="text-sm text-slate-700">
                        {progress.percent}% complete
                        {progress.currentFile ? ` • Processing ${progress.currentFile}` : ""}
                    </p>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                        <div className="h-2 rounded-full bg-[#566AF0]" style={{ width: `${progress.percent}%` }} />
                    </div>
                </div>
            )}

            {errors.length > 0 && (
                <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4">
                    <p className="font-semibold text-amber-900">Some files could not be converted</p>
                    <ul className="mt-2 list-disc ml-5 text-sm text-amber-800 space-y-1">
                        {errors.map((item) => (
                            <li key={item.fileName}>
                                {item.fileName}: {item.error}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <Preview results={results} />
            <DownloadPanel results={results} />
        </div>
    );
}
