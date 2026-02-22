"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartCTAProps {
    /**
     * Where to redirect authenticated users
     */
    authenticatedRoute?: string;
    /**
     * Where to redirect non-authenticated users
     */
    unauthenticatedRoute?: string;
    /**
     * Button text when user is authenticated
     */
    authenticatedText?: string;
    /**
     * Button text when user is not authenticated
     */
    unauthenticatedText?: string;
    /**
     * Button variant
     */
    variant?: "primary" | "secondary";
    /**
     * Show arrow icon
     */
    showArrow?: boolean;
    /**
     * Additional CSS classes
     */
    className?: string;
}

export default function SmartCTA({
    authenticatedRoute = "/dashboard",
    unauthenticatedRoute = "/auth?mode=signup",
    authenticatedText = "Go to Dashboard",
    unauthenticatedText = "Get Started",
    variant = "primary",
    showArrow = true,
    className = ""
}: SmartCTAProps) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setIsAuthenticated(!!session);
            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const checkAuth = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
        } catch (error) {
            console.error("Auth check error:", error);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClick = () => {
        if (isAuthenticated) {
            router.push(authenticatedRoute);
        } else {
            router.push(unauthenticatedRoute);
        }
    };

    const baseClasses = "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = variant === "primary"
        ? "bg-[#566AF0] text-white hover:translate-y-[-1px] hover:bg-[#4355d6] btn-shadow"
        : "bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50";

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={cn(baseClasses, variantClasses, className)}
        >
            {isLoading ? (
                "Loading..."
            ) : (
                <>
                    {isAuthenticated ? authenticatedText : unauthenticatedText}
                    {showArrow && <ArrowRight className="h-5 w-5" />}
                </>
            )}
        </button>
    );
}