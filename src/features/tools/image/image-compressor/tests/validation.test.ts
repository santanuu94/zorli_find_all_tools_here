import { validateImageFile } from '../lib/validation';

describe('Image Compressor File Validation Tests', () => {
  test('accepts valid JPEG, PNG, and WebP types', () => {
    const mockJpg = new File(['dummycontent'], 'photo.jpg', { type: 'image/jpeg' });
    const mockPng = new File(['dummycontent'], 'diagram.png', { type: 'image/png' });
    const mockWebp = new File(['dummycontent'], 'graphic.webp', { type: 'image/webp' });

    expect(validateImageFile(mockJpg).valid).toBe(true);
    expect(validateImageFile(mockPng).valid).toBe(true);
    expect(validateImageFile(mockWebp).valid).toBe(true);
  });

  test('accepts files with valid extensions even if MIME type is empty', () => {
    const mockJpgNoMime = new File(['dummycontent'], 'photo.jpeg', { type: '' });
    expect(validateImageFile(mockJpgNoMime).valid).toBe(true);
  });

  test('rejects unsupported file formats gracefully', () => {
    const mockPdf = new File(['dummycontent'], 'document.pdf', { type: 'application/pdf' });
    const mockTxt = new File(['dummycontent'], 'notes.txt', { type: 'text/plain' });
    const mockGif = new File(['dummycontent'], 'animation.gif', { type: 'image/gif' });

    const pdfResult = validateImageFile(mockPdf);
    expect(pdfResult.valid).toBe(false);
    expect(pdfResult.error).toMatch(/Unsupported format/i);

    const txtResult = validateImageFile(mockTxt);
    expect(txtResult.valid).toBe(false);

    const gifResult = validateImageFile(mockGif);
    expect(gifResult.valid).toBe(false);
  });

  test('rejects empty files (0 bytes)', () => {
    const emptyFile = new File([], 'empty.jpg', { type: 'image/jpeg' });
    const result = validateImageFile(emptyFile);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/empty/i);
  });

  test('rejects files exceeding 50MB size limit', () => {
    // 51 MB mock file
    const largeFile = {
      name: 'large.jpg',
      size: 51 * 1024 * 1024,
      type: 'image/jpeg',
    } as File;

    const result = validateImageFile(largeFile);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/exceeds maximum size/i);
  });

  test('rejects null or undefined file input', () => {
    const result = validateImageFile(null as unknown as File);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/No file provided/i);
  });
});
