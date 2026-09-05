import type { InvoiceExtraction } from "./schema";

// Keep in sync with CIS_KEYWORDS in vatRules.ts
const CIS_KEYWORDS = [
  "subcontractor",
  "labour",
  "labor",
  "construction",
  "groundwork",
  "scaffolding",
  "roofing",
];

const FINANCIAL_CATEGORIES = ["insurance", "finance"];

// Matches the last segment of an email's domain: user@host.tld or user@host.co.tld
const EMAIL_RE = /[\w.+\-]+@[\w\-]+(\.[a-z]{2,})+/gi;

// TLDs that suggest a non-UK foreign supplier when found in an email address
const FOREIGN_TLDS = new Set([".com", ".de", ".fr"]);

const UK_VAT_NUMBER = /^GB\d{9}$/;

export interface FlagContext {
  /** Pre-computed expense category label (e.g. "Software & Cloud", "Insurance") */
  category?: string;
  /** Previously processed invoices used to detect duplicates */
  priorInvoices?: Array<{ invoice_number: string; supplier_name: string }>;
}

/**
 * Generates contextual HMRC compliance warnings for a UK invoice.
 * Returns an array of human-readable flag strings — empty when nothing is
 * amiss. Runs entirely client-side; no API call required.
 */
export function generateFlags(
  invoice: InvoiceExtraction,
  context: FlagContext = {},
): string[] {
  const flags: string[] = [];

  // ── Rule 1: No VAT number but VAT charged ──────────────────────────────
  if (invoice.supplier_vat_number === null && invoice.vat_amount > 0) {
    flags.push(
      "No VAT number detected — cannot reclaim VAT without a valid VAT invoice.",
    );
  }

  // ── Rule 2: Foreign supplier ───────────────────────────────────────────
  // Triggers on a non-GB VAT number OR a foreign-TLD email in the raw text.
  const hasNonGBVat =
    invoice.supplier_vat_number !== null &&
    !UK_VAT_NUMBER.test(invoice.supplier_vat_number);

  const hasForeignEmail = (() => {
    const matches = invoice.raw_ocr_text.matchAll(EMAIL_RE);
    for (const [match] of matches) {
      // Extract the final dotted segment, e.g. ".com" from "acme@corp.com"
      const lastDot = match.lastIndexOf(".");
      if (lastDot !== -1) {
        const tld = match.slice(lastDot).toLowerCase();
        if (FOREIGN_TLDS.has(tld)) return true;
      }
    }
    return false;
  })();

  if (hasNonGBVat || hasForeignEmail) {
    flags.push(
      "Foreign supplier — check if reverse charge VAT applies.",
    );
  }

  // ── Rule 3: High-value invoice with no line items ──────────────────────
  if (invoice.total_amount > 250 && invoice.line_items.length === 0) {
    flags.push(
      "Invoices over £250 require line items for VAT reclaim (HMRC).",
    );
  }

  // ── Rule 4: CIS / construction keywords ───────────────────────────────
  const cisHaystack = [
    invoice.supplier_name,
    ...invoice.line_items.map((li) => li.description),
  ]
    .join(" ")
    .toLowerCase();

  if (CIS_KEYWORDS.some((kw) => cisHaystack.includes(kw))) {
    flags.push(
      "Possible CIS subcontractor — 20% withholding may apply.",
    );
  }

  // ── Rule 5: 20% VAT on exempt financial/insurance services ────────────
  if (
    invoice.vat_rate === 20 &&
    context.category &&
    FINANCIAL_CATEGORIES.some((fc) =>
      context.category!.toLowerCase().includes(fc),
    )
  ) {
    flags.push(
      "Financial services are usually VAT exempt — verify this charge with the supplier.",
    );
  }

  // ── Rule 6: 4-year VAT reclaim window ─────────────────────────────────
  if (invoice.invoice_date) {
    const invoiceDate = new Date(invoice.invoice_date);
    if (!Number.isNaN(invoiceDate.getTime())) {
      const fourYearsAgo = new Date();
      fourYearsAgo.setFullYear(fourYearsAgo.getFullYear() - 4);
      if (invoiceDate < fourYearsAgo) {
        flags.push(
          "VAT reclaim window may have expired (4-year rule) — confirm with your accountant before filing.",
        );
      }
    }
  }

  // ── Rule 7: Duplicate invoice number for same supplier ─────────────────
  if (
    invoice.invoice_number &&
    context.priorInvoices?.some(
      (prior) =>
        prior.invoice_number === invoice.invoice_number &&
        prior.supplier_name.toLowerCase() ===
          invoice.supplier_name.toLowerCase(),
    )
  ) {
    flags.push(
      `Possible duplicate invoice — ${invoice.supplier_name} has already submitted invoice #${invoice.invoice_number}.`,
    );
  }

  return flags;
}
