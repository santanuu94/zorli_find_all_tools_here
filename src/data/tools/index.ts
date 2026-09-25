import { Tool } from '../../types';
import { imageTools } from './image';

export * from './image';

/**
 * Combined master tools dataset
 */
export const TOOLS: Tool[] = [
  ...imageTools,
];

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string): Tool[] {
  return TOOLS.filter((t) => {
    if (t.category === category) return true;
    if (category === 'images' && t.category === 'image') return true;
    if (category === 'image' && t.category === 'images') return true;
    if (category === 'calculators' && t.category === 'calculator') return true;
    if (category === 'calculator' && t.category === 'calculators') return true;
    return false;
  });
}

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
