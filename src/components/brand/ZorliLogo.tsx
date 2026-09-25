import React from 'react';

interface ZorliLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
}

export const ZorliLogo: React.FC<ZorliLogoProps> = ({
  size = 'md',
  showWordmark = true,
  theme = 'auto',
  className = '',
}) => {
  const sizeMap = {
    sm: { height: 28, width: showWordmark ? 112 : 28, text: 'text-xl', iconSize: 28 },
    md: { height: 36, width: showWordmark ? 144 : 36, text: 'text-2xl', iconSize: 36 },
    lg: { height: 46, width: showWordmark ? 184 : 46, text: 'text-3xl', iconSize: 46 },
    xl: { height: 56, width: showWordmark ? 224 : 56, text: 'text-4xl', iconSize: 56 },
  };

  const { iconSize, text } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2 select-none group cursor-pointer ${className}`}>
      {/* Brand Icon Mark */}
      <div className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="starGradMain" x1="10" y1="10" x2="70" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <filter id="starGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <g filter="url(#starGlow)">
            {/* Primary 4-point sparkle star */}
            <path
              d="M40 12 C40 27 45 32 60 40 C45 48 40 53 40 68 C40 53 35 48 20 40 C35 32 40 27 40 12 Z"
              fill="url(#starGradMain)"
            />
            {/* Secondary companion mini sparkle */}
            <path
              d="M58 20 C58 24 59 26 63 28 C59 30 58 32 58 36 C58 32 57 30 53 28 C57 26 58 24 58 20 Z"
              fill="#A78BFA"
              opacity="0.9"
            />
          </g>
        </svg>
      </div>

      {/* Brand Wordmark */}
      {showWordmark && (
        <span
          className={`font-display font-extrabold tracking-[-0.03em] ${text} transition-colors ${
            theme === 'light'
              ? 'text-[#0F172A]'
              : theme === 'dark'
              ? 'text-white'
              : 'text-[#0F172A] dark:text-white'
          }`}
        >
          Zorli
        </span>
      )}
    </div>
  );
};
