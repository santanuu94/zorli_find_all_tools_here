import React from 'react';
import { ToolComponentProps } from '../../../types';
import { ToolWorkspace } from '../../../common/ToolWorkspace';
import { useImageResizer } from '../hooks/useImageResizer';
import { ResizerUploadArea } from './ResizerUploadArea';
import { ResizerSettingsComponent } from './ResizerSettings';
import { ResizerCard } from './ResizerCard';
import { ResizerPreviewModal } from './ResizerPreviewModal';
import { Trash2, Download, Play, Loader2, Sparkles, FolderArchive } from 'lucide-react';
import { formatFileSize } from '../utils/format-file-size';
import { SOCIAL_PLATFORMS, PRESET_DIMENSIONS } from '../lib/resizer';

export const ImageResizer: React.FC<ToolComponentProps> = () => {
  const {
    settings,
    updateMode,
    updateSocialPlatform,
    updateCustomWidth,
    updateCustomHeight,
    toggleLockRatio,
    updatePercentage,
    updatePreset,
    updatePresetFitMode,
    updateCanvasBackground,
    toggleDontEnlarge,
    updateQuality,
    files,
    addFiles,
    removeFile,
    clearFiles,
    startResizing,
    downloadFile,
    downloadAll,
    isProcessing,
    previewItem,
    setPreviewItem,
  } = useImageResizer();

  const completedFiles = files.filter(
    (f) =>
      f.status === 'done' &&
      f.outputBlob &&
      f.targetWidth === f.outputWidth &&
      f.targetHeight === f.outputHeight
  );
  const pendingFiles = files.filter(
    (f) =>
      f.status === 'pending' ||
      (f.status === 'done' &&
        (f.targetWidth !== f.outputWidth || f.targetHeight !== f.outputHeight))
  );
  const hasFilesToResize = files.some((f) => f.status !== 'error' && f.file);

  const currentPlatform =
    SOCIAL_PLATFORMS.find((p) => p.id === settings.socialPlatformId) ||
    SOCIAL_PLATFORMS.find((p) => p.presets.some((pr) => pr.id === settings.presetId)) ||
    SOCIAL_PLATFORMS[0];
  const currentPreset =
    currentPlatform.presets.find((p) => p.id === settings.presetId) ||
    PRESET_DIMENSIONS.find((p) => p.id === settings.presetId) ||
    currentPlatform.presets[0];

  return (
    <>
      <ToolWorkspace
        title="In-Browser Image Resizing Studio"
        badge="100% Free & Private"
        statusText="High-performance client-side scaling with aspect-ratio preservation. Zero server uploads."
        sidebar={
          <div className="space-y-4">
            <ResizerSettingsComponent
              settings={settings}
              primaryFile={files[0]}
              totalFilesCount={files.length}
              onModeChange={updateMode}
              onPlatformChange={updateSocialPlatform}
              onWidthChange={updateCustomWidth}
              onHeightChange={updateCustomHeight}
              onToggleLockRatio={toggleLockRatio}
              onPercentageChange={updatePercentage}
              onPresetChange={updatePreset}
              onPresetFitModeChange={updatePresetFitMode}
              onCanvasBackgroundChange={updateCanvasBackground}
              onToggleDontEnlarge={toggleDontEnlarge}
              onQualityChange={updateQuality}
              onResizeClick={startResizing}
              isProcessing={isProcessing}
              hasFilesToResize={hasFilesToResize}
              disabled={isProcessing}
            />

            {/* Completed Session Summary Card */}
            {completedFiles.length > 0 && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 text-slate-800 dark:text-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Resizing Completed
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                      Processed Files
                    </span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {completedFiles.length} of {files.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                      Total Output Size
                    </span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {formatFileSize(
                        completedFiles.reduce((acc, f) => acc + (f.outputSize || 0), 0)
                      )}
                    </span>
                  </div>
                </div>

                {completedFiles.length > 1 && (
                  <button
                    type="button"
                    onClick={downloadAll}
                    className="w-full mt-4 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <FolderArchive className="w-4 h-4" />
                    <span>Download All ({completedFiles.length} Images as ZIP)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        }
      >
        <div className="space-y-6">
          {/* Upload Dropzone */}
          <ResizerUploadArea onFilesSelected={addFiles} disabled={isProcessing} />

          {/* Queue & File Cards */}
          {files.length > 0 && (
            <div className="space-y-4 pt-2">
              {/* Action Banner when pending files are ready to resize */}
              {pendingFiles.length > 0 && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/5 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {pendingFiles.length === 1
                          ? '1 image ready to resize'
                          : `${pendingFiles.length} images ready to resize`}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {settings.mode === 'percentage'
                          ? `Scale to ${settings.percentage}% of native size`
                          : settings.mode === 'social'
                          ? `Social Preset: ${currentPlatform.name} — ${currentPreset.name} (${currentPreset.width} × ${currentPreset.height} px)`
                          : settings.mode === 'web' || settings.mode === 'preset'
                          ? `Preset: ${currentPreset.name} (${currentPreset.width} × ${currentPreset.height} px)`
                          : `Target: ${settings.customWidth} × ${settings.customHeight} px`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={clearFiles}
                      className="py-2 px-3 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={startResizing}
                      className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Resize Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Batch Preset Notification when multiple files are in queue */}
              {files.length > 1 && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-slate-600 dark:text-slate-400">
                      Preset applied to all <strong className="text-slate-900 dark:text-white">{files.length} images</strong>:
                    </span>
                    <span className="font-bold font-mono text-emerald-700 dark:text-emerald-300">
                      {settings.mode === 'social'
                        ? `${currentPlatform.name} — ${currentPreset.name} (${currentPreset.width} × ${currentPreset.height} px)`
                        : settings.mode === 'web' || settings.mode === 'preset'
                        ? `${currentPreset.name} (${currentPreset.width} × ${currentPreset.height} px)`
                        : settings.mode === 'percentage'
                        ? `${settings.percentage}% Scale`
                        : `${settings.customWidth} × ${settings.customHeight} px`}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Change anytime in Settings
                  </span>
                </div>
              )}

              {/* Queue Controls Bar */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Images Queue ({files.length})
                </span>
                <div className="flex items-center gap-3">
                  {completedFiles.length > 0 && (
                    <button
                      type="button"
                      onClick={downloadAll}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>
                        Download All ({completedFiles.length})
                      </span>
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={clearFiles}
                    className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>

              {/* File Cards List */}
              <div className="space-y-3">
                {files.map((item) => (
                  <ResizerCard
                    key={item.id}
                    item={item}
                    onRemove={removeFile}
                    onDownload={downloadFile}
                    onPreview={(it) => setPreviewItem(it)}
                    disabled={isProcessing}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ToolWorkspace>

      {/* Lightbox / Preview Modal */}
      <ResizerPreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
        onDownload={downloadFile}
      />
    </>
  );
};
