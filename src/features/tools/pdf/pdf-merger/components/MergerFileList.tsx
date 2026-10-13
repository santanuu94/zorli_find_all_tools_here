import React, { useState } from 'react';
import {
  FileText,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Trash2,
  FileCheck,
} from 'lucide-react';
import { MergerFileItem } from '../types';
import { formatFileSize } from '../lib/format-utils';

interface MergerFileListProps {
  files: MergerFileItem[];
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  disabled?: boolean;
}

export const MergerFileList: React.FC<MergerFileListProps> = ({
  files,
  onMoveUp,
  onMoveDown,
  onReorder,
  onRemove,
  onClearAll,
  disabled = false,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (disabled) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${index}`);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (disabled || draggedIndex === null) return;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (disabled || draggedIndex === null) return;
    if (draggedIndex !== targetIndex) {
      onReorder(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-3">
      {/* List Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Files Sequence ({files.length})
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
            • Drag or use arrows to rearrange merge order
          </span>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          disabled={disabled}
          className="text-xs font-semibold text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Reorderable Items */}
      <div className="space-y-2">
        {files.map((item, index) => {
          const isDraggingThis = draggedIndex === index;
          const isDragTarget = dragOverIndex === index;

          return (
            <div
              key={item.id}
              draggable={!disabled}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 bg-white dark:bg-[#070B24] select-none ${
                isDraggingThis
                  ? 'opacity-40 border-indigo-500 scale-[0.98]'
                  : isDragTarget
                  ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-500/10'
                  : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Drag Handle & Order Badge */}
                <div
                  className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-500 cursor-grab active:cursor-grabbing"
                  title="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4 shrink-0" />
                  <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/5 font-mono text-xs font-bold flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                    {index + 1}
                  </span>
                </div>

                {/* PDF Icon */}
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-500/20">
                  <FileText className="w-4 h-4" />
                </div>

                {/* Filename & Info */}
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {formatFileSize(item.size)} • {item.pageCount}{' '}
                    {item.pageCount === 1 ? 'page' : 'pages'}
                  </p>
                </div>
              </div>

              {/* Right Reorder Controls & Remove Button */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Accessible Move Up Button */}
                <button
                  type="button"
                  disabled={disabled || index === 0}
                  onClick={() => onMoveUp(index)}
                  title="Move Up in sequence"
                  aria-label={`Move ${item.name} up`}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                {/* Accessible Move Down Button */}
                <button
                  type="button"
                  disabled={disabled || index === files.length - 1}
                  onClick={() => onMoveDown(index)}
                  title="Move Down in sequence"
                  aria-label={`Move ${item.name} down`}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                {/* Remove Item Button */}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onRemove(item.id)}
                  title="Remove file"
                  aria-label={`Remove ${item.name}`}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
