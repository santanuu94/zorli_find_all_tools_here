import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Download,
  Trash2,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { CompressedFileItem } from '../types';
import { formatFileSize } from '../utils/format-file-size';

interface CompressionResultProps {
  files: CompressedFileItem[];
  onRemove: (id: string) => void;
  onDownload: (id: string) => void;
  onPreview: (item: CompressedFileItem) => void;
}

export const CompressionResult: React.FC<CompressionResultProps> = ({
  files,
  onRemove,
  onDownload,
  onPreview,
}) => {
  if (files.length === 0) return null;

  return (
    <div className="space-y-3">
      {files.map((file) => {
        const isDone = file.status === 'done';
        const isProcessing = file.status === 'processing';
        const isError = file.status === 'error';

        return (
          <div
            key={file.id}
            className={`p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-white/[0.03] border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-sm ${
              isError
                ? 'border-rose-200 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/10'
                : 'border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
            }`}
          >
            {/* Left: Thumbnail & Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Thumbnail */}
              <div
                onClick={() => isDone && onPreview(file)}
                className={`w-12 h-12 rounded-xl shrink-0 overflow-hidden bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 relative flex items-center justify-center ${
                  isDone ? 'cursor-pointer group' : ''
                }`}
              >
                {file.compressedPreviewUrl || file.previewUrl ? (
                  <>
                    <img
                      src={file.compressedPreviewUrl || file.previewUrl}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    {isDone && (
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Eye className="w-4 h-4" />
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-[10px] font-mono text-slate-400">IMG</span>
                )}
              </div>

              {/* Filename & Status Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4
                    className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate"
                    title={file.name}
                  >
                    {file.name}
                  </h4>
                  {file.alreadyOptimized && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                      Already optimized
                    </span>
                  )}
                </div>

                {/* Sizing & Delta */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                  <span>{formatFileSize(file.originalSize)}</span>

                  {isDone && typeof file.compressedSize === 'number' && (
                    <>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-700 dark:text-slate-200 font-bold">
                        {formatFileSize(file.compressedSize)}
                      </span>

                      {typeof file.reductionPercentage === 'number' && file.reductionPercentage > 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          -{file.reductionPercentage}%
                        </span>
                      ) : (
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                          (No reduction)
                        </span>
                      )}
                    </>
                  )}

                  {isProcessing && (
                    <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-sans text-[11px] font-medium animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Compressing...
                    </span>
                  )}

                  {file.status === 'pending' && (
                    <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 font-sans text-[11px] font-medium">
                      <Clock className="w-3 h-3" />
                      Ready to compress
                    </span>
                  )}

                  {isError && (
                    <span className="text-rose-500 font-sans text-[11px] flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {file.errorMessage || 'Failed to compress.'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              {/* Preview Button */}
              {isDone && (
                <button
                  type="button"
                  onClick={() => onPreview(file)}
                  title="Preview before/after"
                  aria-label={`Preview ${file.name}`}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}

              {/* Individual Download Button */}
              {isDone && file.compressedBlob && (
                <button
                  type="button"
                  onClick={() => onDownload(file.id)}
                  title="Download compressed image"
                  aria-label={`Download compressed ${file.name}`}
                  className="px-3 py-1.5 rounded-xl bg-[#6657FF] hover:bg-[#5848EE] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-[#6657FF]/25 cursor-pointer transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              )}

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => onRemove(file.id)}
                title="Remove file"
                aria-label={`Remove ${file.name}`}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
