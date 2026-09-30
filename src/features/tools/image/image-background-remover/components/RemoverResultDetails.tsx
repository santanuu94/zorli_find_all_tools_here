import React from 'react';
import { Download, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { RemovalItem } from '../types';

interface RemoverResultDetailsProps {
  item: RemovalItem;
  onDownload: () => void;
  onReset: () => void;
  onRetry: () => void;
  disabled?: boolean;
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export const RemoverResultDetails: React.FC<RemoverResultDetailsProps> = ({
  item,
  onDownload,
  onReset,
  onRetry,
  disabled = false,
}) => {
  const isDone = item.status === 'done';
  const isError = item.status === 'error';

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
      {/* Metrics Row */}
      {isDone && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 border-b border-slate-800/80">
          <div className="space-y-0.5">
            <span className="text-[11px] font-medium text-slate-400">Dimensions</span>
            <p className="text-sm font-semibold text-white font-mono">
              {item.resultWidth || item.originalWidth} × {item.resultHeight || item.originalHeight}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-medium text-slate-400">Output Format</span>
            <p className="text-sm font-semibold text-white">PNG</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-medium text-slate-400">File Size</span>
            <p className="text-sm font-semibold text-white font-mono">
              {formatBytes(item.resultSize)}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-medium text-slate-400">Transparency</span>
            <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              {item.backgroundMode === 'transparent' ? 'True Alpha' : 'Flattened'}
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-white">Background Removal Failed</p>
            <p className="text-xs text-rose-200">
              {item.errorMessage || 'An error occurred while analyzing the image.'}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {isDone && (
          <button
            type="button"
            onClick={onDownload}
            disabled={disabled}
            className="w-full sm:flex-1 py-3 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-500 via-indigo-600 to-electric-blue text-white shadow-[0_0_25px_rgba(99,102,241,0.35)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PNG
          </button>
        )}

        {isError && (
          <button
            type="button"
            onClick={onRetry}
            disabled={disabled}
            className="w-full sm:flex-1 py-3 px-6 rounded-xl font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto py-3 px-5 rounded-xl font-medium text-sm border border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4 text-slate-400" />
          New Image
        </button>
      </div>
    </div>
  );
};
