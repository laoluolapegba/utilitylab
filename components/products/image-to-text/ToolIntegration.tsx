"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

/**
 * This component intelligently routes users:
 * - If logged in → Go to app
 * - If not logged in → Go to sign up
 */
export default function ToolIntegration() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
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

    const handleGetStarted = () => {
        if (isAuthenticated) {
            // User is logged in, go to the actual tool
            router.push("/dashboard/image-to-text");
        } else {
            // User not logged in, go to sign up
            router.push("/auth?mode=signup");
        }
    };

    const handleSecondaryAction = () => {
        if (isAuthenticated) {
            // Already logged in, maybe show dashboard or settings
            router.push("/dashboard");
        } else {
            // Not logged in, show sign in
            router.push("/auth?mode=signin");
        }
    };

    return (
        <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-50 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl mb-6">
                            {isAuthenticated ? "Start Converting Now" : "Try It Now"}
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            {isAuthenticated
                                ? "You're all set! Click below to access the Image to Text converter."
                                : "See the power of our OCR technology in action. Sign up to get started."
                            }
                        </p>
                    </div>

                    {/* Tool Preview/Demo Area */}
                    <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 sm:p-12 shadow-lg">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#566AF0] to-[#4355d6] rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>

                            <h3 className="text-2xl font-bold text-[#0F172A] mb-4">
                                {isAuthenticated
                                    ? "Ready to extract text from your images!"
                                    : "Ready to extract text from images?"
                                }
                            </h3>

                            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                                {isAuthenticated
                                    ? "Access the full Image to Text converter with all features unlocked."
                                    : "Sign up for free to access the Image to Text converter. Get 3 free conversions daily with no credit card required."
                                }
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={handleGetStarted}
                                    disabled={isLoading}
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#566AF0] px-8 py-4 text-base font-semibold text-white transition-all hover:translate-y-[-1px] hover:bg-[#4355d6] btn-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        "Loading..."
                                    ) : isAuthenticated ? (
                                        <>Go to Converter<ArrowRight className="h-5 w-5" /></>
                                    ) : (
                                        <>Get Started Free<ArrowRight className="h-5 w-5" /></>
                                    )}
                                </button>

                                {!isLoading && (
                                    <button
                                        onClick={handleSecondaryAction}
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-white border-2 border-slate-200 px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
                                    >
                                        {isAuthenticated ? "View Dashboard" : "Sign In"}
                                    </button>
                                )}
                            </div>

                            {/* Trust Indicators */}
                            {!isAuthenticated && (
                                <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span>No credit card</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span>3 free daily</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span>Cancel anytime</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-8 mt-12 max-w-3xl mx-auto">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-[#0F172A] mb-2">{'< 2s'}</div>
                            <div className="text-sm text-slate-600">Average Processing</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-[#0F172A] mb-2">99%</div>
                            <div className="text-sm text-slate-600">Accuracy Rate</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-[#0F172A] mb-2">50+</div>
                            <div className="text-sm text-slate-600">Languages</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}