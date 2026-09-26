import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, ShieldCheck } from 'lucide-react';

interface UploadAreaProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onFilesSelected, disabled = false }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      // Reset input value so re-selecting the same file works
      e.target.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload images to compress"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={handleKeyDown}
      className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 md:p-14 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-[#6657FF]/30 select-none group ${
        isDragging
          ? 'border-[#6657FF] bg-[#6657FF]/10 scale-[1.01] shadow-xl shadow-[#6657FF]/15'
          : 'border-slate-300 dark:border-white/15 hover:border-[#6657FF] dark:hover:border-[#6657FF]/80 bg-slate-50/70 dark:bg-white/[0.03] hover:bg-slate-100/50 dark:hover:bg-white/[0.05]'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />

      {/* Floating Animated Icon */}
      <div
        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 ${
          isDragging
            ? 'scale-110 bg-[#6657FF] text-white shadow-lg shadow-[#6657FF]/40'
            : 'bg-gradient-to-tr from-[#6657FF] to-[#8B5CF6] text-white shadow-md shadow-[#6657FF]/25 group-hover:scale-105'
        }`}
      >
        <Upload className="w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:-translate-y-0.5" />
      </div>

      <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white mb-2">
        {isDragging ? 'Drop your images here' : 'Drop images here, or browse files'}
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        Supports <strong className="font-semibold text-slate-700 dark:text-slate-200">JPG, PNG, WebP</strong> up to 50MB per file.
        All processing happens locally in your browser.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          tabIndex={-1}
          className="px-7 py-3 rounded-full bg-[#6657FF] hover:bg-[#5848EE] text-white text-sm font-semibold transition-all shadow-md shadow-[#6657FF]/30 group-hover:shadow-lg group-hover:shadow-[#6657FF]/40 pointer-events-none"
        >
          Select Images
        </button>
      </div>

      {/* Privacy assurance pill */}
      <div className="mt-6 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>100% In-Browser Compression • Zero Uploads</span>
      </div>
    </div>
  );
};
