'use client';

import { useState } from 'react';
import type { ProcessedInvoice } from '@/lib/invoice-journal/types';

export function OutputSelector({ data }: { data: ProcessedInvoice }) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const download = async (format: 'csv' | 'xero' | 'summary') => {
    setDownloading(format);
    try {
      const res = await fetch('/api/invoice-journal/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format, data }),
      });
      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const disposition = res.headers.get('Content-Disposition') || '';
      const filename = disposition.match(/filename="([^"]+)"/)?.[1] || `invoice-export.${format === 'summary' ? 'txt' : 'csv'}`;
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-semibold text-gray-900">Choose your output</h2>
      <p className="mb-5 text-sm text-slate-500">Download the result in the format that matches your bookkeeping workflow.</p>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { key: 'csv', title: 'Journal CSV', body: 'Simple debit/credit export for Excel or Google Sheets.' },
          { key: 'xero', title: 'Xero CSV', body: 'Invoice-line export in a Xero-friendly import format.' },
          { key: 'summary', title: 'Plain-English Summary', body: 'A readable explanation you can keep or send to your accountant.' },
        ].map((option) => (
          <button key={option.key} onClick={() => download(option.key as 'csv' | 'xero' | 'summary')} className="rounded-xl border border-slate-200 p-5 text-left hover:border-blue-300 hover:bg-blue-50">
            <p className="font-semibold text-slate-900">{option.title}</p>
            <p className="mt-2 text-sm text-slate-600">{option.body}</p>
            <p className="mt-4 text-sm font-medium text-blue-600">{downloading === option.key ? 'Preparing…' : 'Download →'}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
