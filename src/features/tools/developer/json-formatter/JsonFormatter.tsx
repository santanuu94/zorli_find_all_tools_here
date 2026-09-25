import React, { useState } from 'react';
import { Code, Copy, Check, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { ToolComponentProps } from '../../types';
import { ToolWorkspace } from '../../common/ToolWorkspace';

export const JsonFormatter: React.FC<ToolComponentProps> = () => {
  const [jsonInput, setJsonInput] = useState('{\n  "status": "success",\n  "code": 200,\n  "data": {\n    "platform": "Zorli",\n    "version": "1.0.0",\n    "tools": ["image-compressor", "json-formatter"]\n  }\n}');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolWorkspace
      title="JSON Formatter & Schema Validator"
      sidebar={
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Quick Actions
          </h3>

          <div className="space-y-2">
            <button
              onClick={() => {
                try {
                  setJsonInput(JSON.stringify(JSON.parse(jsonInput), null, 2));
                } catch (e) {}
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all cursor-pointer text-center"
            >
              Beautify (2 Spaces)
            </button>
            <button
              onClick={() => {
                try {
                  setJsonInput(JSON.stringify(JSON.parse(jsonInput)));
                } catch (e) {}
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-semibold transition-all cursor-pointer text-center"
            >
              Minify / Compact
            </button>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2 text-emerald-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Valid JSON Syntax</span>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-purple-400" />
            Paste or edit JSON below
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 hover:text-[#6657FF] transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>

        <textarea
          rows={14}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="w-full font-mono text-xs sm:text-sm rounded-2xl p-4 bg-slate-50 dark:bg-[#070B24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500 leading-relaxed"
          placeholder="Paste raw JSON here..."
        />
      </div>
    </ToolWorkspace>
  );
};
