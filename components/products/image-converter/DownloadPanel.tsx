"use client";

import type { ConversionResult } from "@/lib/image-converter/converter";
import { createZipBlob } from "@/lib/image-converter/zip";

type DownloadPanelProps = {
    results: ConversionResult[];
};

function triggerDownload(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
}

export default function DownloadPanel({ results }: DownloadPanelProps) {
    if (!results.length) return null;

    const downloadAll = async () => {
        const zipBlob = await createZipBlob(results.map((result) => ({ name: result.fileName, blob: result.blob })));
        triggerDownload(zipBlob, "utilitylab-image-conversions.zip");
    };

    return (
        <div className="rounded-2xl bg-white border border-slate-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Download converted files</h3>
                <button
                    type="button"
                    onClick={downloadAll}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#566AF0] text-white font-medium hover:bg-indigo-700"
                >
                    Download all as ZIP
                </button>
            </div>

            <div className="space-y-2">
                {results.map((result) => (
                    <div key={result.fileName} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 px-4 py-3">
                        <p className="text-sm text-slate-700 truncate">{result.fileName}</p>
                        <button
                            type="button"
                            className="text-sm font-medium text-[#566AF0] hover:text-indigo-700"
                            onClick={() => triggerDownload(result.blob, result.fileName)}
                        >
                            Download
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
