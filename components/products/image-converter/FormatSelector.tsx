"use client";

import { OUTPUT_FORMATS, type OutputFormat } from "@/lib/image-converter/converter";

type FormatSelectorProps = {
    outputFormat: OutputFormat;
    quality: number;
    maxWidth: string;
    maxHeight: string;
    onChange: (updates: {
        outputFormat?: OutputFormat;
        quality?: number;
        maxWidth?: string;
        maxHeight?: string;
    }) => void;
};

export default function FormatSelector({ outputFormat, quality, maxWidth, maxHeight, onChange }: FormatSelectorProps) {
    const showQuality = outputFormat === "jpeg" || outputFormat === "webp" || outputFormat === "avif";

    return (
        <div className="rounded-2xl bg-white border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Conversion settings</h3>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-slate-700">
                    Output format
                    <select
                        value={outputFormat}
                        onChange={(event) => onChange({ outputFormat: event.target.value as OutputFormat })}
                        className="rounded-xl border border-slate-300 px-3 py-2"
                    >
                        {OUTPUT_FORMATS.map((format) => (
                            <option key={format} value={format}>
                                {format.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col gap-2 text-sm text-slate-700">
                        Max width
                        <input
                            value={maxWidth}
                            onChange={(event) => onChange({ maxWidth: event.target.value })}
                            inputMode="numeric"
                            placeholder="Original"
                            className="rounded-xl border border-slate-300 px-3 py-2"
                        />
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-slate-700">
                        Max height
                        <input
                            value={maxHeight}
                            onChange={(event) => onChange({ maxHeight: event.target.value })}
                            inputMode="numeric"
                            placeholder="Original"
                            className="rounded-xl border border-slate-300 px-3 py-2"
                        />
                    </label>
                </div>
            </div>

            {showQuality && (
                <label className="mt-5 flex flex-col gap-2 text-sm text-slate-700">
                    Quality / Compression: {Math.round(quality * 100)}%
                    <input
                        type="range"
                        min={0.1}
                        max={1}
                        step={0.05}
                        value={quality}
                        onChange={(event) => onChange({ quality: Number(event.target.value) })}
                    />
                </label>
            )}
        </div>
    );
}
