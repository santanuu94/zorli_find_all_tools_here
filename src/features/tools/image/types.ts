import { Tool } from '../../../types';

export interface ImageToolOptions {
  quality?: number;
  format?: 'jpg' | 'png' | 'webp' | 'avif' | 'heic';
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
}

export type ImageToolMetadata = Tool;
