import React, { useState } from 'react';
import { Upload, Maximize2, Lock, Unlock } from 'lucide-react';
import { ToolComponentProps } from '../../types';
import { ToolWorkspace } from '../../common/ToolWorkspace';

export const ImageResizer: React.FC<ToolComponentProps> = ({ tool }) => {
  const [width, setWidth] = useState<number>(1920);
  const [height, setHeight] = useState<number>(1080);
  const [lockRatio, setLockRatio] = useState<boolean>(true);

  return (
    <ToolWorkspace
      title="Image Resizing Studio"
      sidebar={
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-emerald-400" />
            Target Dimensions
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Width (px)
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full text-xs font-mono rounded-xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 p-2.5"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Height (px)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full text-xs font-mono rounded-xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 p-2.5"
              />
            </div>
          </div>

          <button
            onClick={() => setLockRatio(!lockRatio)}
            className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-[#6657FF] cursor-pointer"
          >
            {lockRatio ? <Lock className="w-3.5 h-3.5 text-[#6657FF]" /> : <Unlock className="w-3.5 h-3.5" />}
            {lockRatio ? 'Aspect ratio locked' : 'Unlocked (freeform stretch)'}
          </button>
        </div>
      }
    >
      <div className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl p-10 md:p-14 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-white/5 transition-colors">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
          <Upload className="w-8 h-8" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
          Drop image to resize
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
          Resize without quality degradation. Supports JPG, PNG, and WebP.
        </p>
        <button className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-md cursor-pointer">
          Choose Image File
        </button>
      </div>
    </ToolWorkspace>
  );
};
