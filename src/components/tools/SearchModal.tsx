import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { Tool } from '../../types';
import { TOOLS, searchTools } from '../../data/tools';
import { IconHelper } from '../ui/IconHelper';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (tool: Tool) => void;
  onSelectCategory?: (categorySlug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
}) => {
  const [query, setQuery] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const results = query.trim() ? searchTools(query) : TOOLS.filter((t) => t.popular || t.featured).slice(0, 8);

  // Suggestion pills are derived from the catalogue so the modal can never
  // advertise a tool the app does not have.
  const suggestions = TOOLS.filter((t) => t.popular || t.featured).slice(0, 4).map((t) => t.name);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/60 dark:bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#0D1438] border border-slate-200 dark:border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-300 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, categories, or keywords..."
            autoFocus
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-base md:text-lg focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/5 flex items-center gap-2 overflow-x-auto text-xs text-slate-500 dark:text-slate-400">
          <span className="shrink-0 text-slate-400">Popular:</span>
          {suggestions.map((suggest) => (
            <button
              key={suggest}
              onClick={() => setQuery(suggest)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent hover:bg-[#6657FF]/15 hover:text-[#6657FF] transition-colors shrink-0 text-slate-700 dark:text-slate-300 cursor-pointer shadow-xs"
            >
              {suggest}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5 flex-1">
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {query.trim() ? `Search Results (${results.length})` : 'Popular & Featured Tools'}
          </div>

          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Sparkles className="w-8 h-8 text-[#6657FF] dark:text-[#8B5CF6] mx-auto mb-2 opacity-60" />
              <p className="text-base text-slate-700 dark:text-slate-300 font-medium">No tools found</p>
              <p className="text-xs text-slate-500 mt-1">
                Tools are still rolling out — more searchable tools are on the way.
              </p>
            </div>
          ) : (
            results.map((tool) => (
              <button
                key={tool.slug}
                onClick={() => {
                  onSelectTool(tool);
                  onClose();
                }}
                className="w-full text-left p-3.5 hover:bg-slate-100/80 dark:hover:bg-white/5 rounded-2xl transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${tool.iconBg}`}
                    style={{ color: tool.iconColor }}
                  >
                    <IconHelper name={tool.iconName} className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm md:text-base font-semibold text-slate-900 dark:text-white group-hover:text-[#6657FF] transition-colors">
                        {tool.name}
                      </span>
                      {tool.status === 'available' && tool.popular && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-[#6657FF] to-[#8B5CF6] text-white font-medium">
                          Popular
                        </span>
                      )}
                      {tool.status === 'coming-soon' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 font-medium">
                          Coming soon
                        </span>
                      )}
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 dark:border-white/10 px-1.5 py-0.5 rounded">
                        {tool.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {tool.description}
                    </p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/5 group-hover:bg-[#6657FF] text-slate-500 dark:text-slate-400 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
