import React from 'react';
import { CheckCircle2, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { CompressedFileItem } from '../types';
import { formatFileSize } from '../utils/format-file-size';

interface CompressionResultProps {
  files: CompressedFileItem[];
}

const STATUS_ICON = {
  pending: <Clock className="w-4 h-4 text-slate-400 shrink-0" />,
  processing: <Clock className="w-4 h-4 text-amber-400 shrink-0" />,
  done: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
  error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
};

/**
 * Renders one row per selected file.
 *
 * Size deltas are read from the real `compressedSize` / `reductionPercentage`
 * fields. When those are absent (i.e. no compression has actually happened) the
 * row shows the original size only — it never invents a saving.
 */
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
            {STATUS_ICON[file.status]}
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{file.name}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 font-mono text-slate-500 dark:text-slate-400">
            <span>{formatFileSize(file.originalSize)}</span>
            {typeof file.compressedSize === 'number' && (
              <>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="text-emerald-400 font-bold">
                  {formatFileSize(file.compressedSize)}
                  {typeof file.reductionPercentage === 'number' && ` (-${file.reductionPercentage}%)`}
                </span>
              </>
            )}
            {file.status === 'error' && file.errorMessage && (
              <span className="text-rose-400 font-medium max-w-[220px] truncate">{file.errorMessage}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
