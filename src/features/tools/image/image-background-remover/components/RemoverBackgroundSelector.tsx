import React from 'react';
import { BackgroundMode, ModelChoice } from '../types';
import { Palette, Check, Sliders, Sparkles, Wand2, ShieldAlert, Cpu, RefreshCw } from 'lucide-react';

interface RemoverBackgroundSelectorProps {
  currentMode: BackgroundMode;
  customColor: string;
  onSelectMode: (mode: BackgroundMode, color?: string) => void;
  cleanlinessThreshold?: number;
  onCleanlinessChange?: (threshold: number) => void;
  currentModel?: ModelChoice;
  onModelChange?: (model: ModelChoice, reprocess?: boolean) => void;
  isProcessing?: boolean;
  disabled?: boolean;
}

const PRESET_COLORS = [
  { name: 'Royal Blue', hex: '#2563EB' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Rose', hex: '#E11D48' },
  { name: 'Warm Amber', hex: '#D97706' },
  { name: 'Violet', hex: '#7C3AED' },
  { name: 'Slate Grey', hex: '#475569' },
];

const CLEANLINESS_PRESETS = [
  {
    label: 'Soft & Hair',
    value: 15,
    description: 'Preserves delicate flyaways, fuzzy edges & soft fur',
  },
  {
    label: 'Balanced',
    value: 35,
    description: 'Recommended. Cleans floor shadows & standard background haze',
  },
  {
    label: 'Aggressive Cutout',
    value: 60,
    description: 'Erases stubborn background patches, hard shadows & textures',
  },
];

export const RemoverBackgroundSelector: React.FC<RemoverBackgroundSelectorProps> = ({
  currentMode,
  customColor,
  onSelectMode,
  cleanlinessThreshold = 35,
  onCleanlinessChange,
  currentModel = 'rmbg',
  onModelChange,
  isProcessing = false,
  disabled = false,
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-6">
      {/* 1. Background Style Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-400" />
            Background Style
          </label>
          <span className="text-xs text-slate-400">
            Instant update &bull; Zero delay
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Transparent Button */}
          <button
            type="button"
            disabled={disabled || isProcessing}
            onClick={() => onSelectMode('transparent')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
              currentMode === 'transparent'
                ? 'border-indigo-500 bg-indigo-500/15 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
            }`}
          >
            <div className="w-4 h-4 rounded border border-slate-600 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[size:6px_6px] bg-[position:0_0,0_3px,3px_-3px,-3px_0px]" />
            Transparent
          </button>

          {/* Pure White Button */}
          <button
            type="button"
            disabled={disabled || isProcessing}
            onClick={() => onSelectMode('white')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
              currentMode === 'white'
                ? 'border-indigo-500 bg-indigo-500/15 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
            }`}
          >
            <div className="w-4 h-4 rounded border border-slate-300 bg-white" />
            Pure White
          </button>

          {/* Pure Black Button */}
          <button
            type="button"
            disabled={disabled || isProcessing}
            onClick={() => onSelectMode('black')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
              currentMode === 'black'
                ? 'border-indigo-500 bg-indigo-500/15 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
            }`}
          >
            <div className="w-4 h-4 rounded border border-slate-700 bg-black" />
            Pure Black
          </button>

          {/* Custom Color Button */}
          <button
            type="button"
            disabled={disabled || isProcessing}
            onClick={() => onSelectMode('custom', customColor)}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
              currentMode === 'custom'
                ? 'border-indigo-500 bg-indigo-500/15 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
            }`}
          >
            <div
              className="w-4 h-4 rounded border border-white/20"
              style={{ backgroundColor: customColor }}
            />
            Custom Color
          </button>
        </div>

        {/* Custom Color Palette details */}
        {currentMode === 'custom' && (
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Quick Swatches:</span>
            <div className="flex flex-wrap items-center gap-2">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset.hex}
                  type="button"
                  title={preset.name}
                  onClick={() => onSelectMode('custom', preset.hex)}
                  className="w-7 h-7 rounded-full border border-white/20 transition-transform hover:scale-110 flex items-center justify-center"
                  style={{ backgroundColor: preset.hex }}
                >
                  {customColor.toLowerCase() === preset.hex.toLowerCase() && (
                    <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <label className="text-xs text-slate-400">Custom Hex:</label>
              <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => onSelectMode('custom', e.target.value)}
                  className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
                />
                <span className="text-xs font-mono text-slate-200 uppercase">
                  {customColor}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Cleanliness & Edge Refinement Section */}
      {onCleanlinessChange && (
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-white tracking-tight">
                Cleanliness & Edge Refinement
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {cleanlinessThreshold}%
              </span>
            </div>
            <span className="text-xs text-slate-400">
              Real-time &bull; Removes leftover areas & shadows
            </span>
          </div>

          {/* Quick Presets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {CLEANLINESS_PRESETS.map((preset) => {
              const isSelected = Math.abs(cleanlinessThreshold - preset.value) <= 5;
              return (
                <button
                  key={preset.value}
                  type="button"
                  disabled={disabled || isProcessing}
                  onClick={() => onCleanlinessChange(preset.value)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                      : 'border-slate-800 bg-slate-800/30 hover:border-slate-700 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                      {preset.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {preset.value}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Interactive Range Slider */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0% (Soft Edges / Hair)</span>
              <span>35% (Balanced)</span>
              <span>100% (Aggressive Cutout)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={cleanlinessThreshold}
              disabled={disabled || isProcessing}
              onChange={(e) => onCleanlinessChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Helpful Tip Box */}
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-2.5 text-xs text-slate-300">
            <Wand2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Leaving stubborn background areas or shadows?</strong> Select{' '}
              <button
                type="button"
                onClick={() => onCleanlinessChange(60)}
                className="text-emerald-400 font-semibold underline underline-offset-2 hover:text-emerald-300"
              >
                Aggressive Cutout (60%)
              </button>{' '}
              or slide higher to completely wipe unwanted remnants with zero delay.
            </span>
          </div>
        </div>
      )}

      {/* 3. AI Model Engine Section */}
      {onModelChange && (
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              AI Model Engine
            </label>
            <span className="text-xs text-slate-400">
              On-device WebGPU / WASM
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* RMBG-1.4 Button */}
            <button
              type="button"
              disabled={disabled || isProcessing}
              onClick={() => onModelChange('rmbg', currentModel !== 'rmbg')}
              className={`p-3 rounded-xl border text-left transition-all relative ${
                currentModel === 'rmbg'
                  ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  : 'border-slate-800 bg-slate-800/30 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  BRIA RMBG-1.4
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-medium">
                  Ultra-Clean
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Highest quality &bull; Crisp product & studio cutouts
              </p>
            </button>

            {/* IS-Net Button */}
            <button
              type="button"
              disabled={disabled || isProcessing}
              onClick={() => onModelChange('isnet', currentModel !== 'isnet')}
              className={`p-3 rounded-xl border text-left transition-all ${
                currentModel === 'isnet'
                  ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  : 'border-slate-800 bg-slate-800/30 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  IS-Net
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                  General
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Dichotomous image segmentation for everyday photos
              </p>
            </button>

            {/* MODNet Button */}
            <button
              type="button"
              disabled={disabled || isProcessing}
              onClick={() => onModelChange('modnet', currentModel !== 'modnet')}
              className={`p-3 rounded-xl border text-left transition-all ${
                currentModel === 'modnet'
                  ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  : 'border-slate-800 bg-slate-800/30 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  MODNet
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                  Fast
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Lightweight portrait & person matting (6.6MB)
              </p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
