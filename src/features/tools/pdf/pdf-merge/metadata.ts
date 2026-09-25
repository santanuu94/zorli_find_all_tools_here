import { Tool } from '../../../../types';

export const metadata: Tool = {
  slug: 'pdf-merge',
  name: 'PDF Merger',
  description: 'Combine multiple PDF files into one clean document in seconds.',
  category: 'pdf',
  iconName: 'Layers',
  iconBg: 'bg-rose-500/10',
  iconColor: '#F43F5E',
  status: 'coming-soon',
  featured: true,
  filterType: 'edit',
  tags: ['merge', 'combine', 'join', 'pdf'],
  features: [
    'Drag and drop reordering of files and pages',
    'Combine any number of PDF documents seamlessly',
    'No document watermarks or branding added',
  ],
};
