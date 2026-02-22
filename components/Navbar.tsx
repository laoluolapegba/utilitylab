// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type AuthState =
    | { status: "loading" }
    | { status: "signedOut" }
    | { status: "signedIn"; email: string | null };

export default function Navbar() {
    const [auth, setAuth] = useState<AuthState>({ status: "loading" });
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!isMounted) return;

            if (user) setAuth({ status: "signedIn", email: user.email ?? null });
            else setAuth({ status: "signedOut" });
        };

        load();

        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            const user = session?.user ?? null;
            if (user) setAuth({ status: "signedIn", email: user.email ?? null });
            else setAuth({ status: "signedOut" });
        });

        return () => {
            isMounted = false;
            sub.subscription.unsubscribe();
        };
    }, []);

    const onSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/"); // back to landing
        router.refresh();
    };

    const onApp = pathname.startsWith("/app");


    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-transparent transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Brand */}
                    <Link href="/" className="flex items-center group">
                        <img
                            src="/imageLab_dark.png"
                            className="h-7 sm:h-8 group-hover:scale-105 transition-transform"
                            alt="ImageLab Logo"
                        />
                    </Link>

                    {/* Actions */}
                    <nav className="flex items-center gap-6">
                        {onApp && (
                            <div className="hidden md:flex items-center gap-4 text-sm">
                                <Link href="/app/image-to-text" className="text-slate-600 hover:text-slate-900 transition-colors">
                                    Image to Text
                                </Link>
                                <Link href="/app/image-converter" className="text-slate-600 hover:text-slate-900 transition-colors">
                                    Image Converter
                                </Link>
                            </div>
                        )}

                        {/* Sign In / Auth State - Text Link Style */}
                        {auth.status === "loading" ? (
                            <span className="text-xs text-slate-500">…</span>
                        ) : auth.status === "signedOut" ? (
                            <Link
                                href="/auth"
                                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                Sign in
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span className="hidden sm:inline text-xs text-slate-600">
                                    {auth.email}
                                </span>
                                <button
                                    type="button"
                                    onClick={onSignOut}
                                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    Sign out
                                </button>
                            </div>
                        )}

                        {/* Open App - Primary CTA Button Style */}
                        {!onApp && (
                            <Link
                                href="/app"
                                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-[#4F46E5] rounded-full hover:bg-[#4338ca] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                Get Started
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
