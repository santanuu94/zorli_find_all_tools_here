import {
  generateCleanFilename,
  stripJpegMetadata,
  stripPngMetadata,
  stripWebpMetadata,
  verifyCleanCopy,
} from '../lib/metadata-cleaner';
import { ParsedMetadataReport } from '../types';

describe('Image Metadata Cleaner — Cleaning Engine', () => {
  describe('generateCleanFilename', () => {
    test('appends -clean to filename while preserving extension', () => {
      expect(generateCleanFilename('camera-photo.jpg')).toBe('camera-photo-clean.jpg');
      expect(generateCleanFilename('document.png')).toBe('document-clean.png');
      expect(generateCleanFilename('banner.webp')).toBe('banner-clean.webp');
    });

    test('prevents repeated -clean suffixes on already-cleaned files', () => {
      expect(generateCleanFilename('camera-photo-clean.jpg')).toBe('camera-photo-clean.jpg');
      expect(generateCleanFilename('photo_clean.png')).toBe('photo_clean.png');
      expect(generateCleanFilename('vacation-clean-clean.jpg')).toBe('vacation-clean-clean.jpg');
    });

    test('handles multiple dots in filename correctly', () => {
      expect(generateCleanFilename('my.holiday.photo.jpg')).toBe('my.holiday.photo-clean.jpg');
    });

    test('handles file names without extension cleanly', () => {
      expect(generateCleanFilename('raw-image')).toBe('raw-image-clean');
      expect(generateCleanFilename('raw-image-clean')).toBe('raw-image-clean');
    });
  });

  describe('stripJpegMetadata', () => {
    test('strips APP1 (EXIF) segment and preserves essential JPEG stream', () => {
      // Mock JPEG stream with SOI, APP1 (length 10), and SOS
      // SOI: FF D8
      // APP1: FF E1 00 0A 'Exif\0\0' (2 bytes len + 8 bytes payload = 10 total)
      // SOS: FF DA 00 02 [data...] FF D9 (EOI)
      const jpegWithApp1 = new Uint8Array([
        0xff, 0xd8, // SOI
        0xff, 0xe1, 0x00, 0x0a, 0x45, 0x78, 0x69, 0x66, 0x00, 0x00, 0x01, 0x02, // APP1 Exif
        0xff, 0xda, 0x00, 0x02, 0x12, 0x34, // SOS
        0xff, 0xd9, // EOI
      ]);

      const stripped = stripJpegMetadata(jpegWithApp1);

      // Verify APP1 marker (FF E1) is completely gone
      let foundApp1 = false;
      for (let i = 0; i < stripped.length - 1; i++) {
        if (stripped[i] === 0xff && stripped[i + 1] === 0xe1) {
          foundApp1 = true;
          break;
        }
      }
      expect(foundApp1).toBe(false);

      // Verify SOI (FF D8) and EOI (FF D9) are retained
      expect(stripped[0]).toBe(0xff);
      expect(stripped[1]).toBe(0xd8);
      expect(stripped[stripped.length - 2]).toBe(0xff);
      expect(stripped[stripped.length - 1]).toBe(0xd9);
      expect(stripped.length).toBeLessThan(jpegWithApp1.length);
    });
  });

  describe('stripPngMetadata', () => {
    test('strips ancillary tEXt chunk and preserves IHDR and IEND', () => {
      // Create PNG with IHDR + tEXt + IEND
      const pngWithText = new Uint8Array([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // Header
        0x00, 0x00, 0x00, 0x0d, // IHDR length
        0x49, 0x48, 0x44, 0x52, // IHDR
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00,
        0x1f, 0x15, 0xc4, 0x89, // IHDR CRC
        0x00, 0x00, 0x00, 0x06, // tEXt length
        0x74, 0x45, 0x58, 0x74, // tEXt
        0x61, 0x75, 0x74, 0x68, 0x6f, 0x72, // author
        0x00, 0x00, 0x00, 0x00, // CRC
        0x00, 0x00, 0x00, 0x00, // IEND length
        0x49, 0x45, 0x4e, 0x44, // IEND
        0xae, 0x42, 0x60, 0x82, // IEND CRC
      ]);

      const stripped = stripPngMetadata(pngWithText);

      // Verify tEXt chunk is absent
      const str = String.fromCharCode(...stripped);
      expect(str.includes('tEXt')).toBe(false);
      expect(str.includes('IHDR')).toBe(true);
      expect(str.includes('IEND')).toBe(true);
      expect(stripped.length).toBeLessThan(pngWithText.length);
    });
  });

  describe('stripWebpMetadata', () => {
    test('strips EXIF chunk from WebP RIFF stream', () => {
      // Mock WebP RIFF container with VP8 and EXIF chunk
      const webpBytes = new Uint8Array([
        0x52, 0x49, 0x46, 0x46, // RIFF
        0x20, 0x00, 0x00, 0x00, // Size
        0x57, 0x45, 0x42, 0x50, // WEBP
        0x56, 0x50, 0x38, 0x20, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // VP8 chunk
        0x45, 0x58, 0x49, 0x46, 0x04, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, // EXIF chunk
      ]);

      const stripped = stripWebpMetadata(webpBytes);
      const str = String.fromCharCode(...stripped);
      expect(str.includes('EXIF')).toBe(false);
      expect(str.includes('WEBP')).toBe(true);
      expect(stripped.length).toBeLessThan(webpBytes.length);
    });
  });

  describe('verifyCleanCopy', () => {
    test('verifies that output with zero metadata fields reports verifiedClean: true', async () => {
      // Clean PNG fixture without metadata
      const cleanPng = new Uint8Array([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
        0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89,
        0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, 0x54,
        0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4,
        0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44,
        0xae, 0x42, 0x60, 0x82,
      ]);
      const blob = new Blob([cleanPng], { type: 'image/png' });

      const mockBeforeReport: ParsedMetadataReport = {
        format: 'png',
        mimeType: 'image/png',
        hasSupportedMetadata: true,
        totalFieldCount: 5,
        sensitiveFieldCount: 1,
        categories: [],
        rawTags: { Author: 'Photographer', Software: 'Editor' },
        scanTimestamp: Date.now(),
      };

      const result = await verifyCleanCopy(blob, mockBeforeReport, 'lossless-binary');
      expect(result.beforeCount).toBe(5);
      expect(result.afterCount).toBe(0);
      expect(result.removedCount).toBe(5);
      expect(result.verifiedClean).toBe(true);
      expect(result.remainingFields).toEqual([]);
      expect(result.cleaningMethod).toBe('lossless-binary');
    });
  });
});
