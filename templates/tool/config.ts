import { Tool } from '../../src/types';

export interface ToolConfig extends Tool {
  version: string;
}

export const toolConfig: ToolConfig = {
  slug: 'tool-slug',
  name: 'Tool Name',
  description: 'Clean description of what this tool achieves.',
  category: 'image', // primary tool family
  iconName: 'Sparkles',
  iconBg: 'bg-indigo-500/10',
  iconColor: '#6366F1',
  status: 'coming-soon', // or 'available'
  version: '1.0.0',
  features: [
    'Feature 1 bullet description',
    'Feature 2 bullet description',
  ],
  howItWorks: [
    { step: 1, title: 'Step 1 Title', description: 'Step 1 instructions' },
    { step: 2, title: 'Step 2 Title', description: 'Step 2 instructions' },
    { step: 3, title: 'Step 3 Title', description: 'Step 3 instructions' },
  ],
  faqs: [
    { question: 'Is this tool free?', answer: 'Yes, Zorli tools are completely free.' },
  ],
};

export const metadata = toolConfig;
