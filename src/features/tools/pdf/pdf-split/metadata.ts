import { Tool } from '../../../../types';

export const metadata: Tool = {
  slug: 'pdf-split',
  name: 'PDF Splitter',
  description: 'Extract specific pages or break a large PDF into individual pages.',
  category: 'pdf',
  iconName: 'Scissors',
  iconBg: 'bg-orange-500/10',
  iconColor: '#FB923C',
  status: 'coming-soon',
  filterType: 'edit',
  tags: ['split', 'extract', 'pages', 'pdf'],
  features: [
    'Extract individual pages or specified ranges (e.g. 1-5, 8, 11-14)',
    'Split entire book into separate single-page files',
    'Fast visual page preview grid',
  ],
};
