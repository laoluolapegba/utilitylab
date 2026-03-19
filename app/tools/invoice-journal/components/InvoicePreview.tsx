import type { ExtractedInvoice } from '@/lib/invoice-journal/types';

export function InvoicePreview({ invoice }: { invoice: ExtractedInvoice }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Review extracted invoice</h2>
          <p className="text-sm text-gray-500">Check the details before generating journal entries.</p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">OCR confidence: {invoice.confidence ?? 'N/A'}</div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard label="Vendor" value={invoice.vendor} />
        <InfoCard label="Invoice number" value={invoice.invoiceNumber || 'N/A'} />
        <InfoCard label="Invoice date" value={invoice.invoiceDate} />
        <InfoCard label="Due date" value={invoice.dueDate || 'N/A'} />
        <InfoCard label="Subtotal" value={`£${invoice.subtotal.toFixed(2)}`} />
        <InfoCard label="VAT" value={`£${invoice.vatAmount.toFixed(2)} (${invoice.vatRate}%)`} />
        <InfoCard label="Total" value={`£${invoice.total.toFixed(2)}`} />
        <InfoCard label="Currency" value={invoice.currency} />
      </div>
      <div className="mt-6">
        <h3 className="mb-3 font-semibold text-gray-900">Line items</h3>
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Net</th>
                <th className="px-4 py-3">VAT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {invoice.lineItems.map((item, index) => (
                <tr key={`${item.description}-${index}`}>
                  <td className="px-4 py-3">{item.description}</td>
                  <td className="px-4 py-3">{item.quantity ?? 1}</td>
                  <td className="px-4 py-3">£{item.netAmount.toFixed(2)}</td>
                  <td className="px-4 py-3">{item.vatAmount ? `£${item.vatAmount.toFixed(2)}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="mb-1 text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="font-medium text-slate-900">{value}</p>
    </div>
  );
}
