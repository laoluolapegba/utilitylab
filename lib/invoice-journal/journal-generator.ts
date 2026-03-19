import type { ExtractedInvoice, JournalEntry, TaxAnalysis } from '@/lib/invoice-journal/types';

export function generateJournalEntries(invoice: ExtractedInvoice, analysis: TaxAnalysis): JournalEntry[] {
  const entries: JournalEntry[] = [];

  entries.push({
    date: invoice.invoiceDate,
    account: analysis.category,
    accountCode: analysis.accountCode,
    debit: analysis.deductibleAmount,
    memo: `${invoice.vendor} - ${invoice.invoiceNumber || 'Invoice'}`,
    reference: invoice.invoiceNumber || '',
  });

  if (analysis.vatReclaimAmount > 0) {
    entries.push({
      date: invoice.invoiceDate,
      account: 'VAT Input Tax',
      accountCode: '2201',
      debit: analysis.vatReclaimAmount,
      memo: `VAT reclaim on ${invoice.vendor}`,
      reference: invoice.invoiceNumber || '',
    });
  }

  const labourOnlyAmount = analysis.cisApplicable && analysis.cisRate
    ? Number((invoice.subtotal * (analysis.cisRate / 100)).toFixed(2))
    : 0;

  if (labourOnlyAmount > 0) {
    entries.push({
      date: invoice.invoiceDate,
      account: 'CIS Tax Withheld',
      accountCode: '2150',
      credit: labourOnlyAmount,
      memo: `CIS withheld at ${analysis.cisRate}%`,
      reference: invoice.invoiceNumber || '',
    });
  }

  const payable = Number((invoice.total - labourOnlyAmount).toFixed(2));
  entries.push({
    date: invoice.invoiceDate,
    account: 'Accounts Payable',
    accountCode: '2100',
    credit: payable,
    memo: `Invoice payable to ${invoice.vendor}`,
    reference: invoice.invoiceNumber || '',
  });

  return balanceEntries(entries);
}

function balanceEntries(entries: JournalEntry[]): JournalEntry[] {
  const totalDebit = entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
  const totalCredit = entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
  const diff = Number((totalDebit - totalCredit).toFixed(2));

  if (diff === 0) return entries;

  const payableIndex = entries.findIndex((entry) => entry.accountCode === '2100');
  if (payableIndex >= 0) {
    entries[payableIndex] = {
      ...entries[payableIndex],
      credit: Number(((entries[payableIndex].credit || 0) + diff).toFixed(2)),
    };
  }

  return entries;
}
