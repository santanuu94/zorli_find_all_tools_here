import {
  checkHasTransparency,
  composeResult,
  setCustomInferenceRunner,
  removeBackground,
  applyAlphaMask,
  smoothstep,
} from '../lib/remover-engine';
import { getCleanRemovalFilename } from '../lib/filename';

describe('Background Remover Engine & Helpers', () => {
  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();

    // Mock HTMLCanvasElement for JSDOM
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
      fillStyle: '',
      fillRect: jest.fn(),
      drawImage: jest.fn(),
      putImageData: jest.fn(),
      getImageData: jest.fn().mockReturnValue({
        data: new Uint8ClampedArray(10 * 10 * 4),
        width: 10,
        height: 10,
      }),
      createImageData: jest.fn().mockImplementation((w, h) => ({
        data: new Uint8ClampedArray(w * h * 4),
        width: w,
        height: h,
      })),
    });

    HTMLCanvasElement.prototype.toBlob = jest.fn().mockImplementation((cb, type) => {
      cb(new Blob(['mock-png-data'], { type: type || 'image/png' }));
    });
  });

  afterEach(() => {
    setCustomInferenceRunner(null);
  });

  describe('Filename Generator', () => {
    test('appends -no-bg.png for transparent output', () => {
      expect(getCleanRemovalFilename('photo.jpg', 'transparent')).toBe('photo-no-bg.png');
      expect(getCleanRemovalFilename('avatar.png', 'transparent')).toBe('avatar-no-bg.png');
      expect(getCleanRemovalFilename('product.webp', 'transparent')).toBe('product-no-bg.png');
    });

    test('prevents repeated suffixes such as photo-no-bg-no-bg.png', () => {
      expect(getCleanRemovalFilename('photo-no-bg.jpg', 'transparent')).toBe('photo-no-bg.png');
      expect(getCleanRemovalFilename('photo-no-bg-no-bg.png', 'transparent')).toBe('photo-no-bg.png');
      expect(getCleanRemovalFilename('photo_no_bg.png', 'transparent')).toBe('photo-no-bg.png');
    });

    test('generates appropriate filenames for solid background colors', () => {
      expect(getCleanRemovalFilename('car.jpg', 'white')).toBe('car-bg-white.png');
      expect(getCleanRemovalFilename('headshot.png', 'black')).toBe('headshot-bg-black.png');
      expect(getCleanRemovalFilename('shoe.webp', 'custom')).toBe('shoe-bg-custom.png');
    });
  });

  describe('Transparency Detector', () => {
    test('detects transparent pixels when alpha < 250 exists', () => {
      // 2x2 image
      const data = new Uint8ClampedArray(2 * 2 * 4);
      data[3] = 255;  // pixel 1: opaque
      data[7] = 255;  // pixel 2: opaque
      data[11] = 0;   // pixel 3: fully transparent
      data[15] = 255; // pixel 4: opaque

      const imgData = {
        data,
        width: 2,
        height: 2,
        colorSpace: 'srgb' as PredefinedColorSpace,
      };

      expect(checkHasTransparency(imgData)).toBe(true);
    });

    test('returns false when image is 100% opaque', () => {
      const data = new Uint8ClampedArray(2 * 2 * 4);
      for (let i = 0; i < 4; i++) {
        data[i * 4 + 3] = 255;
      }

      const imgData = {
        data,
        width: 2,
        height: 2,
        colorSpace: 'srgb' as PredefinedColorSpace,
      };

      expect(checkHasTransparency(imgData)).toBe(false);
    });
  });

  describe('Smoothstep & Clean Alpha Masking', () => {
    test('smoothstep correctly computes Hermite interpolation', () => {
      expect(smoothstep(0, 100, -10)).toBe(0);
      expect(smoothstep(0, 100, 0)).toBe(0);
      expect(smoothstep(0, 100, 100)).toBe(1);
      expect(smoothstep(0, 100, 150)).toBe(1);
      // Midpoint: 0.5 * 0.5 * (3 - 2 * 0.5) = 0.5
      expect(smoothstep(0, 100, 50)).toBeCloseTo(0.5);
    });

    test('applyAlphaMask completely wipes background noise and shadow remnants', () => {
      const width = 3;
      const height = 1;
      const origData = new Uint8ClampedArray([
        255, 0, 0, 255, // Pixel 0: Red subject
        0, 255, 0, 255, // Pixel 1: Green edge
        100, 100, 100, 255, // Pixel 2: Background floor shadow
      ]);
      const origImg = {
        data: origData,
        width,
        height,
        colorSpace: 'srgb' as PredefinedColorSpace,
      };

      // Mask: pixel 0 is confident foreground (240), pixel 1 is edge (150), pixel 2 is floor shadow (35)
      const maskData = new Uint8ClampedArray([
        240, 240, 240, 255,
        150, 150, 150, 255,
        35, 35, 35, 255,
      ]);

      // Balanced threshold (35):
      // Low cutoff at 35 is ~45.5. Mask value 35 <= 45.5 => alpha forced to 0 (cleanly erased!)
      const result = applyAlphaMask(origImg, maskData, 35);
      
      // Pixel 2 (floor shadow) must be completely transparent (alpha = 0)
      expect(result.data[11]).toBe(0);

      // Pixel 0 (foreground) must be fully opaque
      expect(result.data[3]).toBe(255);

      // Pixel 1 (edge) must be smoothly antialiased (between 50 and 200)
      expect(result.data[7]).toBeGreaterThan(50);
      expect(result.data[7]).toBeLessThan(200);
    });

    test('Aggressive Cutout threshold (60) erases stubborn background remnants', () => {
      const width = 2;
      const height = 1;
      const origData = new Uint8ClampedArray([
        200, 200, 200, 255, // Pixel 0: Stubborn shadow
        255, 255, 255, 255, // Pixel 1: Solid subject
      ]);
      const origImg = {
        data: origData,
        width,
        height,
        colorSpace: 'srgb' as PredefinedColorSpace,
      };

      // Mask value 65 in stubborn shadow area
      const maskData = new Uint8ClampedArray([
        65, 65, 65, 255,
        250, 250, 250, 255,
      ]);

      // Under Balanced (35), mask 65 might retain low alpha (~20)
      const balancedResult = applyAlphaMask(origImg, maskData, 35);
      expect(balancedResult.data[3]).toBeGreaterThan(0);

      // Under Aggressive Cutout (60), low cutoff is 78. Value 65 <= 78 => alpha becomes 0!
      const aggressiveResult = applyAlphaMask(origImg, maskData, 60);
      expect(aggressiveResult.data[3]).toBe(0);
      expect(aggressiveResult.data[7]).toBe(255);
    });
  });

  describe('Canvas Result Compositing', () => {
    test('produces a PNG Blob with transparent background', async () => {
      const width = 10;
      const height = 10;
      const data = new Uint8ClampedArray(width * height * 4);

      for (let i = 0; i < width * height; i++) {
        if (i < 50) {
          data[i * 4] = 255;
          data[i * 4 + 3] = 255;
        } else {
          data[i * 4 + 3] = 0;
        }
      }

      const foreground = {
        data,
        width,
        height,
        colorSpace: 'srgb' as PredefinedColorSpace,
      };

      const blob = await composeResult(foreground, width, height, 'transparent');
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('image/png');
    });

    test('produces a PNG Blob when composited over white background', async () => {
      const width = 5;
      const height = 5;
      const data = new Uint8ClampedArray(width * height * 4);
      const foreground = {
        data,
        width,
        height,
        colorSpace: 'srgb' as PredefinedColorSpace,
      };

      const blob = await composeResult(foreground, width, height, 'white');
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('image/png');
    });

    test('produces a PNG Blob when composited over custom color', async () => {
      const width = 5;
      const height = 5;
      const data = new Uint8ClampedArray(width * height * 4);
      const foreground = {
        data,
        width,
        height,
        colorSpace: 'srgb' as PredefinedColorSpace,
      };

      const blob = await composeResult(foreground, width, height, 'custom', '#FF5733');
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('image/png');
    });
  });

  describe('Custom Inference Runner (Pipeline Injection)', () => {
    test('executes custom runner and dispatches progress updates', async () => {
      const mockRunner = jest.fn().mockImplementation(async (img, model, onProgress) => {
        onProgress?.({ stage: 'Mock analysis...', percent: 50 });
        const data = new Uint8ClampedArray(10 * 10 * 4);
        data[3] = 0;
        return {
          data,
          width: 10,
          height: 10,
          colorSpace: 'srgb' as PredefinedColorSpace,
        };
      });

      setCustomInferenceRunner(mockRunner);

      const fakeImage = {
        naturalWidth: 10,
        naturalHeight: 10,
        width: 10,
        height: 10,
      } as unknown as HTMLImageElement;

      const progressCallback = jest.fn();
      const result = await removeBackground(fakeImage, 'rmbg', progressCallback);

      expect(mockRunner).toHaveBeenCalledWith(fakeImage, 'rmbg', progressCallback, 35);
      expect(progressCallback).toHaveBeenCalledWith({
        stage: 'Mock analysis...',
        percent: 50,
      });
      expect(result.width).toBe(10);
      expect(result.height).toBe(10);
      expect(checkHasTransparency(result)).toBe(true);
    });
  });
});
