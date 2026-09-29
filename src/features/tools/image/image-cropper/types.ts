export type SupportedFormat = 'jpg' | 'png' | 'webp';

import type { PixelCrop } from 'react-image-crop';
export type { PixelCrop };

export interface AspectRatioPreset {
  id: string;
  label: string;
  ratio?: number; // undefined for freeform
  description?: string;
}

export interface CroppedImageItem {
  id: string;
  file: File;
  originalName: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalFormat: SupportedFormat | 'unknown';
  previewUrl: string;
  status: 'idle' | 'cropping' | 'done' | 'error';
  cropCoordinates?: PixelCrop;
  outputBlob?: Blob;
  outputUrl?: string;
  outputSize?: number;
  outputWidth?: number;
  outputHeight?: number;
  errorMessage?: string;
}

export interface CropTransformSettings {
  aspectRatioId: string;
  aspectRatio?: number;
  socialPlatformId?: string;
  socialPresetId?: string;
  zoom: number; // 1 to 3
  rotation: number; // 0, 90, 180, 270
  flipH: boolean;
  flipV: boolean;
}
