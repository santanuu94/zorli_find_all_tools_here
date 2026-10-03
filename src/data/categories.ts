import { ToolCategory } from '../types';
import { TOOLS } from '../features/tools';

/**
 * A category can own tools whose `category` value is stored in either singular
 * or plural form (e.g. `images` / `image`, `pdf` / `pdfs`). Keep the aliases in one place so
 * counts, filtering and the registry all agree.
 */
const CATEGORY_TOOL_ALIASES: Record<string, string[]> = {
  images: ['images', 'image'],
  image: ['images', 'image'],
  pdf: ['pdf', 'pdfs'],
  pdfs: ['pdf', 'pdfs'],
  calculators: ['calculators', 'calculator'],
  calculator: ['calculators', 'calculator'],
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
    floatingBadges: [
      {
        label: 'Compress',
        bgClass: 'bg-gradient-to-r from-[#6657FF] to-[#8B5CF6]',
        positionClass: 'top-12 left-4 sm:left-6',
        animClass: 'anim-float-xy',
      },
      {
        label: 'Resize',
        iconName: 'Maximize2',
        bgClass: 'bg-blue-600',
        positionClass: 'top-6 right-20 sm:right-28',
        animClass: 'anim-float-xy',
      },
      {
        label: 'Convert',
        iconName: 'FileCode2',
        bgClass: 'bg-sky-500',
        positionClass: 'bottom-16 right-4 sm:right-6',
        animClass: 'anim-float-y',
      },
      {
        label: 'Edit',
        iconName: 'Crop',
        bgClass: 'bg-indigo-600',
        positionClass: 'bottom-10 left-12 sm:left-16',
        animClass: 'anim-float-y',
      },
    ],
    proTip: {
      title: 'Pro Tip',
      description:
        'Need a smaller image for a form or website? Use our Image Compressor to trim file size in a single click directly in your browser.',
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
    seoContent: {
      sectionTitle: 'Image Tools',
      sectionBody:
        'Zorli’s image tools provide fast, privacy-friendly utilities for optimizing, resizing, converting, and editing photos directly in your web browser.',
      chooseTitle: 'Choose the image tool you need',
      chooseBody:
        'Select a dedicated tool based on your current task—compress files to save bandwidth, resize dimensions for social media, convert between formats, crop photos, or clean sensitive metadata.',
    },
  },
  {
    slug: 'pdf',
    name: 'PDF Tools',
    shortName: 'PDF',
    description: 'Simple tools to compress, merge, split, organize and work with PDF files.',
    iconName: 'FileText',
    iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    iconColor: '#FB7185',
    // Dynamically derived from the active tool registry
    toolsCount: countCategoryTools('pdf'),
    availableToolsCount: countAvailableCategoryTools('pdf'),
    featured: true,
    heroBadge: 'PDF TOOLS',
    heroDescription:
      'Simple tools to compress, merge, split, organize and work with PDF files.',
    filterTabs: [
      { id: 'all', label: 'All Tools' },
      { id: 'popular', label: 'Popular' },
      { id: 'optimize', label: 'Compress' },
      { id: 'edit', label: 'Merge & Split' },
      { id: 'convert', label: 'Convert' },
    ],
    floatingBadges: [
      {
        label: 'Compress',
        bgClass: 'bg-gradient-to-r from-rose-500 to-red-600',
        positionClass: 'top-12 left-4 sm:left-6',
        animClass: 'anim-float-xy',
      },
      {
        label: 'Merge',
        iconName: 'Layers',
        bgClass: 'bg-indigo-600',
        positionClass: 'top-6 right-20 sm:right-28',
        animClass: 'anim-float-xy',
      },
      {
        label: 'Split',
        iconName: 'Scissors',
        bgClass: 'bg-purple-600',
        positionClass: 'bottom-16 right-4 sm:right-6',
        animClass: 'anim-float-y',
      },
      {
        label: 'Organize',
        iconName: 'FileText',
        bgClass: 'bg-amber-600',
        positionClass: 'bottom-10 left-12 sm:left-16',
        animClass: 'anim-float-y',
      },
    ],
    whyBanner: {
      headline: 'Simple, Secure PDF Tools Built for',
      highlightWord: 'Speed.',
      subtitle: 'Fast. Private. Document utilities that run right in your browser.',
      points: [
        {
          iconName: 'Zap',
          title: 'Instant Processing',
          description: 'Handle documents in seconds.',
        },
        {
          iconName: 'Shield',
          title: 'Document Privacy',
          description: 'PDFs stay securely on your device.',
        },
        {
          iconName: 'Heart',
          title: 'Completely Free',
          description: 'No accounts, subscriptions, or watermarks.',
        },
        {
          iconName: 'Smartphone',
          title: 'Cross-Device',
          description: 'Works smoothly on mobile, tablet, and desktop.',
        },
      ],
    },
    seoContent: {
      sectionTitle: 'PDF Tools',
      sectionBody:
        'Zorli’s PDF tools provide simple, high-speed utilities for working with PDF documents directly in your browser. Whether you need to compress large files, merge multiple pages, split documents, or reorganize pages, our tools prioritize privacy and performance without requiring account sign-ups or software installation.',
      chooseTitle: 'Choose the PDF tool you need',
      chooseBody:
        'Each tool on Zorli is dedicated to a specific task so you get results quickly. Select the tool tailored to your workflow—such as compressing a document for email attachments, combining multiple files into a single PDF, or extracting individual pages—and process your files securely on your device.',
    },
  },
];
