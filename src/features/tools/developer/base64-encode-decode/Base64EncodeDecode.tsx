import React, { useState } from 'react';
import { Binary, ArrowUpDown, Copy, Check } from 'lucide-react';
import { ToolComponentProps } from '../../types';
import { ToolWorkspace } from '../../common/ToolWorkspace';

export const Base64EncodeDecode: React.FC<ToolComponentProps> = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [inputVal, setInputVal] = useState('Hello Zorli Platform!');
  const [copied, setCopied] = useState(false);

  const getResult = () => {
    try {
      return mode === 'encode' ? btoa(inputVal) : atob(inputVal);
    } catch (e) {
      return 'Invalid Base64 string';
    }
  };

  const result = getResult();

  return (
    <ToolWorkspace
      title="Base64 Encoding & Decoding Studio"
      sidebar={
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-indigo-400" />
            Conversion Mode
          </h3>

          <div className="flex rounded-xl bg-slate-200 dark:bg-white/10 p-1">
            <button
              onClick={() => setMode('encode')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'encode' ? 'bg-[#6657FF] text-white shadow' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              Encode
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'decode' ? 'bg-[#6657FF] text-white shadow' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              Decode
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {mode === 'encode' ? 'Input Plain Text' : 'Input Base64 String'}
          </label>
          <textarea
            rows={5}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full font-mono text-xs rounded-xl p-3 bg-slate-50 dark:bg-[#070B24] border border-slate-200 dark:border-white/10"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Output Result
            </label>
            <button
              onClick={() => {
                navigator.clipboard.writeText(result);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-xs text-[#6657FF] font-medium flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            rows={5}
            readOnly
            value={result}
            className="w-full font-mono text-xs rounded-xl p-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>
    </ToolWorkspace>
  );
};
