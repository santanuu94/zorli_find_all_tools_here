import React, { useEffect, useState } from 'react';
import { X, Download, ArrowRight, CheckCircle2, RotateCcw, Eye, Maximize2 } from 'lucide-react';
import { CroppedImageItem } from '../types';
import { formatFileSize } from '../utils/format-file-size';

interface CropperPreviewModalProps {
  item: CroppedImageItem | null;
  onClose: () => void;
  onDownload: (item: CroppedImageItem) => void;
  onRecrop?: () => void;
}

export const CropperPreviewModal: React.FC<CropperPreviewModalProps> = ({
  item,
  onClose,
  onDownload,
  onRecrop,
}) => {
  const [activeTab, setActiveTab] = useState<'cropped' | 'original'>('cropped');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const hasCropped = Boolean(item.outputUrl);
  const currentView = hasCropped && activeTab === 'cropped' ? 'cropped' : 'original';
  const currentUrl = currentView === 'cropped' ? item.outputUrl : item.previewUrl;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cropper-preview-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-[#0D1438] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/10 shrink-0">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2">
              <h3
                id="cropper-preview-modal-title"
                className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white truncate"
              >
                {item.originalName}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-[10px] uppercase border border-amber-500/20 shrink-0">
                Preview
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span>{item.originalWidth} × {item.originalHeight} px</span>
              {hasCropped && (
                <>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {item.outputWidth} × {item.outputHeight} px
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {hasCropped && (
              <button
                type="button"
                onClick={() => onDownload(item)}
                className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Cropped</span>
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

        {/* View Switcher Tabs */}
        {hasCropped && (
          <div className="px-5 py-2.5 bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/60 dark:bg-white/5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('cropped')}
                className={`py-1 px-3 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'cropped'
                    ? 'bg-white dark:bg-[#070B24] text-amber-600 dark:text-amber-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-amber-500" />
                <span>Cropped Output ({item.outputWidth} × {item.outputHeight})</span>
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

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span className="uppercase">{item.originalFormat}</span>
              {activeTab === 'cropped' && item.outputSize && (
                <span>{formatFileSize(item.outputSize)}</span>
              )}
            </div>
          </div>
        )}

        {/* Image Preview Canvas */}
        <div className="flex-1 p-4 sm:p-8 overflow-auto flex items-center justify-center bg-slate-950/50 min-h-[300px]">
          {currentUrl ? (
            <img
              src={currentUrl}
              alt={item.originalName}
              className="max-h-[58vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
            />
          ) : (
            <div className="text-slate-400 text-sm">No preview available</div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {hasCropped
              ? 'Inspect your cropped image. If you like the result, click Download or adjust your crop area.'
              : 'Original image preview.'}
          </div>

          <div className="flex items-center gap-2.5">
            {onRecrop && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRecrop();
                }}
                className="py-2 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Adjust Crop</span>
              </button>
            )}

            {hasCropped && (
              <button
                type="button"
                onClick={() => onDownload(item)}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Like it? Download Image</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
