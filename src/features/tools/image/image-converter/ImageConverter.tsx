import React, { useState } from 'react';
import { Upload, FileCode2, ArrowRight } from 'lucide-react';
import { ToolComponentProps } from '../../types';
import { ToolWorkspace } from '../../common/ToolWorkspace';

export const ImageConverter: React.FC<ToolComponentProps> = () => {
  const [targetFormat, setTargetFormat] = useState('webp');

  return (
    <ToolWorkspace
      title="Universal Image Format Converter"
      sidebar={
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-rose-400" />
            Convert Into
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {['webp', 'png', 'jpg', 'avif', 'ico', 'svg'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setTargetFormat(fmt)}
                className={`py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                  targetFormat === fmt
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                .{fmt}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <div className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl p-10 md:p-14 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-white/5 transition-colors">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-400 text-white flex items-center justify-center mb-4 shadow-lg shadow-rose-500/20">
          <Upload className="w-8 h-8" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
          Drop any images to convert to .{targetFormat.toUpperCase()}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
          Instantly transform single files or entire batches with high color fidelity.
        </p>
        <button className="px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition-all shadow-md cursor-pointer">
          Select Source Files
        </button>
      </div>
    </ToolWorkspace>
  );
};
