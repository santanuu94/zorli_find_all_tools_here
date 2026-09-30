import { renderHook, act } from '@testing-library/react';
import { useImageBackgroundRemover } from '../hooks/useImageBackgroundRemover';
import { setCustomInferenceRunner } from '../lib/remover-engine';

describe('Image Background Remover Validation & Hook Tests', () => {
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

  beforeEach(() => {
    setCustomInferenceRunner(async (img) => {
      const w = img.naturalWidth || 50;
      const h = img.naturalHeight || 50;
      const data = new Uint8ClampedArray(w * h * 4);
      data[3] = 0; // has transparent pixel
      return {
        data,
        width: w,
        height: h,
        colorSpace: 'srgb' as PredefinedColorSpace,
      };
    });
  });

  afterEach(() => {
    setCustomInferenceRunner(null);
  });

  test('filters out unsupported file formats like pdf or text', async () => {
    const { result } = renderHook(() => useImageBackgroundRemover());

    const validJpg = new File(['fake-jpg'], 'photo.jpg', { type: 'image/jpeg' });
    const invalidPdf = new File(['fake-pdf'], 'document.pdf', { type: 'application/pdf' });
    const invalidTxt = new File(['fake-txt'], 'notes.txt', { type: 'text/plain' });

    await act(async () => {
      await result.current.addFiles([validJpg, invalidPdf, invalidTxt]);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].file.name).toBe('photo.jpg');
    expect(result.current.items[0].modelChoice).toBe('rmbg');
    expect(result.current.items[0].cleanlinessThreshold).toBe(35);
  });

  test('supports JPG, PNG, and WebP formats', async () => {
    const { result } = renderHook(() => useImageBackgroundRemover());

    const jpg = new File(['jpg'], 'image1.jpg', { type: 'image/jpeg' });
    const png = new File(['png'], 'image2.png', { type: 'image/png' });
    const webp = new File(['webp'], 'image3.webp', { type: 'image/webp' });

    await act(async () => {
      await result.current.addFiles([jpg, png, webp]);
    });

    expect(result.current.items).toHaveLength(3);
    expect(result.current.items.map((i) => i.file.name)).toEqual([
      'image1.jpg',
      'image2.png',
      'image3.webp',
    ]);
  });

  test('switches background mode without resetting image status', async () => {
    const { result } = renderHook(() => useImageBackgroundRemover());

    const file = new File(['img'], 'product.png', { type: 'image/png' });

    await act(async () => {
      await result.current.addFiles([file]);
    });

    const itemId = result.current.items[0].id;

    // Change background to white
    await act(async () => {
      await result.current.updateBackground(itemId, 'white');
    });

    expect(result.current.items[0].backgroundMode).toBe('white');

    // Change background to custom color
    await act(async () => {
      await result.current.updateBackground(itemId, 'custom', '#10B981');
    });

    expect(result.current.items[0].backgroundMode).toBe('custom');
    expect(result.current.items[0].customColor).toBe('#10B981');
  });

  test('updates cleanliness threshold dynamically', async () => {
    const { result } = renderHook(() => useImageBackgroundRemover());

    const file = new File(['img'], 'portrait.jpg', { type: 'image/jpeg' });

    await act(async () => {
      await result.current.addFiles([file]);
    });

    const itemId = result.current.items[0].id;

    // Switch to aggressive threshold 60
    await act(async () => {
      await result.current.updateCleanlinessThreshold(itemId, 60);
    });

    expect(result.current.items[0].cleanlinessThreshold).toBe(60);

    // Switch to soft threshold 15
    await act(async () => {
      await result.current.updateCleanlinessThreshold(itemId, 15);
    });

    expect(result.current.items[0].cleanlinessThreshold).toBe(15);
  });

  test('handles item removal and clearAll', async () => {
    const { result } = renderHook(() => useImageBackgroundRemover());

    const file1 = new File(['1'], 'one.jpg', { type: 'image/jpeg' });
    const file2 = new File(['2'], 'two.jpg', { type: 'image/jpeg' });

    await act(async () => {
      await result.current.addFiles([file1, file2]);
    });

    expect(result.current.items).toHaveLength(2);

    act(() => {
      result.current.removeItem(result.current.items[0].id);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].file.name).toBe('two.jpg');

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.activeId).toBeNull();
  });
});
