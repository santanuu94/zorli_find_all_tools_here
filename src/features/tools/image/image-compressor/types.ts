export interface CompressionSettings {
  quality: number;
  outputFormat: 'original' | 'jpeg' | 'png' | 'webp';
  preserveMetadata: boolean;
}

export interface CompressedFileItem {
  id: string;
  name: string;
  originalSize: number;
  compressedSize?: number;
  reductionPercentage?: number;
  status: 'pending' | 'processing' | 'done' | 'error';
  errorMessage?: string;
  previewUrl?: string;
}
