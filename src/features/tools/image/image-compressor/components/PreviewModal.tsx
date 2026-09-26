import React, { useEffect, useState } from 'react';
import { X, ArrowRight, Download, CheckCircle2, Sliders } from 'lucide-react';
import { CompressedFileItem } from '../types';
import { formatFileSize } from '../utils/format-file-size';

interface PreviewModalProps {
  item: CompressedFileItem;
  onClose: () => void;
  onDownload: (id: string) => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ item, onClose, onDownload }) => {
  const [viewMode, setViewMode] = useState<'compressed' | 'original' | 'split'>('compressed');

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const activeSrc =
    viewMode === 'original'
      ? item.previewUrl
      : item.compressedPreviewUrl || item.previewUrl;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image preview comparison"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-white dark:bg-[#0D1438] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-4">
          <div className="truncate">
            <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white truncate">
              {item.name}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>Original: <strong className="text-slate-700 dark:text-slate-200 font-mono">{formatFileSize(item.originalSize)}</strong></span>
              {typeof item.compressedSize === 'number' && (
                <>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span>Compressed: <strong className="text-emerald-500 font-mono">{formatFileSize(item.compressedSize)}</strong></span>
                  {typeof item.reductionPercentage === 'number' && item.reductionPercentage > 0 && (
                    <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      -{item.reductionPercentage}%
                    </span>
                  )}
                  {item.alreadyOptimized && (
                    <span className="text-amber-500 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full">
                      Already optimized
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {item.compressedBlob && (
              <button
                type="button"
                onClick={() => onDownload(item.id)}
                className="px-4 py-2 rounded-xl bg-[#6657FF] hover:bg-[#5848EE] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#6657FF]/25 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview modal"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Toggle Tabs */}
        {item.compressedPreviewUrl && (
          <div className="px-6 py-2.5 bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200/80 dark:border-white/5 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              {item.width && item.height ? `${item.width} × ${item.height} px` : ''}
            </span>
            <div className="flex items-center gap-1 p-0.5 bg-slate-200/80 dark:bg-white/10 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode('compressed')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  viewMode === 'compressed'
                    ? 'bg-white dark:bg-[#6657FF] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Compressed Output
              </button>
              <button
                type="button"
                onClick={() => setViewMode('original')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  viewMode === 'original'
                    ? 'bg-white dark:bg-[#6657FF] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Original Image
              </button>
            </div>
          </div>
        )}

        {/* Image Preview Canvas */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-slate-100/70 dark:bg-[#070B24]/80 min-h-[300px]">
          {activeSrc ? (
            <img
              src={activeSrc}
              alt={item.name}
              className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-lg border border-slate-200/50 dark:border-white/10"
            />
          ) : (
            <div className="text-slate-400 text-sm">No preview available</div>
          )}
        </div>
      </div>
    </div>
  );
};
