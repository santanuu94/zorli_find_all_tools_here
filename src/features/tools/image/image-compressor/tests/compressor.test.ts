import { formatFileSize } from '../utils/format-file-size';
import {
  calculateSavings,
  generateCompressedFilename,
  determineOutputMimeType,
} from '../lib/image-processing';
import { createZipBlob } from '../lib/zip';
import { compressImage } from '../lib/compressor';

describe('Image Compressor Utility Tests', () => {
  describe('formatFileSize', () => {
    test('formats bytes properly into human-readable strings', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(2516582)).toBe('2.4 MB');
      expect(formatFileSize(-100)).toBe('0 B');
      expect(formatFileSize(NaN)).toBe('0 B');
    });
  });

  describe('calculateSavings (Strict Percentage Formula)', () => {
    test('accurately calculates reduction percentage', () => {
      // 1000 -> 500 = 50%
      const half = calculateSavings(1000, 500);
      expect(half.reductionPercentage).toBe(50);
      expect(half.alreadyOptimized).toBe(false);

      // 2.4 MB (2,400,000) -> 680 KB (680,000) = 71.7%
      const realistic = calculateSavings(2400000, 680000);
      expect(realistic.reductionPercentage).toBe(71.7);
      expect(realistic.alreadyOptimized).toBe(false);
    });

    test('never claims false savings when output is larger or equal (Already Optimized)', () => {
      // 1000 -> 1100: file became larger, must NOT report savings
      const larger = calculateSavings(1000, 1100);
      expect(larger.reductionPercentage).toBe(0);
      expect(larger.alreadyOptimized).toBe(true);

      // Exact same size
      const same = calculateSavings(1000, 1000);
      expect(same.reductionPercentage).toBe(0);
      expect(same.alreadyOptimized).toBe(true);

      // Edge case 0 bytes
      const zero = calculateSavings(0, 500);
      expect(zero.reductionPercentage).toBe(0);
      expect(zero.alreadyOptimized).toBe(true);
    });
  });

  describe('generateCompressedFilename', () => {
    test('preserves original name with -compressed suffix and appropriate extension', () => {
      expect(generateCompressedFilename('photo.jpg', 'image/jpeg')).toBe('photo-compressed.jpg');
      expect(generateCompressedFilename('graphic.png', 'image/png')).toBe('graphic-compressed.png');
      expect(generateCompressedFilename('banner.png', 'image/webp')).toBe('banner-compressed.webp');
      expect(generateCompressedFilename('archive.backup.photo.jpg', 'image/jpeg')).toBe(
        'archive.backup.photo-compressed.jpg'
      );
    });

    test('sanitizes illegal path and filename characters', () => {
      const sanitized = generateCompressedFilename('bad:file/name?.jpg', 'image/jpeg');
      expect(sanitized).toBe('bad_file_name_-compressed.jpg');
    });
  });

  describe('determineOutputMimeType', () => {
    test('honors original formats and format conversions', () => {
      expect(determineOutputMimeType('image/jpeg', 'photo.jpg', 'original')).toBe('image/jpeg');
      expect(determineOutputMimeType('image/png', 'icon.png', 'original')).toBe('image/png');
      expect(determineOutputMimeType('image/webp', 'art.webp', 'original')).toBe('image/webp');

      // Conversion overrides
      expect(determineOutputMimeType('image/png', 'icon.png', 'jpeg')).toBe('image/jpeg');
      expect(determineOutputMimeType('image/jpeg', 'photo.jpg', 'webp')).toBe('image/webp');
      expect(determineOutputMimeType('image/jpeg', 'photo.jpg', 'png')).toBe('image/png');
    });
  });

  describe('createZipBlob (ZIP generation for Download All)', () => {
    test('packages multiple files into a valid ZIP archive', async () => {
      const file1 = new Blob(['sample-image-data-1'], { type: 'image/jpeg' });
      const file2 = new Blob(['sample-image-data-2'], { type: 'image/png' });

      const zipBlob = await createZipBlob([
        { name: 'photo1-compressed.jpg', data: file1 },
        { name: 'photo2-compressed.png', data: file2 },
      ]);

      expect(zipBlob).toBeDefined();
      expect(zipBlob.type).toBe('application/zip');
      expect(zipBlob.size).toBeGreaterThan(0);

      // Verify PK\x03\x04 signature at start of ZIP
      const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(zipBlob.slice(0, 4));
      });
      const bytes = new Uint8Array(buffer);
      expect(bytes[0]).toBe(0x50); // 'P'
      expect(bytes[1]).toBe(0x4b); // 'K'
      expect(bytes[2]).toBe(0x03);
      expect(bytes[3]).toBe(0x04);
    });
  });

  describe('compressImage Engine Contract', () => {
    // Setup jsdom canvas mock for compressor tests
    beforeAll(() => {
      // Mock URL.createObjectURL and URL.revokeObjectURL
      if (typeof window.URL.createObjectURL === 'undefined') {
        window.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      }
      if (typeof window.URL.revokeObjectURL === 'undefined') {
        window.URL.revokeObjectURL = jest.fn();
      }

      // Mock Image constructor in jsdom
      const originalImage = window.Image;
      window.Image = class {
        src = '';
        width = 800;
        height = 600;
        naturalWidth = 800;
        naturalHeight = 600;
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload();
          }, 0);
        }
      } as unknown as typeof Image;

      // Mock HTMLCanvasElement.prototype.getContext and toBlob
      HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
        fillStyle: '',
        fillRect: jest.fn(),
        drawImage: jest.fn(),
        getImageData: jest.fn().mockReturnValue({
          data: new Uint8ClampedArray(800 * 600 * 4),
        }),
        putImageData: jest.fn(),
      }) as unknown as typeof HTMLCanvasElement.prototype.getContext;

      HTMLCanvasElement.prototype.toBlob = jest.fn(
        (callback: BlobCallback, type = 'image/jpeg', quality = 0.8) => {
          // Simulate real compression: lower quality produces smaller blob
          const simulatedSize = Math.max(100, Math.round(1000 * (quality || 0.8)));
          const mockBlob = new Blob([new Uint8Array(simulatedSize)], { type });
          callback(mockBlob);
        }
      ) as unknown as typeof HTMLCanvasElement.prototype.toBlob;
    });

    test('successfully compresses an image and returns genuine result data', async () => {
      // 2000-byte test file
      const testFile = new File([new Uint8Array(2000)], 'test.jpg', { type: 'image/jpeg' });
      const result = await compressImage(testFile, {
        quality: 80,
        outputFormat: 'original',
      });

      expect(result.blob).toBeDefined();
      expect(result.originalSize).toBe(2000);
      expect(result.compressedSize).toBeLessThan(2000);
      expect(result.reductionPercentage).toBeGreaterThan(0);
      expect(result.width).toBe(800);
      expect(result.height).toBe(600);
      expect(result.outputMimeType).toBe('image/jpeg');
    });

    test('quality setting affects compression output size', async () => {
      const testFile = new File([new Uint8Array(5000)], 'test.jpg', { type: 'image/jpeg' });

      const lowQualityResult = await compressImage(testFile, {
        quality: 40,
        outputFormat: 'original',
      });

      const highQualityResult = await compressImage(testFile, {
        quality: 90,
        outputFormat: 'original',
      });

      expect(lowQualityResult.compressedSize).toBeLessThan(highQualityResult.compressedSize);
    });

    test('retains original file without false savings when compressed size is larger', async () => {
      // 500-byte tiny file: toBlob mock at quality 0.8 returns 800 bytes (larger!)
      const tinyFile = new File([new Uint8Array(500)], 'tiny.jpg', { type: 'image/jpeg' });

      const result = await compressImage(tinyFile, {
        quality: 80,
        outputFormat: 'original',
      });

      expect(result.alreadyOptimized).toBe(true);
      expect(result.reductionPercentage).toBe(0);
      // Retained the smaller 500-byte original
      expect(result.compressedSize).toBe(500);
    });

    test('compresses image under requested target size in targetSize mode', async () => {
      // 10000-byte file, target 0.5 KB (512 bytes)
      const testFile = new File([new Uint8Array(10000)], 'large-photo.jpg', { type: 'image/jpeg' });

      const result = await compressImage(testFile, {
        mode: 'targetSize',
        quality: 80,
        targetSizeKb: 1, // 1024 bytes target
        outputFormat: 'original',
      });

      expect(result.blob).toBeDefined();
      expect(result.compressedSize).toBeLessThanOrEqual(1024);
      expect(result.compressedSize).toBeLessThan(testFile.size);
    });
  });
});
