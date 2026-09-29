import React, { useState, useRef } from 'react';
import { Upload, Shield, Eye, Lock } from 'lucide-react';

interface MetadataUploadAreaProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export const MetadataUploadArea: React.FC<MetadataUploadAreaProps> = ({
  onFilesSelected,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Upload Dropzone Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`relative rounded-3xl p-8 sm:p-14 text-center border-2 border-dashed transition-all cursor-pointer select-none group ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
            : 'border-slate-300 dark:border-white/10 hover:border-indigo-500/50 bg-slate-50 dark:bg-white/[0.02]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          onChange={handleFileInput}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/10">
            <Upload className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <div className="space-y-1.5 max-w-md">
            <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white">
              Drag & Drop Image
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              or <span className="text-indigo-500 font-semibold hover:underline">Browse Files</span> to inspect and clean metadata
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            {['JPG', 'PNG', 'WebP'].map((fmt) => (
              <span
                key={fmt}
                className="px-2.5 py-1 rounded-lg bg-slate-200/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy guarantee reminder */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Processed 100% locally in your browser</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 flex items-center gap-2.5">
          <Eye className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Inspect hidden EXIF, GPS & device data</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-purple-400 shrink-0" />
          <span>Lossless removal of supported metadata</span>
        </div>
      </div>
    </div>
  );
};
