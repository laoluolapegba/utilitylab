import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type InvoiceBody = {
    rawText?: string;
    invoice?: Record<string, unknown>;
    analysis?: Record<string, unknown>;
    question?: string;
};

const fallbackAnalysis = {
    deductibleStatus: "partial",
    reason: "Review line items to confirm business purpose. Mixed-use invoices can be partly deductible.",
    vatReclaimableAmount: "Check VAT line on invoice",
    category: "General Business Expense",
    ukAccountingCode: "400",
    warnings: ["Always keep a valid VAT invoice for HMRC records."],
    summary: "The invoice appears to be a business expense. Confirm private use and VAT eligibility before filing.",
};

async function generateStructuredAnalysis(rawText: string, invoice: Record<string, unknown>) {
    if (!process.env.OPENAI_API_KEY) return fallbackAnalysis;

    const prompt = `You are a UK bookkeeping assistant for freelancers and contractors.
Given OCR text and extracted fields, return ONLY valid JSON:
{
  "deductibleStatus": "fully" | "partial",
  "reason": "plain english reason",
  "vatReclaimableAmount": "amount or guidance",
  "category": "expense category",
  "ukAccountingCode": "simple nominal/account code",
  "warnings": ["warning"],
  "summary": "2-3 sentence summary"
}
Consider UK VAT, sole trader rules, CIS context when relevant.

OCR text:\n${rawText.slice(0, 12000)}

Extracted fields:\n${JSON.stringify(invoice, null, 2)}
`;

    const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [
            { role: "system", content: "Respond with JSON only." },
            { role: "user", content: prompt },
        ],
    });

    const content = completion.choices[0]?.message?.content ?? "{}";

    try {
        const parsed = JSON.parse(content);
        return {
            deductibleStatus: parsed.deductibleStatus === "fully" ? "fully" : "partial",
            reason: String(parsed.reason || fallbackAnalysis.reason),
            vatReclaimableAmount: String(parsed.vatReclaimableAmount || fallbackAnalysis.vatReclaimableAmount),
            category: String(parsed.category || fallbackAnalysis.category),
            ukAccountingCode: String(parsed.ukAccountingCode || fallbackAnalysis.ukAccountingCode),
            warnings: Array.isArray(parsed.warnings) ? parsed.warnings.map((w: unknown) => String(w)) : fallbackAnalysis.warnings,
            summary: String(parsed.summary || fallbackAnalysis.summary),
        };
    } catch {
        return fallbackAnalysis;
    }
}

async function answerQuestion(input: { rawText: string; invoice: Record<string, unknown>; analysis?: Record<string, unknown>; question: string }) {
    if (!process.env.OPENAI_API_KEY) {
        return "I can't access AI right now. As a fallback, treat this as a business expense only if it was wholly and exclusively for work, and keep VAT evidence for HMRC.";
    }

    const prompt = `You are a UK tax explainer. Answer in plain English with practical guidance, not legal advice. Keep it under 120 words.
Question: ${input.question}

Invoice fields:\n${JSON.stringify(input.invoice, null, 2)}

Existing analysis:\n${JSON.stringify(input.analysis ?? {}, null, 2)}

OCR snippet:\n${input.rawText.slice(0, 8000)}
`;

    const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [{ role: "user", content: prompt }],
    });

    return completion.choices[0]?.message?.content?.trim() || "I couldn't generate an answer.";
}

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as InvoiceBody;
        const rawText = body.rawText || "";
        const invoice = (body.invoice ?? {}) as Record<string, unknown>;

        if (body.question) {
            const answer = await answerQuestion({
                rawText,
                invoice,
                analysis: (body.analysis ?? {}) as Record<string, unknown>,
                question: body.question,
            });
            return NextResponse.json({ answer });
        }

        const analysis = await generateStructuredAnalysis(rawText, invoice);
        return NextResponse.json({ analysis });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unable to process invoice" },
            { status: 500 }
        );
    }
}
