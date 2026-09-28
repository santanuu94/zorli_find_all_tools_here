import {
  getTargetMimeType,
  getMimeTypeForFormat,
  generateConvertedFilename,
  calculateSizeDelta,
  isLossyFormat,
  FORMAT_OPTIONS,
} from '../lib/converter';

describe('Image Converter Engine & Logic', () => {
  describe('getTargetMimeType and getMimeTypeForFormat', () => {
    test('maps jpg to image/jpeg', () => {
      expect(getTargetMimeType('jpg')).toBe('image/jpeg');
      expect(getMimeTypeForFormat('jpg')).toBe('image/jpeg');
    });

    test('maps png to image/png', () => {
      expect(getTargetMimeType('png')).toBe('image/png');
      expect(getMimeTypeForFormat('png')).toBe('image/png');
    });

    test('maps webp to image/webp', () => {
      expect(getTargetMimeType('webp')).toBe('image/webp');
      expect(getMimeTypeForFormat('webp')).toBe('image/webp');
    });
  });

  describe('generateConvertedFilename', () => {
    test('replaces .png with .webp', () => {
      expect(generateConvertedFilename('photo.png', 'webp')).toBe('photo.webp');
    });

    test('replaces .jpg with .png', () => {
      expect(generateConvertedFilename('vacation-pic.jpg', 'png')).toBe('vacation-pic.png');
    });

    test('replaces .jpeg with .jpg', () => {
      expect(generateConvertedFilename('sunset.jpeg', 'jpg')).toBe('sunset.jpg');
    });

    test('handles multiple dots in filename correctly', () => {
      expect(generateConvertedFilename('my.awesome.screenshot.png', 'webp')).toBe(
        'my.awesome.screenshot.webp'
      );
    });

    test('handles filenames with no extension cleanly', () => {
      expect(generateConvertedFilename('raw-image', 'jpg')).toBe('raw-image.jpg');
    });
  });

  describe('isLossyFormat', () => {
    test('identifies jpg and webp as lossy', () => {
      expect(isLossyFormat('jpg')).toBe(true);
      expect(isLossyFormat('webp')).toBe(true);
    });

    test('identifies png as lossless', () => {
      expect(isLossyFormat('png')).toBe(false);
    });
  });

  describe('calculateSizeDelta', () => {
    test('calculates negative delta when converted file is smaller', () => {
      const original = 1000;
      const converted = 400;
      const delta = calculateSizeDelta(original, converted);
      expect(delta).toEqual({
        deltaPercent: -60,
        isSmaller: true,
      });
    });

    test('calculates positive delta when converted file is larger', () => {
      const original = 500;
      const converted = 800;
      const delta = calculateSizeDelta(original, converted);
      expect(delta).toEqual({
        deltaPercent: 60,
        isSmaller: false,
      });
    });

    test('handles identical sizes as 0% change', () => {
      const delta = calculateSizeDelta(1000, 1000);
      expect(delta).toEqual({
        deltaPercent: 0,
        isSmaller: false,
      });
    });
  });

  describe('FORMAT_OPTIONS definitions', () => {
    test('defines exactly the 3 genuine V1 formats: JPG, PNG, WebP', () => {
      const formats = FORMAT_OPTIONS.map((f) => f.format);
      expect(formats).toEqual(['jpg', 'png', 'webp']);
    });

    test('provides accurate lossy/lossless flags and transparency support', () => {
      const pngOpt = FORMAT_OPTIONS.find((f) => f.format === 'png');
      expect(pngOpt?.isLossy).toBe(false);
      expect(pngOpt?.supportsTransparency).toBe(true);

      const jpgOpt = FORMAT_OPTIONS.find((f) => f.format === 'jpg');
      expect(jpgOpt?.isLossy).toBe(true);
      expect(jpgOpt?.supportsTransparency).toBe(false);

      const webpOpt = FORMAT_OPTIONS.find((f) => f.format === 'webp');
      expect(webpOpt?.isLossy).toBe(true);
      expect(webpOpt?.supportsTransparency).toBe(true);
    });
  });
});
