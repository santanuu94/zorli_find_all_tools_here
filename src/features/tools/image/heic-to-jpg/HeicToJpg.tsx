import React from 'react';
import { Upload, Smartphone } from 'lucide-react';
import { ToolComponentProps } from '../../types';
import { ToolWorkspace } from '../../common/ToolWorkspace';

export const HeicToJpg: React.FC<ToolComponentProps> = () => (
  <ToolWorkspace title="Apple HEIC to Standard JPG Converter">
    <div className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl p-10 md:p-14 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-white/5">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
        <Smartphone className="w-8 h-8" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
        Drop Apple iPhone .HEIC photos
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
        Convert proprietary iOS camera captures to universally compatible JPEG images without uploading.
      </p>
      <button className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all shadow-md cursor-pointer">
        Select HEIC Photos
      </button>
    </div>
  </ToolWorkspace>
);
