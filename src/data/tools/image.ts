import { Tool } from '../../types';
import { TOOLS } from '../../features/tools';

/**
 * Image-family catalogue for the data layer.
 *
 * This is the display catalogue, not the "shipped" list: entries may be
 * `coming-soon`. Whether a tool is actually available is decided solely by the
 * active registry (`ACTIVE_TOOL_SLUGS` in src/features/tools/registry.ts), and
 * the `status` field here always reflects that decision.
 */
export const imageTools: Tool[] = TOOLS.filter((tool) => tool.category === 'images');
