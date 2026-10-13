import { RangeRow, SplitPlan, SplitPlanItem } from '../types';
import { sanitizePdfFilename } from './format-utils';

function getBaseNameWithoutPdf(filename: string): string {
  const clean = filename.replace(/\.pdf$/i, '').trim();
  return clean.length > 0 ? clean : 'document';
}

/**
 * Builds and validates a split plan for Mode A: Split by Page Ranges.
 */
export function buildRangePlan(
  totalPages: number,
  ranges: RangeRow[],
  originalFilename: string
): SplitPlan {
  const baseName = getBaseNameWithoutPdf(originalFilename);
  const items: SplitPlanItem[] = [];
  const coveredSet = new Set<number>();
  const overlapSet = new Set<number>();

  if (ranges.length === 0) {
    return {
      mode: 'range',
      items: [],
      totalPages,
      coveredPages: [],
      uncoveredPages: Array.from({ length: totalPages }, (_, i) => i + 1),
      hasOverlaps: false,
      isValid: false,
      errorMessage: 'Add at least one page range to split the document.',
    };
  }

  for (let i = 0; i < ranges.length; i++) {
    const row = ranges[i];
    const { start, end, customName } = row;

    if (start === '' || end === '') {
      return {
        mode: 'range',
        items: [],
        totalPages,
        coveredPages: [],
        uncoveredPages: [],
        hasOverlaps: false,
        isValid: false,
        errorMessage: `Range #${i + 1} has an incomplete start or end page.`,
      };
    }

    const startNum = Number(start);
    const endNum = Number(end);

    if (!Number.isInteger(startNum) || !Number.isInteger(endNum)) {
      return {
        mode: 'range',
        items: [],
        totalPages,
        coveredPages: [],
        uncoveredPages: [],
        hasOverlaps: false,
        isValid: false,
        errorMessage: `Range #${i + 1} contains non-integer page numbers.`,
      };
    }

    if (startNum < 1) {
      return {
        mode: 'range',
        items: [],
        totalPages,
        coveredPages: [],
        uncoveredPages: [],
        hasOverlaps: false,
        isValid: false,
        errorMessage: `Range #${i + 1} begins at page ${startNum}. Page numbers must be 1 or greater.`,
      };
    }

    if (endNum > totalPages) {
      return {
        mode: 'range',
        items: [],
        totalPages,
        coveredPages: [],
        uncoveredPages: [],
        hasOverlaps: false,
        isValid: false,
        errorMessage: `Range #${i + 1} ends at page ${endNum}, but the document only has ${totalPages} ${
          totalPages === 1 ? 'page' : 'pages'
        }.`,
      };
    }

    if (startNum > endNum) {
      return {
        mode: 'range',
        items: [],
        totalPages,
        coveredPages: [],
        uncoveredPages: [],
        hasOverlaps: false,
        isValid: false,
        errorMessage: `Range #${i + 1} (${startNum}–${endNum}) is reversed. Start page must be less than or equal to end page.`,
      };
    }

    const pages: number[] = [];
    for (let p = startNum; p <= endNum; p++) {
      pages.push(p);
      if (coveredSet.has(p)) {
        overlapSet.add(p);
      } else {
        coveredSet.add(p);
      }
    }

    const pageDisplay = startNum === endNum ? `Page ${startNum}` : `Pages ${startNum}–${endNum}`;
    const defaultFilename = `${baseName}_pages_${startNum}-${endNum}.pdf`;
    const finalFilename = customName && customName.trim()
      ? sanitizePdfFilename(customName)
      : defaultFilename;

    items.push({
      id: row.id,
      sequence: i + 1,
      title: `Part ${i + 1}`,
      filename: finalFilename,
      pages,
      pageDisplay,
      pageCount: pages.length,
    });
  }

  const allPages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const coveredPages = Array.from(coveredSet).sort((a, b) => a - b);
  const uncoveredPages = allPages.filter((p) => !coveredSet.has(p));
  const hasOverlaps = overlapSet.size > 0;
  const overlapNotes = hasOverlaps
    ? `Pages ${Array.from(overlapSet).sort((a, b) => a - b).join(', ')} appear in multiple output groups.`
    : undefined;

  return {
    mode: 'range',
    items,
    totalPages,
    coveredPages,
    uncoveredPages,
    hasOverlaps,
    overlapNotes,
    isValid: true,
  };
}

