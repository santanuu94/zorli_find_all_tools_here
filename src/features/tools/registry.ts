import { Tool } from '../../types';
import { ToolModule } from './types';
import { ACTIVE_IMAGE_TOOL_METADATA, COMING_SOON_IMAGE_TOOLS } from './image/registry';

/**
 * Slugs of tools that are genuinely implemented, production-ready and exposed
 * to users.
 *
 * Currently empty: the only fully-built tool in the codebase (Image Compressor)
 * still has a stub processing engine, so it is catalogued as `coming-soon`
 * instead. Nothing in the product may claim to be available while this is empty.
 */
export const ACTIVE_TOOL_SLUGS: string[] = ACTIVE_IMAGE_TOOL_METADATA;

/**
 * The tool catalogue rendered by the UI (cards, search, counts).
 *
 * `status` is *derived* from `ACTIVE_TOOL_SLUGS` rather than trusted from each
 * tool's own metadata. That makes it impossible for the registry, the tool
 * metadata and the UI badge to disagree — a tool is available here if and only
 * if it is listed in the active registry.
 *
 * Entries may still be `coming-soon`: that is the honest way to show a roadmap,
 * and such entries have no loader (see `TOOL_MODULE_LOADERS`), so opening one
 * renders the "architecture ready / coming in a later phase" shell rather than a
 * fake working tool.
 */
export const TOOLS: Tool[] = COMING_SOON_IMAGE_TOOLS.map((tool) => ({
  ...tool,
  status: ACTIVE_TOOL_SLUGS.includes(tool.slug) ? 'available' : 'coming-soon',
}));

/**
 * Map of tool slug to a function that dynamically loads the tool module
 * (component + metadata).
 *
 * SCALING CONTRACT — read before adding new tool families:
 * 1. Add exactly one lazy loader per family, e.g.
 *    'pdf-compress': () => import('./pdf/CompressTool').then(m => ({...}))
 *    Vite turns each dynamic import into its own chunk, so a new family adds
 *    ~0 bytes to the home page and loads only when its tool page opens.
 * 2. NEVER `import { XTool } from './pdf/...'` statically at the top of this
 *    file or of any route loaded by the home page — that would pull the whole
 *    family into the initial bundle for every visitor.
 * 3. Keep catalogue metadata (TOOLS below) JSON-light: names, slugs, tags.
 *    Heavy engines/parsers live inside the lazy chunk, never in metadata.
 *
 * Intentionally minimal until a tool ships with a real engine. To ship a tool,
 * add exactly one entry here plus the slug in the family registry — see
 * `src/features/tools/image/registry.ts` for the documented three-step wiring.
 */
const TOOL_MODULE_LOADERS: Record<string, () => Promise<ToolModule>> = {};

/**
 * True when the tool is genuinely shipped and may be presented as available.
 */
export function isToolActive(slug: string): boolean {
  return ACTIVE_TOOL_SLUGS.includes(slug);
}

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