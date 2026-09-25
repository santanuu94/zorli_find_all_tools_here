import React from 'react';
import * as Icons from 'lucide-react';

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
  const IconComponent = (Icons[name] || Icons.Sparkles) as React.ComponentType<{
    className?: string;
    size?: number;
    color?: string;
  }>;

  return <IconComponent className={className} size={size} color={color} />;
};