/**
 * Builds and validates a split plan for Mode B: Extract Individual Pages.
 */
export function buildExtractPlan(
  totalPages: number,
  selectedPages: number[],
  originalFilename: string
): SplitPlan {
  const baseName = getBaseNameWithoutPdf(originalFilename);

  if (selectedPages.length === 0) {
    return {
      mode: 'extract',
      items: [],
      totalPages,
      coveredPages: [],
      uncoveredPages: Array.from({ length: totalPages }, (_, i) => i + 1),
      hasOverlaps: false,
      isValid: false,
      errorMessage: 'Select at least one page to extract.',
    };
  }

  // Deduplicate while preserving order of selection
  const uniquePages: number[] = [];
  const seen = new Set<number>();
  for (const page of selectedPages) {
    if (!Number.isInteger(page)) {
      return {
        mode: 'extract',
        items: [],
        totalPages,
        coveredPages: [],
        uncoveredPages: [],
        hasOverlaps: false,
        isValid: false,
        errorMessage: `Selected page "${page}" is not a valid integer.`,
      };
    }
    if (page < 1 || page > totalPages) {
      return {
        mode: 'extract',
        items: [],
        totalPages,
        coveredPages: [],
        uncoveredPages: [],
        hasOverlaps: false,
        isValid: false,
        errorMessage: `Page ${page} is outside the document range (1 to ${totalPages}).`,
      };
    }
    if (!seen.has(page)) {
      seen.add(page);
      uniquePages.push(page);
    }
  }

  const items: SplitPlanItem[] = uniquePages.map((page, index) => ({
    id: `extract-${page}`,
    sequence: index + 1,
    title: `Page ${page}`,
    filename: `${baseName}_page_${page}.pdf`,
    pages: [page],
    pageDisplay: `Page ${page}`,
    pageCount: 1,
  }));

  const allPages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const coveredPages = [...uniquePages].sort((a, b) => a - b);
  const uncoveredPages = allPages.filter((p) => !seen.has(p));

  return {
    mode: 'extract',
    items,
    totalPages,
    coveredPages,
    uncoveredPages,
    hasOverlaps: false,
    isValid: true,
  };
}

/**
 * Builds and validates a split plan for Mode C: Split into Equal Page Groups.
 */
export function buildEqualPlan(
  totalPages: number,
  pagesPerFile: number,
  originalFilename: string
): SplitPlan {
  const baseName = getBaseNameWithoutPdf(originalFilename);

  if (!Number.isInteger(pagesPerFile) || pagesPerFile < 1) {
    return {
      mode: 'equal',
      items: [],
      totalPages,
      coveredPages: [],
      uncoveredPages: Array.from({ length: totalPages }, (_, i) => i + 1),
      hasOverlaps: false,
      isValid: false,
      errorMessage: 'Pages per file must be an integer of 1 or greater.',
    };
  }

  const items: SplitPlanItem[] = [];
  let currentStart = 1;
  let partIndex = 1;

  while (currentStart <= totalPages) {
    const currentEnd = Math.min(currentStart + pagesPerFile - 1, totalPages);
    const pages: number[] = [];
    for (let p = currentStart; p <= currentEnd; p++) {
      pages.push(p);
    }

    const pageDisplay =
      currentStart === currentEnd ? `Page ${currentStart}` : `Pages ${currentStart}–${currentEnd}`;
    const filename = `${baseName}_part_${partIndex}.pdf`;

    items.push({
      id: `equal-${partIndex}`,
      sequence: partIndex,
      title: `Part ${partIndex}`,
      filename,
      pages,
      pageDisplay,
      pageCount: pages.length,
    });

    currentStart = currentEnd + 1;
    partIndex++;
  }

  const allPages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return {
    mode: 'equal',
    items,
    totalPages,
    coveredPages: allPages,
    uncoveredPages: [],
    hasOverlaps: false,
    isValid: true,
  };
}
