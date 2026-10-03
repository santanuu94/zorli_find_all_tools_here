import { ToolModule, ToolFamilyRegistry } from '../types';
import { Tool } from '../../../types';
import { metadata as pdfCompressorMetadata } from './pdf-compressor/metadata';

/**
 * Lazy-loaders for SHIPPED PDF tools.
 *
 * Each shipped tool has exactly one loader here. Vite turns each dynamic import
 * into its own code-split chunk, loaded only on demand when its route opens.
 */
export const PDF_TOOL_LOADERS: Record<string, () => Promise<ToolModule>> = {
  'pdf-compressor': () => import('./pdf-compressor'),
};

/**
 * PDF tools that are genuinely implemented AND production-ready.
 */
export const PDF_TOOL_MODULES: ToolModule[] = [];

/**
 * Active tool slugs — the single source of truth for what is "live".
 * Only slugs listed here may be rendered as available.
 */
export const ACTIVE_PDF_TOOL_SLUGS: string[] = ['pdf-compressor'];

/**
 * Metadata keys for active tools only.
 */
export const ACTIVE_PDF_TOOL_METADATA: string[] = ACTIVE_PDF_TOOL_SLUGS;

/**
 * All catalogued PDF tools (available + upcoming roadmap).
 */
export const ALL_PDF_TOOLS: Tool[] = [pdfCompressorMetadata];

export const PDF_FAMILY: ToolFamilyRegistry = {
  family: 'pdf',
  name: 'PDF Tools',
  description: 'Simple tools to compress, merge, split, organize and work with PDF files.',
  tools: PDF_TOOL_MODULES,
};
