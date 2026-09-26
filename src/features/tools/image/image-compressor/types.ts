export type CompressionMode = 'quality' | 'targetSize';

export interface CompressionSettings {
  mode?: CompressionMode;
  quality: number; // 10 to 95
  targetSizeKb?: number; // Target max size in KB (e.g. 100, 200, 500)
  outputFormat: 'original' | 'jpeg' | 'png' | 'webp';
  preserveMetadata?: boolean;
}

export type FileCompressionStatus = 'pending' | 'processing' | 'done' | 'error';

export interface CompressedFileItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  compressedSize?: number;
  reductionPercentage?: number;
  status: FileCompressionStatus;
  errorMessage?: string;
  previewUrl?: string;
  compressedPreviewUrl?: string;
  compressedBlob?: Blob;
  width?: number;
  height?: number;
  outputMimeType?: string;
  alreadyOptimized?: boolean;
}

export interface CompressionResultData {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  reductionPercentage: number;
  width: number;
  height: number;
  outputMimeType: string;
  alreadyOptimized: boolean;
}
