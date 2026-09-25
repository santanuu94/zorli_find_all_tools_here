import { Tool } from '../../../types';

export interface PdfToolOptions {
  compressionPreset?: 'extreme' | 'recommended' | 'low';
  pageRanges?: string;
  targetFormat?: 'docx' | 'pdf' | 'jpg';
}

export type PdfToolMetadata = Tool;
