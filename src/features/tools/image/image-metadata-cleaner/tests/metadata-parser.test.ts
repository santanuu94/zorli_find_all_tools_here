import {
  detectFormatFromBuffer,
  detectC2paMarkers,
  formatCoordinate,
  parseImageMetadata,
} from '../lib/metadata-parser';

describe('Image Metadata Cleaner — Parser Engine', () => {
  describe('detectFormatFromBuffer', () => {
    test('detects JPEG from SOI magic bytes FF D8 FF', () => {
      const jpegBytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
      expect(detectFormatFromBuffer(jpegBytes)).toBe('jpeg');
    });

    test('detects PNG from signature bytes 89 50 4E 47 0D 0A 1A 0A', () => {
      const pngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
      expect(detectFormatFromBuffer(pngBytes)).toBe('png');
    });

    test('detects WebP from RIFF ... WEBP header', () => {
      const webpBytes = new Uint8Array([
        0x52, 0x49, 0x46, 0x46, // RIFF
        0x20, 0x00, 0x00, 0x00, // Size
        0x57, 0x45, 0x42, 0x50, // WEBP
        0x56, 0x50, 0x38, 0x20, // VP8
      ]);
      expect(detectFormatFromBuffer(webpBytes)).toBe('webp');
    });

    test('returns unknown for unsupported or truncated byte streams', () => {
      expect(detectFormatFromBuffer(new Uint8Array([0x01, 0x02]))).toBe('unknown');
      expect(detectFormatFromBuffer(new Uint8Array(12).fill(0))).toBe('unknown');
    });
  });

  describe('detectC2paMarkers', () => {
    test('identifies JUMBF Content Credentials marker in byte stream', () => {
      const buffer = new Uint8Array(64);
      // Inject 'JUMB' signature at offset 10
      buffer[10] = 0x4a;
      buffer[11] = 0x55;
      buffer[12] = 0x4d;
      buffer[13] = 0x42;
      expect(detectC2paMarkers(buffer)).toBe(true);
    });

    test('identifies c2pa provenance marker in byte stream', () => {
      const buffer = new Uint8Array(64);
      // Inject 'c2pa' signature at offset 20
      buffer[20] = 0x63;
      buffer[21] = 0x32;
      buffer[22] = 0x70;
      buffer[23] = 0x61;
      expect(detectC2paMarkers(buffer)).toBe(true);
    });

    test('returns false when no C2PA markers are present', () => {
      const cleanBuffer = new Uint8Array(100).fill(0x20);
      expect(detectC2paMarkers(cleanBuffer)).toBe(false);
    });
  });

  describe('formatCoordinate', () => {
    test('formats positive latitude as North (° N)', () => {
      expect(formatCoordinate(37.7749, true)).toBe('37.77490° N');
    });

    test('formats negative latitude as South (° S)', () => {
      expect(formatCoordinate(-33.8688, true)).toBe('33.86880° S');
    });

    test('formats positive longitude as East (° E)', () => {
      expect(formatCoordinate(151.2093, false)).toBe('151.20930° E');
    });

    test('formats negative longitude as West (° W)', () => {
      expect(formatCoordinate(-122.4194, false)).toBe('122.41940° W');
    });
  });

  describe('parseImageMetadata', () => {
    test('parses clean PNG and reports zero supported metadata fields', async () => {
      // 1x1 clean PNG without ancillary text or exif chunks
      const pngBytes = new Uint8Array([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
        0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89,
        0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, 0x54,
        0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4,
        0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44,
        0xae, 0x42, 0x60, 0x82,
      ]);

      const report = await parseImageMetadata(pngBytes);
      expect(report.format).toBe('png');
      expect(report.hasSupportedMetadata).toBe(false);
      expect(report.totalFieldCount).toBe(0);
      expect(report.sensitiveFieldCount).toBe(0);
      expect(report.gps).toBeUndefined();
    });
  });
});
