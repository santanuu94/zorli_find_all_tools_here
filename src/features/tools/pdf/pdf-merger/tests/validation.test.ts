import {
  formatFileSize,
  hasPdfMagicBytes,
  sanitizePdfFilename,
} from '../lib/format-utils';
import { inspectPdfFile } from '../lib/pdf-merger-engine';

describe('PDF Merger Validation and Calculation Tests', () => {
  describe('hasPdfMagicBytes', () => {
    test('identifies valid %PDF- magic signature', () => {
      const validBuffer = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
      expect(hasPdfMagicBytes(validBuffer)).toBe(true);
    });

    test('rejects non-PDF buffer', () => {
      const invalidBuffer = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]); // PNG
      expect(hasPdfMagicBytes(invalidBuffer)).toBe(false);
    });

    test('rejects empty or truncated buffer', () => {
      expect(hasPdfMagicBytes(new Uint8Array([]))).toBe(false);
      expect(hasPdfMagicBytes(new Uint8Array([0x25, 0x50]))).toBe(false);
    });
  });

  describe('formatFileSize', () => {
    test('formats bytes with standard binary 1024 basis', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(2048 * 1024)).toBe('2 MB');
      expect(formatFileSize(5.5 * 1024 * 1024)).toBe('5.5 MB');
    });

    test('handles negative and invalid inputs', () => {
      expect(formatFileSize(-50)).toBe('0 B');
      expect(formatFileSize(NaN)).toBe('0 B');
    });
  });

  describe('sanitizePdfFilename', () => {
    test('ensures .pdf extension is always present', () => {
      expect(sanitizePdfFilename('my-contract')).toBe('my-contract.pdf');
      expect(sanitizePdfFilename('my-contract.pdf')).toBe('my-contract.pdf');
      expect(sanitizePdfFilename('annual-report.PDF')).toBe('annual-report.PDF');
    });

    test('strips unsafe path and control characters', () => {
      expect(sanitizePdfFilename('report/2026:final?.pdf')).toBe('report2026final.pdf');
      expect(sanitizePdfFilename('file*name<test>.pdf')).toBe('filenametest.pdf');
    });

    test('falls back to merged-document.pdf on empty input', () => {
      expect(sanitizePdfFilename('')).toBe('merged-document.pdf');
      expect(sanitizePdfFilename('   ')).toBe('merged-document.pdf');
      expect(sanitizePdfFilename('???')).toBe('merged-document.pdf');
    });
  });

  describe('inspectPdfFile validation', () => {
    test('rejects non-PDF files with clear error', async () => {
      const fakeFile = new File(['plain text data'], 'readme.txt', { type: 'text/plain' });
      (fakeFile as any).arrayBuffer = async () => new TextEncoder().encode('plain text data').buffer;
      await expect(inspectPdfFile(fakeFile)).rejects.toThrow(/not a valid PDF/i);
    });

    test('rejects corrupted PDF files', async () => {
      const corruptBytes = new TextEncoder().encode('%PDF-1.4\ncorrupt header content\n%%EOF');
      const corruptPdf = new File([corruptBytes as any], 'broken.pdf', {
        type: 'application/pdf',
      });
      (corruptPdf as any).arrayBuffer = async () => corruptBytes.buffer;
      await expect(inspectPdfFile(corruptPdf)).rejects.toThrow(/corrupted/i);
    });
  });
});
