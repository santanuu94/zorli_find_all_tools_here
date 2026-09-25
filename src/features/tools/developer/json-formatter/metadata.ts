import { Tool } from '../../../../types';

export const metadata: Tool = {
  slug: 'json-formatter',
  name: 'JSON Formatter & Validator',
  description: 'Clean, format, indent and validate complex JSON data.',
  category: 'developer',
  iconName: 'Code',
  iconBg: 'bg-purple-500/10',
  iconColor: '#A855F7',
  status: 'coming-soon',
  featured: true,
  popular: true,
  filterType: 'edit',
  tags: ['json', 'format', 'beautify', 'validate', 'lint'],
  features: [
    'Beautify, indent, and format unreadable minified JSON',
    'Syntax error highlighting and diagnostic explanations',
    'One-click minify / compact payload generator',
    'Copy formatted code directly to clipboard',
  ],
};
