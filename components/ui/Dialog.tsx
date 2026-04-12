"use client";

/**
 * Modal Dialog.
 * When @radix-ui/react-dialog is installed, swap this implementation.
 * For now exposes a minimal accessible dialog built with native <dialog>.
 */

import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type DialogProps = {
    open:        boolean;
    onClose:     () => void;
    title?:      string;
    children:    ReactNode;
    className?:  string;
};

export function Dialog({ open, onClose, title, children, className }: DialogProps) {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (open) {
            el.showModal?.();
        } else {
            el.close?.();
        }
    }, [open]);

    return (
        <dialog
            ref={ref}
            onClose={onClose}
            className={cn(
                "rounded-2xl border border-slate-200 bg-white p-6 shadow-xl backdrop:bg-black/40 max-w-lg w-full",
                className,
            )}
        >
            {title && (
                <h2 className="text-lg font-bold text-[#0F172A] mb-4">{title}</h2>
            )}
            {children}
        </dialog>
    );
}
