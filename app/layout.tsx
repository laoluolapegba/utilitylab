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
                {children}
            </body>
        </html>
    );
}
