import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import type { ExtractedInvoice, TaxAnalysis } from '@/lib/invoice-journal/types';

interface ExplanationCardProps {
  analysis: TaxAnalysis;
  invoice: ExtractedInvoice;
}

export function ExplanationCard({ analysis, invoice }: ExplanationCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">💡 What&apos;s reclaimable</h2>
      <p className="mb-5 text-sm text-slate-500">Invoice total: £{invoice.total.toFixed(2)} from {invoice.vendor}</p>
      <div className="mb-6">
        {analysis.deductibilityStatus === 'fully_deductible' && <Badge color="green" icon={<CheckCircle className="h-5 w-5" />} label="Fully Deductible" />}
        {analysis.deductibilityStatus === 'partially_deductible' && <Badge color="yellow" icon={<AlertCircle className="h-5 w-5" />} label="Partially Deductible" />}
        {analysis.deductibilityStatus === 'not_deductible' && <Badge color="red" icon={<AlertCircle className="h-5 w-5" />} label="Not Deductible" />}
      </div>
      <p className="mb-6 leading-relaxed text-gray-700">{analysis.explanation}</p>
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Metric label="Category" value={analysis.category} />
        <Metric label="Deductible Amount" value={`£${analysis.deductibleAmount.toFixed(2)}`} />
        <Metric label="VAT Reclaimable" value={analysis.vatReclaimable ? `£${analysis.vatReclaimAmount.toFixed(2)}` : 'No'} />
        <Metric label="Account Code" value={analysis.accountCode} />
      </div>
      {analysis.warnings.length > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
            <div>
              <p className="mb-2 font-medium text-yellow-900">Things to note</p>
              <ul className="space-y-1 text-sm text-yellow-800">
                {analysis.warnings.map((warning, idx) => <li key={idx}>• {warning}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
      {analysis.cisApplicable && (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          <strong>CIS deduction:</strong> This invoice appears subject to CIS at {analysis.cisRate}%.
        </div>
      )}
    </div>
  );
}

function Badge({ color, icon, label }: { color: 'green' | 'yellow' | 'red'; icon: React.ReactNode; label: string }) {
  const styles = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  };
  return <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${styles[color]}`}>{icon}<span className="font-medium">{label}</span></div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-gray-50 p-4"><p className="mb-1 text-xs text-gray-500">{label}</p><p className="font-semibold text-gray-900">{value}</p></div>;
}
