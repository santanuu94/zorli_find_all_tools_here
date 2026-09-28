import React from 'react';
import { ToolComponentProps } from '../../types';
import { ToolWorkspace } from '../../common/ToolWorkspace';
import { useImageConverter } from './hooks/useImageConverter';
import { ConverterUploadArea } from './components/ConverterUploadArea';
import { ConverterSettings } from './components/ConverterSettings';
import { ConverterCard } from './components/ConverterCard';
import { ConverterPreviewModal } from './components/ConverterPreviewModal';
import { Trash2, Download, Play, Loader2, Sparkles, FolderArchive } from 'lucide-react';
import { formatFileSize } from './utils/format-file-size';

export const ImageConverter: React.FC<ToolComponentProps> = () => {
  const {
    globalSettings,
    updateGlobalFormat,
    updateGlobalQuality,
    updateGlobalBackgroundColor,
    updateItemFormat,
    files,
    addFiles,
    removeFile,
    clearFiles,
    startConversion,
    downloadFile,
    downloadAll,
    isProcessing,
    previewItem,
    setPreviewItem,
  } = useImageConverter();

  const completedFiles = files.filter((f) => f.status === 'done' && f.outputBlob);
  const pendingFiles = files.filter(
    (f) =>
      f.status === 'pending' ||
      (f.status === 'done' && f.targetFormat !== f.outputFormat)
  );
  const sameFormatFiles = files.filter((f) => f.status === 'same-format');
  const hasFilesToConvert = files.some(
    (f) => f.status !== 'error' && f.status !== 'same-format' && f.file
  );

  return (
    <>
      <ToolWorkspace
        title="In-Browser Image Converter Studio"
        badge="100% Free & Private"
        statusText="High-fidelity client-side format conversion. Zero server uploads, your files never leave your device."
        sidebar={
          <div className="space-y-4">
            <ConverterSettings
              settings={globalSettings}
              totalFilesCount={files.length}
              readyFilesCount={pendingFiles.length}
              sameFormatFilesCount={sameFormatFiles.length}
              onFormatChange={updateGlobalFormat}
              onQualityChange={updateGlobalQuality}
              onBackgroundColorChange={updateGlobalBackgroundColor}
              onConvertClick={startConversion}
              isProcessing={isProcessing}
              hasFilesToConvert={hasFilesToConvert}
              disabled={isProcessing}
            />

            {/* Completed Session Summary Card */}
            {completedFiles.length > 0 && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-transparent border border-rose-500/20 text-slate-800 dark:text-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    Conversion Completed
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                      Converted Files
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
                        completedFiles.reduce((acc, it) => acc + (it.outputSize || 0), 0)
                      )}
                    </span>
                  </div>
                </div>

                {completedFiles.length > 1 && (
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={downloadAll}
                    className="w-full mt-4 py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-rose-500/20 transition-all cursor-pointer disabled:opacity-50"
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
          <ConverterUploadArea onFilesSelected={addFiles} disabled={isProcessing} />

          {/* Queue & File Cards */}
          {files.length > 0 && (
            <div className="space-y-4 pt-2">
              {/* Action Banner when pending files are ready to convert */}
              {pendingFiles.length > 0 && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/15 via-pink-500/10 to-rose-500/5 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {pendingFiles.length === 1
                          ? '1 image ready to convert'
                          : `${pendingFiles.length} images ready to convert`}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <span>Target format:</span>
                        <span className="font-bold uppercase text-rose-600 dark:text-rose-400">
                          {globalSettings.targetFormat}
                        </span>
                        {globalSettings.targetFormat !== 'png' && (
                          <span>({globalSettings.quality}% quality)</span>
                        )}
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
                      disabled={!hasFilesToConvert || isProcessing}
                      onClick={startConversion}
                      className="py-2 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Converting...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Convert Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Batch Format Banner */}
              {files.length > 1 && (
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-slate-600 dark:text-slate-400">
                      Converting <strong className="text-slate-900 dark:text-white">{files.length} images</strong> into:
                    </span>
                    <span className="font-bold uppercase font-mono text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded bg-rose-500/20">
                      .{globalSettings.targetFormat}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Target format and quality apply to all files
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
                      disabled={isProcessing}
                      onClick={downloadAll}
                      className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
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
                    className="text-xs text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>

              {/* File Cards List */}
              <div className="space-y-3">
                {files.map((item) => (
                  <ConverterCard
                    key={item.id}
                    item={item}
                    onRemove={removeFile}
                    onDownload={downloadFile}
                    onPreview={(it) => setPreviewItem(it)}
                    onFormatChange={updateItemFormat}
                    disabled={isProcessing}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ToolWorkspace>

      {/* Lightbox / Preview Modal */}
      <ConverterPreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
        onDownload={downloadFile}
      />
    </>
  );
};
export default ImageConverter;
