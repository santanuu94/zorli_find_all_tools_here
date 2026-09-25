import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'light' | 'dark' | 'glass-dark' | 'glass-light';
  interactive?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'light',
  interactive = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    light:
      'bg-white text-slate-800 border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:border-indigo-100',
    dark:
      'bg-[#0D1438] text-white border border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]',
    'glass-dark':
      'bg-[#0D1438]/80 text-white backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]',
    'glass-light':
      'bg-white/90 text-slate-900 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)]',
  };

  const interactiveStyles = interactive
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer'
    : '';

  return (
    <div
      className={`rounded-2xl p-6 ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
