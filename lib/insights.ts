// lib/insights.ts
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface InsightResult {
    summary: string;
    bulletPoints: string[];
    rawText: string;
}

export async function generateInsightsFromText(rawText: string): Promise<InsightResult> {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is not set");
    }

    const prompt = `
You are an assistant that converts OCR-extracted text into concise, useful insights.

Input text:
---
${rawText}
---

Return a JSON object with:
- "summary": 2-4 sentence plain-English summary of the content.
- "bulletPoints": 3-7 concise bullet points capturing key information.

Respond with ONLY valid JSON, no extra commentary.
`;

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a precise, JSON-only assistant." },
            { role: "user", content: prompt },
        ],
        temperature: 0.2,
    });

    const content = response.choices[0]?.message?.content ?? "{}";

    // Basic JSON parsing + fallback
    let parsed: any;
    try {
        parsed = JSON.parse(content);
    } catch {
        parsed = { summary: "", bulletPoints: [] };
    }

    return {
        summary: parsed.summary ?? "",
        bulletPoints: Array.isArray(parsed.bulletPoints) ? parsed.bulletPoints : [],
        rawText,
    };
}
