import { formatFileSize } from '../utils/format-file-size';

/**
 * Unit tests specification for Image Compressor utilities
 */
describe('Image Compressor Utility Tests', () => {
  test('formats bytes properly into human-readable strings', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1048576)).toBe('1 MB');
  });
});
