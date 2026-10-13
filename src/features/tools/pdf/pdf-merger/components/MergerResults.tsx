import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  RotateCcw,
  FileText,
  Layers,
  Sparkles,
  FileCheck,
  Eye,
} from 'lucide-react';
import { MergerResult } from '../types';
import { formatFileSize, sanitizePdfFilename } from '../lib/format-utils';
import { PdfPreviewModal } from '../../components/PdfPreviewModal';

interface MergerResultsProps {
  result: MergerResult;
  filename: string;
  onFilenameChange: (name: string) => void;
  onDownload: () => void;
  onReset: () => void;
}

export const MergerResults: React.FC<MergerResultsProps> = ({
  result,
  filename,
  onFilenameChange,
  onDownload,
  onReset,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Status Indicator Header */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold flex items-center gap-2">
              <span>PDFs merged successfully!</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono">
                {result.filesCount} files combined
              </span>
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300/80 mt-0.5">
              All pages stitched in your specified sequence.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Metrics Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Files Merged
          </span>
          <div className="text-xl font-black font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <span>{result.filesCount}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Pages
          </span>
          <div className="text-xl font-black font-display text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <span>{result.pageCount}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Output Size
          </span>
          <div className="text-xl font-black font-display text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-500" />
            <span>{formatFileSize(result.mergedSize)}</span>
          </div>
        </div>
      </div>

      {/* 3. Output Filename Configuration */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
        <label
          htmlFor="merged-filename-input"
          className="text-xs font-bold text-slate-700 dark:text-slate-300 block"
        >
          Output Filename
        </label>
        <div className="flex items-center gap-2">
          <input
            id="merged-filename-input"
            type="text"
            value={filename}
            onChange={(e) => onFilenameChange(e.target.value)}
            onBlur={() => onFilenameChange(sanitizePdfFilename(filename))}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-[#070B24] border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="merged-document.pdf"
          />
        </div>
        <span className="text-[11px] text-slate-400 block">
          Default name is merged-document.pdf. Saved file will automatically have .pdf extension.
        </span>
      </div>

      {/* 4. Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="py-3.5 px-6 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-bold text-sm transition-all border border-indigo-500/25 cursor-pointer flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          <span>See Output PDF</span>
        </button>

        <button
          type="button"
          onClick={onDownload}
          className="flex-1 py-3.5 px-6 rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:scale-[0.99] text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/25 cursor-pointer flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Download Merged PDF</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all border border-slate-200 dark:border-white/10 cursor-pointer flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Merge More PDFs</span>
        </button>
      </div>

      {/* 5. PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={filename}
        pdfUrl={result.downloadUrl}
        pageCount={result.pageCount}
        fileSize={result.mergedSize}
        onDownload={onDownload}
      />
    </div>
  );
};
