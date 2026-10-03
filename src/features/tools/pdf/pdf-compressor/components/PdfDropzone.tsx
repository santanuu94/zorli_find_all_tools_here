import React, { useRef, useState } from 'react';
import { FileText, Upload, Shield, AlertCircle } from 'lucide-react';

interface PdfDropzoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export const PdfDropzone: React.FC<PdfDropzoneProps> = ({
  onFileSelected,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formatError, setFormatError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setFormatError(null);
    const isPdfExt = file.name.toLowerCase().endsWith('.pdf');
    const isPdfMime = file.type === 'application/pdf' || file.type === '';

    if (!isPdfExt && !isPdfMime) {
      setFormatError('Please upload a valid PDF file.');
      return;
    }

    onFileSelected(file);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
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
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
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
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload PDF file to compress"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 md:p-14 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-[#6657FF]/30 select-none group ${
          isDragging
            ? 'border-rose-500 bg-rose-500/10 scale-[1.01] shadow-xl shadow-rose-500/15'
            : 'border-slate-300 dark:border-white/15 hover:border-rose-500/70 dark:hover:border-rose-500/60 bg-slate-50/70 dark:bg-white/[0.03] hover:bg-slate-100/50 dark:hover:bg-white/[0.05]'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleChange}
          disabled={disabled}
        />

        {/* Central Icon */}
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 ${
            isDragging
              ? 'scale-110 bg-gradient-to-tr from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/40'
              : 'bg-rose-500/10 text-rose-500 dark:text-rose-400 group-hover:scale-105 border border-rose-500/20'
          }`}
        >
          <FileText className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        {/* Drag & Drop Prompt */}
        <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
          {isDragging ? 'Drop your PDF here' : 'Drag & Drop PDF'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
          or{' '}
          <span className="font-semibold text-rose-500 dark:text-rose-400 underline decoration-rose-500/40 hover:decoration-rose-500">
            browse from your device
          </span>
          . Target practical file sizes like 1 MB or 2 MB in seconds.
        </p>

        {/* Action Button */}
        <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-semibold text-sm transition-all shadow-md shadow-rose-500/25 mb-4">
          <Upload className="w-4 h-4" />
          <span>Select PDF File</span>
        </div>

        {/* Privacy Pill */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 bg-slate-200/60 dark:bg-white/5 px-3 py-1 rounded-full border border-slate-300/50 dark:border-white/5">
          <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>100% In-Browser Compression • Zero Server Uploads</span>
        </div>
      </div>

      {formatError && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formatError}</span>
        </div>
      )}
    </div>
  );
};
