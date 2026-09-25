import React, { useState } from 'react';
import { Type, Clock, AlignLeft, Sparkles } from 'lucide-react';
import { ToolComponentProps } from '../../types';
import { ToolWorkspace } from '../../common/ToolWorkspace';

export const WordCounter: React.FC<ToolComponentProps> = () => {
  const [text, setText] = useState(
    'Zorli provides simple tools for a smarter you. Every tool runs cleanly, quickly, and securely in your browser.'
  );

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const sentences = text.trim() ? (text.match(/[.!?]+(?:\s+|$)/g) || []).length : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;
  const readingTime = Math.ceil(words / 200);

  return (
    <ToolWorkspace
      title="Live Text Analytics & Word Counter"
      sidebar={
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            Estimated Reading
          </h3>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="text-2xl font-black font-display text-amber-500">{readingTime} min</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Average silent reading speed (200 wpm)</div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B24] border border-slate-200 dark:border-white/10 text-center">
            <div className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">{words}</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Words</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B24] border border-slate-200 dark:border-white/10 text-center">
            <div className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">{characters}</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Characters</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B24] border border-slate-200 dark:border-white/10 text-center">
            <div className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">{sentences}</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Sentences</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B24] border border-slate-200 dark:border-white/10 text-center">
            <div className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">{paragraphs}</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Paragraphs</div>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          rows={9}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text here to analyze..."
          className="w-full text-sm sm:text-base rounded-2xl p-5 bg-slate-50 dark:bg-[#070B24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 leading-relaxed"
        />
      </div>
    </ToolWorkspace>
  );
};
