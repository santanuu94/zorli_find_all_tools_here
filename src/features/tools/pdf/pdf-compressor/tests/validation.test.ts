import {
  calculateReductionPercentage,
  calculateTargetBytes,
  formatFileSize,
  generateCompressedFilename,
  hasPdfMagicBytes,
  TARGET_PRESET_BYTES,
} from '../lib/format-utils';
import { inspectPdf } from '../lib/pdf-compressor-engine';

describe('PDF Compressor Validation and Calculation Tests', () => {
  describe('hasPdfMagicBytes', () => {
    test('identifies valid %PDF- magic signature', () => {
      const validBuffer = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x35]);
      expect(hasPdfMagicBytes(validBuffer)).toBe(true);
    });

    test('rejects non-PDF buffer', () => {
      const invalidBuffer = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]); // PNG
      expect(hasPdfMagicBytes(invalidBuffer)).toBe(false);
    });

    test('rejects empty or too small buffer', () => {
      expect(hasPdfMagicBytes(new Uint8Array([]))).toBe(false);
      expect(hasPdfMagicBytes(new Uint8Array([0x25, 0x50]))).toBe(false);
    });
  });

  describe('formatFileSize', () => {
    test('formats bytes, KB, MB, GB with standard binary 1024 basis', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(512)).toBe('512 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(500 * 1024)).toBe('500 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1.87 * 1024 * 1024)).toBe('1.87 MB');
      expect(formatFileSize(10 * 1024 * 1024)).toBe('10 MB');
    });

    test('handles negative, NaN and invalid inputs gracefully', () => {
      expect(formatFileSize(-100)).toBe('0 B');
      expect(formatFileSize(NaN)).toBe('0 B');
    });
  });

  describe('calculateTargetBytes', () => {
    test('returns exact preset bytes', () => {
      expect(
        calculateTargetBytes({
          targetPreset: '500kb',
          customTargetValue: 2,
          customTargetUnit: 'MB',
          quality: 'balanced',
          removeMetadata: true,
        })
      ).toBe(TARGET_PRESET_BYTES['500kb']);

      expect(
        calculateTargetBytes({
          targetPreset: '1mb',
          customTargetValue: 2,
          customTargetUnit: 'MB',
          quality: 'balanced',
          removeMetadata: true,
        })
      ).toBe(1024 * 1024);

      expect(
        calculateTargetBytes({
          targetPreset: '2mb',
          customTargetValue: 2,
          customTargetUnit: 'MB',
          quality: 'balanced',
          removeMetadata: true,
        })
      ).toBe(2 * 1024 * 1024);
    });

    test('calculates custom target in MB and KB', () => {
      const customMb = calculateTargetBytes({
        targetPreset: 'custom',
        customTargetValue: 3.5,
        customTargetUnit: 'MB',
        quality: 'balanced',
        removeMetadata: true,
      });
      expect(customMb).toBe(Math.round(3.5 * 1024 * 1024));

      const customKb = calculateTargetBytes({
        targetPreset: 'custom',
        customTargetValue: 750,
        customTargetUnit: 'KB',
        quality: 'balanced',
        removeMetadata: true,
      });
      expect(customKb).toBe(750 * 1024);
    });
  });

  describe('calculateReductionPercentage', () => {
    test('computes exact ((orig - comp) / orig) * 100 percentage', () => {
      // 10MB down to 2MB = 80% reduction
      expect(calculateReductionPercentage(1000, 200)).toBe(80);
      // 8.4MB down to 1.87MB = ((8.4 - 1.87) / 8.4) * 100 = 77.7%
      expect(calculateReductionPercentage(8400000, 1870000)).toBe(77.7);
    });

    test('returns 0 when compressed size is greater than or equal to original', () => {
      expect(calculateReductionPercentage(1000, 1000)).toBe(0);
      expect(calculateReductionPercentage(1000, 1200)).toBe(0);
      expect(calculateReductionPercentage(0, 100)).toBe(0);
    });
  });

  describe('generateCompressedFilename', () => {
    test('appends -compressed to PDF name', () => {
      expect(generateCompressedFilename('document.pdf')).toBe('document-compressed.pdf');
      expect(generateCompressedFilename('annual-report.PDF')).toBe('annual-report-compressed.pdf');
    });

    test('prevents repeated suffixes', () => {
      expect(generateCompressedFilename('document-compressed.pdf')).toBe('document-compressed.pdf');
    });
  });

  describe('inspectPdf validation', () => {
    test('rejects non-PDF files', async () => {
      const fakeFile = new File(['not a pdf at all'], 'test.txt', { type: 'text/plain' });
      (fakeFile as any).arrayBuffer = async () => new TextEncoder().encode('not a pdf at all').buffer;
      await expect(inspectPdf(fakeFile)).rejects.toThrow('Please upload a valid PDF file.');
    });

    test('rejects corrupted PDF files', async () => {
      const corruptBytes = new TextEncoder().encode('%PDF-1.4\ncorrupt content here\n%%EOF');
      const corruptPdf = new File([corruptBytes], 'corrupt.pdf', {
        type: 'application/pdf',
      });
      (corruptPdf as any).arrayBuffer = async () => corruptBytes.buffer;
      await expect(inspectPdf(corruptPdf)).rejects.toThrow();
    });
  });
});
