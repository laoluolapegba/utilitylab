'use client';

import { useEffect, useState } from 'react';
import UsageLimitGate from '@/components/UsageLimitGate';
import { getUsageLimitState, recordAnonymousUsage, type UsageLimitState } from '@/lib/usageLimits';
import type { ExtractedInvoice, JournalEntry, ProcessedInvoice, TaxAnalysis } from '@/lib/invoice-journal/types';
import { UploadZone } from '../components/UploadZone';
import { InvoicePreview } from '../components/InvoicePreview';
import { ExplanationCard } from '../components/ExplanationCard';
import { JournalEntriesDisplay } from '../components/JournalEntriesDisplay';
import { OutputSelector } from '../components/OutputSelector';
import { QuestionChat } from '../components/QuestionChat';

const MAX_MB = 10;
type Step = 'upload' | 'preview' | 'results';

export default function ProcessInvoicePage() {
  const [step, setStep] = useState<Step>('upload');
  const [processing, setProcessing] = useState(false);
  const [invoice, setInvoice] = useState<ExtractedInvoice | null>(null);
  const [analysis, setAnalysis] = useState<TaxAnalysis | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [error, setError] = useState('');
  const [usage, setUsage] = useState<UsageLimitState>({ loading: true, isAuthenticated: false, usedToday: 0, limit: 3, remaining: 3, limitReached: false });

  useEffect(() => {
    getUsageLimitState().then(setUsage);
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!usage.isAuthenticated && usage.limitReached) {
      setError('Daily free limit reached. Please sign up to continue.');
      return;
    }

    if (!['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setError('Please upload a PDF, PNG, or JPG file.');
      return;
    }

    if (file.size > MAX_MB * 1024 * 1024) {
      setError('File must be 10MB or smaller.');
      return;
    }

    if (!usage.isAuthenticated) {
      const next = await recordAnonymousUsage();
      setUsage(next);
    }

    setProcessing(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const extractRes = await fetch('/api/invoice-journal/extract', {
        method: 'POST',
        body: formData,
      });
      const extractData = await extractRes.json();

      if (!extractRes.ok) {
        throw new Error(extractData.error || 'Failed to extract invoice data');
      }

      setInvoice(extractData.data);
      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setProcessing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!invoice) return;

    setProcessing(true);
    setError('');

    try {
      const analyzeRes = await fetch('/api/invoice-journal/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice }),
      });
      const analyzeData = await analyzeRes.json();

      if (!analyzeRes.ok) {
        throw new Error(analyzeData.error || 'Failed to analyze invoice');
      }

      setAnalysis(analyzeData.data.analysis);
      setJournalEntries(analyzeData.data.journalEntries);
      setStep('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setStep('upload');
    setInvoice(null);
    setAnalysis(null);
    setJournalEntries([]);
    setError('');
  };

  const processedInvoice: ProcessedInvoice | null = invoice && analysis
    ? { invoice, analysis, journalEntries, generatedAt: new Date().toISOString() }
    : null;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Invoice to Journal Entries</h1>
          <p className="text-gray-600">Upload an invoice → get journal entries, VAT guidance, and plain-English tax explanations.</p>
          {!usage.loading && !usage.isAuthenticated && (
            <p className="mt-3 text-xs text-slate-500">Free usage: {usage.usedToday}/{usage.limit} used today across all tools.</p>
          )}
        </div>

        {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

        {!usage.loading && !usage.isAuthenticated && usage.limitReached && step === 'upload' && (
          <div className="mb-6"><UsageLimitGate /></div>
        )}

        {step === 'upload' && <UploadZone onUpload={handleFileUpload} isProcessing={processing} />}

        {step === 'preview' && invoice && (
          <div className="space-y-6">
            <InvoicePreview invoice={invoice} />
            <div className="flex gap-4">
              <button onClick={handleReset} className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">Start Over</button>
              <button onClick={handleAnalyze} disabled={processing} className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400">
                {processing ? 'Analyzing...' : 'Analyze & Generate Entries →'}
              </button>
            </div>
          </div>
        )}

        {step === 'results' && invoice && analysis && processedInvoice && (
          <div className="space-y-8">
            <ExplanationCard analysis={analysis} invoice={invoice} />
            <JournalEntriesDisplay entries={journalEntries} invoice={invoice} />
            <OutputSelector data={processedInvoice} />
            <QuestionChat invoice={invoice} analysis={analysis} />
            <div className="text-center">
              <button onClick={handleReset} className="text-blue-600 hover:underline">Process Another Invoice</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
