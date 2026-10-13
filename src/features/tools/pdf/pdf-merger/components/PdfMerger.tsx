import React from 'react';
import {
  Layers,
  ArrowRight,
  AlertCircle,
  Shield,
  Sparkles,
  FileText,
  Info,
} from 'lucide-react';
import { ToolComponentProps } from '../../../types';
import { ToolWorkspace } from '../../../common/ToolWorkspace';
import { usePdfMerger } from '../hooks/usePdfMerger';
import { MergerDropzone } from './MergerDropzone';
import { MergerFileList } from './MergerFileList';
import { MergerProgressCard } from './MergerProgressCard';
import { MergerResults } from './MergerResults';
import { formatFileSize } from '../lib/format-utils';

export const PdfMerger: React.FC<ToolComponentProps> = () => {
  const {
    files,
    isMerging,
    progress,
    result,
    error,
    outputFilename,
    setOutputFilename,
    totalInputSize,
    totalInputPages,
    addFiles,
    removeFile,
    clearFiles,
    moveUp,
    moveDown,
    reorderFiles,
    startMerge,
    reset,
    downloadMergedPdf,
  } = usePdfMerger();

  const hasFiles = files.length > 0;
  const canMerge = files.length >= 2;

  return (
    <ToolWorkspace
      title="Client-Side PDF Document Merger"
      badge="Multi-File Stitcher"
      statusText="PDF files are combined locally in your web browser. Zero server uploads."
      sidebar={
        hasFiles ? (
          <div className="space-y-4">
            {/* Queue Summary Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Merge Queue
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 font-bold border border-indigo-500/20">
                  {files.length} {files.length === 1 ? 'file' : 'files'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Total Files:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {files.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Total Pages:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {totalInputPages}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400">Combined Size:</span>
                  <span className="font-mono font-bold text-indigo-500">
                    {formatFileSize(totalInputSize)}
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
                Your confidential documents never leave this device. Merging executes in browser memory.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Combine in Seconds</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload multiple PDF files, arrange their order with drag-and-drop, and merge them into one complete document.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Exact page order preservation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Accessible arrow buttons</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>100% private and client-side</span>
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
              <span className="font-bold block">Merge Error</span>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* State 1: Upload View (when queue is empty) */}
        {!hasFiles && !result && (
          <MergerDropzone
            onFilesSelected={addFiles}
            disabled={isMerging}
          />
        )}

        {/* State 2: Processing State */}
        {isMerging && <MergerProgressCard progress={progress} />}

        {/* State 3: Completed Result */}
        {!isMerging && result && (
          <MergerResults
            result={result}
            filename={outputFilename}
            onFilenameChange={setOutputFilename}
            onDownload={downloadMergedPdf}
            onReset={reset}
          />
        )}

        {/* State 4: Queue Active (ready to merge) */}
        {!isMerging && !result && hasFiles && (
          <div className="space-y-6">
            <MergerFileList
              files={files}
              onMoveUp={moveUp}
              onMoveDown={moveDown}
              onReorder={reorderFiles}
              onRemove={removeFile}
              onClearAll={clearFiles}
              disabled={isMerging}
            />

            <MergerDropzone
              compact
              onFilesSelected={addFiles}
              disabled={isMerging}
            />

            {/* Merge Action Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
              {!canMerge ? (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>Add at least one more PDF to merge files.</span>
                </div>
              ) : null}

              <button
                type="button"
                disabled={!canMerge || isMerging}
                onClick={startMerge}
                className="w-full py-4 px-6 rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:scale-[0.99] text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/25 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Layers className="w-4 h-4" />
                <span>Merge {files.length} PDFs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolWorkspace>
  );
};
