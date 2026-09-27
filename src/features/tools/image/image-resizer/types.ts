export type ResizeMode = 'custom' | 'percentage' | 'social' | 'web' | 'preset';

export type PresetCategory = 'social' | 'web' | 'common';

export type PresetFitMode = 'fit' | 'fill' | 'stretch';

export type CanvasBackground = 'blur' | 'black' | 'white' | 'transparent';

export interface PresetDimension {
  id: string;
  name: string;
  label: string;
  category: PresetCategory;
  width: number;
  height: number;
  aspectRatioLabel?: string;
  description: string;
  platform?: string;
}

export interface SocialPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  aspectRatioLabel: string;
  description: string;
}

export interface SocialPlatform {
  id: string;
  name: string;
  presets: SocialPreset[];
}

export interface ResizeSettings {
  mode: ResizeMode;
  customWidth: number;
  customHeight: number;
  lockAspectRatio: boolean;
  primaryDimension: 'width' | 'height';
  percentage: number;
  presetId: string;
  socialPlatformId?: string;
  presetFitMode: PresetFitMode;
  canvasBackground?: CanvasBackground;
  manualOverride?: boolean;
  dontEnlarge: boolean;
  quality: number; // 1-100 for JPEG/WebP
}

export interface ResizedImageItem {
  id: string;
  file: File;
  originalName: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  aspectRatio: number;
  targetWidth: number;
  targetHeight: number;
  previewUrl: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  outputBlob?: Blob;
  outputUrl?: string;
  outputSize?: number;
  outputWidth?: number;
  outputHeight?: number;
  outputMimeType?: string;
  errorMessage?: string;
}
