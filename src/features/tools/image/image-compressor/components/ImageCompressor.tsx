import React from 'react';
import { ToolComponentProps } from '../../../types';
import { ToolWorkspace } from '../../../common/ToolWorkspace';
import { useImageCompressor } from '../hooks/useImageCompressor';
import { UploadArea } from './UploadArea';
import { CompressionSettingsComponent } from './CompressionSettings';
import { CompressionResult } from './CompressionResult';
import { DownloadButton } from './DownloadButton';
import { PreviewModal } from './PreviewModal';
import { Trash2, Sparkles, Image as ImageIcon, Play, HardDrive } from 'lucide-react';
import { formatFileSize } from '../utils/format-file-size';

export const ImageCompressor: React.FC<ToolComponentProps> = () => {
  const {
    settings,
    updateMode,
    updateQuality,
    updateTargetSizeKb,
    updateOutputFormat,
    startCompression,
    files,
    addFiles,
    removeFile,
    clearFiles,
    downloadFile,
    downloadAll,
    isProcessing,
    previewItem,
    setPreviewItem,
  } = useImageCompressor();

  const completedFiles = files.filter((f) => f.status === 'done' && f.compressedBlob);
  const pendingFiles = files.filter((f) => f.status === 'pending');
  const hasFilesToCompress = files.some((f) => f.status !== 'error' && f.file);

  // Calculate overall savings across all completed files
  const totalOriginalBytes = completedFiles.reduce((acc, f) => acc + f.originalSize, 0);
  const totalCompressedBytes = completedFiles.reduce(
    (acc, f) => acc + (f.compressedSize || f.originalSize),
    0
  );
  const totalSavedBytes = Math.max(0, totalOriginalBytes - totalCompressedBytes);
  const overallReduction =
    totalOriginalBytes > 0 && totalSavedBytes > 0
      ? Math.round((totalSavedBytes / totalOriginalBytes) * 1000) / 10
      : 0;

  return (
    <>
      <ToolWorkspace
        title="In-Browser Image Compression Studio"
        badge="100% Free & Private"
        statusText="Images are processed locally using your device's browser engine. Zero server uploads."
        sidebar={
          <div className="space-y-4">
            <CompressionSettingsComponent
              settings={settings}
              onModeChange={updateMode}
              onQualityChange={updateQuality}
              onTargetSizeChange={updateTargetSizeKb}
              onFormatChange={updateOutputFormat}
              onCompressClick={() => startCompression()}
              isProcessing={isProcessing}
              hasFilesToCompress={hasFilesToCompress}
              disabled={isProcessing}
            />

            {/* Total savings summary box when multiple files are processed */}
            {completedFiles.length > 0 && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 text-slate-800 dark:text-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#6657FF]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#6657FF]">
                    Session Savings
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                      Original Total
                    </span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {formatFileSize(totalOriginalBytes)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                      Compressed Total
                    </span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {formatFileSize(totalCompressedBytes)}
                    </span>
                  </div>
                </div>
                {overallReduction > 0 && (
                  <div className="mt-3 pt-3 border-t border-indigo-500/20 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      Space Saved
                    </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {formatFileSize(totalSavedBytes)} (-{overallReduction}%)
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        }
      >
        <div className="space-y-6">
          <UploadArea onFilesSelected={addFiles} disabled={isProcessing} />

          {files.length > 0 && (
            <div className="space-y-4 pt-2">
              {/* Action Banner when files are ready to compress */}
              {pendingFiles.length > 0 && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-indigo-500/5 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#6657FF] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {pendingFiles.length} {pendingFiles.length === 1 ? 'image' : 'images'} ready to compress
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {settings.mode === 'targetSize'
                          ? `Compressing to under ${settings.targetSizeKb} KB`
                          : `Compressing at ${settings.quality}% quality`}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => startCompression()}
                    disabled={isProcessing}
                    aria-label="Start compression"
                    className="px-6 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-[#6657FF] hover:bg-[#5848EE] text-white shadow-md shadow-[#6657FF]/30 active:scale-95 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Compress Now</span>
                  </button>
                </div>
              )}

              {/* Files Queue Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#6657FF]" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    Uploaded Images ({files.length})
                  </span>
                  {completedFiles.length > 0 && (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {completedFiles.length} ready
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Primary Compress / Re-compress Button */}
                  {hasFilesToCompress && (
                    <button
                      type="button"
                      onClick={() => startCompression()}
                      disabled={isProcessing}
                      aria-label="Compress images"
                      className={`px-4 py-2 rounded-xl font-display font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        pendingFiles.length > 0
                          ? 'bg-[#6657FF] hover:bg-[#5848EE] text-white shadow-md shadow-[#6657FF]/25 active:scale-95'
                          : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-[#6657FF] dark:text-indigo-300 border border-indigo-500/20'
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                          <span>Compressing...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>{pendingFiles.length > 0 ? 'Compress' : 'Re-compress'}</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={clearFiles}
                    disabled={isProcessing}
                    aria-label="Clear all uploaded images"
                    className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>

                  <DownloadButton
                    onClick={downloadAll}
                    disabled={completedFiles.length === 0}
                    count={completedFiles.length}
                  />
                </div>
              </div>

              <CompressionResult
                files={files}
                onRemove={removeFile}
                onDownload={downloadFile}
                onPreview={(item) => setPreviewItem(item)}
              />
            </div>
          )}
        </div>
      </ToolWorkspace>

      {/* Before/After Image Preview Modal */}
      {previewItem && (
        <PreviewModal
          item={previewItem}
          onClose={() => setPreviewItem(null)}
          onDownload={downloadFile}
        />
      )}
    </>
  );
};
