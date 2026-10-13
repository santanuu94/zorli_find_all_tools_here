import React from 'react';
import { Layers, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { SplitPlan } from '../types';

interface SplitPlanPreviewProps {
  plan: SplitPlan;
  originalFilename: string;
  totalPages: number;
}

export const SplitPlanPreview: React.FC<SplitPlanPreviewProps> = ({
  plan,
  originalFilename,
  totalPages,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          Output Plan Preview
        </label>
        {plan.isValid && (
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
            {plan.items.length} {plan.items.length === 1 ? 'file' : 'files'} planned
          </span>
        )}
      </div>

      {/* Error state */}
      {!plan.isValid && plan.errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Configuration Error</span>
            <p className="text-[11px]">{plan.errorMessage}</p>
          </div>
        </div>
      )}

      {/* Plan items list */}
      {plan.isValid && plan.items.length > 0 && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-sm space-y-2 max-h-60 overflow-y-auto">
          {plan.items.map((item) => (
            <div
              key={item.id}
              className="p-2.5 sm:p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-5 h-5 rounded-md bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                  {item.sequence}
                </span>
                <div className="min-w-0 truncate">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                    {item.filename}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {item.pageDisplay} ({item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'})
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-1.5 text-slate-400 text-[11px] font-mono">
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                <span>{item.pageCount}p</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
