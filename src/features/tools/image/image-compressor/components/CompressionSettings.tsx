import React, { useState } from 'react';
import { Sliders, Sparkles, Check, HardDrive, Zap, Play } from 'lucide-react';
import { CompressionSettings, CompressionMode } from '../types';

interface CompressionSettingsProps {
  settings: CompressionSettings;
  onModeChange: (mode: CompressionMode) => void;
  onQualityChange: (quality: number) => void;
  onTargetSizeChange: (targetSizeKb: number) => void;
  onFormatChange?: (format: 'original' | 'jpeg' | 'png' | 'webp') => void;
  onCompressClick?: () => void;
  isProcessing?: boolean;
  hasFilesToCompress?: boolean;
  disabled?: boolean;
}

const QUALITY_PRESETS = [
  { label: 'Smaller File', quality: 60, desc: 'High compression' },
  { label: 'Balanced', quality: 80, desc: 'Optimal balance' },
  { label: 'Best Quality', quality: 90, desc: 'Minimal loss' },
];

const TARGET_SIZE_PRESETS = [
  { label: 'Under 100 KB', kb: 100 },
  { label: 'Under 200 KB', kb: 200 },
  { label: 'Under 500 KB', kb: 500 },
  { label: 'Under 1 MB', kb: 1024 },
  { label: 'Under 2 MB', kb: 2048 },
];

