import React from 'react';
import { Check, Info } from 'lucide-react';
import { SplitPlan } from '../types';

interface ExtractModeControlsProps {
  totalPages: number;
  selectedPages: number[];
  extractText: string;
  onTogglePage: (page: number) => void;
  onTextChange: (text: string) => void;
  onSelectAll: () => void;
  onSelectOdd: () => void;
  onSelectEven: () => void;
  onClear: () => void;
  plan: SplitPlan;
  disabled?: boolean;
}

export const ExtractModeControls: React.FC<ExtractModeControlsProps> = ({
  totalPages,
  selectedPages,
  extractText,
  onTogglePage,
  onTextChange,
  onSelectAll,
  onSelectOdd,
  onSelectEven,
  onClear,
  plan,
  disabled = false,
}) => {
  const selectedSet = new Set(selectedPages);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Select Pages to Extract
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Every selected page becomes its own 1-page PDF file. Total pages: <strong>{totalPages}</strong>.
          </p>
        </div>

        {/* Quick Selection Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={onSelectAll}
            disabled={disabled}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            All
          </button>
          <button
            type="button"
            onClick={onSelectOdd}
            disabled={disabled}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            Odd
          </button>
          <button
            type="button"
            onClick={onSelectEven}
            disabled={disabled}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            Even
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Manual Input Field */}
      <div className="space-y-1.5">
        <label htmlFor="extract-pages-input" className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          Page numbers or ranges (e.g. 1, 3, 5-8):
        </label>
        <input
          id="extract-pages-input"
          type="text"
          value={extractText}
          onChange={(e) => onTextChange(e.target.value)}
          disabled={disabled}
          placeholder="1, 3, 5"
          className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#070B24] border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {/* Interactive Page Pills Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Click page badges to toggle:</span>
          <span>
            Selected: <strong className="text-indigo-500">{selectedPages.length}</strong> of {totalPages}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-3 rounded-2xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            const isSelected = selectedSet.has(page);
            return (
              <button
                key={page}
                type="button"
                onClick={() => onTogglePage(page)}
                disabled={disabled}
                aria-label={`Toggle page ${page}`}
                aria-pressed={isSelected}
                className={`min-w-9 h-8 px-2 rounded-lg font-mono text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 ring-2 ring-indigo-500/30'
                    : 'bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-indigo-400/50'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                <span>{page}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Plan summary badge */}
      {selectedPages.length > 0 && plan.isValid && (
        <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-900 dark:text-indigo-200 text-xs flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>
            {selectedPages.length} separate single-page PDF {selectedPages.length === 1 ? 'file' : 'files'} will be generated.
          </span>
        </div>
      )}
    </div>
  );
};
