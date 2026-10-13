export interface MergerFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
  status: 'ready' | 'loading' | 'error';
  error?: string;
}

export type MergerStage =
  | 'idle'
  | 'reading'
  | 'merging'
  | 'verifying'
  | 'saving'
  | 'done'
  | 'error';

export interface MergerProgress {
  stage: MergerStage;
  message: string;
  currentFileIndex?: number;
  totalFiles?: number;
  percentage?: number;
}

export interface MergerResult {
  mergedBlob: Blob;
  mergedSize: number;
  pageCount: number;
  filesCount: number;
  downloadUrl: string;
  defaultFilename: string;
}
