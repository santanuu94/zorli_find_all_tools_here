import React from 'react';
import {
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  FileSpreadsheet,
  Lock,
} from 'lucide-react';
import { ImageMetadataItem } from '../types';
import { formatFileSize } from '../utils/format-file-size';

interface CleaningVerificationViewProps {
  item: ImageMetadataItem;
  onDownload: (item: ImageMetadataItem) => void;
  onCleanAgain?: () => void;
}

export const CleaningVerificationView: React.FC<CleaningVerificationViewProps> = ({
  item,
  onDownload,
}) => {
  const verification = item.verificationResult;
  if (!verification || !item.cleanedBlob) return null;

  const isVerifiedClean = verification.verifiedClean;
  const beforeCount = verification.beforeCount;
  const afterCount = verification.afterCount;

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0D1438] border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-xl animate-in fade-in duration-300 space-y-6 p-5 sm:p-7">
      {/* Verification Status Banner */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isVerifiedClean
            ? 'bg-emerald-500/10 border-emerald-500/20 text-slate-800 dark:text-slate-100'
            : 'bg-amber-500/10 border-amber-500/20 text-slate-800 dark:text-slate-100'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              isVerifiedClean
                ? 'bg-emerald-500/20 text-emerald-500'
                : 'bg-amber-500/20 text-amber-500'
            }`}
          >
            {isVerifiedClean ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-1">
            <h4
              className={`text-base font-bold ${
                isVerifiedClean
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-amber-700 dark:text-amber-400'
              }`}
            >
              {isVerifiedClean
                ? 'Clean copy created & verified'
                : 'Clean copy created with partial metadata remaining'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isVerifiedClean
                ? `Zorli re-scanned the generated output and verified that 0 supported metadata fields remain.`
                : `Zorli removed ${verification.removedCount} metadata fields. ${verification.afterCount} fields could not be removed safely.`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDownload(item)}
          className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Clean Copy</span>
        </button>
      </div>

      {/* Before / After Verification Metrics (Requirement #13 & #14) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original File Summary */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-white/5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Original Image
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-slate-200/80 dark:bg-white/10 text-slate-600 dark:text-slate-300">
              {item.format}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Filename:</span>
              <span className="font-mono font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]" title={item.originalName}>
                {item.originalName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">File Size:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {formatFileSize(item.originalSize)}
              </span>
            </div>
            {item.originalWidth && item.originalHeight && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Dimensions:</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {item.originalWidth} × {item.originalHeight} px
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-1 border-t border-slate-200/80 dark:border-white/5">
              <span className="text-slate-500 dark:text-slate-400">Metadata Detected:</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                {beforeCount} fields
              </span>
            </div>
          </div>
        </div>

        {/* Cleaned File Summary */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-white/5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Clean Copy</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              Sanitized
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Cleaned Filename:</span>
              <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400 truncate max-w-[200px]" title={item.cleanedName}>
                {item.cleanedName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Cleaned Size:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {item.cleanedSize ? formatFileSize(item.cleanedSize) : '—'}
              </span>
            </div>
            {item.originalWidth && item.originalHeight && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Dimensions:</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {item.originalWidth} × {item.originalHeight} px (Unchanged)
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-1 border-t border-slate-200/80 dark:border-white/5">
              <span className="text-slate-500 dark:text-slate-400">Metadata Remaining:</span>
              <span className={`font-mono font-bold ${afterCount === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                {afterCount} fields ({afterCount === 0 ? 'Verified Zero' : `${afterCount} retained`})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Remaining Fields Note if any */}
      {verification.remainingFields.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 space-y-1">
          <span className="font-bold block">Remaining metadata tags in clean copy:</span>
          <ul className="list-disc list-inside space-y-0.5 font-mono text-[11px]">
            {verification.remainingFields.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Method & Privacy Guarantee Note */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/80 dark:border-white/5 gap-2">
        <span className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-500" />
          <span>Cleaning method: {verification.cleaningMethod === 'lossless-binary' ? 'Lossless Binary Stripping (0% Recompression)' : 'Canvas Re-encoding'}</span>
        </span>
        <span>Original file untouched on your device.</span>
      </div>
    </div>
  );
};