export const CompressionSettingsComponent: React.FC<CompressionSettingsProps> = ({
  settings,
  onModeChange,
  onQualityChange,
  onTargetSizeChange,
  onFormatChange,
  onCompressClick,
  isProcessing = false,
  hasFilesToCompress = false,
  disabled = false,
}) => {
  const [customInputVal, setCustomInputVal] = useState<string>(
    settings.targetSizeKb ? String(settings.targetSizeKb) : '200'
  );
  const [customUnit, setCustomUnit] = useState<'KB' | 'MB'>('KB');

  const handleCustomInputChange = (val: string) => {
    setCustomInputVal(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      const kb = customUnit === 'MB' ? Math.round(num * 1024) : Math.round(num);
      onTargetSizeChange(kb);
    }
  };

  const handleUnitToggle = (unit: 'KB' | 'MB') => {
    setCustomUnit(unit);
    const num = parseFloat(customInputVal);
    if (!isNaN(num) && num > 0) {
      const kb = unit === 'MB' ? Math.round(num * 1024) : Math.round(num);
      onTargetSizeChange(kb);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 space-y-6">
      {/* Primary Compress Button */}
      {onCompressClick && (
        <button
          type="button"
          onClick={onCompressClick}
          disabled={disabled || isProcessing || !hasFilesToCompress}
          aria-label="Start image compression"
          className={`w-full py-3.5 px-6 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
            isProcessing
              ? 'bg-indigo-600/70 text-white cursor-wait'
              : !hasFilesToCompress
              ? 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-[#6657FF] to-[#8B5CF6] hover:from-[#5848EE] hover:to-[#7A4BE5] active:scale-[0.98] text-white shadow-[#6657FF]/30 hover:shadow-[#6657FF]/40'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>Compressing...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Compress Images</span>
            </>
          )}
        </button>
      )}

      {/* Mode Selector Tabs: Quality vs Target Size */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
          Compression Strategy
        </label>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/70 dark:bg-white/10 rounded-xl">
          <button
            type="button"
            onClick={() => onModeChange('quality')}
            disabled={disabled || isProcessing}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              settings.mode === 'quality'
                ? 'bg-white dark:bg-[#6657FF] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>By Quality</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange('targetSize')}
            disabled={disabled || isProcessing}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              settings.mode === 'targetSize'
                ? 'bg-white dark:bg-[#6657FF] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Target Size</span>
          </button>
        </div>
      </div>

      {/* Mode 1: BY QUALITY */}
      {settings.mode === 'quality' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Quality Level
            </span>
            <span className="text-sm font-mono font-bold text-[#6657FF] bg-[#6657FF]/10 dark:bg-[#6657FF]/20 px-3 py-0.5 rounded-full border border-[#6657FF]/20">
              {settings.quality}%
            </span>
          </div>

          <div>
            <input
              type="range"
              min="10"
              max="95"
              step="1"
              value={settings.quality}
              onChange={(e) => onQualityChange(Number(e.target.value))}
              disabled={disabled || isProcessing}
              aria-label="Compression quality slider"
              className="w-full h-2.5 bg-slate-200 dark:bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#6657FF] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6657FF]"
            />
            <div className="flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1.5">
              <span>Max Compression (10%)</span>
              <span>Balanced (80%)</span>
              <span>Best Quality (95%)</span>
            </div>
          </div>

          {/* Quick Quality Presets */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
              Quick Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              {QUALITY_PRESETS.map((preset) => {
                const isSelected = settings.quality === preset.quality;
                return (
                  <button
                    key={preset.quality}
                    type="button"
                    onClick={() => onQualityChange(preset.quality)}
                    disabled={disabled || isProcessing}
                    className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-[#6657FF]/10 border-[#6657FF] text-[#6657FF] dark:text-indigo-300 font-bold shadow-sm'
                        : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                    } ${disabled || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="font-semibold truncate">{preset.label}</span>
                      {isSelected && <Check className="w-3 h-3 shrink-0 ml-1" />}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {preset.quality}%
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: BY TARGET FILE SIZE */}
      {settings.mode === 'targetSize' && (
        <div className="space-y-5 animate-fade-in">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Compress to Under
              </span>
              <span className="text-sm font-mono font-bold text-[#6657FF] bg-[#6657FF]/10 dark:bg-[#6657FF]/20 px-3 py-0.5 rounded-full border border-[#6657FF]/20">
                &lt; {settings.targetSizeKb && settings.targetSizeKb >= 1024
                  ? `${(settings.targetSizeKb / 1024).toFixed(1)} MB`
                  : `${settings.targetSizeKb || 200} KB`}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Target maximum output file size. Zorli will optimize quality and dimensions to fit under this limit.
            </p>
          </div>

          {/* Custom Size Input */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                min="10"
                max="50000"
                value={customInputVal}
                onChange={(e) => handleCustomInputChange(e.target.value)}
                disabled={disabled || isProcessing}
                placeholder="200"
                aria-label="Custom target size"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-mono font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6657FF]"
              />
            </div>
            <div className="flex rounded-xl bg-slate-200/80 dark:bg-white/10 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleUnitToggle('KB')}
                disabled={disabled || isProcessing}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  customUnit === 'KB'
                    ? 'bg-white dark:bg-[#6657FF] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                KB
              </button>
              <button
                type="button"
                onClick={() => handleUnitToggle('MB')}
                disabled={disabled || isProcessing}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  customUnit === 'MB'
                    ? 'bg-white dark:bg-[#6657FF] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                MB
              </button>
            </div>
          </div>

          {/* Quick Target Size Chips */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
              Popular Size Targets
            </label>
            <div className="flex flex-wrap gap-2">
              {TARGET_SIZE_PRESETS.map((preset) => {
                const isSelected = settings.targetSizeKb === preset.kb;
                return (
                  <button
                    key={preset.kb}
                    type="button"
                    onClick={() => {
                      onTargetSizeChange(preset.kb);
                      if (preset.kb >= 1024) {
                        setCustomInputVal(String(preset.kb / 1024));
                        setCustomUnit('MB');
                      } else {
                        setCustomInputVal(String(preset.kb));
                        setCustomUnit('KB');
                      }
                    }}
                    disabled={disabled || isProcessing}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-[#6657FF] text-white border-[#6657FF] shadow-sm'
                        : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Output Format Selector */}
      {onFormatChange && (
        <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-white/10">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            Output Format
          </label>
          <div className="grid grid-cols-4 gap-1.5 text-xs">
            {(
              [
                { id: 'original', label: 'Original' },
                { id: 'jpeg', label: 'JPG' },
                { id: 'png', label: 'PNG' },
                { id: 'webp', label: 'WebP' },
              ] as const
            ).map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => onFormatChange(fmt.id)}
                disabled={disabled || isProcessing}
                className={`py-1.5 px-2 rounded-lg text-center font-medium transition-all border cursor-pointer ${
                  settings.outputFormat === fmt.id
                    ? 'bg-[#6657FF] text-white border-[#6657FF]'
                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Privacy Guarantee Note */}
      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed bg-white/60 dark:bg-white/[0.02] p-3 rounded-xl border border-slate-200/60 dark:border-white/5">
        <Sparkles className="w-3.5 h-3.5 text-[#6657FF] inline mr-1 -mt-0.5" />
        Configure your desired settings, then click{' '}
        <strong className="text-slate-700 dark:text-slate-200">"Compress Images"</strong> to start.
      </div>
    </div>
  );
};
