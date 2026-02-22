// scripts/test-openai.cjs

// Load env vars from .env.local (adjust path if needed)
require("dotenv").config({ path: ".env.local" });

const OpenAI = require("openai");

async function main() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.error("❌ OPENAI_API_KEY is not set. Check your .env.local file.");
        process.exit(1);
    }

    console.log("✅ OPENAI_API_KEY loaded (first 8 chars):", apiKey.slice(0, 8) + "****");

    const client = new OpenAI({ apiKey });

    try {
        console.log("🚀 Sending test request to OpenAI...");

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "user", content: "Say 'pong' if you can read this." },
            ],
            max_tokens: 20,
        });

        const message = response.choices?.[0]?.message?.content;
        console.log("✅ OpenAI response:");
        console.log(message);
    } catch (err) {
        console.error("❌ Error calling OpenAI API");

        // Raw error
        console.error(err);

        // Try to pull out structured info if available
        if (err.status) console.error("Status:", err.status);
        if (err.code) console.error("Code:", err.code);
        if (err.type) console.error("Type:", err.type);
        if (err.error) {
            console.error("Error details:", err.error);
        }
    }
}

main();
