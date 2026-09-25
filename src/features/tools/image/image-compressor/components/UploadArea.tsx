import React, { useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface UploadAreaProps {
  onFilesSelected: (files: File[]) => void;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onFilesSelected }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className="border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-[#6657FF] dark:hover:border-[#6657FF] rounded-2xl p-10 md:p-14 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-white/5 transition-all cursor-pointer group"
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={handleChange}
      />
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6657FF] to-[#8B5CF6] text-white flex items-center justify-center mb-4 shadow-lg shadow-[#6657FF]/30 group-hover:scale-105 transition-transform">
        <Upload className="w-8 h-8" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
        Drop images here or click to browse
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
        Supports JPG, PNG, WebP, AVIF up to 50MB. Local browser processing ensures full privacy.
      </p>
      <button
        type="button"
        className="px-6 py-3 rounded-full bg-[#6657FF] hover:bg-[#5848EE] text-white text-sm font-semibold transition-all shadow-md shadow-[#6657FF]/25 cursor-pointer pointer-events-none"
      >
        Select Images
      </button>
    </div>
  );
};
