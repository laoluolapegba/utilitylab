"use client";

import { useEffect, useMemo } from "react";
import type { ConversionResult } from "@/lib/image-converter/converter";

function formatBytes(bytes: number) {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / 1024 ** index;
    return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[index]}`;
}

type PreviewProps = {
    results: ConversionResult[];
};

export default function Preview({ results }: PreviewProps) {
    const previews = useMemo(
        () => results.map((result) => ({ key: `${result.sourceFileName}-${result.fileName}`, url: URL.createObjectURL(result.blob), result })),
        [results],
    );

    useEffect(() => {
        return () => {
            previews.forEach((preview) => URL.revokeObjectURL(preview.url));
        };
    }, [previews]);

    if (!results.length) return null;

    return (
        <div className="rounded-2xl bg-white border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Preview</h3>
            <div className="grid gap-4 md:grid-cols-2">
                {previews.map(({ key, url, result }) => (
                    <div key={key} className="rounded-xl border border-slate-200 p-4">
                        <img src={url} alt={result.fileName} className="w-full h-40 object-contain bg-slate-50 rounded-lg" />
                        <p className="mt-3 text-sm font-medium text-slate-900 truncate">{result.fileName}</p>
                        <p className="text-xs text-slate-600">
                            {formatBytes(result.sourceSize)} → {formatBytes(result.outputSize)}
                        </p>
                        {result.width > 0 && (
                            <p className="text-xs text-slate-600">
                                {result.width} × {result.height}
                            </p>
                        )}
                        {result.warning && <p className="mt-2 text-xs text-amber-600">{result.warning}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}
