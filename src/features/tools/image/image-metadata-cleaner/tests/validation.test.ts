import { FORMAT_CAPABILITIES, getFormatCapability } from '../lib/format-capabilities';
import { formatFileSize } from '../utils/format-file-size';

describe('Image Metadata Cleaner — Validation & Capabilities', () => {
  describe('Format Capabilities Model', () => {
    test('defines explicit capabilities and limitations for JPEG', () => {
      const jpegCap = getFormatCapability('jpeg');
      expect(jpegCap.format).toBe('jpeg');
      expect(jpegCap.readableMetadata).toContain('EXIF (Camera, Exposure, Lens)');
      expect(jpegCap.readableMetadata).toContain('GPS Location (Coordinates, Altitude)');
      expect(jpegCap.removableMetadata).toContain('EXIF (APP1)');
      expect(jpegCap.limitations.length).toBeGreaterThan(0);
    });

    test('defines explicit capabilities and limitations for PNG', () => {
      const pngCap = getFormatCapability('png');
      expect(pngCap.format).toBe('png');
      expect(pngCap.readableMetadata).toContain('eXIf (Embedded EXIF data)');
      expect(pngCap.removableMetadata).toContain('eXIf chunk');
      expect(pngCap.limitations[0]).toContain('IHDR');
    });

    test('defines explicit capabilities and limitations for WebP', () => {
      const webpCap = getFormatCapability('webp');
      expect(webpCap.format).toBe('webp');
      expect(webpCap.readableMetadata).toContain('EXIF metadata chunk');
      expect(webpCap.removableMetadata).toContain('EXIF chunk');
    });

    test('handles unknown format gracefully', () => {
      const unknownCap = getFormatCapability('unknown');
      expect(unknownCap.format).toBe('unknown');
      expect(unknownCap.readableMetadata).toEqual([]);
      expect(unknownCap.removableMetadata).toEqual([]);
    });
  });

  describe('formatFileSize', () => {
    test('formats bytes to human readable string', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(512)).toBe('512 B');
      expect(formatFileSize(2048)).toBe('2.00 KB');
      expect(formatFileSize(1048576)).toBe('1.00 MB');
      expect(formatFileSize(2500000)).toBe('2.38 MB');
    });
  });
});
