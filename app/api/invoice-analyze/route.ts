import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

// ─── Logger ──────────────────────────────────────────────────────────────────

type LogLevel = "info" | "warn" | "error";

function log(level: LogLevel, correlationId: string, stage: string, message: string, extra?: object) {
    const entry = {
        timestamp: new Date().toISOString(),
        level,
        correlationId,
        route: "invoice-analyze",
        stage,
        message,
        ...extra,
    };
    process.stdout.write(JSON.stringify(entry) + "\n");
}

function generateCorrelationId() {
    return `inv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── OpenAI Client ───────────────────────────────────────────────────────────

if (!process.env.OPENAI_API_KEY) {
    console.warn("[invoice-analyze] OPENAI_API_KEY is not set — AI features will use fallback");
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── Types ───────────────────────────────────────────────────────────────────

type InvoiceBody = {
    rawText?: string;
    invoice?: Record<string, unknown>;
    analysis?: Record<string, unknown>;
    question?: string;
};

// ─── Fallback ────────────────────────────────────────────────────────────────

const fallbackAnalysis = {
    deductibleStatus: "partial",
    reason: "Review line items to confirm business purpose. Mixed-use invoices can be partly deductible.",
    vatReclaimableAmount: "Check VAT line on invoice",
    category: "General Business Expense",
    ukAccountingCode: "400",
    warnings: ["Always keep a valid VAT invoice for HMRC records."],
    summary: "The invoice appears to be a business expense. Confirm private use and VAT eligibility before filing.",
};

// ─── Analysis ────────────────────────────────────────────────────────────────

async function generateStructuredAnalysis(
    rawText: string,
    invoice: Record<string, unknown>,
    correlationId: string
) {
    if (!process.env.OPENAI_API_KEY) {
        log("warn", correlationId, "analysis_skipped", "No OPENAI_API_KEY — returning fallback analysis");
        return fallbackAnalysis;
    }

    log("info", correlationId, "analysis_start", "Calling OpenAI for structured analysis", {
        rawTextLength: rawText.length,
        invoiceFieldCount: Object.keys(invoice).length,
    });

    const start = Date.now();

    try {
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

        const durationMs = Date.now() - start;
        const content = completion.choices[0]?.message?.content ?? "{}";

        log("info", correlationId, "analysis_openai_ok", "OpenAI responded", {
            durationMs,
            finishReason: completion.choices[0]?.finish_reason,
            contentLength: content.length,
        });

        try {
            const parsed = JSON.parse(content);
            log("info", correlationId, "analysis_parse_ok", "JSON parsed successfully");
            return {
                deductibleStatus: parsed.deductibleStatus === "fully" ? "fully" : "partial",
                reason: String(parsed.reason || fallbackAnalysis.reason),
                vatReclaimableAmount: String(parsed.vatReclaimableAmount || fallbackAnalysis.vatReclaimableAmount),
                category: String(parsed.category || fallbackAnalysis.category),
                ukAccountingCode: String(parsed.ukAccountingCode || fallbackAnalysis.ukAccountingCode),
                warnings: Array.isArray(parsed.warnings)
                    ? parsed.warnings.map((w: unknown) => String(w))
                    : fallbackAnalysis.warnings,
                summary: String(parsed.summary || fallbackAnalysis.summary),
            };
        } catch (parseError) {
            // THIS was silently swallowed before — now visible
            log("error", correlationId, "analysis_parse_fail", "Failed to parse OpenAI JSON response", {
                parseError: (parseError as Error).message,
                rawContent: content.slice(0, 500), // log first 500 chars to see what came back
            });
            return fallbackAnalysis;
        }
    } catch (openaiError) {
        log("error", correlationId, "analysis_openai_fail", "OpenAI API call failed", {
            durationMs: Date.now() - start,
            error: (openaiError as Error).message,
            errorName: (openaiError as Error).name,
        });
        return fallbackAnalysis;
    }
}

// ─── Q&A ─────────────────────────────────────────────────────────────────────

async function answerQuestion(
    input: {
        rawText: string;
        invoice: Record<string, unknown>;
        analysis?: Record<string, unknown>;
        question: string;
    },
    correlationId: string
) {
    if (!process.env.OPENAI_API_KEY) {
        log("warn", correlationId, "qa_skipped", "No OPENAI_API_KEY — returning fallback answer");
        return "I can't access AI right now. As a fallback, treat this as a business expense only if it was wholly and exclusively for work, and keep VAT evidence for HMRC.";
    }

    log("info", correlationId, "qa_start", "Calling OpenAI for Q&A", {
        questionLength: input.question.length,
    });

    const start = Date.now();

    try {
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

        log("info", correlationId, "qa_openai_ok", "OpenAI Q&A responded", {
            durationMs: Date.now() - start,
            finishReason: completion.choices[0]?.finish_reason,
        });

        return completion.choices[0]?.message?.content?.trim() || "I couldn't generate an answer.";
    } catch (openaiError) {
        log("error", correlationId, "qa_openai_fail", "OpenAI Q&A call failed", {
            durationMs: Date.now() - start,
            error: (openaiError as Error).message,
        });
        return "I couldn't generate an answer due to an error.";
    }
}

// ─── Route Handler ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    const correlationId = req.headers.get("x-correlation-id") ?? generateCorrelationId();
    const start = Date.now();

    log("info", correlationId, "request_received", "POST /api/invoice-analyze");

    try {
        const body = (await req.json()) as InvoiceBody;
        const rawText = body.rawText || "";
        const invoice = (body.invoice ?? {}) as Record<string, unknown>;

        log("info", correlationId, "request_parsed", "Request body parsed", {
            hasRawText: rawText.length > 0,
            rawTextLength: rawText.length,
            hasInvoice: Object.keys(invoice).length > 0,
            isQuestion: !!body.question,
        });

        if (body.question) {
            const answer = await answerQuestion(
                {
                    rawText,
                    invoice,
                    analysis: (body.analysis ?? {}) as Record<string, unknown>,
                    question: body.question,
                },
                correlationId
            );

            log("info", correlationId, "request_complete", "Q&A response sent", {
                durationMs: Date.now() - start,
            });

            return NextResponse.json({ answer }, {
                headers: { "x-correlation-id": correlationId },
            });
        }

        const analysis = await generateStructuredAnalysis(rawText, invoice, correlationId);

        log("info", correlationId, "request_complete", "Analysis response sent", {
            durationMs: Date.now() - start,
            deductibleStatus: analysis.deductibleStatus,
        });

        return NextResponse.json({ analysis }, {
            headers: { "x-correlation-id": correlationId },
        });

    } catch (error) {
        log("error", correlationId, "request_failed", "Unhandled error in route handler", {
            durationMs: Date.now() - start,
            error: (error as Error).message,
            stack: (error as Error).stack,
        });

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Unable to process invoice",
                correlationId, // ← return this so the client can reference it
            },
            {
                status: 500,
                headers: { "x-correlation-id": correlationId },
            }
        );
    }
}