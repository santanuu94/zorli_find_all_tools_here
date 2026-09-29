import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Code2, Search } from 'lucide-react';

interface MetadataAdvancedViewProps {
  rawTags: Record<string, any>;
}

export const MetadataAdvancedView: React.FC<MetadataAdvancedViewProps> = ({ rawTags }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const keys = Object.keys(rawTags).filter((k) => k !== 'errors' && k !== 'warnings');

  const filteredKeys = searchQuery.trim()
    ? keys.filter((k) =>
        k.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(rawTags[k]).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : keys;

  if (keys.length === 0) return null;

  return (
    <div className="rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 overflow-hidden transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-100/60 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-slate-200/80 dark:bg-white/10 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Advanced / Technical Metadata</span>
              <span className="text-[11px] font-mono font-medium text-slate-400">
                ({keys.length} raw tags)
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Low-level EXIF/XMP/IPTC binary tags and parser properties
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-indigo-500 font-semibold">
          <span>{isOpen ? 'Collapse' : 'Show Details'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 sm:p-5 border-t border-slate-200/80 dark:border-white/10 space-y-3.5 bg-white dark:bg-[#070B24]/40">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tag name or value..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
            {filteredKeys.length === 0 ? (
              <div className="text-xs text-slate-400 p-3 text-center">No matching tags found.</div>
            ) : (
              filteredKeys.map((key) => {
                const val = rawTags[key];
                let displayVal = String(val);
                if (typeof val === 'object' && val !== null) {
                  try {
                    displayVal = JSON.stringify(val);
                  } catch (e) {
                    displayVal = String(val);
                  }
                }

                return (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 text-xs font-mono gap-1"
                  >
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
                      {key}
                    </span>
                    <span
                      className="text-slate-700 dark:text-slate-300 truncate max-w-full sm:max-w-md text-right"
                      title={displayVal}
                    >
                      {displayVal}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
