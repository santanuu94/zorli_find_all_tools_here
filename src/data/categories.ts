import { ToolCategory } from '../types';

export const CATEGORIES: ToolCategory[] = [
  {
    slug: 'images',
    name: 'Image Tools',
    shortName: 'Image',
    description: 'Compress, resize, convert and edit images.',
    iconName: 'Image',
    iconBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    iconColor: '#38BDF8',
    toolsCount: 12,
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
        'Need a smaller image for a form or website? Try our Image Compressor — it\'s the most popular tool!',
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
