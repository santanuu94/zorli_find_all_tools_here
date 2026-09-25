import { Tool } from '../../../../types';

export const metadata: Tool = {
  slug: 'case-converter',
  name: 'Case Converter',
  description: 'Convert text to uppercase, lowercase, title case, camelCase, snake_case.',
  category: 'text',
  iconName: 'CaseSensitive',
  iconBg: 'bg-amber-500/10',
  iconColor: '#D97706',
  status: 'coming-soon',
  filterType: 'edit',
  tags: ['case', 'uppercase', 'camelcase', 'slug'],
  features: [
    'UPPERCASE, lowercase, Title Case',
    'camelCase, PascalCase, snake_case, kebab-case',
    'Instant copy output button',
  ],
};
