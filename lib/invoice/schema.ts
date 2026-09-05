export interface InvoiceExtraction {
  supplier_name: string;
  /** UK VAT reg: GB + 9 digits */
  supplier_vat_number: string | null;
  invoice_number: string;
  /** ISO 8601 */
  invoice_date: string;
  due_date: string | null;
  /** default GBP */
  currency: string;
  subtotal: number;
  vat_amount: number;
  /** 0, 5, 20 or null if unknown */
  vat_rate: number | null;
  total_amount: number;
  line_items: Array<{
    description: string;
    quantity: number | null;
    unit_price: number | null;
    vat_rate: number | null;
    line_total: number;
  }>;
  extraction_confidence: {
    overall: "high" | "medium" | "low";
    per_field: Record<string, "high" | "medium" | "low" | "missing">;
  };
  raw_ocr_text: string;
}
