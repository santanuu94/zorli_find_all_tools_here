import { validateImageFile, detectFormat } from '../lib/validation';

describe('Image Cropper Validation & Format Detection', () => {
  test('detects JPG formats correctly', () => {
    const fileJpg = new File(['mock'], 'photo.jpg', { type: 'image/jpeg' });
    const fileJpeg = new File(['mock'], 'photo.jpeg', { type: 'image/jpeg' });
    expect(detectFormat(fileJpg)).toBe('jpg');
    expect(detectFormat(fileJpeg)).toBe('jpg');
  });

  test('detects PNG formats correctly', () => {
    const filePng = new File(['mock'], 'avatar.png', { type: 'image/png' });
    expect(detectFormat(filePng)).toBe('png');
  });

  test('detects WebP formats correctly', () => {
    const fileWebp = new File(['mock'], 'banner.webp', { type: 'image/webp' });
    expect(detectFormat(fileWebp)).toBe('webp');
  });

  test('falls back to filename extension if MIME type is missing', () => {
    const fileExt = new File(['mock'], 'graphic.WEBP', { type: 'application/octet-stream' });
    expect(detectFormat(fileExt)).toBe('webp');
  });

  test('returns null for unsupported formats', () => {
    const fileGif = new File(['mock'], 'anim.gif', { type: 'image/gif' });
    const filePdf = new File(['mock'], 'doc.pdf', { type: 'application/pdf' });
    const fileSvg = new File(['mock'], 'vector.svg', { type: 'image/svg+xml' });
    expect(detectFormat(fileGif)).toBeNull();
    expect(detectFormat(filePdf)).toBeNull();
    expect(detectFormat(fileSvg)).toBeNull();
  });

  test('validates supported files within size limits', () => {
    const validFile = new File(['mock data'], 'image.jpg', { type: 'image/jpeg' });
    const result = validateImageFile(validFile);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
    expect(result.detectedFormat).toBe('jpg');
  });

  test('rejects unsupported file types with human-readable error', () => {
    const invalidFile = new File(['mock data'], 'anim.gif', { type: 'image/gif' });
    const result = validateImageFile(invalidFile);
    expect(result.valid).toBe(false);
    expect(result.error).toBe(
      "This file type isn't supported. Please upload JPG, PNG, or WebP."
    );
  });

  test('rejects files exceeding the 50MB limit with human-readable error', () => {
    const largeFile = new File(['mock data'], 'large-photo.jpg', { type: 'image/jpeg' });
    Object.defineProperty(largeFile, 'size', { value: 55 * 1024 * 1024 });
    const result = validateImageFile(largeFile);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds the 50 MB limit');
  });
});
