import React from 'react';
import {
  FileText,
  Sliders,
  Trash2,
  Sparkles,
  Shield,
  ArrowRight,
  AlertCircle,
  HardDrive,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { ToolComponentProps } from '../../../types';
import { ToolWorkspace } from '../../../common/ToolWorkspace';
import { usePdfCompressor } from '../hooks/usePdfCompressor';
import { PdfDropzone } from './PdfDropzone';
import { TargetSizeSelector } from './TargetSizeSelector';
import { CompressionControls } from './CompressionControls';
import { CompressionProgressCard } from './CompressionProgressCard';
import { CompressionResults } from './CompressionResults';
import { formatFileSize } from '../lib/format-utils';

export const PdfCompressor: React.FC<ToolComponentProps> = () => {
  const {
    fileInfo,
    isInspecting,
    isCompressing,
    progress,
    result,
    error,
    settings,
    targetBytes,
    isAlreadySmaller,
    setTargetPreset,
    setCustomTargetValue,
    setCustomTargetUnit,
    setQuality,
    setRemoveMetadata,
    handleSelectFile,
    startCompression,
    reset,
    downloadCompressedPdf,
    downloadOriginalPdf,
  } = usePdfCompressor();

  return (
    <ToolWorkspace
      title="Client-Side PDF Document Compressor"
      badge="Target-Size Optimizer"
      statusText="PDF files are analyzed and compressed locally in your web browser. Zero server uploads."
      sidebar={
        fileInfo ? (
          <div className="space-y-4">
            {/* Document Snapshot Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Document Overview
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-bold border border-rose-500/20">
                  PDF
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Original Size:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {formatFileSize(fileInfo.originalSize)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Total Pages:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {fileInfo.pageCount}
                  </span>
                </div>
                {fileInfo.imageCount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Embedded Images:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {fileInfo.imageCount}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400">Target Goal:</span>
                  <span className="font-mono font-bold text-rose-500">
                    {formatFileSize(targetBytes)}
                  </span>
                </div>
              </div>
            </div>

            {/* Privacy Box */}
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                <Shield className="w-3.5 h-3.5" />
                <span>Zero Server Uploads</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Your PDF never leaves this computer. All compression logic executes in browser memory.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Target-Size Compression</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Choose an exact target like <strong>1 MB</strong> or <strong>2 MB</strong> to fit email attachment and portal upload limits.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Maintains selectable text & fonts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Optimizes high-resolution photos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Compresses internal object streams</span>
              </div>
            </div>
          </div>
        )
      }
    >
      <div className="space-y-6">
        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <div className="space-y-1">
              <span className="font-bold block">Compression Error</span>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* State 1: Upload View */}
        {!fileInfo && (
          <PdfDropzone
            onFileSelected={handleSelectFile}
            disabled={isInspecting}
          />
        )}

        {/* State 2 & 3: File Loaded */}
        {fileInfo && (
          <div className="space-y-6">
            {/* File Header Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    {fileInfo.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {formatFileSize(fileInfo.originalSize)} • {fileInfo.pageCount}{' '}
                    {fileInfo.pageCount === 1 ? 'page' : 'pages'}
                    {fileInfo.imageCount > 0 && ` • ${fileInfo.imageCount} images`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={reset}
                disabled={isCompressing}
                className="self-end sm:self-center text-xs font-semibold text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>

            {/* Show Progress */}
            {isCompressing && <CompressionProgressCard progress={progress} />}

            {/* Show Results if Completed */}
            {!isCompressing && result && (
              <CompressionResults
                fileInfo={fileInfo}
                result={result}
                onDownload={downloadCompressedPdf}
                onReset={reset}
                onCompressAnyway={() => startCompression(true)}
                onDownloadOriginal={downloadOriginalPdf}
              />
            )}

            {/* Show Target Selector and Action if Not Completed */}
            {!isCompressing && !result && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
                <TargetSizeSelector
                  selectedPreset={settings.targetPreset}
                  customValue={settings.customTargetValue}
                  customUnit={settings.customTargetUnit}
                  onSelectPreset={setTargetPreset}
                  onChangeCustomValue={setCustomTargetValue}
                  onChangeCustomUnit={setCustomTargetUnit}
                  disabled={isCompressing}
                />

                <CompressionControls
                  quality={settings.quality}
                  removeMetadata={settings.removeMetadata}
                  onQualityChange={setQuality}
                  onRemoveMetadataChange={setRemoveMetadata}
                  disabled={isCompressing}
                />

                {isAlreadySmaller ? (
                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-900 dark:text-blue-200 space-y-3">
                    <p className="text-xs">
                      This PDF is already {formatFileSize(fileInfo.originalSize)}, which is smaller than your selected target of {formatFileSize(targetBytes)}.
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={downloadOriginalPdf}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        Keep Original
                      </button>
                      <button
                        type="button"
                        onClick={() => startCompression(true)}
                        className="px-4 py-2 rounded-xl bg-white dark:bg-white/10 hover:bg-blue-50 dark:hover:bg-white/15 text-blue-800 dark:text-blue-200 text-xs font-semibold border border-blue-500/30 transition-all cursor-pointer"
                      >
                        Compress Anyway
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => startCompression(false)}
                    disabled={isCompressing}
                    className="w-full py-4 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 active:scale-[0.99] text-white font-bold text-sm transition-all shadow-lg shadow-rose-500/25 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>Compress PDF</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolWorkspace>
  );
};
