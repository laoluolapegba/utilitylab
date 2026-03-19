import { NextRequest, NextResponse } from 'next/server';
import { generateCSV, generateSummary, generateXeroCSV } from '@/lib/invoice-journal/export-formatters';
import type { ProcessedInvoice } from '@/lib/invoice-journal/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { format, data } = (await req.json()) as {
      format: 'csv' | 'xero' | 'summary';
      data: ProcessedInvoice;
    };

    let output: string;
    let filename: string;
    let contentType: string;

    switch (format) {
      case 'csv':
        output = generateCSV(data);
        filename = `journal-${data.invoice.invoiceNumber || 'entry'}-${Date.now()}.csv`;
        contentType = 'text/csv';
        break;
      case 'xero':
        output = generateXeroCSV(data);
        filename = `xero-${data.invoice.invoiceNumber || 'import'}-${Date.now()}.csv`;
        contentType = 'text/csv';
        break;
      case 'summary':
        output = generateSummary(data);
        filename = `summary-${data.invoice.invoiceNumber || 'invoice'}-${Date.now()}.txt`;
        contentType = 'text/plain';
        break;
      default:
        return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

    return new NextResponse(output, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Export failed' }, { status: 500 });
  }
}
