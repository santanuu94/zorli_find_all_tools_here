import React, { useRef, useState } from 'react';
import { Upload, Scissors, FileText, AlertCircle } from 'lucide-react';

interface SplitterDropzoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export const SplitterDropzone: React.FC<SplitterDropzoneProps> = ({
  onFileSelected,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragError(null);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setDragError('Only PDF files are supported. Please drop a valid PDF.');
      return;
    }

    onFileSelected(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    onFileSelected(files[0]);
    // Reset so the user can re-select the same file if needed
    e.target.value = '';
  };

  return (
    <div className="w-full space-y-3">
      {dragError && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{dragError}</span>
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`group relative rounded-3xl border-2 border-dashed transition-all duration-300 p-8 sm:p-14 flex flex-col items-center justify-center text-center cursor-pointer select-none ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.005]'
            : 'border-slate-300 dark:border-white/15 bg-white dark:bg-[#070B24] hover:border-indigo-400/50 hover:bg-slate-50 dark:hover:bg-white/[0.02]'
        } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Floating Ambient Glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-indigo-500/5 via-purple-500/5 to-transparent pointer-events-none" />

        {/* Central Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center mb-5 shadow-xl shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
          <Scissors className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
          Drop your PDF here, or <span className="text-indigo-500 hover:underline">browse</span>
        </h3>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
          Split by page ranges, extract single pages, or divide into equal groups. 100% processed in your browser.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-1.5 font-medium">
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            PDF format only
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-medium">
            Max 150 MB
          </span>
        </div>
      </div>
    </div>
  );
};
