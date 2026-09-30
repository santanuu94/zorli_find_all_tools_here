/**
 * Type definitions for Tool #6: Image Background Remover
 */

export type RemovalStatus = 'idle' | 'loading-model' | 'processing' | 'done' | 'error';

export type BackgroundMode = 'transparent' | 'white' | 'black' | 'custom';

export type ModelChoice = 'rmbg' | 'isnet' | 'modnet';

export interface ProcessProgress {
  stage: string;
  percent?: number;
}

export interface RemovalItem {
  id: string;
  file: File;
  originalUrl: string;
  originalWidth: number;
  originalHeight: number;
  originalSize: number;
  status: RemovalStatus;
  progress?: ProcessProgress;
  errorMessage?: string;
  
  // Results
  resultBlob?: Blob;
  resultUrl?: string;
  resultWidth?: number;
  resultHeight?: number;
  resultSize?: number;
  hasTransparency?: boolean;
  
  // Settings per item
  backgroundMode: BackgroundMode;
  customColor: string;
  modelChoice: ModelChoice;
  cleanlinessThreshold: number; // 0 to 100, default 35
  
  // Cached raw mask & original image data for zero-latency slider & background updates
  rawMaskData?: Uint8ClampedArray;
  originalImageData?: ImageData;
  foregroundImageData?: ImageData;
}

export interface BackgroundRemoverConfig {
  defaultBackgroundMode: BackgroundMode;
  defaultCustomColor: string;
  defaultModel: ModelChoice;
  defaultCleanlinessThreshold: number;
}
