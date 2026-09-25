import React from 'react';

interface ZorliSparkleProps {
  size?: number;
  className?: string;
  glow?: boolean;
  colorGradId?: string;
  variant?: 'primary' | 'secondary' | 'cyan' | 'white';
}

export const ZorliSparkle: React.FC<ZorliSparkleProps> = ({
  size = 40,
  className = '',
  glow = true,
  colorGradId,
  variant = 'primary',
}) => {
  const gradId = colorGradId || `starGrad-${Math.random().toString(36).substring(2, 8)}`;
  const glowId = `starGlow-${gradId}`;

  const gradients = {
    primary: { stop1: '#A78BFA', stop2: '#818CF8', stop3: '#60A5FA', sub: '#DDD6FE' },
    secondary: { stop1: '#C084FC', stop2: '#A855F7', stop3: '#7E22CE', sub: '#F3E8FF' },
    cyan: { stop1: '#38BDF8', stop2: '#6366F1', stop3: '#8B5CF6', sub: '#A5F3FC' },
    white: { stop1: '#FFFFFF', stop2: '#E0E7FF', stop3: '#C7D2FE', sub: '#FFFFFF' },
  };

  const selected = gradients[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible pointer-events-none select-none ${className}`}
    >
      <defs>
        <linearGradient id={gradId} x1="10" y1="10" x2="70" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={selected.stop1} />
          <stop offset="50%" stopColor={selected.stop2} />
          <stop offset="100%" stopColor={selected.stop3} />
        </linearGradient>
        {glow && (
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>
      <g filter={glow ? `url(#${glowId})` : undefined}>
        {/* Main 4-pointed Star */}
        <path
          d="M40 12 C40 27 45 32 60 40 C45 48 40 53 40 68 C40 53 35 48 20 40 C35 32 40 27 40 12 Z"
          fill={`url(#${gradId})`}
        />
        {/* Secondary Sparkle */}
        <path
          d="M58 20 C58 24 59 26 63 28 C59 30 58 32 58 36 C58 32 57 30 53 28 C57 26 58 24 58 20 Z"
          fill={selected.sub}
          opacity="0.9"
        />
      </g>
    </svg>
  );
};
