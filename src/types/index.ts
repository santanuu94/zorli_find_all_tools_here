export type ToolCategorySlug =
  | 'image'
  | 'images'
  | 'pdf'
  | 'developer'
  | 'text'
  | 'calculator'
  | 'calculators'
  | 'social'
  | 'converter'
  | 'downloader'
  | 'seo'
  | 'productivity'
  | 'privacy'
  | 'more';

export type ToolStatus = 'available' | 'coming-soon';

export type ToolFilterType = 'all' | 'popular' | 'convert' | 'edit' | 'optimize' | 'general';

export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: ToolCategorySlug;
  iconName: string;
  iconBg: string;
  iconColor: string;
  status: ToolStatus;
  featured?: boolean;
  popular?: boolean;
  filterType?: ToolFilterType;
  tags?: string[];
  features?: string[];
  howItWorks?: { step: number; title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
}

export interface ToolCategory {
  slug: ToolCategorySlug;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  iconBg: string;
  iconColor: string;
  toolsCount?: number;
  featured?: boolean;
  heroBadge?: string;
  heroDescription?: string;
  filterTabs?: { id: string; label: string }[];
  proTip?: {
    title: string;
    description: string;
    toolSlug: string;
    toolName: string;
  };
  whyBanner?: {
    headline: string;
    highlightWord: string;
    subtitle: string;
    points: {
      iconName: string;
      title: string;
      description: string;
    }[];
  };
}

export type RoutePath =
  | '/'
  | '/tools'
  | '/categories'
  | `/categories/${string}`
  | `/tools/${string}`
  | `/tools/${string}/${string}`
  | '/about'
  | '/blog'
  | '/contact'
  | '/privacy'
  | '/terms';
