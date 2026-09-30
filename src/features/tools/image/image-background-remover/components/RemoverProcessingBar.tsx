import React from 'react';
import { Loader2, Sparkles, Cpu } from 'lucide-react';
import { ProcessProgress } from '../types';

interface RemoverProcessingBarProps {
  progress?: ProcessProgress;
  fileName?: string;
}

export const RemoverProcessingBar: React.FC<RemoverProcessingBarProps> = ({
  progress,
  fileName,
}) => {
  const stage = progress?.stage || 'Removing background...';
  const percent = progress?.percent;

  return (
    <div
      className="w-full rounded-2xl border border-indigo-500/30 bg-slate-900/80 backdrop-blur-md p-6 shadow-xl text-center space-y-4"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-center gap-3">
        <div className="relative flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <Sparkles className="w-4 h-4 text-violet-400 absolute animate-pulse" />
        </div>
        <div className="text-left">
          <h4 className="text-base font-semibold text-white tracking-tight">
            {stage}
          </h4>
          {fileName && (
            <p className="text-xs text-slate-400 truncate max-w-xs md:max-w-md">
              {fileName}
            </p>
          )}
        </div>
      </div>

      {typeof percent === 'number' ? (
        <div className="w-full space-y-1.5">
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/60">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-electric-blue h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.max(5, Math.min(100, percent))}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400 px-1">
            <span className="flex items-center gap-1 text-indigo-300">
              <Cpu className="w-3 h-3" /> Running in browser
            </span>
            <span className="font-mono">{percent}%</span>
          </div>
        </div>
      ) : (
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/60 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-1/2 animate-[shimmer_1.5s_infinite]" />
        </div>
      )}

      <p className="text-xs text-slate-400">
        Your image is analyzed directly on your device. Zero cloud uploads.
      </p>
    </div>
  );
};
