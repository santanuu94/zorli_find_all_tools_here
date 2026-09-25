import React from 'react';
import { Grid, Sparkles, Send } from 'lucide-react';
import { ToolComponentProps } from '../../types';
import { ToolWorkspace } from '../../common/ToolWorkspace';

export const MoreImageTools: React.FC<ToolComponentProps> = () => (
  <ToolWorkspace title="Zorli Image Pipeline & Roadmap">
    <div className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl p-10 md:p-14 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-white/5">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20">
        <Sparkles className="w-8 h-8" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
        Suggest an Image Tool
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
        Have a specific image transformation or format utility in mind? Our engineering team releases new modules continuously.
      </p>
      <button className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-all shadow-md cursor-pointer flex items-center gap-2">
        <Send className="w-4 h-4" />
        Request a Feature
      </button>
    </div>
  </ToolWorkspace>
);
