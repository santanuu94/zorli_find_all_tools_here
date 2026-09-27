import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, ShieldCheck } from 'lucide-react';

interface ResizerUploadAreaProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export const ResizerUploadArea: React.FC<ResizerUploadAreaProps> = ({
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      e.target.value = ''; // Reset so the same file can be re-selected if removed
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          fileInputRef.current?.click();
        }
      }}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload images to resize. Drag and drop or press enter to browse."
      className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] ${
        isDragging
          ? 'border-[#10B981] bg-emerald-500/10 scale-[1.01]'
          : 'border-slate-300 dark:border-white/15 bg-white/50 dark:bg-white/[0.02] hover:border-emerald-500/50 hover:bg-emerald-500/[0.03]'
      } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      <div className="flex flex-col items-center justify-center max-w-md mx-auto">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 shadow-lg ${
            isDragging
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white scale-110 shadow-emerald-500/30'
              : 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/20'
          }`}
        >
          {isDragging ? <Upload className="w-8 h-8 animate-bounce" /> : <ImageIcon className="w-8 h-8" />}
        </div>

        <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
          {isDragging ? 'Drop images here' : 'Drop images to resize, or browse'}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
          Supports <span className="font-semibold text-slate-800 dark:text-slate-200">JPG, PNG, and WebP</span> up to 50 MB per file.
          Select single or batch images.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Private (In-Browser)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
            No Upload Limits
          </span>
        </div>
      </div>
    </div>
  );
};
