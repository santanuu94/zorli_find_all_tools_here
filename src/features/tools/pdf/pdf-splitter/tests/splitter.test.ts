import { PDFDocument } from 'pdf-lib';
import { inspectPdfSource, splitPdf } from '../lib/pdf-splitter-engine';
import {
  buildEqualPlan,
  buildExtractPlan,
  buildRangePlan,
} from '../lib/split-plan-generator';
import { readFileAsUint8Array } from '../lib/format-utils';
import { createSplitZipBlob } from '../lib/zip-utils';

// Helper to create real, valid PDF fixtures
async function createTestPdf(name: string, pageCount: number): Promise<File> {
  const doc = await PDFDocument.create();
  for (let i = 1; i <= pageCount; i++) {
    const page = doc.addPage([595, 842]); // A4
    page.drawText(`Document ${name} - Page ${i} of ${pageCount}`, {
      x: 50,
      y: 800,
      size: 12,
    });
  }
  const bytes = await doc.save();
  const file = new File([bytes as any], name, { type: 'application/pdf' });
  (file as any).arrayBuffer = async () => bytes.buffer;
  return file;
}

describe('PDF Splitter Engine & Real PDF Tests', () => {
  test('inspectPdfSource extracts accurate page count and size for valid multi-page PDF', async () => {
    const pdf = await createTestPdf('sample.pdf', 6);
    const info = await inspectPdfSource(pdf);

    expect(info.name).toBe('sample.pdf');
    expect(info.pageCount).toBe(6);
    expect(info.sizeBytes).toBe(pdf.size);
    expect(info.isEncrypted).toBe(false);
  });

  test('inspectPdfSource rejects empty 0-byte files', async () => {
    const emptyFile = new File([], 'empty.pdf', { type: 'application/pdf' });
    (emptyFile as any).arrayBuffer = async () => new ArrayBuffer(0);

    await expect(inspectPdfSource(emptyFile)).rejects.toThrow(/empty file/i);
  });

  test('inspectPdfSource rejects non-PDF files', async () => {
    const textBytes = new TextEncoder().encode('Hello, this is not a PDF file.');
    const textFile = new File([textBytes], 'document.txt', { type: 'text/plain' });
    (textFile as any).arrayBuffer = async () => textBytes.buffer;

    await expect(inspectPdfSource(textFile)).rejects.toThrow(/not a recognized PDF/i);
  });

  test('inspectPdfSource rejects corrupted PDF files', async () => {
    // Starts with %PDF- but followed by broken garbage bytes
    const brokenBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x00, 0xff, 0xfe]);
    const brokenFile = new File([brokenBytes], 'corrupt.pdf', { type: 'application/pdf' });
    (brokenFile as any).arrayBuffer = async () => brokenBytes.buffer;

    await expect(inspectPdfSource(brokenFile)).rejects.toThrow(/corrupted or invalid/i);
  });

  test('Mode A: Splits PDF by custom page ranges into valid standalone documents', async () => {
    const pdf = await createTestPdf('manual.pdf', 6);
    const bytes = await readFileAsUint8Array(pdf);

    const plan = buildRangePlan(
      6,
      [
        { id: '1', start: 1, end: 2 },
        { id: '2', start: 3, end: 6 },
      ],
      'manual.pdf'
    );

    const outputs = await splitPdf(bytes, plan);

    expect(outputs.length).toBe(2);
    expect(outputs[0].filename).toBe('manual_pages_1-2.pdf');
    expect(outputs[0].pageCount).toBe(2);
    expect(outputs[1].filename).toBe('manual_pages_3-6.pdf');
    expect(outputs[1].pageCount).toBe(4);

    // Verify Part 1 genuine readability & page count
    const outBytes1 = await readFileAsUint8Array(outputs[0].blob);
    const verifiedDoc1 = await PDFDocument.load(outBytes1);
    expect(verifiedDoc1.getPageCount()).toBe(2);

    // Verify Part 2 genuine readability & page count
    const outBytes2 = await readFileAsUint8Array(outputs[1].blob);
    const verifiedDoc2 = await PDFDocument.load(outBytes2);
    expect(verifiedDoc2.getPageCount()).toBe(4);
  });

  test('Mode B: Extracts individual selected pages into single-page PDFs', async () => {
    const pdf = await createTestPdf('portfolio.pdf', 5);
    const bytes = await readFileAsUint8Array(pdf);

    const plan = buildExtractPlan(5, [1, 4], 'portfolio.pdf');
    const outputs = await splitPdf(bytes, plan);

    expect(outputs.length).toBe(2);
    expect(outputs[0].filename).toBe('portfolio_page_1.pdf');
    expect(outputs[0].pageCount).toBe(1);
    expect(outputs[1].filename).toBe('portfolio_page_4.pdf');
    expect(outputs[1].pageCount).toBe(1);

    const outBytes = await readFileAsUint8Array(outputs[1].blob);
    const doc = await PDFDocument.load(outBytes);
    expect(doc.getPageCount()).toBe(1);
  });

  test('Mode C: Splits PDF into equal page groups', async () => {
    // 5 pages, 2 pages per file -> 3 files (2 pages, 2 pages, 1 page)
    const pdf = await createTestPdf('book.pdf', 5);
    const bytes = await readFileAsUint8Array(pdf);

    const plan = buildEqualPlan(5, 2, 'book.pdf');
    const outputs = await splitPdf(bytes, plan);

    expect(outputs.length).toBe(3);
    expect(outputs[0].pageCount).toBe(2);
    expect(outputs[1].pageCount).toBe(2);
    expect(outputs[2].pageCount).toBe(1);

    const outBytes3 = await readFileAsUint8Array(outputs[2].blob);
    const doc3 = await PDFDocument.load(outBytes3);
    expect(doc3.getPageCount()).toBe(1);
  });

  test('Generates a valid ZIP archive containing all split output files', async () => {
    const pdf = await createTestPdf('doc.pdf', 4);
    const bytes = await readFileAsUint8Array(pdf);

    const plan = buildEqualPlan(4, 2, 'doc.pdf');
    const outputs = await splitPdf(bytes, plan);

    const zipBlob = await createSplitZipBlob(outputs);
    expect(zipBlob).toBeInstanceOf(Blob);
    expect(zipBlob.size).toBeGreaterThan(0);
    expect(zipBlob.type).toBe('application/zip');
  });
});
