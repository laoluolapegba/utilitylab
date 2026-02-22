import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "#565 Add", // Placeholder, will refine based on image analysis
                    foreground: "#ffffff"
                },
                card: {
                    light: "#E3F3FF"
                }
            },
            boxShadow: {
                'btn': '0 4px 14px 0 rgba(0, 118, 255, 0.39)', // Custom drop shadow for buttons
            }
        },
    },
    plugins: [],
};
export default config;
