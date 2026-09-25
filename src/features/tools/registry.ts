import { Tool } from '../../types';
import { ToolModule } from './types';
import { ACTIVE_IMAGE_TOOL_METADATA } from './image/registry';

/**
 * Active tool metadata array for lookups and card grids
 * Only includes tools that are actually implemented and production-ready.
 * Other tools (coming-soon) remain architecturally available but are not shipped.
 */
export const TOOLS: Tool[] = ACTIVE_IMAGE_TOOL_METADATA.map((slug) => {
  // Look up metadata from image registry by slug
  const metadata = {
    slug,
    name: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: `Image tool: ${slug}`,
    category: 'images',
    iconName: 'Image',
    iconBg: 'bg-sky-500/10',
    iconColor: '#38BDF8',
    status: slug === 'image-compressor' ? 'available' : 'coming-soon',
    filterType: 'optimize',
    tags: ['image'],
  };
  return metadata as Tool;
});

/**
 * Map of tool slug to a function that dynamically loads the tool module (component and metadata)
 * We use dynamic import to lazy-load the heavy component code.
 */
const TOOL_MODULE_LOADERS: Record<string, () => Promise<ToolModule>> = {
  'image-compressor': () => import('./image/image-compressor'),
  'image-resizer': () => import('./image/image-resizer'),
  'image-converter': () => import('./image/image-converter'),
  'image-cropper': () => import('./image/image-cropper'),
  'image-enhancer': () => import('./image/image-enhancer'),
  'image-merger': () => import('./image/image-merger'),
  'image-splitter': () => import('./image/image-splitter'),
  'image-to-pdf': () => import('./image/image-to-pdf'),
  'heic-to-jpg': () => import('./image/heic-to-jpg'),
  'jpg-to-webp': () => import('./image/jpg-to-webp'),
  'more-image-tools': () => import('./image/more-image-tools'),
};

/**
 * Helper to get a tool's metadata by its slug
 */
export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

/**
 * Helper to get a tool's full module (metadata + Component) by its slug
 * This function returns a promise that resolves to the tool module.
 */
export function getToolModuleBySlug(slug: string): Promise<ToolModule | undefined> {
  const loader = TOOL_MODULE_LOADERS[slug];
  if (!loader) {
    return Promise.resolve(undefined);
  }
  return loader().then(module => module as ToolModule);
}

/**
 * Helper to get all tools in a specific category/family
 * Note: We only have the image family for now.
 */
export function getToolsByCategory(category: string): Tool[] {
  // Support both singular and plural forms (e.g. image & images, calculator & calculators)
  return TOOLS.filter((t) => {
    if (t.category === category) return true;
    if (category === 'images' && t.category === 'image') return true;
    if (category === 'image' && t.category === 'images') return true;
    // Since we removed other families, we don't need to check for calculators, etc.
    return false;
  });
}

/**
 * Helper to search tools across all metadata fields
 */
export function searchTools(query: string): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return TOOLS;
  return TOOLS.filter((tool) => {
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  });
}