import { NextRequest, NextResponse } from 'next/server';
import { extractInvoiceText } from '@/lib/invoice-journal/ocr-wrapper';
import { buildExtractionPrompt } from '@/lib/invoice-journal/prompts';
import type { ExtractedInvoice } from '@/lib/invoice-journal/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ocrResult = await extractInvoiceText(buffer, 'textract');

    const extracted = await structureInvoiceWithClaude(ocrResult.rawText);
    extracted.rawText = ocrResult.rawText;
    extracted.confidence = ocrResult.confidence;

    return NextResponse.json({ success: true, data: extracted });
  } catch (error) {
    console.error('Extract error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Extraction failed' }, { status: 500 });
  }
}

async function structureInvoiceWithClaude(rawOcrText: string): Promise<ExtractedInvoice> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return buildFallbackExtraction(rawOcrText);
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: buildExtractionPrompt(rawOcrText) }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Anthropic extraction failed: ${text}`);
  }

  const data = await response.json();
  const content = data.content?.[0]?.text as string | undefined;
  if (!content) {
    throw new Error('Anthropic extraction returned no content');
  }

  const jsonText = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return normalizeInvoice(JSON.parse(jsonText) as Partial<ExtractedInvoice>, rawOcrText);
}

function buildFallbackExtraction(rawOcrText: string): ExtractedInvoice {
  const lines = rawOcrText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const vendor = lines[0] || 'Unknown Vendor';
  const invoiceNumber = rawOcrText.match(/(?:invoice\s*(?:number|no\.?|#)\s*[:\-]?\s*)([A-Z0-9\-\/]+)/i)?.[1] || null;
  const invoiceDate = rawOcrText.match(/(20\d{2}-\d{2}-\d{2}|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/)?.[1] || new Date().toISOString().slice(0, 10);
  const total = parseMoney(rawOcrText.match(/total\s*(?:due|amount)?\s*[:\-]?\s*[£$]?\s?([\d,.]+)/i)?.[1]);
  const vatAmount = parseMoney(rawOcrText.match(/vat\s*(?:amount)?\s*[:\-]?\s*[£$]?\s?([\d,.]+)/i)?.[1]);
  const subtotal = total > 0 ? Number((total - vatAmount).toFixed(2)) : 0;

  return {
    vendor,
    vendorAddress: null,
    invoiceNumber,
    invoiceDate: normalizeDate(invoiceDate),
    dueDate: null,
    subtotal,
    vatAmount,
    vatRate: vatAmount > 0 && subtotal > 0 ? Number(((vatAmount / subtotal) * 100).toFixed(2)) : 0,
    total,
    lineItems: [{ description: 'General expense', quantity: 1, unitPrice: subtotal, netAmount: subtotal, vatAmount, vatRate: vatAmount > 0 ? 20 : 0 }],
    currency: 'GBP',
    rawText: rawOcrText,
    confidence: null,
  };
}

function normalizeInvoice(payload: Partial<ExtractedInvoice>, rawOcrText: string): ExtractedInvoice {
  const subtotal = Number(payload.subtotal || 0);
  const vatAmount = Number(payload.vatAmount || 0);
  const total = Number(payload.total || subtotal + vatAmount);

  return {
    vendor: payload.vendor || 'Unknown Vendor',
    vendorAddress: payload.vendorAddress ?? null,
    invoiceNumber: payload.invoiceNumber ?? null,
    invoiceDate: normalizeDate(payload.invoiceDate),
    dueDate: payload.dueDate ? normalizeDate(payload.dueDate) : null,
    subtotal,
    vatAmount,
    vatRate: Number(payload.vatRate || 0),
    total,
    lineItems: (payload.lineItems || []).map((item) => ({
      description: item.description || 'Item',
      quantity: item.quantity ?? 1,
      unitPrice: item.unitPrice ?? item.netAmount ?? 0,
      netAmount: Number(item.netAmount || 0),
      vatAmount: item.vatAmount ?? null,
      vatRate: item.vatRate ?? null,
    })),
    currency: payload.currency || 'GBP',
    rawText: rawOcrText,
    confidence: null,
  };
}

function parseMoney(value?: string | null): number {
  const cleaned = value?.replace(/[^\d.-]/g, '') || '';
  const amount = Number.parseFloat(cleaned);
  return Number.isFinite(amount) ? amount : 0;
}

function normalizeDate(value?: string | null): string {
  if (!value) return new Date().toISOString().slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString().slice(0, 10) : date.toISOString().slice(0, 10);
}
