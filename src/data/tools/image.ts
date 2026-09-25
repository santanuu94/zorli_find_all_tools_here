import { Tool } from '../../types';
import { TOOLS } from '../../features/tools';

/**
 * Active tools array for the data layer
 * This is the single source of truth for tools available in the UI
 */
export const imageTools: Tool[] = TOOLS.filter((tool) => tool.category === 'images');
