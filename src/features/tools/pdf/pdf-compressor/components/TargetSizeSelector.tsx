import React from 'react';
import { Target, Info, Sparkles } from 'lucide-react';
import { CustomTargetUnit, TargetPreset } from '../types';
import { TARGET_PRESET_LABELS } from '../lib/format-utils';

interface TargetSizeSelectorProps {
  selectedPreset: TargetPreset;
  customValue: number;
  customUnit: CustomTargetUnit;
  onSelectPreset: (preset: TargetPreset) => void;
  onChangeCustomValue: (value: number) => void;
  onChangeCustomUnit: (unit: CustomTargetUnit) => void;
  disabled?: boolean;
}

const PRESETS: TargetPreset[] = ['500kb', '1mb', '2mb', '5mb', '10mb'];

export const TargetSizeSelector: React.FC<TargetSizeSelectorProps> = ({
  selectedPreset,
  customValue,
  customUnit,
  onSelectPreset,
  onChangeCustomValue,
  onChangeCustomUnit,
  disabled = false,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-rose-500" />
          <span>Target File Size</span>
        </label>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Target goal for optimizer
        </span>
      </div>

      {/* Preset Buttons Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {PRESETS.map((preset) => {
          const isSelected = selectedPreset === preset;
          return (
            <button
              key={preset}
              type="button"
              disabled={disabled}
              onClick={() => onSelectPreset(preset)}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center border ${
                isSelected
                  ? 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/25 scale-[1.02]'
                  : 'bg-white dark:bg-[#0A0F30] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-rose-500/50 hover:bg-slate-50 dark:hover:bg-white/5'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {TARGET_PRESET_LABELS[preset]}
            </button>
          );
        })}

        {/* Custom Preset Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectPreset('custom')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center border ${
            selectedPreset === 'custom'
              ? 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/25 scale-[1.02]'
              : 'bg-white dark:bg-[#0A0F30] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-rose-500/50 hover:bg-slate-50 dark:hover:bg-white/5'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Custom
        </button>
      </div>

      {/* Custom Size Input Area */}
      {selectedPreset === 'custom' && (
        <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                Max Size:
              </span>
              <input
                type="number"
                min="0.1"
                step={customUnit === 'MB' ? '0.1' : '10'}
                value={customValue || ''}
                disabled={disabled}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChangeCustomValue(isNaN(val) ? 1 : Math.max(0.1, val));
                }}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#070B24] border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder={customUnit === 'MB' ? '2.0' : '2048'}
              />
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChangeCustomUnit('MB')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  customUnit === 'MB'
                    ? 'bg-rose-500 text-white border-rose-600'
                    : 'bg-white dark:bg-[#070B24] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                MB
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChangeCustomUnit('KB')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  customUnit === 'KB'
                    ? 'bg-rose-500 text-white border-rose-600'
                    : 'bg-white dark:bg-[#070B24] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                KB
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Honest Target Communication Note */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 text-[11px] text-slate-600 dark:text-slate-400">
        <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
        <span>
          <strong>Target size is a goal.</strong> The final size may vary depending on whether your PDF contains high-res photos, vector curves, or embedded fonts.
        </span>
      </div>
    </div>
  );
};
