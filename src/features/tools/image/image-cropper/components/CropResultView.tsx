import React from 'react';
import {
  Download,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Maximize2,
  Eye,
} from 'lucide-react';
import { CroppedImageItem } from '../types';
import { formatFileSize } from '../utils/format-file-size';

interface CropResultViewProps {
  item: CroppedImageItem;
  onDownload: (item: CroppedImageItem) => void;
  onRecrop: () => void;
  onPreview: (item: CroppedImageItem) => void;
}

export const CropResultView: React.FC<CropResultViewProps> = ({
  item,
  onDownload,
  onRecrop,
  onPreview,
}) => {
  if (!item.outputUrl) return null;

  return (
    <div className="flex flex-col rounded-3xl bg-white dark:bg-[#0D1438] border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-xl animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/10 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Cropped Successfully
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span>{item.originalWidth} × {item.originalHeight} px</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {item.outputWidth} × {item.outputHeight} px
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPreview(item)}
            className="py-2 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="See full comparison preview & inspect details"
          >
            <Eye className="w-3.5 h-3.5 text-amber-500" />
            <span>See Output</span>
          </button>

          <button
            type="button"
            onClick={onRecrop}
            className="py-2 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Adjust Crop</span>
          </button>

          <button
            type="button"
            onClick={() => onDownload(item)}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Cropped</span>
          </button>
        </div>
      </div>

      {/* Image Preview Canvas */}
      <div className="flex-1 p-6 sm:p-10 bg-slate-950/40 flex items-center justify-center min-h-[340px] max-h-[560px] overflow-auto">
        <img
          src={item.outputUrl}
          alt={item.originalName}
          className="max-h-[50vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
        />
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-200/80 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 font-mono">
        <span className="uppercase">Format: {item.originalFormat}</span>
        {item.outputSize && <span>File Size: {formatFileSize(item.outputSize)}</span>}
      </div>
    </div>
  );
};
