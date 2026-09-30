import React, { useRef, useState } from 'react';
import { Upload, Sparkles, Shield, Cpu } from 'lucide-react';

interface RemoverUploadAreaProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export const RemoverUploadArea: React.FC<RemoverUploadAreaProps> = ({
  onFilesSelected,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed p-8 md:p-12 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.2)]'
            : 'border-slate-700/80 bg-slate-900/50 hover:border-indigo-500/60 hover:bg-slate-800/40'
        } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Upload image to remove background"
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300 shadow-inner">
          <Upload className="h-8 w-8" />
        </div>

        <h3 className="mt-5 text-xl font-semibold text-white tracking-tight">
          Drag &amp; Drop Image
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          or <span className="text-indigo-400 font-medium underline underline-offset-4 group-hover:text-indigo-300">Browse Files</span> from your device
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {['JPG', 'PNG', 'WebP'].map((format) => (
            <span
              key={format}
              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50"
            >
              {format}
            </span>
          ))}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Shield className="w-3 h-3" />
            100% In-Browser Privacy
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Cpu className="w-3 h-3" />
            On-Device AI
          </span>
        </div>
      </div>
    </div>
  );
};
