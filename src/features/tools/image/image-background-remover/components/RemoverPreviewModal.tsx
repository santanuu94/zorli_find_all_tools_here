import React, { useEffect } from 'react';
import { X, Download, Eye, Sparkles } from 'lucide-react';
import { RemovalItem } from '../types';

interface RemoverPreviewModalProps {
  item: RemovalItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export const RemoverPreviewModal: React.FC<RemoverPreviewModalProps> = ({
  item,
  isOpen,
  onClose,
  onDownload,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item || !item.resultUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Preview: ${item.file.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-[#070B24] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 shrink-0">
          <div className="min-w-0 pr-4">
            <h3 className="text-sm sm:text-base font-bold font-display text-slate-900 dark:text-white truncate">
              {item.file.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
              <span className="font-mono text-emerald-500 font-semibold">Background Removed</span>
              <span>•</span>
              <span>{item.resultWidth || item.originalWidth} × {item.resultHeight || item.originalHeight} px</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onDownload}
              className="px-3 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Canvas */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-slate-900/60 min-h-[300px]">
          <div
            className="relative max-w-full max-h-[65vh] rounded-2xl overflow-hidden border border-white/10 shadow-xl flex items-center justify-center"
            style={{
              backgroundImage:
                'linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              backgroundColor: '#0f172a',
            }}
          >
            <img
              src={item.resultUrl}
              alt={`Output: ${item.file.name}`}
              className="max-w-full max-h-[65vh] object-contain block"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
