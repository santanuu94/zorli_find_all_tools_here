import React from 'react';
import { Minus, Plus, Info } from 'lucide-react';
import { SplitPlan } from '../types';

interface EqualModeControlsProps {
  totalPages: number;
  pagesPerGroup: number;
  onChangePagesPerGroup: (val: number) => void;
  plan: SplitPlan;
  disabled?: boolean;
}

export const EqualModeControls: React.FC<EqualModeControlsProps> = ({
  totalPages,
  pagesPerGroup,
  onChangePagesPerGroup,
  plan,
  disabled = false,
}) => {
  const handleDecrement = () => {
    if (pagesPerGroup > 1) {
      onChangePagesPerGroup(pagesPerGroup - 1);
    }
  };

  const handleIncrement = () => {
    if (pagesPerGroup < totalPages) {
      onChangePagesPerGroup(pagesPerGroup + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed)) {
      onChangePagesPerGroup(Math.max(1, Math.min(parsed, totalPages)));
    }
  };

  const totalFiles = Math.ceil(totalPages / Math.max(1, pagesPerGroup));
  const remainder = totalPages % pagesPerGroup;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div>
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Divide into Equal Page Groups
        </h4>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          Specify how many pages should be in each output document.
        </p>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label htmlFor="pages-per-file-input" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Pages per PDF file:
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={disabled || pagesPerGroup <= 1}
              aria-label="Decrease pages per file"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40"
            >
              <Minus className="w-4 h-4" />
            </button>

            <input
              id="pages-per-file-input"
              type="number"
              min="1"
              max={totalPages}
              value={pagesPerGroup}
              onChange={handleInputChange}
              disabled={disabled}
              className="w-20 px-3 py-2 rounded-xl text-center bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white font-mono font-bold text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            <button
              type="button"
              onClick={handleIncrement}
              disabled={disabled || pagesPerGroup >= totalPages}
              aria-label="Increase pages per file"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calculation summary */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <div className="flex items-center justify-between font-medium">
            <span>Expected output files:</span>
            <strong className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">
              {totalFiles} {totalFiles === 1 ? 'file' : 'files'}
            </strong>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-500 leading-relaxed">
            {totalFiles === 1
              ? `All ${totalPages} pages will be kept together in 1 file.`
              : remainder === 0
              ? `All ${totalFiles} files will contain exactly ${pagesPerGroup} pages each.`
              : `Parts 1–${totalFiles - 1} will have ${pagesPerGroup} pages each; Part ${totalFiles} will have the remaining ${remainder} ${remainder === 1 ? 'page' : 'pages'}.`}
          </p>
        </div>
      </div>
    </div>
  );
};
