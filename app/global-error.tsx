"use client";

// app/global-error.tsx
// Catches errors thrown by the root layout itself.
// Must include <html> and <body> because it replaces the entire layout.

type Props = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
    return (
        <html lang="en">
            <body>
                <div className="min-h-screen bg-white flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>
                            Something went wrong
                        </h1>
                        <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
                            A critical error occurred. Please reload the page.
                            {error.digest && (
                                <span style={{ display: "block", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                                    Ref: {error.digest}
                                </span>
                            )}
                        </p>
                        <button
                            onClick={reset}
                            style={{
                                padding: "0.75rem 1.5rem",
                                background: "#566AF0",
                                color: "#fff",
                                borderRadius: "9999px",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: 500,
                            }}
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
