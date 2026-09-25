import React, { useState } from 'react';
import { Upload, FileText, Sliders, Shield } from 'lucide-react';
import { ToolComponentProps } from '../../types';
import { ToolWorkspace } from '../../common/ToolWorkspace';

export const PdfCompressor: React.FC<ToolComponentProps> = () => {
  const [compressionPreset, setCompressionPreset] = useState<'extreme' | 'recommended' | 'low'>('recommended');

  return (
    <ToolWorkspace
      title="PDF Document Compression Engine"
      sidebar={
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-rose-500" />
            Compression Level
          </h3>

          <div className="space-y-2">
            {[
              { id: 'extreme', label: 'Extreme Compression', desc: 'Lowest size, fair quality' },
              { id: 'recommended', label: 'Recommended', desc: 'Best balance of size & sharpness' },
              { id: 'low', label: 'Low Compression', desc: 'High quality, minimal reduction' },
            ].map((preset) => (
              <button
                key={preset.id}
                onClick={() => setCompressionPreset(preset.id as any)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  compressionPreset === preset.id
                    ? 'border-rose-500 bg-rose-500/10 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#070B24] text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-xs font-bold">{preset.label}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{preset.desc}</div>
              </button>
            ))}
          </div>
        </div>
      }
    >
      <div className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl p-10 md:p-14 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-white/5 transition-colors">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-red-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-rose-500/20">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
          Drop PDF file here to compress
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
          Files are compressed locally in browser memory. Secure and confidential.
        </p>
        <button className="px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition-all shadow-md cursor-pointer">
          Select PDF File
        </button>
      </div>
    </ToolWorkspace>
  );
};
