import { PDFDocument } from 'pdf-lib';
import { PdfSourceInfo, SplitOutputItem, SplitPlan } from '../types';
import {
  hasPdfMagicBytes,
  readFileAsUint8Array,
  safeCreateObjectURL,
  sanitizePdfFilename,
} from './format-utils';

/**
 * Inspects an uploaded PDF, validates magic bytes, and retrieves genuine page count.
 */
export async function inspectPdfSource(file: File): Promise<PdfSourceInfo> {
  if (file.size === 0) {
    throw new Error(`"${file.name}" is an empty file (0 bytes). Please upload a valid PDF.`);
  }

  const bytes = await readFileAsUint8Array(file);

  if (!hasPdfMagicBytes(bytes)) {
    throw new Error(
      `"${file.name}" is not a recognized PDF document. Please verify the file is a valid PDF.`
    );
  }

  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(bytes, { ignoreEncryption: false });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (/encrypted|password/i.test(message)) {
      throw new Error(
        `We couldn't open "${file.name}" because it is encrypted or password-protected.`
      );
    }
    throw new Error(
      `"${file.name}" appears to be corrupted or invalid and cannot be read.`
    );
  }

  let pageCount = 0;
  try {
    pageCount = doc.getPageCount();
  } catch {
    throw new Error(
      `"${file.name}" contains corrupted page trees and could not be read.`
    );
  }

  if (pageCount < 1) {
    throw new Error(`"${file.name}" contains no readable pages.`);
  }

  return {
    file,
    name: file.name,
    sizeBytes: file.size,
    pageCount,
    isEncrypted: false,
  };
}

/**
 * Executes the split plan, producing genuine separate PDF documents.
 */
export async function splitPdf(
  sourceBytes: Uint8Array,
  plan: SplitPlan,
  onProgress?: (part: number, total: number) => void
): Promise<SplitOutputItem[]> {
  if (!plan.isValid || plan.items.length === 0) {
    throw new Error(plan.errorMessage || 'Invalid split configuration.');
  }

  let sourceDoc: PDFDocument;
  try {
    sourceDoc = await PDFDocument.load(sourceBytes, { ignoreEncryption: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (/encrypted|password/i.test(message)) {
      throw new Error('The source PDF is password-protected and cannot be split.');
    }
    throw new Error('Failed to load source PDF for splitting.');
  }

  const totalPages = sourceDoc.getPageCount();
  const outputs: SplitOutputItem[] = [];

  for (let i = 0; i < plan.items.length; i++) {
    const item = plan.items[i];
    onProgress?.(i + 1, plan.items.length);

    // Validate page numbers against actual source doc
    const pageIndices: number[] = [];
    for (const pageNum of item.pages) {
      if (pageNum < 1 || pageNum > totalPages) {
        throw new Error(
          `Requested page ${pageNum} is out of bounds for this document (1 to ${totalPages}).`
        );
      }
      pageIndices.push(pageNum - 1); // 0-indexed for pdf-lib
    }

    try {
      const targetDoc = await PDFDocument.create();
      const copiedPages = await targetDoc.copyPages(sourceDoc, pageIndices);
      for (const page of copiedPages) {
        targetDoc.addPage(page);
      }

      const outputBytes = await targetDoc.save({ useObjectStreams: true });

      if (outputBytes.length === 0 || !hasPdfMagicBytes(outputBytes)) {
        throw new Error(`Failed to generate valid PDF bytes for ${item.filename}.`);
      }

      // Verify structural integrity of generated output
      const verifiedDoc = await PDFDocument.load(outputBytes);
      if (verifiedDoc.getPageCount() !== item.pageCount) {
        throw new Error(
          `Page count mismatch on ${item.filename}: expected ${item.pageCount}, got ${verifiedDoc.getPageCount()}.`
        );
      }

      const blob = new Blob([outputBytes as unknown as BlobPart], { type: 'application/pdf' });
      const downloadUrl = safeCreateObjectURL(blob);

      outputs.push({
        id: item.id,
        sequence: item.sequence,
        filename: sanitizePdfFilename(item.filename),
        blob,
        downloadUrl,
        sizeBytes: blob.size,
        pageCount: item.pageCount,
        pageDisplay: item.pageDisplay,
      });
    } catch (err: unknown) {
      // Clean up any previously created object URLs before throwing
      outputs.forEach((o) => {
        if (o.downloadUrl && typeof URL !== 'undefined') {
          URL.revokeObjectURL(o.downloadUrl);
        }
      });
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to create part ${item.sequence} (${item.filename}): ${message}`);
    }
  }

  return outputs;
}
