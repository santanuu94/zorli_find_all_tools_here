import {
  formatFileSize,
  hasPdfMagicBytes,
  sanitizePdfFilename,
} from '../lib/format-utils';
import {
  buildEqualPlan,
  buildExtractPlan,
  buildRangePlan,
} from '../lib/split-plan-generator';

describe('PDF Splitter Validation & Plan Generator Tests', () => {
  describe('Format and Validation Utilities', () => {
    test('formatFileSize formats byte sizes correctly on 1024 basis', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(500)).toBe('500 B');
      expect(formatFileSize(1024)).toBe('1.0 KB');
      expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
    });

    test('hasPdfMagicBytes detects standard %PDF- header', () => {
      const validPdfHeader = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
      const invalidHeader = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]); // GIF
      const shortBytes = new Uint8Array([0x25, 0x50]);

      expect(hasPdfMagicBytes(validPdfHeader)).toBe(true);
      expect(hasPdfMagicBytes(invalidHeader)).toBe(false);
      expect(hasPdfMagicBytes(shortBytes)).toBe(false);
    });

    test('sanitizePdfFilename guarantees clean filenames with .pdf extension', () => {
      expect(sanitizePdfFilename('report')).toBe('report.pdf');
      expect(sanitizePdfFilename('chapter:1/part?2.pdf')).toBe('chapter_1_part_2.pdf');
      expect(sanitizePdfFilename('   ')).toBe('split_document.pdf');
    });
  });

  describe('Mode A: Range Plan Generator', () => {
    test('successfully builds a valid multi-range plan', () => {
      const plan = buildRangePlan(
        10,
        [
          { id: '1', start: 1, end: 3 },
          { id: '2', start: 4, end: 7 },
          { id: '3', start: 8, end: 10 },
        ],
        'document.pdf'
      );

      expect(plan.isValid).toBe(true);
      expect(plan.items.length).toBe(3);
      expect(plan.items[0].pages).toEqual([1, 2, 3]);
      expect(plan.items[0].pageCount).toBe(3);
      expect(plan.items[0].filename).toBe('document_pages_1-3.pdf');
      expect(plan.items[1].pages).toEqual([4, 5, 6, 7]);
      expect(plan.items[2].pages).toEqual([8, 9, 10]);
      expect(plan.uncoveredPages).toEqual([]);
      expect(plan.hasOverlaps).toBe(false);
    });

    test('detects uncovered pages when ranges do not cover the whole document', () => {
      const plan = buildRangePlan(
        10,
        [
          { id: '1', start: 1, end: 3 },
          { id: '2', start: 7, end: 8 },
        ],
        'contract.pdf'
      );

      expect(plan.isValid).toBe(true);
      expect(plan.uncoveredPages).toEqual([4, 5, 6, 9, 10]);
    });

    test('detects overlapping pages across ranges', () => {
      const plan = buildRangePlan(
        10,
        [
          { id: '1', start: 1, end: 5 },
          { id: '2', start: 4, end: 8 },
        ],
        'file.pdf'
      );

      expect(plan.isValid).toBe(true);
      expect(plan.hasOverlaps).toBe(true);
      expect(plan.overlapNotes).toContain('4, 5');
    });

    test('rejects reversed ranges such as 8-3', () => {
      const plan = buildRangePlan(
        10,
        [{ id: '1', start: 8, end: 3 }],
        'file.pdf'
      );

      expect(plan.isValid).toBe(false);
      expect(plan.errorMessage).toMatch(/reversed/i);
    });

    test('rejects out of bounds page numbers', () => {
      const plan = buildRangePlan(
        5,
        [{ id: '1', start: 1, end: 8 }],
        'file.pdf'
      );

      expect(plan.isValid).toBe(false);
      expect(plan.errorMessage).toMatch(/only has 5 pages/i);
    });

    test('rejects page numbers less than 1', () => {
      const plan = buildRangePlan(
        5,
        [{ id: '1', start: 0, end: 3 }],
        'file.pdf'
      );

      expect(plan.isValid).toBe(false);
      expect(plan.errorMessage).toMatch(/must be 1 or greater/i);
    });
  });

  describe('Mode B: Extract Plan Generator', () => {
    test('successfully builds an individual page extraction plan and deduplicates', () => {
      const plan = buildExtractPlan(10, [1, 3, 5, 3], 'paper.pdf');

      expect(plan.isValid).toBe(true);
      expect(plan.items.length).toBe(3); // 3 unique pages
      expect(plan.items[0].pages).toEqual([1]);
      expect(plan.items[0].filename).toBe('paper_page_1.pdf');
      expect(plan.items[1].pages).toEqual([3]);
      expect(plan.items[2].pages).toEqual([5]);
      expect(plan.uncoveredPages).toEqual([2, 4, 6, 7, 8, 9, 10]);
    });

    test('rejects empty page selections', () => {
      const plan = buildExtractPlan(10, [], 'paper.pdf');
      expect(plan.isValid).toBe(false);
      expect(plan.errorMessage).toMatch(/Select at least one page/i);
    });

    test('rejects out-of-bounds page selections', () => {
      const plan = buildExtractPlan(5, [1, 7], 'paper.pdf');
      expect(plan.isValid).toBe(false);
      expect(plan.errorMessage).toMatch(/outside the document range/i);
    });
  });

  describe('Mode C: Equal Groups Plan Generator', () => {
    test('divides document into equal parts and correctly preserves the final partial group', () => {
      // 23 pages, 5 pages per group -> 5 groups (5, 5, 5, 5, 3)
      const plan = buildEqualPlan(23, 5, 'handbook.pdf');

      expect(plan.isValid).toBe(true);
      expect(plan.items.length).toBe(5);
      expect(plan.items[0].pages).toEqual([1, 2, 3, 4, 5]);
      expect(plan.items[1].pages).toEqual([6, 7, 8, 9, 10]);
      expect(plan.items[2].pages).toEqual([11, 12, 13, 14, 15]);
      expect(plan.items[3].pages).toEqual([16, 17, 18, 19, 20]);
      expect(plan.items[4].pages).toEqual([21, 22, 23]); // final partial group
      expect(plan.items[4].pageCount).toBe(3);
      expect(plan.uncoveredPages).toEqual([]);
    });

    test('handles single-page grouping', () => {
      const plan = buildEqualPlan(3, 1, 'notes.pdf');

      expect(plan.isValid).toBe(true);
      expect(plan.items.length).toBe(3);
      expect(plan.items[0].pageCount).toBe(1);
      expect(plan.items[1].pageCount).toBe(1);
      expect(plan.items[2].pageCount).toBe(1);
    });

    test('rejects pagesPerFile < 1', () => {
      const plan = buildEqualPlan(10, 0, 'notes.pdf');
      expect(plan.isValid).toBe(false);
      expect(plan.errorMessage).toMatch(/integer of 1 or greater/i);
    });
  });
});
