import React from 'react';
import { CheckCircle2, Trash2, FolderArchive, Loader2, Plus, Eye } from 'lucide-react';
import { CroppedImageItem } from '../types';

interface CropQueueBarProps {
  files: CroppedImageItem[];
  activeFileId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onDownloadAllZip: () => void;
  isZipping: boolean;
  onAddMoreClick: () => void;
  onPreview?: (item: CroppedImageItem) => void;
  disabled?: boolean;
}

export const CropQueueBar: React.FC<CropQueueBarProps> = ({
  files,
  activeFileId,
  onSelect,
  onRemove,
  onClearAll,
  onDownloadAllZip,
  isZipping,
  onAddMoreClick,
  onPreview,
  disabled = false,
}) => {
  if (files.length <= 1) return null;

  const completedCount = files.filter((f) => f.status === 'done' && f.outputBlob).length;

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1438] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Queue ({files.length} images)
        </span>

        <div className="flex items-center gap-3">
          {completedCount > 1 && (
            <button
              type="button"
              disabled={isZipping || disabled}
              onClick={onDownloadAllZip}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              {isZipping ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Zipping...</span>
                </>
              ) : (
                <>
                  <FolderArchive className="w-3.5 h-3.5" />
                  <span>Download All ({completedCount})</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            disabled={disabled}
            onClick={onClearAll}
            className="text-xs text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Thumbnails row */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-0.5">
        {files.map((file) => {
          const isActive = file.id === activeFileId;
          const isDone = file.status === 'done';

          return (
            <div
              key={file.id}
              onClick={() => onSelect(file.id)}
              className={`group relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 cursor-pointer transition-all ${
                isActive
                  ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md scale-105'
                  : 'border-slate-200 dark:border-white/10 hover:border-amber-500/50 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={file.previewUrl}
                alt={file.originalName}
                className="w-full h-full object-cover"
              />

              {isDone && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                  <CheckCircle2 className="w-3 h-3" />
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

              {isDone && onPreview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(file);
                  }}
                  className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-black/70 hover:bg-amber-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="See output preview and download"
                >
                  <Eye className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        <button
          type="button"
          onClick={onAddMoreClick}
          disabled={disabled}
          className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-amber-500 hover:text-amber-500 text-slate-400 flex flex-col items-center justify-center shrink-0 transition-colors cursor-pointer"
          title="Add more images"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Add</span>
        </button>
      </div>
    </div>
  );
};
