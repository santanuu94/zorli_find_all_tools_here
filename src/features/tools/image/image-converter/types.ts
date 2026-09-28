export type SupportedFormat = 'jpg' | 'png' | 'webp';

export type TargetMimeType = 'image/jpeg' | 'image/png' | 'image/webp';

export type TransparencyBackground = 'white' | 'black' | 'custom';

export type ConversionStatus = 'pending' | 'converting' | 'done' | 'same-format' | 'error';

export interface FormatOption {
  format: SupportedFormat;
  label: string;
  mimeType: TargetMimeType;
  extension: string;
  description: string;
  isLossy: boolean;
  supportsTransparency: boolean;
}

export interface ConvertedImageItem {
  id: string;
  file: File;
  originalName: string;
  originalSize: number;
  originalMimeType: string;
  originalFormat: SupportedFormat | 'unknown';
  originalWidth: number;
  originalHeight: number;
  previewUrl: string;
  targetFormat: SupportedFormat;
  quality: number; // 1 to 100 (for lossy formats)
  backgroundColor: string; // Hex color for flattening transparent images to JPG (default #FFFFFF)
  status: ConversionStatus;
  errorMessage?: string;
  outputBlob?: Blob;
  outputUrl?: string;
  outputSize?: number;
  outputFormat?: SupportedFormat;
  outputMimeType?: string;
  outputWidth?: number;
  outputHeight?: number;
  sizeDeltaPercent?: number; // e.g. -45.2% or +10.5%
}

export interface GlobalConvertSettings {
  targetFormat: SupportedFormat;
  quality: number;
  backgroundColor: string;
}
