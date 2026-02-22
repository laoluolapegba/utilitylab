"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function MarketingNavbar() {
    const [open, setOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        void supabase.auth.getSession().then(({ data: { session } }) => {
            setIsAuthenticated(!!session);
        }).catch((error) => {
            console.error("Auth check error:", error);
            setIsAuthenticated(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            setIsAuthenticated(false);
            router.push("/");
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-100/50 bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/imageLab_dark.png"
                        alt="UtilityLab Logo"
                        width={140}
                        height={40}
                        className="h-8 w-auto object-contain"
                        priority
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/#products"
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                    >
                        Products
                    </Link>
                    <Link
                        href="/#pricing"
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                    >
                        Pricing
                    </Link>

                    {isAuthenticated === null ? (
                        // Loading state
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-8 bg-slate-100 animate-pulse rounded" />
                            <div className="w-20 h-10 bg-slate-100 animate-pulse rounded-full" />
                        </div>
                    ) : isAuthenticated ? (
                        // Logged in state
                        <>
                            <button
                                onClick={handleSignOut}
                                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                            >
                                Sign out
                            </button>
                            <Link
                                href="/app/image-converter"
                                className={cn(
                                    "rounded-full bg-[#566AF0] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4355d6]",
                                    "btn-shadow"
                                )}
                            >
                                Go to Tool
                            </Link>
                        </>
                    ) : (
                        // Logged out state
                        <>
                            <Link
                                href="/auth?mode=signin"
                                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/auth?mode=signup"
                                className={cn(
                                    "rounded-full bg-[#566AF0] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4355d6]",
                                    "btn-shadow"
                                )}
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </nav>

                {/* Mobile toggle */}
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="md:hidden p-2 text-slate-600 hover:text-slate-900"
                    aria-label="Toggle menu"
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden border-t border-slate-100 bg-white/90 backdrop-blur-sm">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <nav className="flex flex-col gap-3">
                            <Link
                                href="/#products"
                                className="text-sm font-medium text-slate-700 hover:text-slate-900 py-2"
                                onClick={() => setOpen(false)}
                            >
                                Products
                            </Link>
                            <Link
                                href="/#pricing"
                                className="text-sm font-medium text-slate-700 hover:text-slate-900 py-2"
                                onClick={() => setOpen(false)}
                            >
                                Pricing
                            </Link>

                            <div className="border-t border-slate-200 my-2" />

                            {isAuthenticated === null ? (
                                // Loading state
                                <div className="space-y-3">
                                    <div className="h-8 bg-slate-100 animate-pulse rounded" />
                                    <div className="h-10 bg-slate-100 animate-pulse rounded-full" />
                                </div>
                            ) : isAuthenticated ? (
                                // Logged in state
                                <>
                                    <button
                                        onClick={() => {
                                            handleSignOut();
                                            setOpen(false);
                                        }}
                                        className="text-sm font-medium text-slate-700 hover:text-slate-900 text-left py-2"
                                    >
                                        Sign out
                                    </button>
                                    <Link
                                        href="/app/image-converter"
                                        className={cn(
                                            "mt-2 inline-flex items-center justify-center rounded-full bg-[#566AF0] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4355d6]",
                                            "btn-shadow"
                                        )}
                                        onClick={() => setOpen(false)}
                                    >
                                        Go to Tool
                                    </Link>
                                </>
                            ) : (
                                // Logged out state
                                <>
                                    <Link
                                        href="/auth?mode=signin"
                                        className="text-sm font-medium text-slate-700 hover:text-slate-900 py-2"
                                        onClick={() => setOpen(false)}
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        href="/auth?mode=signup"
                                        className={cn(
                                            "mt-2 inline-flex items-center justify-center rounded-full bg-[#566AF0] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4355d6]",
                                            "btn-shadow"
                                        )}
                                        onClick={() => setOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}