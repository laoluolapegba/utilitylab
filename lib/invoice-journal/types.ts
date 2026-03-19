export interface ExtractedInvoice {
  vendor: string;
  vendorAddress?: string | null;
  invoiceNumber?: string | null;
  invoiceDate: string;
  dueDate?: string | null;
  subtotal: number;
  vatAmount: number;
  vatRate: number;
  total: number;
  lineItems: LineItem[];
  currency: string;
  rawText: string;
  confidence: number | null;
}

export interface LineItem {
  description: string;
  quantity?: number | null;
  unitPrice?: number | null;
  netAmount: number;
  vatAmount?: number | null;
  vatRate?: number | null;
}

export interface TaxAnalysis {
  category: string;
  accountCode: string;
  deductibilityStatus: 'fully_deductible' | 'partially_deductible' | 'not_deductible';
  deductibleAmount: number;
  vatReclaimable: boolean;
  vatReclaimAmount: number;
  explanation: string;
  warnings: string[];
  cisApplicable: boolean;
  cisRate?: number | null;
}

export interface JournalEntry {
  date: string;
  account: string;
  accountCode: string;
  debit?: number;
  credit?: number;
  memo: string;
  reference: string;
}

export interface ProcessedInvoice {
  invoice: ExtractedInvoice;
  analysis: TaxAnalysis;
  journalEntries: JournalEntry[];
  generatedAt: string;
}
