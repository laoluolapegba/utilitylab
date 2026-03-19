'use client';

import { useState } from 'react';
import type { ExtractedInvoice, TaxAnalysis } from '@/lib/invoice-journal/types';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function QuestionChat({ invoice, analysis }: { invoice: ExtractedInvoice; analysis: TaxAnalysis }) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;
    const nextQuestion = question.trim();
    setMessages((prev) => [...prev, { role: 'user', content: nextQuestion }]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await fetch('/api/invoice-journal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice, analysis, question: nextQuestion }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to answer right now.');
      setMessages((prev) => [...prev, { role: 'assistant', content: data.data.answer }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: error instanceof Error ? error.message : 'Unable to answer right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-semibold text-gray-900">Ask a question about this invoice</h2>
      <p className="mb-5 text-sm text-slate-500">Try: “Can I still claim this if I also use it personally?” or “What if this was a client meal?”</p>
      <div className="space-y-3">
        {messages.length === 0 && <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">No questions yet. Ask anything about VAT, deductibility, or the journal treatment.</div>}
        {messages.map((message, index) => (
          <div key={index} className={`rounded-lg p-4 text-sm ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-700'}`}>
            <p className="mb-1 font-semibold">{message.role === 'user' ? 'You' : 'UtilityLab AI'}</p>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        <input value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && askQuestion()} placeholder="Ask a follow-up question" className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none ring-0 focus:border-blue-500" />
        <button onClick={askQuestion} disabled={loading} className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:bg-slate-400">{loading ? 'Thinking…' : 'Ask'}</button>
      </div>
    </div>
  );
}
