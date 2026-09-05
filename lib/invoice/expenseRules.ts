import type { InvoiceExtraction } from "./schema";

export interface ExpenseCategory {
  category: string;
  /** UK nominal ledger code */
  code: string;
  /** true = matched by keyword; false = AI categorisation needed */
  matched: boolean;
}

const CATEGORY_RULES: Array<{
  keywords: string[];
  category: string;
  code: string;
}> = [
  {
    keywords: ["aws", "azure", "google cloud", "hosting", "domain"],
    category: "Software & Cloud",
    code: "7600",
  },
  {
    keywords: ["train", "rail", "uber", "taxi", "flight", "hotel"],
    category: "Travel",
    code: "7400",
  },
  {
    keywords: [
      "microsoft",
      "adobe",
      "saas",
      "subscription",
      "software",
    ],
    category: "Software",
    code: "7600",
  },
  {
    keywords: ["electricity", "gas", "water", "broadband", "phone"],
    category: "Utilities",
    code: "7200",
  },
  {
    keywords: ["accountant", "solicitor", "legal", "consultant"],
    category: "Professional Services",
    code: "7800",
  },
  {
    keywords: ["office", "stationery", "supplies", "amazon"],
    category: "Office Supplies",
    code: "7500",
  },
];

/**
 * Attempts to categorise an invoice by keyword matching against the supplier
 * name and line item descriptions. Returns matched: false when no rule fires,
 * signalling that AI categorisation should be used instead.
 */
export function categoriseExpense(invoice: InvoiceExtraction): ExpenseCategory {
  const haystack = [
    invoice.supplier_name,
    ...invoice.line_items.map((li) => li.description),
  ]
    .join(" ")
    .toLowerCase();

  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => haystack.includes(kw))) {
      return { category: rule.category, code: rule.code, matched: true };
    }
  }

  return { category: "", code: "", matched: false };
}
