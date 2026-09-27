import React, { useEffect, useState } from 'react';
import { X, Download, Maximize2, FileText, ArrowRight } from 'lucide-react';
import { ResizedImageItem } from '../types';
import { formatFileSize } from '../utils/format-file-size';

interface ResizerPreviewModalProps {
  item: ResizedImageItem | null;
  onClose: () => void;
  onDownload: (item: ResizedImageItem) => void;
}

export const ResizerPreviewModal: React.FC<ResizerPreviewModalProps> = ({
  item,
  onClose,
  onDownload,
}) => {
  const [activeTab, setActiveTab] = useState<'resized' | 'original'>('resized');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const hasResized = item.status === 'done' && item.outputUrl;
  const currentView = hasResized && activeTab === 'resized' ? 'resized' : 'original';
  const currentUrl = currentView === 'resized' ? item.outputUrl : item.previewUrl;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
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
              id="preview-modal-title"
              className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white truncate"
            >
              {item.originalName}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span>{item.originalWidth} × {item.originalHeight} px</span>
              {hasResized && (
                <>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {item.outputWidth} × {item.outputHeight} px
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {hasResized && (
              <button
                type="button"
                onClick={() => onDownload(item)}
                className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
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

        {/* View Switcher Tabs (if resized) */}
        {hasResized && (
          <div className="px-5 py-2.5 bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/60 dark:bg-white/5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('resized')}
                className={`py-1 px-3 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'resized'
                    ? 'bg-white dark:bg-[#070B24] text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Resized ({item.outputWidth} × {item.outputHeight})
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
                Original ({item.originalWidth} × {item.originalHeight})
              </button>
            </div>

            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {activeTab === 'resized' && item.outputSize
                ? formatFileSize(item.outputSize)
                : formatFileSize(item.originalSize)}
            </span>
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
