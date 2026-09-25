import { Tool } from '../../../../types';

export const metadata: Tool = {
  slug: 'pdf-compressor',
  name: 'PDF Compressor',
  description: 'Shrink large PDF file sizes while keeping clean text clarity.',
  category: 'pdf',
  iconName: 'FileText',
  iconBg: 'bg-rose-500/10',
  iconColor: '#FB7185',
  status: 'coming-soon',
  featured: true,
  popular: true,
  filterType: 'optimize',
  tags: ['pdf', 'compress', 'reduce', 'document'],
  features: [
    'Substantial size reduction suitable for email attachments',
    'Preserves text clarity, vector shapes, and hyperlinks',
    'Multiple compression presets for different document types',
  ],
};
