"use client";

/**
 * Design-system Button.
 * All product components should import from here, not style inline.
 */

import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size    = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
    primary:   "bg-[#566AF0] text-white hover:bg-[#4355d6] btn-shadow",
    secondary: "border border-[#566AF0] text-[#566AF0] hover:bg-[#566AF0]/10",
    ghost:     "text-slate-600 hover:text-[#0F172A] hover:bg-slate-100",
};

const SIZES: Record<Size, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
};

export function Button({
    variant = "primary",
    size    = "md",
    className,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#566AF0] disabled:pointer-events-none disabled:opacity-50",
                VARIANTS[variant],
                SIZES[size],
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}
