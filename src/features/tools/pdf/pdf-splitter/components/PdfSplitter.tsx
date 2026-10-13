import React from 'react';
import {
  FileText,
  Scissors,
  RotateCcw,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { ToolComponentProps } from '../../../types';
import { ToolWorkspace } from '../../../common/ToolWorkspace';
import { usePdfSplitter } from '../hooks/usePdfSplitter';
import { formatFileSize } from '../lib/format-utils';
import { SplitterDropzone } from './SplitterDropzone';
import { SplitModeSelector } from './SplitModeSelector';
import { RangeModeControls } from './RangeModeControls';
import { ExtractModeControls } from './ExtractModeControls';
import { EqualModeControls } from './EqualModeControls';
import { SplitPlanPreview } from './SplitPlanPreview';
import { SplitProgressCard } from './SplitProgressCard';
import { SplitResults } from './SplitResults';

export const PdfSplitter: React.FC<ToolComponentProps> = () => {
  const {
    sourceInfo,
    isInspecting,
    error,
    mode,
    setMode,
    rangeRows,
    addRangeRow,
    removeRangeRow,
    updateRangeRow,
    selectedPages,
    extractText,
    togglePage,
    handleExtractTextChange,
    selectOddPages,
    selectEvenPages,
    selectAllPages,
    clearSelectedPages,
    pagesPerGroup,
    setPagesPerGroup,
    plan,
    isSplitting,
    isZipping,
    progress,
    outputs,
    handleSelectFile,
    startSplit,
    downloadSingleOutput,
    downloadAllZip,
    reset,
  } = usePdfSplitter();

  return (
    <ToolWorkspace
      title="Client-Side PDF Document Splitter"
      badge="In-Browser Engine"
      statusText="Split by custom page ranges, extract single pages, or divide into equal groups. Zero server uploads."
      sidebar={
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>How to Split PDF Documents</span>
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Choose custom page ranges, extract single pages, or divide documents into equal-sized parts.
          </p>
          <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>100% private in-browser page extraction</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>Download parts individually or as a single ZIP</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>Preserves original vector paths, text, & fonts</span>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <div className="space-y-1">
              <span className="font-bold block">Splitting Error</span>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* State 1: Upload View */}
        {!sourceInfo && (
          <SplitterDropzone
            onFileSelected={handleSelectFile}
            disabled={isInspecting}
          />
        )}

        {/* State 2: Document Loaded */}
        {sourceInfo && (
          <div className="space-y-6">
            {/* Document Header Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
                  <Scissors className="w-6 h-6" />
                </div>
                <div className="min-w-0 truncate">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {sourceInfo.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="font-mono">{formatFileSize(sourceInfo.sizeBytes)}</span>
                    <span>•</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold font-mono">
                      {sourceInfo.pageCount} {sourceInfo.pageCount === 1 ? 'page' : 'pages'}
                    </span>
                  </div>
                </div>
              </div>

              {!isSplitting && !outputs && (
                <button
                  type="button"
                  onClick={reset}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Choose Another PDF</span>
                </button>
              )}
            </div>

            {/* In Progress */}
            {isSplitting && <SplitProgressCard progress={progress} />}

            {/* Results */}
            {!isSplitting && outputs && (
              <SplitResults
                outputs={outputs}
                originalName={sourceInfo.name}
                onDownloadSingle={downloadSingleOutput}
                onDownloadAllZip={downloadAllZip}
                onReset={reset}
                isZipping={isZipping}
              />
            )}

            {/* Configuration & Action Workspace */}
            {!isSplitting && !outputs && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#070B24] border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
                {/* Mode Selector */}
                <SplitModeSelector
                  currentMode={mode}
                  onSelectMode={setMode}
                  disabled={isSplitting}
                />

                {/* Mode Specific Controls */}
                <div className="pt-2 border-t border-slate-100 dark:border-white/5">
                  {mode === 'range' && (
                    <RangeModeControls
                      totalPages={sourceInfo.pageCount}
                      rangeRows={rangeRows}
                      onAddRow={addRangeRow}
                      onRemoveRow={removeRangeRow}
                      onUpdateRow={updateRangeRow}
                      plan={plan}
                      disabled={isSplitting}
                    />
                  )}

                  {mode === 'extract' && (
                    <ExtractModeControls
                      totalPages={sourceInfo.pageCount}
                      selectedPages={selectedPages}
                      extractText={extractText}
                      onTogglePage={togglePage}
                      onTextChange={handleExtractTextChange}
                      onSelectAll={selectAllPages}
                      onSelectOdd={selectOddPages}
                      onSelectEven={selectEvenPages}
                      onClear={clearSelectedPages}
                      plan={plan}
                      disabled={isSplitting}
                    />
                  )}

                  {mode === 'equal' && (
                    <EqualModeControls
                      totalPages={sourceInfo.pageCount}
                      pagesPerGroup={pagesPerGroup}
                      onChangePagesPerGroup={setPagesPerGroup}
                      plan={plan}
                      disabled={isSplitting}
                    />
                  )}
                </div>

                {/* Plan Preview */}
                <div className="pt-2 border-t border-slate-100 dark:border-white/5">
                  <SplitPlanPreview
                    plan={plan}
                    originalFilename={sourceInfo.name}
                    totalPages={sourceInfo.pageCount}
                  />
                </div>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={startSplit}
                  disabled={isSplitting || !plan.isValid || plan.items.length === 0}
                  className="w-full py-4 px-6 rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:scale-[0.99] text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/25 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Scissors className="w-4 h-4" />
                  <span>Split PDF ({plan.items.length} {plan.items.length === 1 ? 'file' : 'files'})</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolWorkspace>
  );
};
