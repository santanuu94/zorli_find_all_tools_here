import { Tool } from '../../../../types';

export const metadata: Tool = {
  slug: 'base64-encode-decode',
  name: 'Base64 Encoder / Decoder',
  description: 'Encode text and files to Base64 strings or decode back.',
  category: 'developer',
  iconName: 'Binary',
  iconBg: 'bg-indigo-500/10',
  iconColor: '#818CF8',
  status: 'coming-soon',
  filterType: 'convert',
  tags: ['base64', 'decode', 'encode', 'binary'],
  features: [
    'Fast UTF-8 and ASCII string encoding and decoding',
    'Drag and drop files to generate Data URI strings',
    'Real-time conversion without page reloads',
  ],
};
