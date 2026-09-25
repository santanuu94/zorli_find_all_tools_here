import React from 'react';
import { Upload, RotateCw } from 'lucide-react';
import { ToolComponentProps } from '../../types';
import { ToolWorkspace } from '../../common/ToolWorkspace';

export const ImageRotator: React.FC<ToolComponentProps> = () => (
  <ToolWorkspace title="Image Orientation & Rotation">
    <div className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl p-10 md:p-14 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-white/5">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-fuchsia-500 to-pink-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-fuchsia-500/20">
        <RotateCw className="w-8 h-8" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
        Rotate or flip your photos
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
        Turn 90° clockwise, 180°, or mirror horizontally and vertically.
      </p>
      <button className="px-6 py-3 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-sm font-semibold transition-all shadow-md cursor-pointer">
        Select Image
      </button>
    </div>
  </ToolWorkspace>
);
