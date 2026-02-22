"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface OcrHistoryItem {
    id: string;
    file_name: string | null;
    raw_text: string | null;
    confidence: number | null;
    created_at: string;
}

interface Props {
    reloadKey: number;
}

export default function OcrHistory({ reloadKey }: Props) {
    const [items, setItems] = useState<OcrHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("ocr_results")
                .select("id, file_name, raw_text, confidence, created_at")
                .order("created_at", { ascending: false })
                .limit(5);

            if (error) {
                console.error("Error loading history:", error);
                setItems([]);
            } else {
                setItems(data || []);
            }

            setLoading(false);
        };

        loadHistory();
    }, [reloadKey]);

    if (loading) {
        return (
            <div className="mt-8 text-xs text-slate-500">
                Loading recent results...
            </div>
        );
    }

    if (!items.length) {
        return (
            <div className="mt-8 text-xs text-slate-500">
                No previous OCR results yet.
            </div>
        );
    }

    return (
        <div className="mt-8">
            <h2 className="text-sm font-semibold text-slate-800 mb-2">
                Recent OCR results
            </h2>
            <div className="space-y-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="border border-slate-200 rounded-lg p-3 bg-white"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-slate-800">
                                {item.file_name || "Untitled image"}
                            </span>
                            <span className="text-[10px] text-slate-500">
                                {new Date(item.created_at).toLocaleString()}
                            </span>
                        </div>
                        {item.confidence != null && (
                            <div className="text-[10px] text-slate-500 mb-1">
                                Confidence: {item.confidence.toFixed(1)}%
                            </div>
                        )}
                        <p className="text-[11px] text-slate-700 line-clamp-3">
                            {item.raw_text || ""}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
