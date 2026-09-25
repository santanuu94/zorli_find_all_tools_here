import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6657FF]/50 focus:ring-offset-2 active:scale-[0.98] select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#6657FF] to-[#8B5CF6] text-white hover:brightness-110 shadow-lg shadow-[#6657FF]/25 border border-white/15',
    secondary:
      'bg-slate-200/80 hover:bg-slate-200 text-slate-900 border border-slate-300/80 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white dark:border-white/15 backdrop-blur-md shadow-sm',
    outline:
      'bg-transparent border border-slate-300 dark:border-white/20 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/10',
    ghost:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200',
    glass:
      'bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/15 text-slate-900 dark:text-white hover:bg-white/90 dark:hover:bg-white/20 shadow-md',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
