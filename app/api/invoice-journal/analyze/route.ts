import { NextRequest, NextResponse } from 'next/server';
import { buildAnalysisPrompt, buildJournalPrompt } from '@/lib/invoice-journal/prompts';
import { generateJournalEntries } from '@/lib/invoice-journal/journal-generator';
import type { ExtractedInvoice, JournalEntry, TaxAnalysis } from '@/lib/invoice-journal/types';
import { analyzeUkTax } from '@/lib/invoice-journal/uk-tax-analyzer';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { invoice } = (await req.json()) as { invoice: ExtractedInvoice };
    if (!invoice) {
      return NextResponse.json({ error: 'Missing invoice payload' }, { status: 400 });
    }

    let analysis = analyzeUkTax(invoice);
    let journalEntries = generateJournalEntries(invoice, analysis);

    if (process.env.ANTHROPIC_API_KEY) {
      analysis = await getClaudeAnalysis(invoice, analysis);
      journalEntries = await getClaudeJournalEntries(invoice, analysis, journalEntries);
    }

    return NextResponse.json({ success: true, data: { analysis, journalEntries } });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Analysis failed' }, { status: 500 });
  }
}

async function getClaudeAnalysis(invoice: ExtractedInvoice, fallback: TaxAnalysis): Promise<TaxAnalysis> {
  const response = await callAnthropic(buildAnalysisPrompt(invoice), 2000);
  if (!response) return fallback;

  try {
    const analysisJson = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return { ...fallback, ...(JSON.parse(analysisJson) as Partial<TaxAnalysis>) };
  } catch {
    return fallback;
  }
}

async function getClaudeJournalEntries(invoice: ExtractedInvoice, analysis: TaxAnalysis, fallback: JournalEntry[]): Promise<JournalEntry[]> {
  const response = await callAnthropic(buildJournalPrompt(invoice, analysis), 1500);
  if (!response) return fallback;

  try {
    const journalJson = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(journalJson) as JournalEntry[];
  } catch {
    return fallback;
  }
}

async function callAnthropic(prompt: string, maxTokens: number): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  return (data.content?.[0]?.text as string | undefined) ?? null;
}
