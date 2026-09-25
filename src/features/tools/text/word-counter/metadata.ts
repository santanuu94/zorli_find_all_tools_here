import { Tool } from '../../../../types';

export const metadata: Tool = {
  slug: 'word-counter',
  name: 'Word & Character Counter',
  description: 'Count words, characters, sentences, paragraphs and reading time.',
  category: 'text',
  iconName: 'Type',
  iconBg: 'bg-amber-500/10',
  iconColor: '#F59E0B',
  status: 'coming-soon',
  featured: true,
  popular: true,
  filterType: 'optimize',
  tags: ['words', 'count', 'characters', 'reading time'],
  features: [
    'Real-time stats as you type',
    'Estimated reading and speaking duration',
    'Characters with and without whitespace',
    'Keyword density analysis',
  ],
};
