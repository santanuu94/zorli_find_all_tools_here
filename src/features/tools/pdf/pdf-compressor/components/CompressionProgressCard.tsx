import React from 'react';
import { Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { CompressionProgress } from '../types';

interface CompressionProgressCardProps {
  progress: CompressionProgress | null;
}

export const CompressionProgressCard: React.FC<CompressionProgressCardProps> = ({
  progress,
}) => {
  const percentage = progress?.percentage || 30;

  return (
    <div className="p-8 rounded-3xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-lg text-center space-y-5 animate-in fade-in">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin" />
      </div>

      <div className="space-y-1">
        <h4 className="text-base font-bold font-display text-slate-900 dark:text-white">
          {progress?.message || 'Optimizing PDF Document...'}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Calculating byte streams and applying target-size compression
        </p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto">
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-red-500 transition-all duration-300 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>100% Client-Side • Your document never leaves your device</span>
      </div>
    </div>
  );
};
