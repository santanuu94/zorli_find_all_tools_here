import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Download,
  RotateCcw,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { CompressionResult, PdfFileInfo } from '../types';
import { formatFileSize } from '../lib/format-utils';

interface CompressionResultsProps {
  fileInfo: PdfFileInfo;
  result: CompressionResult;
  onDownload: () => void;
  onReset: () => void;
  onCompressAnyway?: () => void;
  onDownloadOriginal?: () => void;
}

export const CompressionResults: React.FC<CompressionResultsProps> = ({
  fileInfo,
  result,
  onDownload,
  onReset,
  onCompressAnyway,
  onDownloadOriginal,
}) => {
  const isTargetAchieved = result.targetResultState === 'target_achieved';
  const isAlreadySmaller = result.targetResultState === 'already_smaller';
  const isAlreadyMinimal = result.targetResultState === 'already_minimal';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Status Indicator Header */}
      {isAlreadySmaller ? (
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-900 dark:text-blue-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold">This PDF is already smaller than your target.</h4>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
                Your file is {formatFileSize(fileInfo.originalSize)}, which is already under your goal of {formatFileSize(result.targetBytes)}. No further compression is required.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {onDownloadOriginal && (
                  <button
                    type="button"
                    onClick={onDownloadOriginal}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Original</span>
                  </button>
                )}
                {onCompressAnyway && (
                  <button
                    type="button"
                    onClick={onCompressAnyway}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-white/10 hover:bg-blue-50 dark:hover:bg-white/15 text-blue-800 dark:text-blue-200 text-xs font-semibold border border-blue-500/30 transition-all cursor-pointer"
                  >
                    Compress Anyway
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : isTargetAchieved ? (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold flex items-center gap-2">
                <span>Target achieved</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono">
                  {formatFileSize(result.compressedSize)} ≤ {formatFileSize(result.targetBytes)}
                </span>
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300/80 mt-0.5">
                Reduced by {result.reductionPercentage}% while preserving document structure.
              </p>
            </div>
          </div>
        </div>
      ) : isAlreadyMinimal ? (
        <div className="p-4 rounded-2xl bg-slate-500/10 border border-slate-500/20 text-slate-800 dark:text-slate-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold">This PDF is already heavily optimized.</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                The file streams and objects are already at peak compression. Further processing could not reduce the byte size without destructive quality loss.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-900 dark:text-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold">PDF compressed successfully</h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                {result.message || 'PDF compressed successfully, but the requested target could not be reached without excessive quality loss.'}
              </p>
              <div className="mt-2 text-[11px] text-amber-700 dark:text-amber-400">
                Target: {formatFileSize(result.targetBytes)} • Best achieved: {formatFileSize(result.compressedSize)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Before / After Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Original Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Original Document
          </span>
          <div className="text-2xl font-black font-display text-slate-800 dark:text-slate-200">
            {formatFileSize(fileInfo.originalSize)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>{fileInfo.pageCount} {fileInfo.pageCount === 1 ? 'page' : 'pages'}</span>
          </div>
        </div>

        {/* Compressed Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 via-purple-500/5 to-transparent border border-rose-500/25 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider block">
              Compressed PDF
            </span>
            {result.reductionPercentage > 0 && (
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                -{result.reductionPercentage}%
              </span>
            )}
          </div>
          <div className="text-2xl font-black font-display text-slate-900 dark:text-white">
            {formatFileSize(result.compressedSize)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>
              {result.savedBytes > 0
                ? `Saved ${formatFileSize(result.savedBytes)}`
                : 'Maintained optimal bytes'}
            </span>
          </div>
        </div>
      </div>

      {/* Warning note if aggressive compression occurred */}
      {result.warning && (
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{result.warning}</span>
        </div>
      )}

      {/* 3. Primary Actions: Download & Reset */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onDownload}
          className="flex-1 py-3.5 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 active:scale-[0.99] text-white font-bold text-sm transition-all shadow-lg shadow-rose-500/25 cursor-pointer flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Download Compressed PDF</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all border border-slate-200 dark:border-white/10 cursor-pointer flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Compress Another PDF</span>
        </button>
      </div>
    </div>
  );
};
