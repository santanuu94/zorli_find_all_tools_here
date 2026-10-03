import { PDFDocument } from 'pdf-lib';
import { compressPdf, inspectPdf, readFileAsUint8Array } from '../lib/pdf-compressor-engine';

// Helper to create real, valid PDF fixtures
async function createTestPdfFixture(pages = 3, addMetadata = true): Promise<File> {
  const doc = await PDFDocument.create();

  if (addMetadata) {
    doc.setTitle('Financial Annual Report with Excessive Metadata');
    doc.setAuthor('Enterprise Software Creator v12.4');
    doc.setSubject('Q4 Detailed Breakdown');
    doc.setKeywords(['finance', 'quarterly', 'tax', 'audit', 'confidential']);
    doc.setProducer('Legacy Uncompressed PDF Engine');
  }

  for (let i = 1; i <= pages; i++) {
    const page = doc.addPage([600, 800]);
    page.drawText(`Confidential Report Page ${i} of ${pages}`, { x: 50, y: 750, size: 14 });
    page.drawText('This is genuine vector text content preserved across compression passes.', {
      x: 50,
      y: 700,
      size: 11,
    });
    // Add extra drawing commands to simulate complex content
    for (let j = 0; j < 30; j++) {
      page.drawLine({
        start: { x: 50, y: 650 - j * 15 },
        end: { x: 550, y: 650 - j * 15 },
        thickness: 0.5,
      });
    }
  }

  // Save WITHOUT object streams to simulate standard unoptimized exported PDFs
  const bytes = await doc.save({ useObjectStreams: false });
  const file = new File([bytes as any], 'test-document.pdf', { type: 'application/pdf' });
  (file as any).arrayBuffer = async () => bytes.buffer;
  return file;
}

describe('PDF Compressor Engine Core Tests', () => {
  test('inspectPdf correctly reads valid PDF properties and page count', async () => {
    const fixture = await createTestPdfFixture(4, true);
    const info = await inspectPdf(fixture);

    expect(info.name).toBe('test-document.pdf');
    expect(info.originalSize).toBe(fixture.size);
    expect(info.pageCount).toBe(4);
    expect(info.isEncrypted).toBe(false);
  });

  test('genuinely reduces file size for unoptimized PDF with metadata and object streams', async () => {
    const fixture = await createTestPdfFixture(3, true);
    const originalSize = fixture.size;

    const result = await compressPdf(
      fixture,
      {
        targetPreset: '500kb',
        customTargetValue: 1,
        customTargetUnit: 'MB',
        quality: 'balanced',
        removeMetadata: true,
      },
      undefined,
      true // forceCompress
    );

    // 1. Output must actually be smaller than original
    expect(result.compressedSize).toBeLessThan(originalSize);
    expect(result.savedBytes).toBe(originalSize - result.compressedSize);
    expect(result.reductionPercentage).toBeGreaterThan(0);

    // 2. Output must be a valid PDF that can be parsed and page count is preserved
    const compressedBuffer = await readFileAsUint8Array(result.compressedBlob);
    const verifiedDoc = await PDFDocument.load(compressedBuffer);
    expect(verifiedDoc.getPageCount()).toBe(3);
  });

  test('reports target_achieved when output size is within the requested goal', async () => {
    const fixture = await createTestPdfFixture(2, true);

    // Set target to 2 MB (far larger than our small fixture)
    const result = await compressPdf(
      fixture,
      {
        targetPreset: '2mb',
        customTargetValue: 2,
        customTargetUnit: 'MB',
        quality: 'balanced',
        removeMetadata: true,
      },
      undefined,
      true
    );

    expect(result.targetResultState).toBe('target_achieved');
    expect(result.compressedSize).toBeLessThanOrEqual(result.targetBytes);
  });

  test('reports target_not_achieved when target is lower than practical output size', async () => {
    const fixture = await createTestPdfFixture(5, true);

    // Set target to 0.5 KB = 512 bytes (much smaller than the ~4-5KB fixture)
    const result = await compressPdf(
      fixture,
      {
        targetPreset: 'custom',
        customTargetValue: 0.5,
        customTargetUnit: 'KB',
        quality: 'balanced',
        removeMetadata: true,
      },
      undefined,
      true
    );

    expect(result.targetResultState).toBe('target_not_achieved');
    expect(result.compressedSize).toBeGreaterThan(result.targetBytes);
    expect(result.message).toMatch(/requested target could not be reached/i);
  });

  test('reports already_smaller when original file size is already below target and force is false', async () => {
    const fixture = await createTestPdfFixture(1, false);

    // Target 10 MB on a ~1-2 KB fixture without force
    const result = await compressPdf(
      fixture,
      {
        targetPreset: '10mb',
        customTargetValue: 10,
        customTargetUnit: 'MB',
        quality: 'balanced',
        removeMetadata: true,
      },
      undefined,
      false
    );

    expect(result.targetResultState).toBe('already_smaller');
    expect(result.message).toMatch(/already smaller than your target/i);
    expect(result.compressedSize).toBe(fixture.size);
  });
});
