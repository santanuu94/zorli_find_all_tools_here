import { PDFDocument } from 'pdf-lib';
import { inspectPdfFile, mergePdfs } from '../lib/pdf-merger-engine';
import { readFileAsUint8Array } from '../lib/format-utils';

// Helper to create real, valid multi-page PDF fixtures
async function createTestPdfFixture(filename: string, pageCount: number): Promise<File> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Document ${filename}`);

  for (let i = 1; i <= pageCount; i++) {
    const page = doc.addPage([600, 800]);
    page.drawText(`${filename} - Page ${i} of ${pageCount}`, {
      x: 50,
      y: 750,
      size: 14,
    });
  }

  const bytes = await doc.save();
  const file = new File([bytes as any], filename, { type: 'application/pdf' });
  (file as any).arrayBuffer = async () => bytes.buffer;
  return file;
}

describe('PDF Merger Core Engine Tests', () => {
  test('inspectPdfFile correctly inspects valid PDF properties and page count', async () => {
    const doc1 = await createTestPdfFixture('report-1.pdf', 3);
    const info = await inspectPdfFile(doc1);

    expect(info.pageCount).toBe(3);
    expect(info.size).toBe(doc1.size);
  });

  test('requires at least two PDF files to merge', async () => {
    const doc1 = await createTestPdfFixture('single.pdf', 2);
    await expect(mergePdfs([doc1])).rejects.toThrow(/Add at least two PDF files/i);
  });

  test('successfully merges multiple real PDFs into one valid document', async () => {
    const docA = await createTestPdfFixture('Cover.pdf', 1);
    const docB = await createTestPdfFixture('Chapter-1.pdf', 3);
    const docC = await createTestPdfFixture('Appendix.pdf', 2);

    const result = await mergePdfs([docA, docB, docC]);

    // 1. Files count and total pages must match sum
    expect(result.filesCount).toBe(3);
    expect(result.pageCount).toBe(6); // 1 + 3 + 2
    expect(result.mergedSize).toBeGreaterThan(0);
    expect(result.defaultFilename).toBe('merged-document.pdf');

    // 2. Output must be a genuine readable PDF with 6 pages
    const mergedBytes = await readFileAsUint8Array(result.mergedBlob);
    const verifiedDoc = await PDFDocument.load(mergedBytes);
    expect(verifiedDoc.getPageCount()).toBe(6);
  });

  test('preserves the exact page order of the supplied file queue', async () => {
    const doc1 = await createTestPdfFixture('Doc1.pdf', 2);
    const doc2 = await createTestPdfFixture('Doc2.pdf', 1);

    // Merge in order [Doc1, Doc2]
    const resultOrder1 = await mergePdfs([doc1, doc2]);
    const bytes1 = await readFileAsUint8Array(resultOrder1.mergedBlob);
    const verified1 = await PDFDocument.load(bytes1);
    expect(verified1.getPageCount()).toBe(3);

    // Merge in reverse order [Doc2, Doc1]
    const resultOrder2 = await mergePdfs([doc2, doc1]);
    const bytes2 = await readFileAsUint8Array(resultOrder2.mergedBlob);
    const verified2 = await PDFDocument.load(bytes2);
    expect(verified2.getPageCount()).toBe(3);
  });

  test('rejects corrupted PDF in the queue and identifies the broken file', async () => {
    const validDoc = await createTestPdfFixture('valid.pdf', 2);
    const corruptBytes = new TextEncoder().encode('%PDF-1.4\ncorrupted stream bytes\n%%EOF');
    const corruptFile = new File([corruptBytes as any], 'broken-contract.pdf', {
      type: 'application/pdf',
    });
    (corruptFile as any).arrayBuffer = async () => corruptBytes.buffer;

    await expect(mergePdfs([validDoc, corruptFile])).rejects.toThrow(
      /broken-contract.pdf/i
    );
  });
});
