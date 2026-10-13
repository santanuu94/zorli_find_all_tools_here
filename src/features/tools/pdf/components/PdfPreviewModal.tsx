import React, { useEffect } from 'react';
import { X, Download, ExternalLink, FileText } from 'lucide-react';

export interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfUrl: string;
  pageCount?: number;
  fileSize?: number;
  onDownload?: () => void;
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  pdfUrl,
  pageCount,
  fileSize,
  onDownload,
}) => {
  // Handle ESC key to dismiss
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !pdfUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`PDF Preview: ${title}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl bg-white dark:bg-[#070B24] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-all"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0 truncate">
              <h3 className="text-sm sm:text-base font-bold font-display text-slate-900 dark:text-white truncate">
                {title || 'Document Preview'}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {pageCount !== undefined && (
                  <span>
                    {pageCount} {pageCount === 1 ? 'page' : 'pages'}
                  </span>
                )}
                {pageCount !== undefined && fileSize !== undefined && <span>•</span>}
                {fileSize !== undefined && (
                  <span className="font-mono">{formatBytes(fileSize)}</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Open in new window"
              aria-label="Open PDF in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Tab</span>
            </a>

            {onDownload && (
              <button
                type="button"
                onClick={onDownload}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
                title="Download this document"
                aria-label="Download PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
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

        {/* Modal Body / Embedded PDF View */}
        <div className="relative flex-1 bg-slate-900/90 min-h-[50vh] sm:min-h-[68vh] p-2 sm:p-4 flex flex-col">
          <iframe
            src={pdfUrl}
            title={title || 'PDF Preview'}
            className="w-full flex-1 rounded-xl border border-slate-700/50 bg-white"
          />

          <div className="pt-2 px-2 text-center">
            <span className="text-[11px] text-slate-400">
              Can't view the document?{' '}
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline font-medium"
              >
                Open directly in a new tab
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
