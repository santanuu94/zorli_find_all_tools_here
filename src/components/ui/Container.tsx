import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  size = 'lg',
}) => {
  const sizeMap = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-[1240px]',
    full: 'max-w-full',
  };

  return (
    <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${sizeMap[size]} ${className}`}>
      {children}
    </div>
  );
};
