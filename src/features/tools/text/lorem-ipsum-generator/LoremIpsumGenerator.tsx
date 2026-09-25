import React, { useState } from 'react';
import { AlignLeft, Copy, Check } from 'lucide-react';
import { ToolComponentProps } from '../../types';
import { ToolWorkspace } from '../../common/ToolWorkspace';

const LOREM_PARAGRAPHS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.',
];

export const LoremIpsumGenerator: React.FC<ToolComponentProps> = () => {
  const [numParagraphs, setNumParagraphs] = useState(2);
  const [copied, setCopied] = useState(false);

  const text = LOREM_PARAGRAPHS.slice(0, numParagraphs).join('\n\n');

  return (
    <ToolWorkspace
      title="Placeholder Text Generator"
      sidebar={
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <AlignLeft className="w-4 h-4 text-yellow-500" />
            Paragraphs
          </h3>
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setNumParagraphs(n)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  numParagraphs === n
                    ? 'bg-yellow-500 text-slate-950 shadow'
                    : 'bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                {n} {n === 1 ? 'Para' : 'Paras'}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Generated Dummy Text
          </label>
          <button
            onClick={() => {
              navigator.clipboard.writeText(text);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="text-xs text-yellow-600 dark:text-yellow-400 font-medium flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <textarea
          rows={8}
          readOnly
          value={text}
          className="w-full text-sm rounded-2xl p-4 bg-slate-50 dark:bg-[#070B24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 leading-relaxed"
        />
      </div>
    </ToolWorkspace>
  );
};
