import React, { useState } from 'react';
import {
  Sliders,
  Percent,
  Share2,
  Globe,
  Lock,
  Unlock,
  Play,
  Loader2,
  Check,
  CheckCircle2,
  ArrowRight,
  Info,
  ChevronDown,
} from 'lucide-react';
import { ResizeMode, ResizeSettings, ResizedImageItem } from '../types';
import { PRESET_DIMENSIONS, SOCIAL_PLATFORMS } from '../lib/resizer';

interface ResizerSettingsProps {
  settings: ResizeSettings;
  primaryFile?: ResizedImageItem;
  totalFilesCount: number;
  onModeChange: (mode: ResizeMode) => void;
  onPlatformChange?: (platformId: string) => void;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
  onToggleLockRatio: () => void;
  onPercentageChange: (percentage: number) => void;
  onPresetChange: (presetId: string) => void;
  onPresetFitModeChange: (fitMode: 'fit' | 'stretch') => void;
  onToggleDontEnlarge: () => void;
  onQualityChange: (quality: number) => void;
  onResizeClick: () => void;
  isProcessing: boolean;
  hasFilesToResize: boolean;
  disabled?: boolean;
}

export const ResizerSettingsComponent: React.FC<ResizerSettingsProps> = ({
  settings,
  primaryFile,
  totalFilesCount,
  onModeChange,
  onPlatformChange,
  onWidthChange,
  onHeightChange,
  onToggleLockRatio,
  onPercentageChange,
  onPresetChange,
  onPresetFitModeChange,
  onToggleDontEnlarge,
  onQualityChange,
  onResizeClick,
  isProcessing,
  hasFilesToResize,
  disabled = false,
}) => {
  const [showOverride, setShowOverride] = useState(false);
  const percentageOptions = [25, 50, 75, 100, 125, 150];

  const socialPresets = PRESET_DIMENSIONS.filter((p) => p.category === 'social');
  const webPresets = PRESET_DIMENSIONS.filter(
    (p) => p.category === 'web' || p.category === 'common'
  );

  const activeMode: ResizeMode =
    settings.mode === 'preset' ? 'social' : settings.mode;

  const currentPlatformId = settings.socialPlatformId || 'youtube';
  const currentPlatform =
    SOCIAL_PLATFORMS.find((p) => p.id === currentPlatformId) ||
    SOCIAL_PLATFORMS.find((p) => p.presets.some((pr) => pr.id === settings.presetId)) ||
    SOCIAL_PLATFORMS[0];

  const currentPreset =
    currentPlatform.presets.find((p) => p.id === settings.presetId) ||
    currentPlatform.presets[0];

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-6">
      {/* Step 1 / Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
        <div>
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
            Resize Mode
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            What do you want to resize for?
          </p>
        </div>
        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
          Step 2 of 3
        </span>
      </div>

      {/* 4 High-Level Visual Task Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Option 1: Custom Dimensions */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onModeChange('custom')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeMode === 'custom'
              ? 'bg-emerald-500/10 border-emerald-500 text-slate-900 dark:text-white ring-1 ring-emerald-500 shadow-sm'
              : 'bg-white dark:bg-[#070B24] border-slate-200 dark:border-white/10 hover:border-emerald-500/40 text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                activeMode === 'custom'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
            </div>
            {activeMode === 'custom' && <Check className="w-4 h-4 text-emerald-500" />}
          </div>
          <div>
            <span className="text-xs font-bold block font-display">Exact Pixels</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight block mt-0.5">
              Set width & height
            </span>
          </div>
        </button>

        {/* Option 2: Percentage */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onModeChange('percentage')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeMode === 'percentage'
              ? 'bg-emerald-500/10 border-emerald-500 text-slate-900 dark:text-white ring-1 ring-emerald-500 shadow-sm'
              : 'bg-white dark:bg-[#070B24] border-slate-200 dark:border-white/10 hover:border-emerald-500/40 text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                activeMode === 'percentage'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
            </div>
            {activeMode === 'percentage' && <Check className="w-4 h-4 text-emerald-500" />}
          </div>
          <div>
            <span className="text-xs font-bold block font-display">Percentage</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight block mt-0.5">
              Scale up or down %
            </span>
          </div>
        </button>

        {/* Option 3: Social Media */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onModeChange('social')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeMode === 'social'
              ? 'bg-emerald-500/10 border-emerald-500 text-slate-900 dark:text-white ring-1 ring-emerald-500 shadow-sm'
              : 'bg-white dark:bg-[#070B24] border-slate-200 dark:border-white/10 hover:border-emerald-500/40 text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                activeMode === 'social'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
            </div>
            {activeMode === 'social' && <Check className="w-4 h-4 text-emerald-500" />}
          </div>
          <div>
            <span className="text-xs font-bold block font-display">Social Media</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight block mt-0.5">
              Instagram, YT, FB, LinkedIn
            </span>
          </div>
        </button>

        {/* Option 4: Web */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onModeChange('web')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeMode === 'web'
              ? 'bg-emerald-500/10 border-emerald-500 text-slate-900 dark:text-white ring-1 ring-emerald-500 shadow-sm'
              : 'bg-white dark:bg-[#070B24] border-slate-200 dark:border-white/10 hover:border-emerald-500/40 text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                activeMode === 'web'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
            </div>
            {activeMode === 'web' && <Check className="w-4 h-4 text-emerald-500" />}
          </div>
          <div>
            <span className="text-xs font-bold block font-display">Web & Display</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight block mt-0.5">
              Hero, blog & HD web sizes
            </span>
          </div>
        </button>
      </div>

      {/* DYNAMIC PROGRESSIVE CONTROLS ACCORDING TO SELECTED TASK */}
      <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 space-y-4">
        {/* TASK A: CUSTOM DIMENSIONS */}
        {activeMode === 'custom' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="resizer-width"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Width (px)
                </label>
                <input
                  id="resizer-width"
                  type="number"
                  min="1"
                  max="16384"
                  disabled={disabled}
                  value={settings.customWidth || ''}
                  onChange={(e) => onWidthChange(Number(e.target.value))}
                  className="w-full text-xs font-mono font-bold rounded-xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label
                  htmlFor="resizer-height"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Height (px)
                </label>
                <input
                  id="resizer-height"
                  type="number"
                  min="1"
                  max="16384"
                  disabled={disabled}
                  value={settings.customHeight || ''}
                  onChange={(e) => onHeightChange(Number(e.target.value))}
                  className="w-full text-xs font-mono font-bold rounded-xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Aspect Ratio Lock Toggle */}
            <button
              type="button"
              disabled={disabled}
              onClick={onToggleLockRatio}
              className={`w-full py-2 px-3 rounded-xl flex items-center justify-between text-xs font-medium border transition-colors cursor-pointer ${
                settings.lockAspectRatio
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span className="flex items-center gap-2">
                {settings.lockAspectRatio ? (
                  <Lock className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Unlock className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>
                  {settings.lockAspectRatio
                    ? '🔒 Aspect Ratio Locked'
                    : '🔓 Freeform Stretch (Unlocked)'}
                </span>
              </span>
              <span className="text-[10px] opacity-80">
                {settings.lockAspectRatio ? 'Preserves proportions' : 'Freeform'}
              </span>
            </button>
          </div>
        )}

        {/* TASK B: PERCENTAGE */}
        {activeMode === 'percentage' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Scale Target
                </label>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {settings.percentage}% of native size
                </span>
              </div>

              {/* Quick Percentage Chips */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {percentageOptions.map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    disabled={disabled}
                    onClick={() => onPercentageChange(pct)}
                    className={`py-2 px-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                      settings.percentage === pct
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-emerald-500/50'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>

              {/* Slider */}
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                disabled={disabled}
                value={settings.percentage}
                onChange={(e) => onPercentageChange(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                <span>10% (Tiny)</span>
                <span>50% (Half)</span>
                <span>100% (Native)</span>
                <span>200% (Double)</span>
              </div>
            </div>

            {primaryFile && (
              <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400">
                  {primaryFile.originalWidth} × {primaryFile.originalHeight} px
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {Math.round(primaryFile.originalWidth * (settings.percentage / 100))} ×{' '}
                  {Math.round(primaryFile.originalHeight * (settings.percentage / 100))} px
                </span>
              </div>
            )}
          </div>
        )}

        {/* TASK C: SOCIAL MEDIA PRESETS WITH TWO-TIER DROPDOWNS */}
        {activeMode === 'social' && (
          <div className="space-y-4">
            {/* 1. Social Media Platform Selector */}
            <div>
              <label
                htmlFor="social-platform-select"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Select Platform
              </label>
              <div className="relative">
                <select
                  id="social-platform-select"
                  disabled={disabled}
                  value={currentPlatform.id}
                  onChange={(e) => {
                    const nextPlatId = e.target.value;
                    if (onPlatformChange) {
                      onPlatformChange(nextPlatId);
                    } else {
                      const plat =
                        SOCIAL_PLATFORMS.find((p) => p.id === nextPlatId) ||
                        SOCIAL_PLATFORMS[0];
                      onPresetChange(plat.presets[0].id);
                    }
                  }}
                  className="w-full py-2.5 px-3.5 pr-10 text-xs font-semibold rounded-xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
                >
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <option
                      key={platform.id}
                      value={platform.id}
                      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-1"
                    >
                      {platform.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 2. Dynamic Format Selector */}
            <div>
              <label
                htmlFor="social-preset-select"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                What do you want to resize for?
              </label>
              <div className="relative">
                <select
                  id="social-preset-select"
                  disabled={disabled}
                  value={currentPreset.id}
                  onChange={(e) => onPresetChange(e.target.value)}
                  className="w-full py-2.5 px-3.5 pr-10 text-xs font-semibold rounded-xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
                >
                  {currentPlatform.presets.map((preset) => (
                    <option
                      key={preset.id}
                      value={preset.id}
                      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-1"
                    >
                      {preset.name} ({preset.width} × {preset.height} px — {preset.aspectRatioLabel})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {currentPreset.description && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {currentPreset.description}
                </p>
              )}
            </div>

            {/* 3. Recommended Size Display */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                  Recommended Size
                </span>
                <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                  {currentPreset.width} × {currentPreset.height} px
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">
                  Aspect Ratio
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  {currentPreset.aspectRatioLabel}
                </span>
              </div>
            </div>

            {/* 4. Preserve Manual Control: Optional Dimension Override */}
            <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Manual Adjustments
                </span>
                <button
                  type="button"
                  onClick={() => setShowOverride(!showOverride)}
                  className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer flex items-center gap-1"
                >
                  <Sliders className="w-3 h-3" />
                  <span>{showOverride ? 'Hide Override' : 'Override Dimensions'}</span>
                </button>
              </div>

              {showOverride && (
                <div className="p-3 rounded-2xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        Width (px)
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="16384"
                        disabled={disabled}
                        value={settings.customWidth || currentPreset.width}
                        onChange={(e) => onWidthChange(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        Height (px)
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="16384"
                        disabled={disabled}
                        value={settings.customHeight || currentPreset.height}
                        onChange={(e) => onHeightChange(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={disabled}
                    onClick={onToggleLockRatio}
                    className={`w-full py-1.5 px-2.5 rounded-xl flex items-center justify-between text-[11px] font-medium border transition-colors cursor-pointer ${
                      settings.lockAspectRatio
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {settings.lockAspectRatio ? (
                        <Lock className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Unlock className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span>
                        {settings.lockAspectRatio
                          ? '🔒 Aspect Ratio Locked'
                          : '🔓 Unlocked Freeform'}
                      </span>
                    </span>
                    <span className="text-[10px] opacity-80">
                      {settings.lockAspectRatio ? 'Preserves proportions' : 'Freeform'}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* 5. Framing & Proportions: Fit vs Stretch */}
            <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Framing & Proportions
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Zero silent crops
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onPresetFitModeChange('fit')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    settings.presetFitMode === 'fit'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-200 ring-1 ring-emerald-500'
                      : 'bg-white dark:bg-[#070B24] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold block">Fit Proportionally</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    No distortion (recommended)
                  </span>
                </button>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onPresetFitModeChange('stretch')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    settings.presetFitMode === 'stretch'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-200 ring-1 ring-emerald-500'
                      : 'bg-white dark:bg-[#070B24] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold block">Exact Stretch</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    Forces canvas dimensions
                  </span>
                </button>
              </div>

              {primaryFile && primaryFile.originalWidth > 0 && (
                <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    {settings.presetFitMode === 'fit'
                      ? `Your image (${primaryFile.originalWidth} × ${primaryFile.originalHeight}) will scale to fit inside the ${currentPreset.width} × ${currentPreset.height} boundary without distortion or cropping.`
                      : `Your image will stretch to exactly ${currentPreset.width} × ${currentPreset.height}. Non-matching aspect ratios will be stretched.`}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TASK D: WEB & DISPLAY */}
        {activeMode === 'web' && (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Select Web & Display Format
            </label>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {webPresets.map((preset) => {
                const isSelected = settings.presetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => onPresetChange(preset.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-emerald-500'
                        : 'bg-white dark:bg-[#070B24] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
                        {preset.name}
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                      </span>
                      {preset.aspectRatioLabel && (
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                          {preset.aspectRatioLabel}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {preset.label} px
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                        {preset.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Distinguish Resize vs Crop: Fit vs Stretch */}
            <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 space-y-1.5">
              <span className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Framing & Proportions
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onPresetFitModeChange('fit')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    settings.presetFitMode === 'fit'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                      : 'bg-white dark:bg-[#070B24] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold block">Fit (Proportional)</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    No distortion (recommended)
                  </span>
                </button>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onPresetFitModeChange('stretch')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    settings.presetFitMode === 'stretch'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                      : 'bg-white dark:bg-[#070B24] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold block">Exact Stretch</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    Forces canvas dimensions
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ALWAYS VISIBLE LIVE BEFORE / AFTER RESULT PREVIEW */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Preview Transformation
          </span>
          {totalFilesCount > 1 && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Applying to all {totalFilesCount} images
            </span>
          )}
        </div>

        <div className="flex items-center justify-between font-mono text-xs">
          <div className="min-w-0">
            <span className="text-[10px] font-sans text-slate-400 block">Original</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {primaryFile && primaryFile.originalWidth > 0
                ? `${primaryFile.originalWidth} × ${primaryFile.originalHeight} px`
                : 'Upload image'}
            </span>
          </div>

          <ArrowRight className="w-4 h-4 text-emerald-500 shrink-0 mx-2" />

          <div className="text-right min-w-0">
            <span className="text-[10px] font-sans text-emerald-600 dark:text-emerald-400 block">
              Result
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {primaryFile && primaryFile.targetWidth > 0
                ? `${primaryFile.targetWidth} × ${primaryFile.targetHeight} px`
                : activeMode === 'custom'
                ? `${settings.customWidth} × ${settings.customHeight} px`
                : activeMode === 'social'
                ? `${currentPreset.width} × ${currentPreset.height} px`
                : 'Select options'}
            </span>
          </div>
        </div>
      </div>

      {/* UNIVERSAL SAFEGUARDS & QUALITY */}
      <div className="space-y-3 pt-2 border-t border-slate-200/80 dark:border-white/10">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            disabled={disabled}
            checked={settings.dontEnlarge}
            onChange={onToggleDontEnlarge}
            className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-500 cursor-pointer"
          />
          <div>
            <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
              Don't enlarge smaller images
            </span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              Prevents pixelation by clamping images smaller than target.
            </span>
          </div>
        </label>
      </div>

      {/* PRIMARY ACTION CTA */}
      <button
        type="button"
        disabled={disabled || !hasFilesToResize || isProcessing}
        onClick={onResizeClick}
        className={`w-full py-3.5 px-5 rounded-2xl font-bold font-display text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
          hasFilesToResize && !isProcessing
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-emerald-500/25 active:scale-[0.98]'
            : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
        }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Resizing Images in Browser...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            <span>
              {totalFilesCount > 1
                ? `Resize All ${totalFilesCount} Images`
                : 'Resize Image'}
            </span>
          </>
        )}
      </button>
    </div>
  );
};
