import React from 'react';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  count?: number;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  onClick,
  disabled = false,
  count,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Download all completed compressed images"
      className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer select-none ${
        disabled
          ? 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60'
          : 'bg-[#6657FF] hover:bg-[#5848EE] active:scale-95 text-white shadow-md shadow-[#6657FF]/25 hover:shadow-lg hover:shadow-[#6657FF]/35'
      }`}
    >
      <Download className="w-3.5 h-3.5 shrink-0" />
      <span>
        {count && count > 1 ? `Download All (${count} ZIP)` : 'Download All'}
      </span>
    </button>
  );
};
