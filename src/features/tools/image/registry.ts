import React from 'react';
import { ToolModule, ToolFamilyRegistry } from '../types';

/**
 * Lazy-loaders for tool modules - these are used for dynamic import in ToolPageShell
 * This avoids bundling all tool implementations in the initial JS bundle.
 */
export const IMAGE_TOOL_LOADERS: Record<string, () => Promise<ToolModule>> = {
  'image-compressor': () => import('./image-compressor'),
  'image-resizer': () => import('./image-resizer'),
  'image-converter': () => import('./image-converter'),
  'image-cropper': () => import('./image-cropper'),
  'heic-to-jpg': () => import('./heic-to-jpg'),
  'jpg-to-webp': () => import('./jpg-to-webp'),
  'image-rotator': () => import('./image-rotator'),
  'image-enhancer': () => import('./image-enhancer'),
  'image-splitter': () => import('./image-splitter'),
  'image-merger': () => import('./image-merger'),
  'image-to-pdf': () => import('./image-to-pdf'),
  'more-image-tools': () => import('./more-image-tools'),
};

/**
 * Only include tools that are actually implemented and ready for production.
 * Tools with status 'coming-soon' should NOT appear in the active registry.
 * They remain architecturally available but are not shipped to users.
 */
export const IMAGE_TOOL_MODULES: ToolModule[] = [
  // Only the Image Compressor is implemented and production-ready
];

export const IMAGE_FAMILY: ToolFamilyRegistry = {
  family: 'images',
  name: 'Image Tools',
  description: 'Compress, resize, convert and edit images directly in your browser.',
  tools: IMAGE_TOOL_MODULES,
};

/**
 * Active tool slugs - only these tools are exposed to users in search/category pages.
 * This is the single source of truth for what's "live" vs "coming-soon".
 */
export const ACTIVE_IMAGE_TOOL_SLUGS: string[] = [
  'image-compressor',
];

/**
 * Metadata for active tools only - used by data/tools/image.ts for the TOOLS array.
 * This avoids importing unfinished tool metadata into the initial bundle.
 */
export const ACTIVE_IMAGE_TOOL_METADATA: string[] = [
  'image-compressor',
];
