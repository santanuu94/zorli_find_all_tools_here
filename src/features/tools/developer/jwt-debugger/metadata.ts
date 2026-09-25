import { Tool } from '../../../../types';

export const metadata: Tool = {
  slug: 'jwt-debugger',
  name: 'JWT Debugger',
  description: 'Inspect and decode JSON Web Tokens safely in the browser.',
  category: 'developer',
  iconName: 'Key',
  iconBg: 'bg-emerald-500/10',
  iconColor: '#10B981',
  status: 'coming-soon',
  filterType: 'general',
  tags: ['jwt', 'token', 'auth', 'security'],
  features: [
    'Decodes Header, Payload and Signature blocks',
    '100% Client-side token analysis without sending keys over the internet',
    'Expiration timestamp parsing with human readable countdown',
  ],
};
