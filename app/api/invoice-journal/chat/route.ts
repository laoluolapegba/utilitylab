import { NextRequest, NextResponse } from 'next/server';
import { buildChatPrompt } from '@/lib/invoice-journal/prompts';
import type { ExtractedInvoice, TaxAnalysis } from '@/lib/invoice-journal/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { invoice, analysis, question } = (await req.json()) as {
      invoice: ExtractedInvoice;
      analysis: TaxAnalysis;
      question: string;
    };

    if (!invoice || !analysis || !question?.trim()) {
      return NextResponse.json({ error: 'Invoice, analysis, and question are required' }, { status: 400 });
    }

    const answer = await getAnswer(invoice, analysis, question.trim());
    return NextResponse.json({ success: true, data: { answer } });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Chat failed' }, { status: 500 });
  }
}

async function getAnswer(invoice: ExtractedInvoice, analysis: TaxAnalysis, question: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return `Based on this invoice, ${analysis.explanation} If your question changes the facts—for example whether it was personal, client entertainment, or mixed use—you should adjust the deductible amount before posting the journal.`;
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
      max_tokens: 800,
      messages: [{ role: 'user', content: buildChatPrompt(invoice, analysis, question) }],
    }),
  });

  if (!response.ok) {
    throw new Error('Unable to get answer from Anthropic');
  }

  const data = await response.json();
  return (data.content?.[0]?.text as string | undefined) || 'No answer returned.';
}
