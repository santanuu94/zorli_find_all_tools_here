import React from 'react';
import { Upload, Scissors } from 'lucide-react';
import { ToolComponentProps } from '../../types';
import { ToolWorkspace } from '../../common/ToolWorkspace';

export const PdfSplit: React.FC<ToolComponentProps> = () => (
  <ToolWorkspace title="PDF Page Separator & Extractor">
    <div className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl p-10 md:p-14 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-white/5">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
        <Scissors className="w-8 h-8" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
        Upload PDF to extract pages
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
        Select specific page ranges or extract each page into its own individual file.
      </p>
      <button className="px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-all shadow-md cursor-pointer">
        Select PDF
      </button>
    </div>
  </ToolWorkspace>
);
