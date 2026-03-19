import type { ExtractedInvoice, TaxAnalysis } from '@/lib/invoice-journal/types';

const CATEGORY_RULES = [
  { match: /(paper|printer|office|stationery|ink|notebook|amazon basics)/i, category: 'Office Supplies', accountCode: '7400' },
  { match: /(accountant|legal|solicitor|consult|software|subscription|hosting|domain)/i, category: 'Professional Services', accountCode: '7200' },
  { match: /(train|taxi|uber|flight|hotel|travel|parking|fuel)/i, category: 'Travel', accountCode: '7300' },
  { match: /(laptop|computer|monitor|phone|equipment|tool)/i, category: 'Equipment', accountCode: '7600' },
  { match: /(meal|restaurant|entertainment|hospitality|dinner|lunch)/i, category: 'Entertainment', accountCode: '7550' },
  { match: /(construction|subcontract|labour|labor|cis|building|site)/i, category: 'Construction Costs', accountCode: '5000' },
];

export function analyzeUkTax(invoice: ExtractedInvoice): TaxAnalysis {
  const text = `${invoice.vendor} ${invoice.rawText} ${invoice.lineItems.map((item) => item.description).join(' ')}`;
  const matched = CATEGORY_RULES.find((rule) => rule.match.test(text));
  const category = matched?.category ?? 'General Business Expense';
  const accountCode = matched?.accountCode ?? '7000';

  const isEntertainment = category === 'Entertainment';
  const cisApplicable = /\bcis\b|construction industry scheme|subcontract/i.test(text);
  const cisRate = /30\s?%/.test(text) ? 30 : cisApplicable ? 20 : null;
  const deductibleAmount = isEntertainment ? Number((invoice.subtotal * 0.5).toFixed(2)) : invoice.subtotal;
  const deductibilityStatus = isEntertainment ? 'partially_deductible' : 'fully_deductible';
  const vatReclaimable = invoice.vatAmount > 0 && !/mileage/i.test(text);
  const vatReclaimAmount = vatReclaimable ? invoice.vatAmount : 0;
  const warnings: string[] = [];

  if (!invoice.invoiceNumber) warnings.push('Invoice number was not confidently detected; double-check before posting.');
  if (!invoice.vendorAddress) warnings.push('Supplier address was not clearly captured from OCR.');
  if (invoice.confidence !== null && invoice.confidence < 75) warnings.push('OCR confidence is low, so review the extracted amounts carefully.');
  if (isEntertainment) warnings.push('Business entertainment often has limited tax deductibility; confirm the business purpose and attendees.');
  if (cisApplicable) warnings.push('Check whether labour and materials need to be split before applying the CIS deduction.');

  const explanation = isEntertainment
    ? `This looks like entertainment or meals. That usually is not fully deductible for UK tax, so I have treated only part of the net cost as deductible. VAT recovery can also depend on who attended and the business purpose.`
    : `This looks like a normal business expense in the ${category} category. The net cost should usually reduce your taxable profit, and the VAT can normally be reclaimed if you are VAT registered and the invoice is valid.`;

  return {
    category,
    accountCode,
    deductibilityStatus,
    deductibleAmount,
    vatReclaimable,
    vatReclaimAmount,
    explanation,
    warnings,
    cisApplicable,
    cisRate,
  };
}
