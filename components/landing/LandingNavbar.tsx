"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function LandingNavbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100/50">
            <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
                <div className="flex items-center justify-between h-[72px]">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">U</span>
                        </div>
                        <span className="text-lg font-bold text-slate-900 tracking-tight">UtilityLab</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="/auth?mode=signin"
                            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            Sign in
                        </Link>
                        <Link
                            href="/auth?mode=signup"
                            className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-[#4F46E5] rounded-full hover:bg-[#4338CA] transition-all shadow-sm hover:shadow-md"
                        >
                            Sign up
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-slate-600 hover:text-slate-900"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-slate-100">
                        <nav className="flex flex-col gap-4">
                            <Link
                                href="/auth?mode=signin"
                                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/auth?mode=signup"
                                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-[#4F46E5] rounded-full hover:bg-[#4338CA] transition-all"
                            >
                                Sign up
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
