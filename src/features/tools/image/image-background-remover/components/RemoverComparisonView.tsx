import React, { useState } from 'react';
import { BackgroundMode } from '../types';
import { Eye, Layers, Sparkles } from 'lucide-react';

interface RemoverComparisonViewProps {
  originalUrl: string;
  resultUrl?: string;
  backgroundMode: BackgroundMode;
  customColor: string;
  isProcessing?: boolean;
}

export const RemoverComparisonView: React.FC<RemoverComparisonViewProps> = ({
  originalUrl,
  resultUrl,
  backgroundMode,
  customColor,
  isProcessing = false,
}) => {
  const [mobileTab, setMobileTab] = useState<'result' | 'original'>('result');

  // Background style for transparency checkerboard
  const checkerboardStyle: React.CSSProperties =
    backgroundMode === 'transparent'
      ? {
          backgroundImage: `
            linear-gradient(45deg, #1e293b 25%, transparent 25%),
            linear-gradient(-45deg, #1e293b 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #1e293b 75%),
            linear-gradient(-45deg, transparent 75%, #1e293b 75%)
          `,
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
          backgroundColor: '#0f172a',
        }
      : backgroundMode === 'white'
      ? { backgroundColor: '#ffffff' }
      : backgroundMode === 'black'
      ? { backgroundColor: '#000000' }
      : { backgroundColor: customColor };

  return (
    <div className="w-full space-y-3">
      {/* Mobile Toggle Buttons */}
      <div className="flex md:hidden items-center justify-center p-1 bg-slate-900/80 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => setMobileTab('result')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            mobileTab === 'result'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Removed Background
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('original')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            mobileTab === 'original'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Original Image
        </button>
      </div>

      {/* Main View Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Card */}
        <div
          className={`rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden flex flex-col ${
            mobileTab === 'original' ? 'block' : 'hidden md:flex'
          }`}
        >
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/80 bg-slate-900/60">
            <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              Original Image
            </span>
          </div>

          <div className="relative flex-1 min-h-[300px] max-h-[460px] flex items-center justify-center p-4 bg-slate-950/40">
            <img
              src={originalUrl}
              alt="Original uploaded photo"
              className="max-h-[420px] max-w-full w-auto h-auto object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Removed Background Result Card */}
        <div
          className={`rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden flex flex-col ${
            mobileTab === 'result' ? 'block' : 'hidden md:flex'
          }`}
        >
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/80 bg-slate-900/60">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Result {backgroundMode === 'transparent' ? '(Transparent PNG)' : `(${backgroundMode})`}
            </span>
            {backgroundMode === 'transparent' && (
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Alpha Channel
              </span>
            )}
          </div>

          <div
            className="relative flex-1 min-h-[300px] max-h-[460px] flex items-center justify-center p-4 transition-colors duration-200"
            style={checkerboardStyle}
          >
            {resultUrl ? (
              <img
                src={resultUrl}
                alt="Background removed cutout"
                className="max-h-[420px] max-w-full w-auto h-auto object-contain rounded-lg drop-shadow-md"
              />
            ) : isProcessing ? (
              <div className="text-center p-6 space-y-2">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto" />
                <p className="text-xs text-slate-400">Isolating foreground...</p>
              </div>
            ) : (
              <div className="text-center p-6 text-slate-500 text-xs">
                Awaiting processing...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
