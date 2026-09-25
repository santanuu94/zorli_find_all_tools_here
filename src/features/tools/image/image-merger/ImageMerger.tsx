import React from 'react';
import { Upload, Layers } from 'lucide-react';
import { ToolComponentProps } from '../../types';
import { ToolWorkspace } from '../../common/ToolWorkspace';

export const ImageMerger: React.FC<ToolComponentProps> = () => (
  <ToolWorkspace title="Image Stitching & Collage Merger">
    <div className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl p-10 md:p-14 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-white/5">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-500 to-purple-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-violet-500/20">
        <Layers className="w-8 h-8" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
        Combine multiple images
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
        Stitch photos horizontally, vertically, or in a responsive multi-panel collage grid.
      </p>
      <button className="px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-md cursor-pointer">
        Add Images to Merge
      </button>
    </div>
  </ToolWorkspace>
);
