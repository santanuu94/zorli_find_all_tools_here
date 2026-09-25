import { ToolModule, ToolFamilyRegistry } from '../types';
import * as PdfCompressor from './pdf-compressor';
import * as PdfMerge from './pdf-merge';
import * as PdfSplit from './pdf-split';
import * as PdfToWord from './pdf-to-word';

export const PDF_TOOL_MODULES: ToolModule[] = [
  PdfCompressor,
  PdfMerge,
  PdfSplit,
  PdfToWord,
];

export const PDF_FAMILY: ToolFamilyRegistry = {
  family: 'pdf',
  name: 'PDF Tools',
  description: 'Compress, merge, split, and convert PDF documents easily in your browser.',
  tools: PDF_TOOL_MODULES,
};
