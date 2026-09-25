import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { CompressedFileItem } from '../types';
import { formatFileSize } from '../utils/format-file-size';

interface CompressionResultProps {
  files: CompressedFileItem[];
}

export const CompressionResult: React.FC<CompressionResultProps> = ({ files }) => {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2 mt-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs"
        >
          <div className="flex items-center gap-2 truncate pr-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{file.name}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 font-mono text-slate-500 dark:text-slate-400">
            <span>{formatFileSize(file.originalSize)}</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="text-emerald-400 font-bold">
              {formatFileSize(Math.round(file.originalSize * 0.45))} (-55%)
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
