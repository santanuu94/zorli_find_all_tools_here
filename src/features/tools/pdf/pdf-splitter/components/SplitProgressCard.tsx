import React from 'react';
import { Loader2, Scissors, ShieldCheck } from 'lucide-react';
import { SplitProgress } from '../types';

interface SplitProgressCardProps {
  progress: SplitProgress;
}

export const SplitProgressCard: React.FC<SplitProgressCardProps> = ({ progress }) => {
  const percent =
    progress.totalParts > 0
      ? Math.round((progress.currentPart / progress.totalParts) * 100)
      : 0;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-xl space-y-5 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-500/20">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Splitting your PDF...
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {progress.message || 'Extracting and compiling requested pages...'}
            </p>
          </div>
        </div>

        {progress.totalParts > 0 && (
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            {progress.currentPart} / {progress.totalParts}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${Math.max(8, percent)}%` }}
        />
      </div>

      {/* Privacy Guarantee Note */}
      <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        <span>100% in-browser processing. Your document is never uploaded to any server.</span>
      </div>
    </div>
  );
};
