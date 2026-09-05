import type { InvoiceExtraction } from "./schema";

export type VATTreatment =
  | "standard"
  | "zero_rated"
  | "exempt"
  | "reverse_charge"
  | "outside_scope"
  | "unknown";

export interface VATClassification {
  treatment: VATTreatment;
  reclaimable: boolean;
  reclaimableAmount: number;
  flags: string[];
  confidence: "high" | "medium" | "low";
  reasoning: string;
}

const UK_VAT_NUMBER = /^GB\d{9}$/;

const CIS_KEYWORDS = [
  "subcontractor",
  "labour",
  "labor",
  "construction",
  "groundwork",
  "scaffolding",
  "roofing",
];

/** Returns true if any line item description (or the supplier name) contains a CIS keyword. */
function hasCISKeyword(invoice: InvoiceExtraction): boolean {
  const haystack = [
    invoice.supplier_name,
    ...invoice.line_items.map((li) => li.description),
  ]
    .join(" ")
    .toLowerCase();

  return CIS_KEYWORDS.some((kw) => haystack.includes(kw));
}

/**
 * Classifies the VAT treatment for a UK invoice and determines
 * whether input tax is reclaimable, based on concrete HMRC rules.
 */
export function classifyVAT(invoice: InvoiceExtraction): VATClassification {
  const flags: string[] = [];
  let treatment: VATTreatment = "standard";
  let reclaimable = true;
  let confidence: "high" | "medium" | "low" = "high";
  let reasoning = "";

  // ── Rule 7: CIS / construction sector flag ──────────────────────────────
  // Check early so it appears in flags regardless of other rules.
  if (hasCISKeyword(invoice)) {
    flags.push(
      "CIS indicator: invoice may relate to construction services. " +
        "Verify whether the domestic reverse charge applies (effective 1 Mar 2021).",
    );
  }

  // ── Rule 3 + Rule 1: Foreign VAT number = potential reverse charge ───────
  if (
    invoice.supplier_vat_number !== null &&
    !UK_VAT_NUMBER.test(invoice.supplier_vat_number)
  ) {
    treatment = "reverse_charge";
    reclaimable = true; // buyer accounts for VAT; can reclaim on same return
    confidence = "medium";
    reasoning =
      "Supplier VAT number is not in UK format (GB + 9 digits). " +
      "If this is a cross-border B2B supply, the domestic reverse charge may apply — " +
      "you account for VAT and reclaim it on the same return.";
    flags.push(
      `Foreign VAT number detected (${invoice.supplier_vat_number}). ` +
        "Confirm whether reverse charge applies before filing.",
    );
    // Still apply remaining checks for additional flags.
  }

  // ── Rule 1: VAT charged but supplier has no VAT number ──────────────────
  if (invoice.supplier_vat_number === null && invoice.vat_amount > 0) {
    treatment = "outside_scope";
    reclaimable = false;
    confidence = "high";
    reasoning =
      "Supplier has no VAT registration number but has charged VAT. " +
      "HMRC does not allow input tax reclaim on invoices from unregistered suppliers. " +
      "This may also indicate a fraudulent charge.";
    flags.push(
      "VAT charged by an unregistered supplier — input tax is NOT reclaimable. " +
        "Contact the supplier or report to HMRC if suspected fraud.",
    );
    return {
      treatment,
      reclaimable,
      reclaimableAmount: 0,
      flags,
      confidence,
      reasoning,
    };
  }

  // ── Rule 2: UK-registered supplier — standard rules apply ───────────────
  if (
    invoice.supplier_vat_number !== null &&
    UK_VAT_NUMBER.test(invoice.supplier_vat_number)
  ) {
    // Override any reverse-charge assumption set above.
    if (treatment === "reverse_charge") {
      treatment = "standard";
      confidence = "high";
      reasoning = "";
      // Remove the foreign-number flag — number is actually UK format.
      flags.splice(
        flags.findIndex((f) => f.startsWith("Foreign VAT number")),
        1,
      );
    }
    reasoning =
      "Supplier is UK VAT-registered. Standard input tax rules apply.";
  }

  // ── Rule 4: Zero-rated supply ────────────────────────────────────────────
  if (invoice.vat_rate === 0) {
    treatment = "zero_rated";
    reclaimable = false;
    reasoning =
      "VAT rate is 0%. This is a zero-rated supply — taxable but at 0%. " +
      "No VAT has been charged so there is nothing to reclaim, but the supply " +
      "is not exempt (the supplier can still recover their own input tax).";
    flags.push(
      "Zero-rated supply: no input VAT to reclaim. Do not confuse with exempt supplies.",
    );
    return {
      treatment,
      reclaimable,
      reclaimableAmount: 0,
      flags,
      confidence,
      reasoning,
    };
  }

  // ── Rule 5: No VAT amount and no VAT rate = genuinely unknown ───────────
  if (invoice.vat_amount === 0 && invoice.vat_rate === null) {
    treatment = "unknown";
    reclaimable = false;
    confidence = "low";
    reasoning =
      "No VAT amount and no VAT rate could be determined. " +
      "The supply may be exempt, outside scope, or the invoice may be incomplete.";
    flags.push(
      "VAT treatment unclear — review the invoice manually before filing.",
    );
    return {
      treatment,
      reclaimable,
      reclaimableAmount: 0,
      flags,
      confidence,
      reasoning,
    };
  }

  // ── Rule 6: Simplified invoice (total < £250, no line items) ────────────
  const isSimplified =
    invoice.total_amount < 250 && invoice.line_items.length === 0;
  if (isSimplified) {
    flags.push(
      "Simplified invoice rules apply (total under £250, no line items). " +
        "You may reclaim VAT without a full VAT invoice, but keep this document as evidence.",
    );
    confidence = confidence === "high" ? "medium" : confidence;
  }

  // ── Final reclaimable amount ─────────────────────────────────────────────
  const reclaimableAmount = reclaimable ? invoice.vat_amount : 0;

  if (reasoning === "") {
    reasoning =
      "Standard UK VAT rules apply. Input tax is reclaimable subject to normal business-use conditions.";
  }

  return {
    treatment,
    reclaimable,
    reclaimableAmount,
    flags,
    confidence,
    reasoning,
  };
}
