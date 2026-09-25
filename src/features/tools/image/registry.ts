import { ToolModule, ToolFamilyRegistry } from '../types';
import { Tool } from '../../../types';
// Import the config directly (not `./image-compressor`) so that the catalogue can
// read metadata without ever pulling the tool's React component into a chunk.
import { imageCompressorConfig } from './image-compressor/config';

/**
 * Lazy-loaders for SHIPPED image tools.
 *
 * Deliberately empty. No image tool currently has a complete, production-ready
 * processing engine, so nothing is dynamically imported and no orphan tool chunk
 * is emitted by the build.
 *
 * Wiring for the next tool:
 *   1. Finish the engine and set the tool metadata `status: 'available'`.
 *   2. Add it to `IMAGE_TOOL_MODULES` and `ACTIVE_IMAGE_TOOL_SLUGS` below.
 *   3. Add exactly one loader here, e.g.
 *        'jpg-to-png': () => import('./jpg-to-png'),
 * The implementation is then loaded on demand, and only on demand.
 */
export const IMAGE_TOOL_LOADERS: Record<string, () => Promise<ToolModule>> = {};

/**
 * Image tools that are genuinely implemented AND production-ready.
 * This is the only list allowed to back an `available` status.
 */
export const IMAGE_TOOL_MODULES: ToolModule[] = [];

/**
 * Image tools that exist as source code but are NOT part of the current
 * production release.
 *
 * They are catalogued so the roadmap is visible, but they are always reported
 * as `coming-soon`, they have no loader, and their components are never
 * imported — so they cannot be presented as working tools and they add nothing
 * to the shipped JavaScript.
 *
 * `image-compressor` lives here because `lib/compressor.ts` still returns the
 * original file unchanged (see that file). It becomes available again only once
 * a real compression engine replaces the stub.
 */
export const COMING_SOON_IMAGE_TOOLS: Tool[] = [imageCompressorConfig];

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
export const ACTIVE_IMAGE_TOOL_SLUGS: string[] = [];

/**
 * Metadata keys for active tools only. Consumed by the root registry to derive
 * the catalogue's `available` vs `coming-soon` status, so the registry and the
 * metadata can never drift out of sync.
 */
export const ACTIVE_IMAGE_TOOL_METADATA: string[] = ACTIVE_IMAGE_TOOL_SLUGS;
