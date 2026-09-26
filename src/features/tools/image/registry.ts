import { ToolModule, ToolFamilyRegistry } from '../types';
import { Tool } from '../../../types';
// Import the config directly (not `./image-compressor`) so that the catalogue can
// read metadata without ever pulling the tool's React component into a chunk.
import { imageCompressorConfig } from './image-compressor/config';

/**
 * Lazy-loaders for SHIPPED image tools.
 *
 * Each shipped tool has exactly one loader here. Vite turns each dynamic import
 * into its own code-split chunk, loaded only on demand when its route opens.
 */
export const IMAGE_TOOL_LOADERS: Record<string, () => Promise<ToolModule>> = {
  'image-compressor': () => import('./image-compressor'),
};

/**
 * Image tools that are genuinely implemented AND production-ready.
 */
export const IMAGE_TOOL_MODULES: ToolModule[] = [];

/**
 * All catalogued image tools (available + upcoming).
 */
export const ALL_IMAGE_TOOLS: Tool[] = [imageCompressorConfig];

/**
 * Image tools that are coming in future phases.
 */
export const COMING_SOON_IMAGE_TOOLS: Tool[] = [];

export const IMAGE_FAMILY: ToolFamilyRegistry = {
  family: 'images',
  name: 'Image Tools',
  description: 'Compress, resize, convert and edit images directly in your browser.',
  tools: IMAGE_TOOL_MODULES,
};

/**
 * Active tool slugs — the single source of truth for what is "live".
 * Only slugs listed here may be rendered as available.
 */
export const ACTIVE_IMAGE_TOOL_SLUGS: string[] = ['image-compressor'];

/**
 * Metadata keys for active tools only. Consumed by the root registry to derive
 * the catalogue's `available` vs `coming-soon` status, so the registry and the
 * metadata can never drift out of sync.
 */
export const ACTIVE_IMAGE_TOOL_METADATA: string[] = ACTIVE_IMAGE_TOOL_SLUGS;
