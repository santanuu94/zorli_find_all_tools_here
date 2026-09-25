import React, { useState } from 'react';
import { Upload, LayoutGrid, Sparkles } from 'lucide-react';
import { ToolComponentProps } from '../../types';
import { ToolWorkspace } from '../../common/ToolWorkspace';

export const InstagramGridMaker: React.FC<ToolComponentProps> = () => {
  const [layout, setLayout] = useState<'3x1' | '3x2' | '3x3'>('3x3');

  return (
    <ToolWorkspace
      title="Instagram Feed Grid Slicer"
      sidebar={
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-indigo-400" />
            Grid Format
          </h3>
          <div className="space-y-2">
            {[
              { id: '3x3', label: '3×3 Giant Square (9 Posts)' },
              { id: '3x2', label: '3×2 Banner (6 Posts)' },
              { id: '3x1', label: '3×1 Horizontal Strip (3 Posts)' },
            ].map((fmt) => (
              <button
                key={fmt.id}
                onClick={() => setLayout(fmt.id as any)}
                className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  layout === fmt.id
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <div className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl p-10 md:p-14 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-white/5 transition-colors">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
          <LayoutGrid className="w-8 h-8" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
          Drop banner image to slice into {layout} grid
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
          Zorli divides your picture into numbered tiles with easy instructions for Instagram upload order.
        </p>
        <button className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-md cursor-pointer">
          Select Instagram Photo
        </button>
      </div>
    </ToolWorkspace>
  );
};
