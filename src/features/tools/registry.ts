import { Tool } from '../../types';
import { ToolModule } from './types';
import {
  ACTIVE_IMAGE_TOOL_METADATA,
  ALL_IMAGE_TOOLS,
  IMAGE_TOOL_LOADERS,
} from './image/registry';
import {
  ACTIVE_PDF_TOOL_SLUGS,
  ALL_PDF_TOOLS,
  PDF_TOOL_LOADERS,
} from './pdf/registry';

/**
 * Slugs of tools that are genuinely implemented, production-ready and exposed
 * to users.
 */
export const ACTIVE_TOOL_SLUGS: string[] = [
  ...ACTIVE_IMAGE_TOOL_METADATA,
  ...ACTIVE_PDF_TOOL_SLUGS,
];

/**
 * All catalogued tools across all families (available + roadmap).
 */
export const ALL_TOOLS: Tool[] = [
  ...ALL_IMAGE_TOOLS,
  ...ALL_PDF_TOOLS,
];

/**
 * The tool catalogue rendered by the UI (cards, search, counts).
 *
 * `status` is *derived* from `ACTIVE_TOOL_SLUGS` rather than trusted from each
 * tool's own metadata. That makes it impossible for the registry, the tool
 * metadata and the UI badge to disagree — a tool is available here if and only
 * if it is listed in the active registry.
 */
export const TOOLS: Tool[] = ALL_TOOLS.map((tool) => ({
  ...tool,
  status: ACTIVE_TOOL_SLUGS.includes(tool.slug) ? 'available' : 'coming-soon',
}));

/**
 * Map of tool slug to a function that dynamically loads the tool module
 * (component + metadata).
 *
 * Code-split on demand: each tool is only fetched when its route opens.
 */
const TOOL_MODULE_LOADERS: Record<string, () => Promise<ToolModule>> = {
  ...IMAGE_TOOL_LOADERS,
  ...PDF_TOOL_LOADERS,
};

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
  return loader().then((module) => module as ToolModule);
}

/**
 * Helper to get all tools in a specific category/family
 */
export function getToolsByCategory(category: string): Tool[] {
  // Support both singular and plural forms (e.g. image & images, pdf & pdfs)
  return TOOLS.filter((t) => {
    if (t.category === category) return true;
    if (category === 'images' && t.category === 'image') return true;
    if (category === 'pdfs' && t.category === 'pdf') return true;
    return false;
  });
}

/**
 * Helper to get only actively shipped tools in a category
 */
export function getActiveToolsByCategory(category: string): Tool[] {
  return getToolsByCategory(category).filter((t) => t.status === 'available');
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