import React from 'react';
import {
  AlignLeft,
  Binary,
  CaseSensitive,
  Code,
  Columns,
  Crop,
  FileCode,
  FileCode2,
  FileText,
  Grid,
  Heart,
  Image,
  Key,
  Layers,
  LayoutGrid,
  Link,
  Maximize,
  Maximize2,
  Percent,
  RotateCw,
  Scissors,
  Shield,
  Smartphone,
  Sparkles,
  Type,
  Zap,
} from 'lucide-react';

/**
 * Explicit whitelist of every icon referenced by an `iconName` in the category
 * and tool metadata.
 *
 * Do NOT replace this with `import * as Icons from 'lucide-react'`. A namespace
 * import defeats tree-shaking and pulls the entire icon library into the initial
 * bundle (it was the single largest contributor to the entry chunk).
 *
 * Adding a tool? Import its icon above and add it to this map.
 */
const ICONS = {
  AlignLeft,
  Binary,
  CaseSensitive,
  Code,
  Columns,
  Crop,
  FileCode,
  FileCode2,
  FileText,
  Grid,
  Heart,
  Image,
  Key,
  Layers,
  LayoutGrid,
  Link,
  Maximize,
  Maximize2,
  Percent,
  RotateCw,
  Scissors,
  Shield,
  Smartphone,
  Sparkles,
  Type,
  Zap,
};

type IconName = keyof typeof ICONS;

interface IconHelperProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

export const IconHelper: React.FC<IconHelperProps> = ({
  name,
  className = 'w-5 h-5',
  size,
  color,
}) => {
  // Unknown names fall back to the brand sparkle rather than crashing.
  const IconComponent = ICONS[name as IconName] ?? Sparkles;

  return <IconComponent className={className} size={size} color={color} />;
};

