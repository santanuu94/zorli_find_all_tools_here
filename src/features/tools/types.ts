import React from 'react';
import { Tool, ToolCategorySlug } from '../../types';

export interface ToolComponentProps {
  tool?: Tool;
  metadata?: Tool;
  onNavigateHome?: () => void;
  onNavigateCategory?: (categorySlug: string) => void;
}

export interface ToolModule {
  metadata: Tool;
  Component: React.ComponentType<ToolComponentProps>;
}

export interface ToolFamilyRegistry {
  family: ToolCategorySlug;
  name: string;
  description: string;
  tools: ToolModule[];
}
