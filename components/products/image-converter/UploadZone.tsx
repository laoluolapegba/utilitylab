"use client";

import { UploadCloud } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";

type UploadZoneProps = {
    onFilesSelected: (files: File[]) => void;
};

export default function UploadZone({ onFilesSelected }: UploadZoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const onDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        const files = Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith("image/") || /\.(heic|heif|tiff|svg|ico)$/i.test(file.name));
        if (files.length) onFilesSelected(files);
    };

    return (
        <div
            onDrop={onDrop}
            onDragOver={(event) => event.preventDefault()}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            className={`rounded-2xl border-2 border-dashed p-10 text-center transition-all ${isDragging ? "border-[#566AF0] bg-indigo-50" : "border-slate-300 bg-white"}`}
        >
            <UploadCloud className="w-10 h-10 mx-auto text-[#566AF0]" />
            <h3 className="mt-4 text-xl font-semibold text-slate-900">Drop images here</h3>
            <p className="mt-2 text-slate-600">PNG, JPG, WEBP, GIF, BMP, TIFF, SVG, ICO, HEIC and more.</p>

            <button
                type="button"
                className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#566AF0] text-white font-medium hover:bg-indigo-700"
                onClick={() => inputRef.current?.click()}
            >
                Choose files
            </button>

            <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/*,.heic,.heif,.tiff,.tif,.svg,.ico"
                onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    if (files.length) onFilesSelected(files);
                }}
                className="hidden"
            />
        </div>
    );
}
