import React from 'react';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
        disabled
          ? 'bg-slate-200 dark:bg-white/10 text-slate-400 cursor-not-allowed'
          : 'bg-[#6657FF] hover:bg-[#5848EE] text-white shadow-md'
      }`}
    >
      <Download className="w-3.5 h-3.5" />
      Download All (ZIP)
    </button>
  );
};
