import React, { useState } from 'react';
import { Link, Copy, Check } from 'lucide-react';
import { ToolComponentProps } from '../../types';
import { ToolWorkspace } from '../../common/ToolWorkspace';

export const UrlEncoderDecoder: React.FC<ToolComponentProps> = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [val, setVal] = useState('https://zorli.com/search?query=simple tools&category=image');
  const [copied, setCopied] = useState(false);

  const getResult = () => {
    try {
      return mode === 'encode' ? encodeURIComponent(val) : decodeURIComponent(val);
    } catch (e) {
      return 'Invalid URI sequence';
    }
  };

  const result = getResult();

  return (
    <ToolWorkspace
      title="URL Percent-Encoding & Query Parser"
      sidebar={
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Link className="w-4 h-4 text-sky-400" />
            Mode
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
            {mode === 'encode' ? 'Source URL or String' : 'Encoded URI Component'}
          </label>
          <textarea
            rows={4}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full font-mono text-xs rounded-xl p-3 bg-slate-50 dark:bg-[#070B24] border border-slate-200 dark:border-white/10"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Result
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
            rows={4}
            readOnly
            value={result}
            className="w-full font-mono text-xs rounded-xl p-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>
    </ToolWorkspace>
  );
};
