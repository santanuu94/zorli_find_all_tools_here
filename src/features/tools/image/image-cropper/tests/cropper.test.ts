import {
  ASPECT_RATIO_PRESETS,
  generateCroppedFilename,
  getMimeTypeForFormat,
  getSocialPresetRatio,
  SOCIAL_PLATFORMS,
} from '../lib/cropper';

describe('Image Cropper Engine & Presets', () => {
  describe('generateCroppedFilename', () => {
    test('prepends cropped- to filename while preserving extension', () => {
      expect(generateCroppedFilename('portrait.jpg')).toBe('cropped-portrait.jpg');
      expect(generateCroppedFilename('logo.png')).toBe('cropped-logo.png');
      expect(generateCroppedFilename('artwork.webp')).toBe('cropped-artwork.webp');
    });

    test('handles multiple dots in filename correctly', () => {
      expect(generateCroppedFilename('my.photo.final.png')).toBe('cropped-my.photo.final.png');
    });

    test('handles filename without extension cleanly', () => {
      expect(generateCroppedFilename('raw-photo')).toBe('cropped-raw-photo');
    });
  });

  describe('getMimeTypeForFormat', () => {
    test('maps jpg to image/jpeg', () => {
      expect(getMimeTypeForFormat('jpg')).toBe('image/jpeg');
    });

    test('maps png to image/png', () => {
      expect(getMimeTypeForFormat('png')).toBe('image/png');
    });

    test('maps webp to image/webp', () => {
      expect(getMimeTypeForFormat('webp')).toBe('image/webp');
    });
  });

  describe('ASPECT_RATIO_PRESETS', () => {
    test('contains Free, 1:1, 4:5, 3:4, 16:9, and 9:16 presets', () => {
      const presetIds = ASPECT_RATIO_PRESETS.map((p) => p.id);
      expect(presetIds).toEqual(['free', '1:1', '4:5', '3:4', '16:9', '9:16']);
    });

    test('defines correct aspect ratios', () => {
      const freePreset = ASPECT_RATIO_PRESETS.find((p) => p.id === 'free');
      expect(freePreset?.ratio).toBeUndefined();

      const squarePreset = ASPECT_RATIO_PRESETS.find((p) => p.id === '1:1');
      expect(squarePreset?.ratio).toBe(1);

      const portraitPreset = ASPECT_RATIO_PRESETS.find((p) => p.id === '4:5');
      expect(portraitPreset?.ratio).toBeCloseTo(0.8);

      const widePreset = ASPECT_RATIO_PRESETS.find((p) => p.id === '16:9');
      expect(widePreset?.ratio).toBeCloseTo(16 / 9);

      const verticalPreset = ASPECT_RATIO_PRESETS.find((p) => p.id === '9:16');
      expect(verticalPreset?.ratio).toBeCloseTo(9 / 16);
    });
  });

  describe('SOCIAL_PLATFORMS reuse and ratio calculation', () => {
    test('includes primary platforms: YouTube, Instagram, Facebook, X', () => {
      const platformIds = SOCIAL_PLATFORMS.map((p) => p.id);
      expect(platformIds).toContain('youtube');
      expect(platformIds).toContain('instagram');
      expect(platformIds).toContain('facebook');
      expect(platformIds).toContain('twitter');
    });

    test('getSocialPresetRatio calculates accurate aspect ratio from dimensions', () => {
      const instagramPlatform = SOCIAL_PLATFORMS.find((p) => p.id === 'instagram');
      const squarePost = instagramPlatform?.presets.find((pr) => pr.id === 'instagram-post-square');
      expect(squarePost).toBeDefined();
      if (squarePost) {
        expect(getSocialPresetRatio(squarePost)).toBe(1);
      }

      const storyPreset = instagramPlatform?.presets.find((pr) => pr.id === 'instagram-story');
      expect(storyPreset).toBeDefined();
      if (storyPreset) {
        expect(getSocialPresetRatio(storyPreset)).toBeCloseTo(9 / 16);
      }

      const youtubePlatform = SOCIAL_PLATFORMS.find((p) => p.id === 'youtube');
      const ytThumb = youtubePlatform?.presets.find((pr) => pr.id === 'youtube-thumbnail');
      expect(ytThumb).toBeDefined();
      if (ytThumb) {
        expect(getSocialPresetRatio(ytThumb)).toBeCloseTo(16 / 9);
      }
    });
  });

  describe('Crop Coordinate Precision & Scaling', () => {
    test('calculates correct natural pixel bounds from percentages on high-res images', () => {
      const { convertToPixelCrop } = require('react-image-crop');
      // Simulate user selecting an 80% wide 16:9 crop on a 4K (3840x2160) photo
      const percentCrop = {
        unit: '%',
        x: 10,
        y: 10,
        width: 80,
        height: 80,
      };

      const naturalCrop = convertToPixelCrop(percentCrop, 3840, 2160);
      expect(naturalCrop.x).toBe(384);
      expect(naturalCrop.y).toBe(216);
      expect(naturalCrop.width).toBe(3072);
      expect(naturalCrop.height).toBe(1728);
      // Aspect ratio of output crop must match exactly
      expect(naturalCrop.width / naturalCrop.height).toBeCloseTo(16 / 9);
    });

    test('preserves 1:1 square ratio coordinates on vertical image', () => {
      const { convertToPixelCrop } = require('react-image-crop');
      // 1080x1920 portrait photo, 1:1 square crop centered
      const squarePercentCrop = {
        unit: '%',
        x: 0,
        y: 21.875,
        width: 100,
        height: 56.25,
      };

      const naturalCrop = convertToPixelCrop(squarePercentCrop, 1080, 1920);
      expect(naturalCrop.width).toBe(1080);
      expect(naturalCrop.height).toBe(1080);
      expect(naturalCrop.x).toBe(0);
      expect(naturalCrop.y).toBe(420);
    });
  });
});
