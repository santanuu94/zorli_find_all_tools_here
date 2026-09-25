import { Tool } from '../../../../types';

export const metadata: Tool = {
  slug: 'image-resizer',
  name: 'Image Resizer',
  description: 'Resize your images to any dimensions.',
  category: 'images',
  iconName: 'Maximize2',
  iconBg: 'bg-emerald-500/10',
  iconColor: '#34D399',
  status: 'coming-soon',
  featured: true,
  filterType: 'edit',
  tags: ['resize', 'dimensions', 'width', 'height', 'scale'],
  features: [
    'Pixel-precise dimensions or percentage scaling',
    'Lock aspect ratio to prevent distortion',
    'Pre-set social media sizes (Instagram, YouTube, Twitter)',
    'High quality bicubic interpolation',
  ],
};
