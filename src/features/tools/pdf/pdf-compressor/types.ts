export type TargetPreset = '500kb' | '1mb' | '2mb' | '5mb' | '10mb' | 'custom';

export type CustomTargetUnit = 'KB' | 'MB';

export type CompressionQuality = 'high' | 'balanced' | 'low';

export type CompressionStage =
  | 'idle'
  | 'reading'
  | 'analyzing'
  | 'optimizing'
  | 'recompressing'
  | 'saving'
  | 'done'
  | 'error';

export type TargetResultState =
  | 'target_achieved'
  | 'target_not_achieved'
  | 'already_smaller'
  | 'already_minimal';

export interface PdfFileInfo {
  file: File;
  name: string;
  originalSize: number;
  pageCount: number;
  imageCount: number;
  isEncrypted: boolean;
}

export interface CompressionSettings {
  targetPreset: TargetPreset;
  customTargetValue: number;
  customTargetUnit: CustomTargetUnit;
  quality: CompressionQuality;
  removeMetadata: boolean;
}

export interface CompressionProgress {
  stage: CompressionStage;
  message: string;
  percentage?: number;
}

export interface CompressionResult {
  compressedBlob: Blob;
  compressedSize: number;
  savedBytes: number;
  reductionPercentage: number;
  targetBytes: number;
  targetResultState: TargetResultState;
  pageCount: number;
  downloadUrl: string;
  message?: string;
  warning?: string;
}
