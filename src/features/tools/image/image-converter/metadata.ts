import { Tool } from '../../../../types';

export const metadata: Tool = {
  slug: 'image-converter',
  name: 'Image Converter',
  description: 'Convert between JPG, PNG, WebP and more.',
  category: 'images',
  iconName: 'FileCode2',
  iconBg: 'bg-rose-500/10',
  iconColor: '#FB7185',
  status: 'coming-soon',
  featured: true,
  filterType: 'convert',
  tags: ['convert', 'format', 'png', 'jpg', 'webp'],
  features: [
    'Convert to modern WebP or AVIF for ultra-fast websites',
    'Preserve alpha transparency when converting to PNG',
    'Batch conversion for folders of files',
  ],
};
