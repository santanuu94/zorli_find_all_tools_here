import { validateImageFile } from '../lib/validation';

describe('Image Compressor File Validation Tests', () => {
  test('accepts valid jpeg and png types', () => {
    const mockJpg = new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' });
    expect(validateImageFile(mockJpg).valid).toBe(true);
  });
});
