import { Tool } from '../../../../types';

export const metadata: Tool = {
  slug: 'url-encoder-decoder',
  name: 'URL Encoder / Decoder',
  description: 'Safely encode URI components and decode query strings.',
  category: 'developer',
  iconName: 'Link',
  iconBg: 'bg-sky-500/10',
  iconColor: '#38BDF8',
  status: 'coming-soon',
  filterType: 'convert',
  tags: ['url', 'uri', 'query', 'encode'],
  features: [
    'Encode special characters like spaces, amps, and question marks',
    'Decode complex nested URL query parameters',
    'RFC 3986 compliance',
  ],
};
