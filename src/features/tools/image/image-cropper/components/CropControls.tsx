import React from 'react';
import {
  Crop,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  RotateCcw as ResetIcon,
  Play,
  Loader2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Share2,
  Sliders,
  Eye,
} from 'lucide-react';
import { CroppedImageItem, CropTransformSettings, PixelCrop } from '../types';
import {
  ASPECT_RATIO_PRESETS,
  SOCIAL_PLATFORMS,
  SocialPlatform,
  SocialPreset,
} from '../lib/cropper';

interface CropControlsProps {
  item: CroppedImageItem;
  settings: CropTransformSettings;
  completedCrop: PixelCrop | undefined;
  onSetAspectRatio: (presetId: string) => void;
  onSetSocialPreset: (platformId: string, presetId: string) => void;
  onSetZoom: (zoom: number) => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  onReset: () => void;
  onCropClick: () => void;
  onSeeOutputClick: () => void;
  isProcessing: boolean;
  disabled?: boolean;
}

export const CropControls: React.FC<CropControlsProps> = ({
  item,
  settings,
  completedCrop,
  onSetAspectRatio,
  onSetSocialPreset,
  onSetZoom,
  onRotateLeft,
  onRotateRight,
  onFlipHorizontal,
  onFlipVertical,
  onReset,
  onCropClick,
  onSeeOutputClick,
  isProcessing,
  disabled = false,
}) => {
  const currentPlatform: SocialPlatform =
    SOCIAL_PLATFORMS.find((p) => p.id === settings.socialPlatformId) ||
    SOCIAL_PLATFORMS[0];

  const currentPreset: SocialPreset =
    currentPlatform.presets.find((pr) => pr.id === settings.socialPresetId) ||
    currentPlatform.presets[0];

  const cropW = completedCrop ? Math.round(completedCrop.width) : item.originalWidth;
  const cropH = completedCrop ? Math.round(completedCrop.height) : item.originalHeight;

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
        <div>
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-500" />
            <span>Crop Settings</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure composition, ratio, and orientation
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={disabled || isProcessing}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          title="Reset transforms and crop"
        >
          <ResetIcon className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Quick Aspect Ratio Presets */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
          Aspect Ratio
        </label>
        <div className="grid grid-cols-3 gap-2">
          {ASPECT_RATIO_PRESETS.map((preset) => {
            const isSelected =
              settings.aspectRatioId === preset.id && !settings.socialPlatformId;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSetAspectRatio(preset.id)}
                disabled={disabled || isProcessing}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 ring-2 ring-amber-500/30'
                    : 'bg-white dark:bg-[#070B24] border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-amber-500/40'
                } disabled:opacity-50`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Social Media Presets */}
      <div className="space-y-3 pt-2 border-t border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-1.5">
          <Share2 className="w-3.5 h-3.5 text-amber-500" />
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Crop for Social Media
          </label>
        </div>

        <div className="space-y-2">
          {/* Platform selector */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Platform
            </span>
            <select
              value={settings.socialPlatformId || ''}
              onChange={(e) => {
                const pId = e.target.value;
                if (!pId) {
                  onSetAspectRatio('free');
                } else {
                  const plat = SOCIAL_PLATFORMS.find((p) => p.id === pId);
                  if (plat && plat.presets.length > 0) {
                    onSetSocialPreset(pId, plat.presets[0].id);
                  }
                }
              }}
              disabled={disabled || isProcessing}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-white dark:bg-[#070B24] border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer disabled:opacity-50"
            >
              <option value="">Select Platform (Optional)...</option>
              {SOCIAL_PLATFORMS.map((plat) => (
                <option key={plat.id} value={plat.id}>
                  {plat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Format selector (shown when platform is selected) */}
          {settings.socialPlatformId && (
            <div className="flex flex-col gap-1 animate-in fade-in duration-200">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Format / Placement
              </span>
              <select
                value={settings.socialPresetId || currentPlatform.presets[0].id}
                onChange={(e) =>
                  onSetSocialPreset(currentPlatform.id, e.target.value)
                }
                disabled={disabled || isProcessing}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-white dark:bg-[#070B24] border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer disabled:opacity-50"
              >
                {currentPlatform.presets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name} ({preset.aspectRatioLabel})
                  </option>
                ))}
              </select>

              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 mt-1">
                <strong>Crop ratio:</strong> {currentPreset.aspectRatioLabel} ({currentPreset.description})
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Zoom Control */}
      <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-white/10">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Zoom
          </span>
          <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
            {Math.round(settings.zoom * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSetZoom(settings.zoom - 0.1)}
            disabled={disabled || isProcessing || settings.zoom <= 1}
            className="p-1.5 rounded-lg bg-white dark:bg-[#070B24] border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={settings.zoom}
            onChange={(e) => onSetZoom(parseFloat(e.target.value))}
            disabled={disabled || isProcessing}
            className="flex-1 h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-50"
            aria-label="Zoom slider"
          />

          <button
            type="button"
            onClick={() => onSetZoom(settings.zoom + 0.1)}
            disabled={disabled || isProcessing || settings.zoom >= 3}
            className="p-1.5 rounded-lg bg-white dark:bg-[#070B24] border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Rotate & Flip Controls */}
      <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-white/10">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
          Rotate & Flip
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={onRotateLeft}
            disabled={disabled || isProcessing}
            className="py-2 px-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#070B24] border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-amber-500/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            title="Rotate 90 degrees left"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            <span>90° Left</span>
          </button>

          <button
            type="button"
            onClick={onRotateRight}
            disabled={disabled || isProcessing}
            className="py-2 px-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#070B24] border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-amber-500/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            title="Rotate 90 degrees right"
          >
            <RotateCw className="w-3.5 h-3.5 text-amber-500" />
            <span>90° Right</span>
          </button>

          <button
            type="button"
            onClick={onFlipHorizontal}
            disabled={disabled || isProcessing}
            className={`py-2 px-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 ${
              settings.flipH
                ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400'
                : 'bg-white dark:bg-[#070B24] border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-amber-500/40'
            }`}
            title="Flip Horizontal"
          >
            <FlipHorizontal className="w-3.5 h-3.5 text-amber-500" />
            <span>Flip H</span>
          </button>

          <button
            type="button"
            onClick={onFlipVertical}
            disabled={disabled || isProcessing}
            className={`py-2 px-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 ${
              settings.flipV
                ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400'
                : 'bg-white dark:bg-[#070B24] border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-amber-500/40'
            }`}
            title="Flip Vertical"
          >
            <FlipVertical className="w-3.5 h-3.5 text-amber-500" />
            <span>Flip V</span>
          </button>
        </div>
      </div>

      {/* 5. Crop Dimensions Summary */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">Original Size:</span>
          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
            {item.originalWidth} × {item.originalHeight} px
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">Selected Crop:</span>
          <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
            {cropW} × {cropH} px
          </span>
        </div>
      </div>

      {/* 6. Primary Action Buttons */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={onSeeOutputClick}
          disabled={disabled || isProcessing}
          className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-300 dark:border-white/20 shadow-sm active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="See how the cropped output image looks, and download it if you like"
        >
          <Eye className="w-4 h-4 text-amber-500" />
          <span>See Output (Preview & Download)</span>
        </button>

        <button
          type="button"
          onClick={onCropClick}
          disabled={disabled || isProcessing}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Cropping Image...</span>
            </>
          ) : (
            <>
              <Crop className="w-4 h-4" />
              <span>Crop Image</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
