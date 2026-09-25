import React from 'react';
import { Loader2 } from 'lucide-react';

interface CompressionProgressProps {
  progress?: number;
}

export const CompressionProgress: React.FC<CompressionProgressProps> = ({ progress = 50 }) => {
  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-3">
      <Loader2 className="w-5 h-5 text-[#6657FF] animate-spin shrink-0" />
      <div className="flex-1">
        <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
          <span>Compressing assets...</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#6657FF] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
