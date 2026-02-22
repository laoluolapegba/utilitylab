import Image from "next/image";
import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative bg-slate-50 text-slate-600 overflow-hidden">
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <Image
                    src="/footerBg.png"
                    alt="Footer Background"
                    fill
                    className="object-cover object-bottom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent"></div>
            </div>

            <div className="relative z-10 pt-20 pb-10 container mx-auto px-4 sm:px-6 lg:px-8">

                {/* CTA in Footer */}
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-[#0F172A] mb-4">
                        Want to grow your business with us? Download now.
                    </h2>
                    <p className="text-slate-600 mb-8">
                        Focused tools for focused people. Get started today and reclaim your productivity.
                    </p>
                    <Link href="/get-started" className="inline-flex items-center justify-center rounded-full bg-[#566AF0] px-8 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-[#4355d6] btn-shadow">
                        Get started Free
                    </Link>
                </div>

                <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Logo */}
                    <div className="flex items-center">
                        <Image
                            src="/imageLab_dark.png"
                            alt="UtilityLab Logo"
                            width={120}
                            height={32}
                            className="h-6 w-auto object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all"
                        />
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap justify-center gap-8 text-sm font-medium">
                        <Link href="#" className="hover:text-[#566AF0] transition-colors">Team</Link>
                        <Link href="#" className="hover:text-[#566AF0] transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-[#566AF0] transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-[#566AF0] transition-colors">Legal</Link>
                    </div>

                    {/* Socials */}
                    <div className="flex items-center gap-4">
                        <Link href="#" className="p-2 rounded-full bg-slate-100 hover:bg-[#566AF0] hover:text-white transition-all text-slate-500">
                            <Twitter className="w-4 h-4" />
                        </Link>
                        <Link href="#" className="p-2 rounded-full bg-slate-100 hover:bg-[#566AF0] hover:text-white transition-all text-slate-500">
                            <Linkedin className="w-4 h-4" />
                        </Link>
                        <Link href="#" className="p-2 rounded-full bg-slate-100 hover:bg-[#566AF0] hover:text-white transition-all text-slate-500">
                            <Github className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-slate-400">
                    © 2024 UtilityLab. All rights reserved.
                </div>

            </div>
        </footer>
    );
}
