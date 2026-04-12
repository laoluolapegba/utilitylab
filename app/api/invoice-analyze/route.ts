import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createLogger, generateCorrelationId } from "@/lib/logger";
import { extractIdentity, checkAndRecord } from "@/lib/usageTracking";
import { InvoiceAnalyzeSchema } from "@/lib/apiSchemas";

export const runtime = "nodejs";

// ─── OpenAI Client ───────────────────────────────────────────────────────────

if (!process.env.OPENAI_API_KEY) {
    process.stdout.write(JSON.stringify({
        level: "warn",
        route: "invoice-analyze",
        stage: "module_init",
        message: "OPENAI_API_KEY is not set — AI features will use fallback",
        timestamp: new Date().toISOString(),
    }) + "\n");
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
    log: ReturnType<typeof createLogger>,
    requestStart: number,
) {
    if (!process.env.OPENAI_API_KEY) {
        log("analysis_skipped").warn("No OPENAI_API_KEY — returning fallback analysis", {
            durationMs: Date.now() - requestStart,
        });
        return fallbackAnalysis;
    }

    log("analysis_start").info("Calling OpenAI for structured analysis", {
        durationMs: Date.now() - requestStart,
        rawTextLength: rawText.length,
        invoiceFieldCount: Object.keys(invoice).length,
    });

    const callStart = Date.now();

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

        const content = completion.choices[0]?.message?.content ?? "{}";

        log("analysis_openai_ok").info("OpenAI responded", {
            durationMs: Date.now() - callStart,
            finishReason: completion.choices[0]?.finish_reason,
            contentLength: content.length,
        });

        try {
            const parsed = JSON.parse(content);
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
            log("analysis_parse_fail").error("Failed to parse OpenAI JSON response", {
                durationMs: Date.now() - callStart,
                error: parseError instanceof Error ? parseError : new Error(String(parseError)),
                rawContent: content.slice(0, 500),
            });
            return fallbackAnalysis;
        }
    } catch (openaiError) {
        log("analysis_openai_fail").error("OpenAI API call failed", {
            durationMs: Date.now() - callStart,
            error: openaiError instanceof Error ? openaiError : new Error(String(openaiError)),
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
    log: ReturnType<typeof createLogger>,
    requestStart: number,
) {
    if (!process.env.OPENAI_API_KEY) {
        log("qa_skipped").warn("No OPENAI_API_KEY — returning fallback answer", {
            durationMs: Date.now() - requestStart,
        });
        return "I can't access AI right now. As a fallback, treat this as a business expense only if it was wholly and exclusively for work, and keep VAT evidence for HMRC.";
    }

    log("qa_start").info("Calling OpenAI for Q&A", {
        durationMs: Date.now() - requestStart,
        questionLength: input.question.length,
    });

    const callStart = Date.now();

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

        log("qa_openai_ok").info("OpenAI Q&A responded", {
            durationMs: Date.now() - callStart,
            finishReason: completion.choices[0]?.finish_reason,
        });

        return completion.choices[0]?.message?.content?.trim() || "I couldn't generate an answer.";
    } catch (openaiError) {
        log("qa_openai_fail").error("OpenAI Q&A call failed", {
            durationMs: Date.now() - callStart,
            error: openaiError instanceof Error ? openaiError : new Error(String(openaiError)),
        });
        return "I couldn't generate an answer due to an error.";
    }
}

// ─── Route Handler ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    const correlationId = req.headers.get("x-correlation-id") ?? generateCorrelationId();
    const log = createLogger(correlationId);
    const requestStart = Date.now();

    log("request_received").info("POST /api/invoice-analyze", {
        durationMs: 0,
    });

    const { userId, anonId } = await extractIdentity(req);
    const { allowed, used, limit } = await checkAndRecord("invoice-parser", userId, anonId);
    if (!allowed) {
        return NextResponse.json({ upgradeRequired: true, used, limit }, { status: 429 });
    }

    // ── File-size gate (10 MB body limit) ────────────────────────────────────
    const contentLength = Number(req.headers.get("content-length") ?? 0);
    if (contentLength > 10_485_760) {
        return NextResponse.json(
            { error: "Request body exceeds the 10 MB limit.", code: "FILE_TOO_LARGE", correlationId },
            { status: 413, headers: { "x-correlation-id": correlationId } },
        );
    }

    try {
        const parsed = InvoiceAnalyzeSchema.safeParse(await req.json());
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message ?? "Invalid request", code: "VALIDATION_ERROR", correlationId },
                { status: 400, headers: { "x-correlation-id": correlationId } },
            );
        }
        const body = parsed.data as InvoiceBody;
        const rawText = body.rawText || "";
        const invoice = (body.invoice ?? {}) as Record<string, unknown>;

        log("request_parsed").info("Request body parsed", {
            durationMs: Date.now() - requestStart,
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
                log,
                requestStart,
            );

            log("request_complete").info("Q&A response sent", {
                durationMs: Date.now() - requestStart,
            });

            return NextResponse.json({ answer }, {
                headers: { "x-correlation-id": correlationId },
            });
        }

        const analysis = await generateStructuredAnalysis(rawText, invoice, log, requestStart);

        log("request_complete").info("Analysis response sent", {
            durationMs: Date.now() - requestStart,
            deductibleStatus: analysis.deductibleStatus,
        });

        return NextResponse.json({ analysis }, {
            headers: { "x-correlation-id": correlationId },
        });

    } catch (error) {
        log("request_failed").error("Unhandled error in route handler", {
            durationMs: Date.now() - requestStart,
            error: error instanceof Error ? error : new Error(String(error)),
        });

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Unable to process invoice",
                correlationId,
            },
            {
                status: 500,
                headers: { "x-correlation-id": correlationId },
            }
        );
    }
}
