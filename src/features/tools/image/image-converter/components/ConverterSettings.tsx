import React from 'react';
import {
  RefreshCw,
  Play,
  Loader2,
  Check,
  Sliders,
  AlertTriangle,
  Info,
  Sparkles,
} from 'lucide-react';
import { GlobalConvertSettings, SupportedFormat } from '../types';
import { FORMAT_OPTIONS } from '../lib/converter';

interface ConverterSettingsProps {
  settings: GlobalConvertSettings;
  totalFilesCount: number;
  readyFilesCount: number;
  sameFormatFilesCount: number;
  onFormatChange: (format: SupportedFormat) => void;
  onQualityChange: (quality: number) => void;
  onBackgroundColorChange: (color: string) => void;
  onConvertClick: () => void;
  isProcessing: boolean;
  hasFilesToConvert: boolean;
  disabled?: boolean;
}

const BACKGROUND_COLOR_OPTIONS = [
  { label: 'White', color: '#FFFFFF', border: 'border-slate-300' },
  { label: 'Black', color: '#000000', border: 'border-slate-600' },
  { label: 'Light Gray', color: '#F3F4F6', border: 'border-slate-300' },
  { label: 'Dark Slate', color: '#0F172A', border: 'border-slate-700' },
];

export const ConverterSettings: React.FC<ConverterSettingsProps> = ({
  settings,
  totalFilesCount,
  readyFilesCount,
  sameFormatFilesCount,
  onFormatChange,
  onQualityChange,
  onBackgroundColorChange,
  onConvertClick,
  isProcessing,
  hasFilesToConvert,
  disabled = false,
}) => {
  const currentFormatOption =
    FORMAT_OPTIONS.find((f) => f.format === settings.targetFormat) || FORMAT_OPTIONS[2];

  const qualityPresets = [65, 75, 85, 95];

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
        <div>
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
            Conversion Settings
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose output format and settings
          </p>
        </div>
        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 uppercase">
          Step 2 of 3
        </span>
      </div>

      {/* 1. Target Format Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Convert to format:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {FORMAT_OPTIONS.map((opt) => {
            const isSelected = settings.targetFormat === opt.format;
            return (
              <button
                key={opt.format}
                type="button"
                disabled={disabled}
                onClick={() => onFormatChange(opt.format)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-rose-500/10 border-rose-500 text-slate-900 dark:text-white ring-1 ring-rose-500 shadow-sm'
                    : 'bg-white dark:bg-[#070B24] border-slate-200 dark:border-white/10 hover:border-rose-500/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-black font-display tracking-tight text-rose-600 dark:text-rose-400">
                    .{opt.format.toUpperCase()}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-rose-500" />}
                </div>
                <div>
                  <span className="text-xs font-bold block font-display">{opt.label}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight block mt-0.5 line-clamp-2">
                    {opt.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Quality Control (Only for Lossy formats: JPG & WebP) */}
      <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 space-y-3">
        {currentFormatOption.isLossy ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-rose-500" />
                <span>Output Quality</span>
              </label>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/25">
                {settings.quality}%
              </span>
            </div>

            {/* Quick Quality Chips */}
            <div className="grid grid-cols-4 gap-1.5">
              {qualityPresets.map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={disabled}
                  onClick={() => onQualityChange(q)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer text-center ${
                    settings.quality === q
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-rose-500/50'
                  }`}
                >
                  {q}%
                </button>
              ))}
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              disabled={disabled}
              value={settings.quality}
              onChange={(e) => onQualityChange(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              <span>Small file (Low)</span>
              <span>Balanced (85%)</span>
              <span>Maximum (100%)</span>
            </div>
          </div>
        ) : (
          /* PNG lossless explanation (No fake quality control) */
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                PNG uses lossless compression
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed block">
                PNG does not use lossy quality degradation. All pixel details and alpha transparency are 100% preserved.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Transparency Notice & Flattening Color (When converting to JPG) */}
      {settings.targetFormat === 'jpg' && (
        <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 space-y-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">
                JPG does not support transparent backgrounds
              </span>
              <span className="text-[11px] text-amber-700/90 dark:text-amber-300/80 leading-relaxed block">
                Transparent areas will be flattened into a solid background color:
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Background fill color:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {BACKGROUND_COLOR_OPTIONS.map((bg) => (
                <button
                  key={bg.color}
                  type="button"
                  disabled={disabled}
                  onClick={() => onBackgroundColorChange(bg.color)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                    settings.backgroundColor === bg.color
                      ? 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500 font-bold'
                      : 'bg-white dark:bg-[#070B24] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full border ${bg.border}`}
                    style={{ backgroundColor: bg.color }}
                  />
                  <span>{bg.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Same Format Warning helper */}
      {sameFormatFilesCount > 0 && (
        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            {sameFormatFilesCount === 1
              ? `1 image is already .${settings.targetFormat.toUpperCase()} and will be skipped.`
              : `${sameFormatFilesCount} images are already .${settings.targetFormat.toUpperCase()} and will be skipped.`}
          </span>
        </div>
      )}

      {/* 5. Primary Action Button */}
      <button
        type="button"
        disabled={disabled || !hasFilesToConvert || isProcessing}
        onClick={onConvertClick}
        className={`w-full py-3.5 px-5 rounded-2xl font-bold font-display text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
          hasFilesToConvert && !isProcessing
            ? 'bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white shadow-rose-500/25 active:scale-[0.98]'
            : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
        }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Converting Images in Browser...</span>
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4" />
            <span>
              {totalFilesCount > 1
                ? `Convert ${readyFilesCount} of ${totalFilesCount} Images to .${settings.targetFormat.toUpperCase()}`
                : `Convert Image to .${settings.targetFormat.toUpperCase()}`}
            </span>
          </>
        )}
      </button>
    </div>
  );
};
