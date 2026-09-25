import React from 'react';
import { Home, Wrench, Grid, Search, Sparkles } from 'lucide-react';

interface MobileBottomBarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  currentPath,
  onNavigate,
  onOpenSearch,
}) => {
  const items = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Tools', path: '/tools', icon: Wrench },
    { label: 'Search', action: onOpenSearch, icon: Search, highlight: true },
    { label: 'Categories', path: '/categories', icon: Grid },
    { label: 'About', path: '/about', icon: Sparkles },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#070B24]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-white/10 px-2 py-2 flex items-center justify-around shadow-[0_-5px_25px_rgba(0,0,0,0.06)] dark:shadow-[0_-5px_25px_rgba(0,0,0,0.5)] safe-area-bottom transition-colors duration-300"
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        const isActive = item.path ? currentPath === item.path : false;

        if (item.highlight) {
          return (
            <button
              key={idx}
              onClick={item.action}
              className="flex flex-col items-center justify-center -mt-5 group cursor-pointer focus:outline-none"
              aria-label="Open global search"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#6657FF] to-[#8B5CF6] text-white flex items-center justify-center shadow-lg shadow-[#6657FF]/40 border-2 border-white dark:border-[#070B24] active:scale-95 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 mt-1">Search</span>
            </button>
          );
        }

        return (
          <button
            key={idx}
            onClick={() => item.path && onNavigate(item.path)}
            className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
              isActive ? 'text-[#6657FF] dark:text-[#8B5CF6] font-semibold' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
