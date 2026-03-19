import type { ExtractedInvoice, JournalEntry } from '@/lib/invoice-journal/types';

export function JournalEntriesDisplay({ entries, invoice }: { entries: JournalEntry[]; invoice: ExtractedInvoice }) {
  const totalDebit = entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
  const totalCredit = entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Journal entries</h2>
          <p className="text-sm text-slate-500">Balanced entries for invoice {invoice.invoiceNumber || 'N/A'}.</p>
        </div>
        <div className={`rounded-full px-3 py-1 text-sm ${totalDebit === totalCredit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {totalDebit === totalCredit ? 'Balanced' : 'Review needed'}
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Debit</th>
              <th className="px-4 py-3">Credit</th>
              <th className="px-4 py-3">Memo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {entries.map((entry, index) => (
              <tr key={`${entry.accountCode}-${index}`}>
                <td className="px-4 py-3 font-medium text-slate-900">{entry.account}</td>
                <td className="px-4 py-3">{entry.accountCode}</td>
                <td className="px-4 py-3">{entry.debit ? `£${entry.debit.toFixed(2)}` : '—'}</td>
                <td className="px-4 py-3">{entry.credit ? `£${entry.credit.toFixed(2)}` : '—'}</td>
                <td className="px-4 py-3 text-slate-600">{entry.memo}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 font-semibold text-slate-900">
            <tr>
              <td className="px-4 py-3" colSpan={2}>Totals</td>
              <td className="px-4 py-3">£{totalDebit.toFixed(2)}</td>
              <td className="px-4 py-3">£{totalCredit.toFixed(2)}</td>
              <td className="px-4 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
