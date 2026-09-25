import { sanitizeInput } from '../utils/tool-utils';

describe('Tool Unit Tests', () => {
  test('sanitizes input', () => {
    expect(sanitizeInput('  test  ')).toBe('test');
  });
});
