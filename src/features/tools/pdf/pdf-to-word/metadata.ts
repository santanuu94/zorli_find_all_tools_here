import { Tool } from '../../../../types';

export const metadata: Tool = {
  slug: 'pdf-to-word',
  name: 'PDF to Word',
  description: 'Convert PDF documents into editable Word files.',
  category: 'pdf',
  iconName: 'FileCode',
  iconBg: 'bg-blue-500/10',
  iconColor: '#3B82F6',
  status: 'coming-soon',
  filterType: 'convert',
  tags: ['convert', 'word', 'doc', 'editable'],
  features: [
    'Converts PDF text, paragraphs, and tables into .docx format',
    'Maintains document fonts, headings, and styling layout',
    'Ready for Microsoft Word and Google Docs editing',
  ],
};
