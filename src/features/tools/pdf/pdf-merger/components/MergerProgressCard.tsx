import React from 'react';
import { Loader2, ShieldCheck, Layers } from 'lucide-react';
import { MergerProgress } from '../types';

interface MergerProgressCardProps {
  progress: MergerProgress | null;
}

export const MergerProgressCard: React.FC<MergerProgressCardProps> = ({
  progress,
}) => {
  const percentage = progress?.percentage || 30;

  return (
    <div className="p-8 rounded-3xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-lg text-center space-y-5 animate-in fade-in">
      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 mx-auto flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin" />
      </div>

      <div className="space-y-1">
        <h4 className="text-base font-bold font-display text-slate-900 dark:text-white">
          {progress?.message || 'Merging PDF documents...'}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Please keep this page open while your files are combined
        </p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto">
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>100% Client-Side • Your documents never leave your computer</span>
      </div>
    </div>
  );
};
