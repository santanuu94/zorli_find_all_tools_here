import React from 'react';
import {
  CheckCircle2,
  Trash2,
  FolderArchive,
  Loader2,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { ImageMetadataItem } from '../types';

interface MetadataQueueBarProps {
  files: ImageMetadataItem[];
  activeFileId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onCleanAll: () => void;
  onDownloadAllZip: () => void;
  isProcessing: boolean;
  isZipping: boolean;
  onAddMoreClick: () => void;
}

export const MetadataQueueBar: React.FC<MetadataQueueBarProps> = ({
  files,
  activeFileId,
  onSelect,
  onRemove,
  onClearAll,
  onCleanAll,
  onDownloadAllZip,
  isProcessing,
  isZipping,
  onAddMoreClick,
}) => {
  if (files.length <= 1) return null;

  const cleanedCount = files.filter((f) => f.status === 'cleaned').length;
  const pendingCount = files.filter((f) => f.status === 'parsed').length;

  return (
    <div className="p-4 rounded-3xl bg-white dark:bg-[#0D1438] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Queue ({files.length} images • {cleanedCount} sanitized)
        </span>

        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={onCleanAll}
              className="py-1 px-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Clean All Pending ({pendingCount})</span>
            </button>
          )}

          {cleanedCount > 1 && (
            <button
              type="button"
              disabled={isZipping || isProcessing}
              onClick={onDownloadAllZip}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              {isZipping ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Zipping...</span>
                </>
              ) : (
                <>
                  <FolderArchive className="w-3.5 h-3.5" />
                  <span>Download Cleaned ZIP ({cleanedCount})</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            disabled={isProcessing}
            onClick={onClearAll}
            className="text-xs text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Thumbnails Row */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-0.5">
        {files.map((file) => {
          const isActive = file.id === activeFileId;
          const isCleaned = file.status === 'cleaned';
          const isScanning = file.status === 'scanning';
          const hasSensitive = (file.metadataReport?.sensitiveFieldCount || 0) > 0;

          return (
            <div
              key={file.id}
              onClick={() => onSelect(file.id)}
              className={`group relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 cursor-pointer transition-all ${
                isActive
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md scale-105'
                  : 'border-slate-200 dark:border-white/10 hover:border-indigo-500/50 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={file.previewUrl}
                alt={file.originalName}
                className="w-full h-full object-cover"
              />

              {/* Status Icons */}
              {isCleaned && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                  <ShieldCheck className="w-3 h-3" />
                </div>
              )}
              {isScanning && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
              )}
              {!isCleaned && !isScanning && hasSensitive && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shadow">
                  <AlertTriangle className="w-2.5 h-2.5" />
                </div>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(file.id);
                }}
                className="absolute top-1 left-1 w-4 h-4 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove photo"
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={onAddMoreClick}
          disabled={isProcessing}
          className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-indigo-500 hover:text-indigo-500 text-slate-400 flex flex-col items-center justify-center shrink-0 transition-colors cursor-pointer"
          title="Add more photos"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Add</span>
        </button>
      </div>
    </div>
  );
};
