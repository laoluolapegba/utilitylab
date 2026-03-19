import type { ExtractedInvoice, TaxAnalysis } from '@/lib/invoice-journal/types';

export function buildExtractionPrompt(rawOcrText: string): string {
  return `Extract invoice details from this OCR text. Return ONLY valid JSON with no markdown formatting.

OCR Text:
${rawOcrText}

Extract these fields:
{
  "vendor": "Company name",
  "vendorAddress": "Full address if present",
  "invoiceNumber": "INV-12345",
  "invoiceDate": "YYYY-MM-DD",
  "dueDate": "YYYY-MM-DD or null",
  "subtotal": 100.00,
  "vatAmount": 20.00,
  "vatRate": 20,
  "total": 120.00,
  "lineItems": [
    {
      "description": "Item description",
      "quantity": 2,
      "unitPrice": 50.00,
      "netAmount": 100.00,
      "vatAmount": 20.00,
      "vatRate": 20
    }
  ],
  "currency": "GBP"
}

Rules:
- All amounts as numbers (not strings)
- Dates in YYYY-MM-DD format
- If VAT not shown, use vatAmount: 0, vatRate: 0
- If unclear, use null
- UK invoices typically have 20% VAT`;
}

export function buildAnalysisPrompt(invoice: ExtractedInvoice): string {
  return `You are a UK tax and accounting expert for sole traders and freelancers.

Analyze this invoice and provide tax guidance:

Vendor: ${invoice.vendor}
Date: ${invoice.invoiceDate}
Total: £${invoice.total}
VAT: £${invoice.vatAmount}
Items:
${invoice.lineItems.map(item => `- ${item.description}: £${item.netAmount}`).join('\n')}

UK Tax Rules:
- Standard VAT rate: 20%
- Most business expenses are fully deductible
- Entertainment/meals: Only 50% deductible if >£40/head per person
- Mileage claims (45p/mile) exclude fuel VAT reclaim
- CIS (Construction Industry Scheme): 20% or 30% deduction for subcontractors
- Use UK standard chart of accounts codes

Provide analysis as JSON:
{
  "category": "Office Supplies|Travel|Professional Services|Equipment|etc",
  "accountCode": "7400",
  "deductibilityStatus": "fully_deductible|partially_deductible|not_deductible",
  "deductibleAmount": 100.00,
  "vatReclaimable": true,
  "vatReclaimAmount": 20.00,
  "explanation": "Plain English explanation: This is office supplies which are 100% tax deductible for your business. You can reclaim the £20 VAT on your next VAT return if you're VAT registered. This will reduce your taxable profit by £100.",
  "warnings": ["Array of any warnings, e.g., 'Keep receipt for HMRC compliance'"],
  "cisApplicable": false,
  "cisRate": null
}

Be specific and helpful. Explain WHY things are/aren't deductible.`;
}

export function buildJournalPrompt(invoice: ExtractedInvoice, analysis: TaxAnalysis): string {
  return `Generate double-entry journal entries for this invoice.

Invoice: ${invoice.vendor} - £${invoice.total}
Category: ${analysis.category}
Date: ${invoice.invoiceDate}
VAT reclaimable: £${analysis.vatReclaimAmount}
Deductible: £${analysis.deductibleAmount}

Return JSON array of journal entries:
[
  {
    "date": "${invoice.invoiceDate}",
    "account": "${analysis.category}",
    "accountCode": "${analysis.accountCode}",
    "debit": ${analysis.deductibleAmount},
    "memo": "${invoice.vendor} - ${invoice.invoiceNumber || 'Invoice'}",
    "reference": "${invoice.invoiceNumber || ''}"
  },
  {
    "date": "${invoice.invoiceDate}",
    "account": "VAT Input Tax",
    "accountCode": "2201",
    "debit": ${analysis.vatReclaimAmount},
    "memo": "VAT reclaim",
    "reference": "${invoice.invoiceNumber || ''}"
  },
  {
    "date": "${invoice.invoiceDate}",
    "account": "Accounts Payable",
    "accountCode": "2100",
    "credit": ${invoice.total},
    "memo": "Invoice payable to ${invoice.vendor}",
    "reference": "${invoice.invoiceNumber || ''}"
  }
]

Ensure debits = credits (must balance).`;
}

export function buildChatPrompt(invoice: ExtractedInvoice, analysis: TaxAnalysis, question: string): string {
  return `You are helping a UK sole trader understand one invoice in plain English.

Invoice vendor: ${invoice.vendor}
Invoice date: ${invoice.invoiceDate}
Invoice total: £${invoice.total}
VAT amount: £${invoice.vatAmount}
Tax analysis category: ${analysis.category}
Deductibility status: ${analysis.deductibilityStatus}
VAT reclaimable: ${analysis.vatReclaimable ? `Yes (£${analysis.vatReclaimAmount})` : 'No'}
Existing explanation: ${analysis.explanation}
Warnings: ${analysis.warnings.join('; ') || 'None'}

User question: ${question}

Answer in plain English for a non-accountant. Mention uncertainty when facts depend on missing context. Keep it concise but practical.`;
}
