import {
  validateImageFile,
  validateDimensionInput,
  MAX_FILE_SIZE_BYTES,
} from '../lib/validation';

describe('Image Resizer Validation', () => {
  test('accepts valid JPEG, PNG, and WebP files', () => {
    const jpg = new File(['dummy content'], 'photo.jpg', { type: 'image/jpeg' });
    const png = new File(['dummy content'], 'icon.png', { type: 'image/png' });
    const webp = new File(['dummy content'], 'image.webp', { type: 'image/webp' });

    expect(validateImageFile(jpg).valid).toBe(true);
    expect(validateImageFile(png).valid).toBe(true);
    expect(validateImageFile(webp).valid).toBe(true);
  });

  test('rejects unsupported file formats like PDF or text', () => {
    const pdf = new File(['dummy content'], 'document.pdf', { type: 'application/pdf' });
    const txt = new File(['dummy content'], 'notes.txt', { type: 'text/plain' });

    const pdfRes = validateImageFile(pdf);
    expect(pdfRes.valid).toBe(false);
    expect(pdfRes.error).toMatch(/unsupported/i);

    const txtRes = validateImageFile(txt);
    expect(txtRes.valid).toBe(false);
  });

  test('rejects files larger than 50MB', () => {
    const oversizedFile = new File(['x'], 'huge.jpg', { type: 'image/jpeg' });
    Object.defineProperty(oversizedFile, 'size', { value: MAX_FILE_SIZE_BYTES + 1024 });

    const result = validateImageFile(oversizedFile);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/exceeds maximum allowed size/i);
  });

  test('rejects 0 byte empty files', () => {
    const emptyFile = new File([], 'empty.jpg', { type: 'image/jpeg' });
    Object.defineProperty(emptyFile, 'size', { value: 0 });

    const result = validateImageFile(emptyFile);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/empty/i);
  });

  test('validateDimensionInput validates and clamps integers safely', () => {
    expect(validateDimensionInput(1920).sanitized).toBe(1920);
    expect(validateDimensionInput(1920.7).sanitized).toBe(1921);
    expect(validateDimensionInput(-10).valid).toBe(false);
    expect(validateDimensionInput(-10).sanitized).toBe(1);
    expect(validateDimensionInput(20000).valid).toBe(false);
    expect(validateDimensionInput(20000).sanitized).toBe(16384);
    expect(validateDimensionInput(NaN).valid).toBe(false);
    expect(validateDimensionInput(Infinity).valid).toBe(false);
  });
});
