import React from 'react';
import {
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Maximize2,
  Info,
} from 'lucide-react';
import { ConvertedImageItem, SupportedFormat } from '../types';
import { formatFileSize } from '../utils/format-file-size';

interface ConverterCardProps {
  item: ConvertedImageItem;
  onRemove: (id: string) => void;
  onDownload: (item: ConvertedImageItem) => void;
  onPreview: (item: ConvertedImageItem) => void;
  onFormatChange?: (id: string, format: SupportedFormat) => void;
  disabled?: boolean;
}

export const ConverterCard: React.FC<ConverterCardProps> = ({
  item,
  onRemove,
  onDownload,
  onPreview,
  onFormatChange,
  disabled = false,
}) => {
  const isDone = item.status === 'done';
  const isError = item.status === 'error';
  const isConverting = item.status === 'converting';
  const isSameFormat = item.status === 'same-format';

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1438] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Thumbnail & Source Metadata */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative group w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shrink-0">
            {item.previewUrl ? (
              <img
                src={item.previewUrl}
                alt={item.originalName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <Maximize2 className="w-5 h-5" />
              </div>
            )}

            {item.previewUrl && (
              <button
                type="button"
                onClick={() => onPreview(item)}
                title="Preview image"
                aria-label={`Preview ${item.originalName}`}
                className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity cursor-pointer"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4
              className="text-sm font-bold text-slate-900 dark:text-white truncate"
              title={item.originalName}
            >
              {item.originalName}
            </h4>

            {isError ? (
              <div className="flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-400 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{item.errorMessage || 'Failed to process'}</span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span className="font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                  {item.originalFormat}
                </span>
                <span>•</span>
                {item.originalWidth > 0 && (
                  <>
                    <span className="font-mono">
                      {item.originalWidth} × {item.originalHeight} px
                    </span>
                    <span>•</span>
                  </>
                )}
                <span>{formatFileSize(item.originalSize)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Center: Conversion Flow & Status Indicator */}
        <div className="flex items-center gap-3 sm:justify-center">
          {!isError && (
            <div className="flex items-center gap-2 text-xs font-mono">
              <div className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
                <span className="text-[10px] text-slate-400 block uppercase font-sans">Source</span>
                <span className="font-bold uppercase">.{item.originalFormat}</span>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

              {isSameFormat ? (
                <div className="px-2.5 py-1 rounded-lg border bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300">
                  <span className="text-[10px] opacity-80 block uppercase font-sans">Status</span>
                  <span className="font-bold">Already .{item.originalFormat.toUpperCase()}</span>
                </div>
              ) : (
                <div
                  className={`px-2.5 py-1 rounded-lg border ${
                    isDone
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300 font-bold'
                      : 'bg-indigo-500/5 border-indigo-500/20 text-indigo-700 dark:text-indigo-300'
                  }`}
                >
                  <span className="text-[10px] opacity-70 block uppercase font-sans">
                    {isDone ? 'Converted' : 'Target'}
                  </span>
                  <span className="font-bold uppercase">
                    .{isDone ? item.outputFormat : item.targetFormat}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Size Delta Badge when Done */}
          {isDone && item.sizeDeltaPercent !== undefined && (
            <div className="hidden md:block">
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  item.sizeDeltaPercent < 0
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
                }`}
                title={`Original: ${formatFileSize(item.originalSize)} → Converted: ${formatFileSize(item.outputSize || 0)}`}
              >
                {item.sizeDeltaPercent < 0
                  ? `${Math.abs(item.sizeDeltaPercent)}% smaller`
                  : item.sizeDeltaPercent === 0
                  ? 'Same size'
                  : `+${item.sizeDeltaPercent}% size`}
              </span>
            </div>
          )}

          {/* Status Badge */}
          <div>
            {isConverting && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                Converting...
              </span>
            )}
            {isDone && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {item.outputSize ? formatFileSize(item.outputSize) : 'Done'}
              </span>
            )}
            {item.status === 'pending' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400">
                Ready
              </span>
            )}
            {isSameFormat && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Skipped (Already Format)
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          {item.previewUrl && (
            <button
              type="button"
              onClick={() => onPreview(item)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Preview image"
              aria-label={`Preview ${item.originalName}`}
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          {isDone && (
            <button
              type="button"
              onClick={() => onDownload(item)}
              className="py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer"
              title="Download converted image"
              aria-label={`Download converted ${item.originalName}`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          )}

          <button
            type="button"
            disabled={disabled}
            onClick={() => onRemove(item.id)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Remove from queue"
            aria-label={`Remove ${item.originalName}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
