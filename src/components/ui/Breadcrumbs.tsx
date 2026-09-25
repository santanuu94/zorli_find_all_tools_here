import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-xs md:text-sm text-slate-400 select-none ${className}`}>
      <button
        onClick={() => {
          if (items[0]?.onClick) items[0].onClick();
        }}
        className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </button>

      {items.slice(1).map((item, idx) => {
        const isLast = idx === items.length - 2;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            {isLast ? (
              <span className="text-slate-200 font-medium truncate max-w-[200px] sm:max-w-none">
                {item.label}
              </span>
            ) : (
              <button
                onClick={item.onClick}
                className="hover:text-white transition-colors cursor-pointer truncate max-w-[150px] sm:max-w-none"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
