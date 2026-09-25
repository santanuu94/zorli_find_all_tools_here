import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowRight, X, Sparkles } from 'lucide-react';
import { Tool } from '../../types';
import { searchTools } from '../../data/tools';
import { IconHelper } from '../ui/IconHelper';

interface ToolSearchProps {
  placeholder?: string;
  categoryFilter?: string;
  onSelectTool?: (tool: Tool) => void;
  className?: string;
  autoFocus?: boolean;
}

export const ToolSearch: React.FC<ToolSearchProps> = ({
  placeholder = 'Search for a tool (e.g. compress image, merge PDF...)',
  categoryFilter,
  onSelectTool,
  className = '',
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter tools
  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    let list = searchTools(query);
    if (categoryFilter) {
      list = list.filter((t) => t.category === categoryFilter);
    }
    return list.slice(0, 6);
  }, [query, categoryFilter]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (tool: Tool) => {
    setIsOpen(false);
    setQuery('');
    if (onSelectTool) {
      onSelectTool(tool);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Bar */}
      <div className="relative flex items-center bg-white dark:bg-[#0D1438]/90 rounded-full border border-slate-200 dark:border-white/15 shadow-xl shadow-indigo-950/20 backdrop-blur-xl p-1.5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#6657FF] focus-within:border-transparent">
        <div className="flex items-center pl-3.5 pr-2 text-slate-400">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-300" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full bg-transparent py-2.5 px-1 text-sm md:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
        />

        {query && (
          <button
            onClick={() => setQuery('')}
            className="p-1 mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => {
            if (results[0]) handleSelect(results[0]);
          }}
          className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-r from-[#6657FF] to-[#8B5CF6] text-white flex items-center justify-center shadow-md shadow-[#6657FF]/30 hover:brightness-110 active:scale-95 transition-all shrink-0 cursor-pointer"
          aria-label="Submit search"
        >
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      {/* Autocomplete Dropdown Results */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0D1438] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/15 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Matching Tools ({results.length})</span>
              <span className="text-[11px] lowercase text-[#6657FF]">Press to open</span>
            </div>

            {results.length === 0 ? (
              <div className="py-6 px-4 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  We couldn't find a tool matching "{query}".
                </p>
                <p className="text-xs text-slate-400">
                  Try terms like "compress", "pdf", "json", "word count"
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {results.map((tool) => (
                  <button
                    key={tool.slug}
                    onClick={() => handleSelect(tool)}
                    className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tool.iconBg}`}
                        style={{ color: tool.iconColor }}
                      >
                        <IconHelper name={tool.iconName} className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-[#6657FF] transition-colors">
                            {tool.name}
                          </span>
                          {tool.popular && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-[#6657FF]/15 text-[#8B5CF6] rounded font-medium">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate max-w-[260px] sm:max-w-md">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#6657FF] group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
