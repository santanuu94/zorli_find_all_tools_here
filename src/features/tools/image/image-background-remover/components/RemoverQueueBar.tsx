import React from 'react';
import { RemovalItem } from '../types';
import { X, Play, Download, Check, AlertCircle, Loader2 } from 'lucide-react';

interface RemoverQueueBarProps {
  items: RemovalItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onProcessAll: () => void;
  onDownloadAllZip: () => void;
  isProcessingQueue: boolean;
  isZipping: boolean;
}

export const RemoverQueueBar: React.FC<RemoverQueueBarProps> = ({
  items,
  activeId,
  onSelect,
  onRemove,
  onProcessAll,
  onDownloadAllZip,
  isProcessingQueue,
  isZipping,
}) => {
  if (items.length <= 1) return null;

  const doneCount = items.filter((i) => i.status === 'done').length;
  const pendingCount = items.filter(
    (i) => i.status === 'idle' || i.status === 'error'
  ).length;

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-white">Batch Queue</span>
          <span className="text-xs text-slate-400">
            ({doneCount}/{items.length} completed)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <button
              type="button"
              onClick={onProcessAll}
              disabled={isProcessingQueue}
              className="py-1.5 px-3 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 flex items-center gap-1.5 transition-all shadow-sm"
            >
              {isProcessingQueue ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              Process All ({pendingCount})
            </button>
          )}

          {doneCount > 0 && (
            <button
              type="button"
              onClick={onDownloadAllZip}
              disabled={isZipping}
              className="py-1.5 px-3 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 disabled:opacity-50 flex items-center gap-1.5 transition-all"
            >
              {isZipping ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              Download All as ZIP
            </button>
          )}
        </div>
      </div>

      {/* Horizontal thumbnail scroll */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <div
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`group relative flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer shrink-0 max-w-[200px] ${
                isActive
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
              }`}
            >
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                <img
                  src={item.resultUrl || item.originalUrl}
                  alt={item.file.name}
                  className="w-full h-full object-cover"
                />
                {item.status === 'processing' && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                  </div>
                )}
                {item.status === 'done' && (
                  <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
                {item.status === 'error' && (
                  <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-rose-500 flex items-center justify-center">
                    <AlertCircle className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-200 truncate">
                  {item.file.name}
                </p>
                <p className="text-[10px] text-slate-400 capitalize">
                  {item.status === 'done'
                    ? 'Complete'
                    : item.status === 'processing'
                    ? 'Removing bg...'
                    : item.status === 'error'
                    ? 'Failed'
                    : 'Waiting'}
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-rose-400 transition-opacity"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
