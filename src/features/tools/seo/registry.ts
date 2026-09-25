import { ToolModule, ToolFamilyRegistry } from '../types';

export const SEO_TOOL_MODULES: ToolModule[] = [];

export const SEO_FAMILY: ToolFamilyRegistry = {
  family: 'seo',
  name: 'SEO Tools',
  description: 'Meta tag generators, OpenGraph previewers, robots.txt, and sitemap utilities.',
  tools: SEO_TOOL_MODULES,
};
