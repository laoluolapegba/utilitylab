import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createLogger, generateCorrelationId } from "@/lib/logger";
import { extractIdentity, checkAndRecord } from "@/lib/usageTracking";
import { InvoiceAnalyzeSchema } from "@/lib/apiSchemas";
import type { InvoiceExtraction } from "@/lib/invoice/schema";

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

const fallbackExtraction: InvoiceExtraction = {
    supplier_name: "",
    supplier_vat_number: null,
    invoice_number: "",
    invoice_date: "",
    due_date: null,
    currency: "GBP",
    subtotal: 0,
    vat_amount: 0,
    vat_rate: null,
    total_amount: 0,
    line_items: [],
    extraction_confidence: {
        overall: "low",
        per_field: {},
    },
    raw_ocr_text: "",
};

// ─── Extraction ───────────────────────────────────────────────────────────────

async function extractInvoice(
    rawText: string,
    log: ReturnType<typeof createLogger>,
    requestStart: number,
): Promise<InvoiceExtraction> {
    if (!process.env.OPENAI_API_KEY) {
        log("extraction_skipped").warn("No OPENAI_API_KEY — returning fallback extraction", {
            durationMs: Date.now() - requestStart,
        });
        return { ...fallbackExtraction, raw_ocr_text: rawText };
    }

    log("extraction_start").info("Calling OpenAI for invoice extraction", {
        durationMs: Date.now() - requestStart,
        rawTextLength: rawText.length,
    });

    const callStart = Date.now();

    const schemaDescription = `{
  "supplier_name": string,
  "supplier_vat_number": string | null,
  "invoice_number": string,
  "invoice_date": string,          // ISO 8601
  "due_date": string | null,
  "currency": string,              // default "GBP"
  "subtotal": number,
  "vat_amount": number,
  "vat_rate": number | null,       // 0, 5, or 20
  "total_amount": number,
  "line_items": [
    {
      "description": string,
      "quantity": number | null,
      "unit_price": number | null,
      "vat_rate": number | null,
      "line_total": number
    }
  ],
  "extraction_confidence": {
    "overall": "high" | "medium" | "low",
    "per_field": { [fieldName]: "high" | "medium" | "low" | "missing" }
  },
  "raw_ocr_text": string
}`;

    try {
        const completion = await client.chat.completions.create({
            model: "gpt-4o",
            temperature: 0,
            messages: [
                {
                    role: "system",
                    content:
                        "You are a UK invoice data extractor. " +
                        "Return ONLY valid JSON matching the schema exactly. " +
                        "For every field you are uncertain about, set its per_field confidence to 'low'. " +
                        "Missing fields are null, never invented. " +
                        "UK VAT numbers start with GB followed by 9 digits.",
                },
                {
                    role: "user",
                    content: `Extract all invoice fields from the OCR text below into this JSON schema:\n${schemaDescription}\n\nOCR text:\n${rawText.slice(0, 12000)}`,
                },
            ],
        });

        const content = completion.choices[0]?.message?.content ?? "{}";

        log("extraction_openai_ok").info("OpenAI extraction responded", {
            durationMs: Date.now() - callStart,
            finishReason: completion.choices[0]?.finish_reason,
            contentLength: content.length,
        });

        try {
            const parsed: InvoiceExtraction = JSON.parse(content);
            // Always attach the full raw text regardless of what the model returned
            parsed.raw_ocr_text = rawText;
            return parsed;
        } catch (parseError) {
            log("extraction_parse_fail").error("Failed to parse OpenAI JSON response", {
                durationMs: Date.now() - callStart,
                error: parseError instanceof Error ? parseError : new Error(String(parseError)),
                rawContent: content.slice(0, 500),
            });
            return { ...fallbackExtraction, raw_ocr_text: rawText };
        }
    } catch (openaiError) {
        log("extraction_openai_fail").error("OpenAI extraction call failed", {
            durationMs: Date.now() - callStart,
            error: openaiError instanceof Error ? openaiError : new Error(String(openaiError)),
        });
        return { ...fallbackExtraction, raw_ocr_text: rawText };
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
        const invoice = (body.invoice ?? {}) as Record<string, unknown>; // used by Q&A only

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

        const extraction = await extractInvoice(rawText, log, requestStart);

        log("request_complete").info("Extraction response sent", {
            durationMs: Date.now() - requestStart,
            confidence: extraction.extraction_confidence.overall,
        });

        return NextResponse.json({ extraction }, {
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
