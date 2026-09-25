import { ToolCategory } from '../types';
import { TOOLS } from '../features/tools';

/**
 * A category can own tools whose `category` value is stored in either singular
 * or plural form (e.g. `images` / `image`). Keep the aliases in one place so
 * counts, filtering and the registry all agree.
 */
const CATEGORY_TOOL_ALIASES: Record<string, string[]> = {
  images: ['images', 'image'],
  calculators: ['calculators', 'calculator'],
};

const toolsIn = (categorySlug: string) => {
  const aliases = CATEGORY_TOOL_ALIASES[categorySlug] ?? [categorySlug];
  return TOOLS.filter((tool) => aliases.includes(tool.category));
};

/** Total catalogued tools in a category (available + coming-soon). */
export const countCategoryTools = (categorySlug: string): number => toolsIn(categorySlug).length;

/** Tools in a category that are genuinely shipped. */
export const countAvailableCategoryTools = (categorySlug: string): number =>
  toolsIn(categorySlug).filter((tool) => tool.status === 'available').length;

export const CATEGORIES: ToolCategory[] = [
  {
    slug: 'images',
    name: 'Image Tools',
    shortName: 'Image',
    description: 'Compress, resize, convert and edit images.',
    iconName: 'Image',
    iconBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    iconColor: '#38BDF8',
    // Derived from the tool registry — never hardcode these numbers.
    toolsCount: countCategoryTools('images'),
    availableToolsCount: countAvailableCategoryTools('images'),
    featured: true,
    heroBadge: 'IMAGE TOOLS',
    heroDescription:
      'Everything you need to work with images — compress, resize, convert, edit and more. Fast, free and private. All in one place.',
    filterTabs: [
      { id: 'all', label: 'All Tools' },
      { id: 'popular', label: 'Popular' },
      { id: 'convert', label: 'Convert' },
      { id: 'edit', label: 'Edit' },
      { id: 'optimize', label: 'Optimize' },
    ],
    proTip: {
      title: 'Pro Tip',
      description:
        'Need a smaller image for a form or website? Our Image Compressor is coming soon — it will trim file size in a single click.',
      toolSlug: 'image-compressor',
      toolName: 'Image Compressor',
    },
    whyBanner: {
      headline: 'Powerful Image Tools, Built for',
      highlightWord: 'You.',
      subtitle: 'Simple. Fast. Private. Everything you need, nothing you don’t.',
      points: [
        {
          iconName: 'Zap',
          title: 'Lightning Fast',
          description: 'Get results in seconds.',
        },
        {
          iconName: 'Shield',
          title: 'Your Privacy Matters',
          description: 'Files stay on your device.',
        },
        {
          iconName: 'Heart',
          title: 'Completely Free',
          description: 'No sign-ups. No limits.',
        },
        {
          iconName: 'Smartphone',
          title: 'Works Everywhere',
          description: 'On any device, anytime.',
        },
      ],
    },
  },
];
