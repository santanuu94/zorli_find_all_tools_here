export type SplitMode = 'range' | 'extract' | 'equal';

export interface RangeRow {
  id: string;
  start: number | '';
  end: number | '';
  customName?: string;
}

export interface SplitPlanItem {
  id: string;
  sequence: number;
  title: string;
  filename: string;
  pages: number[]; // 1-indexed pages in this output
  pageDisplay: string; // e.g. "Pages 1–5" or "Page 3"
  pageCount: number;
}

export interface SplitPlan {
  mode: SplitMode;
  items: SplitPlanItem[];
  totalPages: number;
  coveredPages: number[];
  uncoveredPages: number[];
  hasOverlaps: boolean;
  overlapNotes?: string;
  isValid: boolean;
  errorMessage?: string;
}

export interface SplitOutputItem {
  id: string;
  sequence: number;
  filename: string;
  blob: Blob;
  downloadUrl: string;
  sizeBytes: number;
  pageCount: number;
  pageDisplay: string;
}

export type SplitStage =
  | 'idle'
  | 'reading'
  | 'analyzing'
  | 'splitting'
  | 'zipping'
  | 'done'
  | 'error';

export interface SplitProgress {
  stage: SplitStage;
  currentPart: number;
  totalParts: number;
  message: string;
}

export interface PdfSourceInfo {
  file: File;
  name: string;
  sizeBytes: number;
  pageCount: number;
  isEncrypted: boolean;
}
