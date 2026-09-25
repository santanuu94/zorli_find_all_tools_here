import React, { useState } from 'react';
import { Maximize, Sliders } from 'lucide-react';
import { ToolComponentProps } from '../../types';
import { ToolWorkspace } from '../../common/ToolWorkspace';

export const AspectRatioCalculator: React.FC<ToolComponentProps> = () => {
  const [origW, setOrigW] = useState(1920);
  const [origH, setOrigH] = useState(1080);
  const [newW, setNewW] = useState(1280);

  const calculatedHeight = Math.round((newW / origW) * origH) || 0;

  return (
    <ToolWorkspace
      title="Aspect Ratio & Resolution Calculator"
      sidebar={
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-teal-400" />
            Common Presets
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '16:9 (HD)', w: 1920, h: 1080 },
              { label: '4:3 (Classic)', w: 1024, h: 768 },
              { label: '1:1 (Square)', w: 1080, h: 1080 },
              { label: '9:16 (Story)', w: 1080, h: 1920 },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setOrigW(p.w);
                  setOrigH(p.h);
                }}
                className="p-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-teal-400 cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">1. Original Aspect Ratio</h4>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={origW}
              onChange={(e) => setOrigW(Number(e.target.value))}
              className="w-32 p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070B24] font-mono text-center"
              placeholder="Width"
            />
            <span className="text-lg font-bold text-slate-400">:</span>
            <input
              type="number"
              value={origH}
              onChange={(e) => setOrigH(Number(e.target.value))}
              className="w-32 p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070B24] font-mono text-center"
              placeholder="Height"
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">2. New Desired Size</h4>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={newW}
              onChange={(e) => setNewW(Number(e.target.value))}
              className="w-32 p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070B24] font-mono text-center"
              placeholder="New Width"
            />
            <span className="text-lg font-bold text-slate-400">×</span>
            <div className="w-32 p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-500 font-mono font-bold text-center">
              {calculatedHeight}px
            </div>
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
};
