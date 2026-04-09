import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "UtilityLab - Simple Utilities that just Work",
    description: "Focused mini-apps for everyday work.",
    icons: {
        icon: "/favicon.ico", // Using the one found in public/
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className={inter.className}>
            <body className="antialiased text-slate-900 bg-white">
                {/*
                  Faux-viewport shell. All content scrolls inside #scroll-area.
                  #modal-root is a sibling — modals use position:absolute within
                  this relative container instead of position:fixed, which breaks
                  when any ancestor has a CSS transform applied.
                */}
                <div id="faux-viewport" className="relative h-screen overflow-hidden">
                    <div id="scroll-area" className="h-full overflow-y-auto">
                        {children}
                    </div>
                    <div id="modal-root" />
                </div>
            </body>
        </html>
    );
}
