import React from 'react';

export interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'glass' | 'success' | 'amber' | 'popular' | 'category';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'glass',
  size = 'md',
  children,
  icon,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs md:text-sm px-3 py-1 gap-1.5',
  };

  const variantStyles = {
    primary: 'bg-[#6657FF]/15 text-[#8B5CF6] border border-[#6657FF]/30 font-medium',
    secondary: 'bg-white/10 text-white/90 border border-white/15 backdrop-blur-sm',
    glass:
      'bg-white/80 dark:bg-white/10 text-slate-800 dark:text-white/90 border border-slate-200 dark:border-white/15 backdrop-blur-md shadow-sm',
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    popular:
      'bg-gradient-to-r from-[#6657FF] to-[#8B5CF6] text-white font-semibold shadow-sm text-[10px] tracking-wide uppercase',
    category:
      'bg-[#6657FF]/20 text-[#A78BFA] border border-[#8B5CF6]/30 font-semibold tracking-wider uppercase text-[11px]',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium transition-colors select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
