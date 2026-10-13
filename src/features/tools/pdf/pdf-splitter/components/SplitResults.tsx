import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  RotateCcw,
  FileText,
  Archive,
  Eye,
  FileCheck,
  Layers,
} from 'lucide-react';
import { SplitOutputItem } from '../types';
import { formatFileSize } from '../lib/format-utils';
import { PdfPreviewModal } from '../../components/PdfPreviewModal';

interface SplitResultsProps {
  outputs: SplitOutputItem[];
  originalName: string;
  onDownloadSingle: (output: SplitOutputItem) => void;
  onDownloadAllZip: () => void;
  onReset: () => void;
  isZipping?: boolean;
}

export const SplitResults: React.FC<SplitResultsProps> = ({
  outputs,
  originalName,
  onDownloadSingle,
  onDownloadAllZip,
  onReset,
  isZipping = false,
}) => {
  const [previewItem, setPreviewItem] = useState<SplitOutputItem | null>(null);

  const totalFiles = outputs.length;
  const totalPages = outputs.reduce((sum, o) => sum + o.pageCount, 0);
  const totalSize = outputs.reduce((sum, o) => sum + o.sizeBytes, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Success Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold flex items-center gap-2">
              <span>PDF split successfully!</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono font-semibold">
                {totalFiles} {totalFiles === 1 ? 'file' : 'files'} generated
              </span>
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300/80 mt-0.5">
              All requested page segments have been compiled into genuine standalone documents.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Generated Files
          </span>
          <div className="text-xl font-black font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <span>{totalFiles}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Pages Split
          </span>
          <div className="text-xl font-black font-display text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <span>{totalPages}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Combined Output
          </span>
          <div className="text-xl font-black font-display text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-500" />
            <span>{formatFileSize(totalSize)}</span>
          </div>
        </div>
      </div>

      {/* 3. Primary Top Actions: Download All as ZIP & Reset */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onDownloadAllZip}
          disabled={isZipping}
          className="flex-1 py-3.5 px-6 rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:scale-[0.99] text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/25 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Archive className="w-4 h-4" />
          <span>{isZipping ? 'Generating ZIP...' : `Download All as ZIP (${totalFiles} files)`}</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all border border-slate-200 dark:border-white/10 cursor-pointer flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Split Another PDF</span>
        </button>
      </div>

      {/* 4. Individual Output Files List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Generated Documents
        </h4>

        <div className="space-y-2.5">
          {outputs.map((out) => (
            <div
              key={out.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:border-slate-300 dark:hover:border-white/20"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-500/20">
                  {out.sequence}
                </span>

                <div className="min-w-0 truncate">
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {out.filename}
                  </h5>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>{out.pageDisplay}</span>
                    <span>•</span>
                    <span className="font-mono">{formatFileSize(out.sizeBytes)}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons per file */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setPreviewItem(out)}
                  className="px-3 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-indigo-500/20"
                  title={`Preview ${out.filename}`}
                  aria-label={`Preview ${out.filename}`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>See Output</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDownloadSingle(out)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                  title={`Download ${out.filename}`}
                  aria-label={`Download ${out.filename}`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. PDF Preview Modal */}
      {previewItem && (
        <PdfPreviewModal
          isOpen={Boolean(previewItem)}
          onClose={() => setPreviewItem(null)}
          title={previewItem.filename}
          pdfUrl={previewItem.downloadUrl}
          pageCount={previewItem.pageCount}
          fileSize={previewItem.sizeBytes}
          onDownload={() => onDownloadSingle(previewItem)}
        />
      )}
    </div>
  );
};
