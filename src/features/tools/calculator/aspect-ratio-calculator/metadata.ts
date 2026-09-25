import { Tool } from '../../../../types';

export const metadata: Tool = {
  slug: 'aspect-ratio-calculator',
  name: 'Aspect Ratio Calculator',
  description: 'Calculate matching 16:9, 4:3, and custom dimensions for video & photos.',
  category: 'calculators',
  iconName: 'Maximize',
  iconBg: 'bg-teal-500/10',
  iconColor: '#14B8A6',
  status: 'coming-soon',
  filterType: 'general',
  tags: ['ratio', 'screen', 'dimensions', 'resolution'],
  features: [
    'Presets for 16:9, 4:3, 1:1, 9:16 vertical video and 21:9 ultrawide',
    'Calculate missing height from new width instantly',
    'Calculate missing width from new height',
  ],
};
