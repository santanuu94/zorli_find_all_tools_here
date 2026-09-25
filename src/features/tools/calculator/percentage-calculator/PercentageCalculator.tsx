import React, { useState } from 'react';
import { Percent, ArrowRight } from 'lucide-react';
import { ToolComponentProps } from '../../types';
import { ToolWorkspace } from '../../common/ToolWorkspace';

export const PercentageCalculator: React.FC<ToolComponentProps> = () => {
  const [percent, setPercent] = useState<number>(25);
  const [total, setTotal] = useState<number>(120);

  const result = (percent / 100) * total;

  return (
    <ToolWorkspace
      title="Interactive Percentage Calculator"
      sidebar={
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Percent className="w-4 h-4 text-emerald-500" />
            Formula
          </h3>
          <p className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#070B24] p-3 rounded-xl border border-slate-200 dark:border-white/10">
            Result = ( {percent} / 100 ) × {total}
            <br />
            Result = {result}
          </p>
        </div>
      }
    >
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#070B24] border border-slate-200 dark:border-white/10 space-y-6">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">What is X% of Y?</h4>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span>What is</span>
          <input
            type="number"
            value={percent}
            onChange={(e) => setPercent(Number(e.target.value))}
            className="w-24 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 font-mono text-sm font-bold text-center"
          />
          <span>% of</span>
          <input
            type="number"
            value={total}
            onChange={(e) => setTotal(Number(e.target.value))}
            className="w-28 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 font-mono text-sm font-bold text-center"
          />
          <span>?</span>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Answer:</span>
          <span className="text-3xl font-black font-display text-emerald-500">{result}</span>
        </div>
      </div>
    </ToolWorkspace>
  );
};
