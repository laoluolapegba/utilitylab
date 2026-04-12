/**
 * Validates required environment variables at module import time (cold start).
 * Throws immediately if any required var is absent so the process fails fast
 * rather than surfacing errors on the first request.
 */

const REQUIRED = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
] as const;

const OPTIONAL = [
    "OPENAI_API_KEY",
    "GOOGLE_APPLICATION_CREDENTIALS",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
] as const;

function validateEnv(): void {
    const missing = REQUIRED.filter((v) => !process.env[v]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }

    const missingOptional = OPTIONAL.filter((v) => !process.env[v]);
    if (missingOptional.length > 0) {
        process.stdout.write(
            JSON.stringify({
                level: "warn",
                stage: "config_init",
                message: `Optional env vars not set: ${missingOptional.join(", ")}`,
                timestamp: new Date().toISOString(),
            }) + "\n",
        );
    }
}

validateEnv();

export {};
