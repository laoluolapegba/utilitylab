import { getProvider } from '@/lib/ocr/getProvider';
import type { OcrResult } from '@/lib/ocr/ocrProvider';

export async function extractInvoiceText(
  fileBuffer: Buffer,
  provider: 'textract' | 'google' = 'textract'
): Promise<OcrResult> {
  const ocr = await getProvider(provider);
  return ocr.extract(fileBuffer);
}
