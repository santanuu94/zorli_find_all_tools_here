import React from 'react';
import { Upload, Zap } from 'lucide-react';
import { ToolComponentProps } from '../../types';
import { ToolWorkspace } from '../../common/ToolWorkspace';

export const JpgToWebp: React.FC<ToolComponentProps> = () => (
  <ToolWorkspace title="JPG to Next-Gen WebP Engine">
    <div className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl p-10 md:p-14 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-white/5">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center mb-4 shadow-lg shadow-teal-500/20">
        <Zap className="w-8 h-8" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
        Drop JPGs to convert to WebP
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
        Reduce website image weights by up to 70% with high visual fidelity.
      </p>
      <button className="px-6 py-3 rounded-full bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-all shadow-md cursor-pointer">
        Select JPG Files
      </button>
    </div>
  </ToolWorkspace>
);
