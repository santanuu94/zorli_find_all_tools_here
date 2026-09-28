import React, { useEffect, useState } from 'react';
import { X, Download, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ConvertedImageItem } from '../types';
import { formatFileSize } from '../utils/format-file-size';

interface ConverterPreviewModalProps {
  item: ConvertedImageItem | null;
  onClose: () => void;
  onDownload: (item: ConvertedImageItem) => void;
}

export const ConverterPreviewModal: React.FC<ConverterPreviewModalProps> = ({
  item,
  onClose,
  onDownload,
}) => {
  const [activeTab, setActiveTab] = useState<'converted' | 'original'>('converted');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const hasConverted = item.status === 'done' && Boolean(item.outputUrl);
  const currentView = hasConverted && activeTab === 'converted' ? 'converted' : 'original';
  const currentUrl = currentView === 'converted' ? item.outputUrl : item.previewUrl;

  const sizeDelta =
    item.outputSize && item.originalSize
      ? Math.round(((item.outputSize - item.originalSize) / item.originalSize) * 100)
      : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="converter-preview-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-[#0D1438] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/10 shrink-0">
          <div className="min-w-0 pr-4">
            <h3
              id="converter-preview-modal-title"
              className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white truncate"
            >
              {item.originalName}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                {item.originalFormat}
              </span>
              <span>{item.originalWidth} × {item.originalHeight} px</span>
              {hasConverted && (
                <>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="uppercase font-semibold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    {item.targetFormat}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {hasConverted && (
              <button
                type="button"
                onClick={() => onDownload(item)}
                className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-500/20 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download {item.targetFormat.toUpperCase()}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher Tabs (if converted) */}
        {hasConverted && (
          <div className="px-5 py-2.5 bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/60 dark:bg-white/5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('converted')}
                className={`py-1 px-3 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'converted'
                    ? 'bg-white dark:bg-[#070B24] text-rose-600 dark:text-rose-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-rose-500" />
                Converted ({item.targetFormat.toUpperCase()})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('original')}
                className={`py-1 px-3 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'original'
                    ? 'bg-white dark:bg-[#070B24] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Original ({item.originalFormat.toUpperCase()})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {activeTab === 'converted' && item.outputSize
                  ? formatFileSize(item.outputSize)
                  : formatFileSize(item.originalSize)}
              </span>
              {activeTab === 'converted' && sizeDelta !== null && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    sizeDelta < 0
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-200/60 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {sizeDelta < 0 ? `${sizeDelta}%` : `+${sizeDelta}%`}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Image Preview Canvas */}
        <div className="flex-1 p-4 sm:p-6 overflow-auto flex items-center justify-center bg-slate-950/40 min-h-[300px]">
          {currentUrl ? (
            <img
              src={currentUrl}
              alt={item.originalName}
              className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-lg border border-white/10"
            />
          ) : (
            <div className="text-slate-400 text-sm">No preview available</div>
          )}
        </div>
      </div>
    </div>
  );
};
