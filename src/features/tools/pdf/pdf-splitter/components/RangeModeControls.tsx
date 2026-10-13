import React from 'react';
import { Plus, Trash2, AlertTriangle, Info } from 'lucide-react';
import { RangeRow, SplitPlan } from '../types';

interface RangeModeControlsProps {
  totalPages: number;
  rangeRows: RangeRow[];
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
  onUpdateRow: (id: string, updates: Partial<RangeRow>) => void;
  plan: SplitPlan;
  disabled?: boolean;
}

export const RangeModeControls: React.FC<RangeModeControlsProps> = ({
  totalPages,
  rangeRows,
  onAddRow,
  onRemoveRow,
  onUpdateRow,
  plan,
  disabled = false,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Define Output Page Ranges
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Document contains <strong>{totalPages}</strong> {totalPages === 1 ? 'page' : 'pages'}. Each range will create a separate PDF file.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddRow}
          disabled={disabled}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Range</span>
        </button>
      </div>

      {/* Rows List */}
      <div className="space-y-2.5">
        {rangeRows.map((row, index) => {
          const startVal = row.start;
          const endVal = row.end;

          return (
            <div
              key={row.id}
              className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-xs font-bold font-mono flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Part {index + 1}
                </span>
              </div>

              {/* Start and End inputs */}
              <div className="flex items-center gap-2 flex-1 sm:max-w-md">
                <div className="flex-1 flex items-center gap-1.5">
                  <label htmlFor={`range-start-${row.id}`} className="text-[11px] text-slate-400 font-medium">
                    From
                  </label>
                  <input
                    id={`range-start-${row.id}`}
                    type="number"
                    min="1"
                    max={totalPages}
                    value={startVal}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                      onUpdateRow(row.id, { start: val });
                    }}
                    disabled={disabled}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="1"
                  />
                </div>

                <span className="text-slate-400 text-xs font-bold">—</span>

                <div className="flex-1 flex items-center gap-1.5">
                  <label htmlFor={`range-end-${row.id}`} className="text-[11px] text-slate-400 font-medium">
                    To
                  </label>
                  <input
                    id={`range-end-${row.id}`}
                    type="number"
                    min="1"
                    max={totalPages}
                    value={endVal}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                      onUpdateRow(row.id, { end: val });
                    }}
                    disabled={disabled}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder={String(totalPages)}
                  />
                </div>

                {/* Remove button */}
                {rangeRows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveRow(row.id)}
                    disabled={disabled}
                    title="Remove this range"
                    aria-label={`Remove range ${index + 1}`}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Warnings & Notices */}
      {plan.uncoveredPages.length > 0 && plan.isValid && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Excluded Pages Notice</span>
            <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
              {plan.uncoveredPages.length === 1
                ? `Page ${plan.uncoveredPages[0]} is not included in any range and will not be in the output.`
                : `${plan.uncoveredPages.length} pages (${plan.uncoveredPages.slice(0, 8).join(', ')}${
                    plan.uncoveredPages.length > 8 ? '...' : ''
                  }) are excluded from the split output.`}
            </p>
          </div>
        </div>
      )}

      {plan.hasOverlaps && plan.overlapNotes && (
        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-900 dark:text-blue-200 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Overlapping Pages</span>
            <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
              {plan.overlapNotes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
