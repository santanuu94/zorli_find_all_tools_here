import React, { useState } from 'react';
import { CaseSensitive, Copy, Check } from 'lucide-react';
import { ToolComponentProps } from '../../types';
import { ToolWorkspace } from '../../common/ToolWorkspace';

export const CaseConverter: React.FC<ToolComponentProps> = () => {
  const [val, setVal] = useState('Build something simple and elegant today');
  const [copied, setCopied] = useState(false);

  const transform = (type: string) => {
    switch (type) {
      case 'upper':
        setVal(val.toUpperCase());
        break;
      case 'lower':
        setVal(val.toLowerCase());
        break;
      case 'title':
        setVal(val.replace(/\b\w/g, (c) => c.toUpperCase()));
        break;
      case 'camel':
        setVal(
          val
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
        );
        break;
      case 'snake':
        setVal(val.toLowerCase().trim().replace(/\s+/g, '_'));
        break;
      case 'kebab':
        setVal(val.toLowerCase().trim().replace(/\s+/g, '-'));
        break;
    }
  };

  return (
    <ToolWorkspace
      title="Text Capitalization & Casing Utility"
      sidebar={
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <CaseSensitive className="w-4 h-4 text-amber-500" />
            Convert To
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => transform('upper')}
              className="p-2 text-xs font-bold rounded-xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 hover:border-amber-500 cursor-pointer"
            >
              UPPERCASE
            </button>
            <button
              onClick={() => transform('lower')}
              className="p-2 text-xs font-bold rounded-xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 hover:border-amber-500 cursor-pointer"
            >
              lowercase
            </button>
            <button
              onClick={() => transform('title')}
              className="p-2 text-xs font-bold rounded-xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 hover:border-amber-500 cursor-pointer"
            >
              Title Case
            </button>
            <button
              onClick={() => transform('camel')}
              className="p-2 text-xs font-bold rounded-xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 hover:border-amber-500 cursor-pointer"
            >
              camelCase
            </button>
            <button
              onClick={() => transform('snake')}
              className="p-2 text-xs font-bold rounded-xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 hover:border-amber-500 cursor-pointer"
            >
              snake_case
            </button>
            <button
              onClick={() => transform('kebab')}
              className="p-2 text-xs font-bold rounded-xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 hover:border-amber-500 cursor-pointer"
            >
              kebab-case
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Current Text
          </label>
          <button
            onClick={() => {
              navigator.clipboard.writeText(val);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="text-xs text-amber-500 font-medium flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <textarea
          rows={8}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="w-full text-sm rounded-2xl p-4 bg-slate-50 dark:bg-[#070B24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100"
        />
      </div>
    </ToolWorkspace>
  );
};
