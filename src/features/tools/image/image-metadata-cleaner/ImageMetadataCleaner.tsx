import React, { useRef } from 'react';
import { ToolComponentProps } from '../../types';
import { ToolWorkspace } from '../../common/ToolWorkspace';
import { useImageMetadataCleaner } from './hooks/useImageMetadataCleaner';
import { MetadataUploadArea } from './components/MetadataUploadArea';
import { MetadataSummaryBanner } from './components/MetadataSummaryBanner';
import { GpsPrivacyCard } from './components/GpsPrivacyCard';
import { MetadataCategoryList } from './components/MetadataCategoryList';
import { MetadataAdvancedView } from './components/MetadataAdvancedView';
import { CleaningVerificationView } from './components/CleaningVerificationView';
import { MetadataQueueBar } from './components/MetadataQueueBar';
import { EducationalContent } from './components/EducationalContent';
import { formatFileSize } from './utils/format-file-size';
import {
  Sparkles,
  Download,
  Loader2,
  FileCheck2,
  Shield,
  Lock,
  ArrowRight,
  Info,
} from 'lucide-react';

export const ImageMetadataCleaner: React.FC<ToolComponentProps> = () => {
  const {
    files,
    activeFile,
    activeFileId,
    isProcessing,
    isZipping,
    addFiles,
    cleanActiveFile,
    cleanAllFiles,
    downloadFile,
    downloadAllZip,
    selectActiveFile,
    removeFile,
    clearFiles,
  } = useImageMetadataCleaner();

  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  const report = activeFile?.metadataReport;
  const isCleaned = activeFile?.status === 'cleaned';
  const isScanning = activeFile?.status === 'scanning';
  const isCleaning = activeFile?.status === 'cleaning';
  const hasMetadata = report?.hasSupportedMetadata ?? false;

  return (
    <>
      <ToolWorkspace
        title="Image Metadata Viewer & Cleaner"
        badge="100% In-Browser & Private"
        statusText="Inspect hidden EXIF, GPS and hardware tags. Create a sanitized clean copy before sharing."
        sidebar={
          activeFile ? (
            <div className="space-y-4">
              {/* Image Preview & File Info Card */}
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950/40 border border-slate-200/80 dark:border-white/10 flex items-center justify-center">
                  <img
                    src={activeFile.cleanedUrl || activeFile.previewUrl}
                    alt={activeFile.originalName}
                    className="max-h-full max-w-full object-contain"
                  />
                  {isCleaned && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow">
                      Sanitized
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white truncate" title={activeFile.originalName}>
                    {activeFile.originalName}
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-mono">
                    <span className="uppercase">{activeFile.format}</span>
                    <span>{formatFileSize(activeFile.originalSize)}</span>
                    {activeFile.originalWidth && activeFile.originalHeight && (
                      <span>{activeFile.originalWidth} × {activeFile.originalHeight} px</span>
                    )}
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 space-y-2">
                  {isCleaned ? (
                    <button
                      type="button"
                      onClick={() => downloadFile(activeFile)}
                      className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Clean Copy</span>
                    </button>
                  ) : hasMetadata ? (
                    <button
                      type="button"
                      onClick={cleanActiveFile}
                      disabled={isProcessing || isScanning}
                      className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCleaning ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sanitizing Metadata...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Create Clean Copy</span>
                        </>
                      )}
                    </button>
                  ) : (
                    // Requirement #24: No Metadata Case
                    <button
                      type="button"
                      onClick={() => downloadFile(activeFile)}
                      className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 dark:border-white/20 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-emerald-500" />
                      <span>Download Original (Clean)</span>
                    </button>
                  )}

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                    {hasMetadata
                      ? 'Losslessly removes supported EXIF, GPS & author tags.'
                      : 'No supported metadata was found in this file.'}
                  </p>
                </div>
              </div>

              {/* Local Privacy Assurance Card */}
              <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  <span>Client-Side Guarantee</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Your image file is read and processed entirely inside your web browser. No photos, coordinates, or tags are uploaded to any external server.
                </p>
              </div>
            </div>
          ) : undefined
        }
      >
        <div className="space-y-6">
          {/* Hidden file input for adding more queue items */}
          <input
            ref={hiddenFileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                addFiles(Array.from(e.target.files));
                e.target.value = '';
              }
            }}
            className="hidden"
          />

          {/* Initial State: Clean Upload Dropzone */}
          {files.length === 0 && (
            <MetadataUploadArea onFilesSelected={addFiles} disabled={isProcessing} />
          )}

          {/* Active Workspace State */}
          {files.length > 0 && activeFile && (
            <div className="space-y-6">
              {/* Batch Queue Bar */}
              <MetadataQueueBar
                files={files}
                activeFileId={activeFileId}
                onSelect={selectActiveFile}
                onRemove={removeFile}
                onClearAll={clearFiles}
                onCleanAll={cleanAllFiles}
                onDownloadAllZip={downloadAllZip}
                isProcessing={isProcessing}
                isZipping={isZipping}
                onAddMoreClick={() => hiddenFileInputRef.current?.click()}
              />

              {/* Scanning Loading State */}
              {isScanning && (
                <div className="p-10 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 text-center space-y-3 animate-pulse">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Scanning image metadata...
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Reading binary markers, EXIF headers, GPS coordinates, and color profiles.
                    </p>
                  </div>
                </div>
              )}

              {/* Cleaning Completed: Before / After Verification View */}
              {!isScanning && isCleaned && (
                <CleaningVerificationView
                  item={activeFile}
                  onDownload={downloadFile}
                />
              )}

              {/* Metadata Inspection View (When Parsed) */}
              {!isScanning && report && (
                <div className="space-y-6">
                  {/* Summary Banner */}
                  <MetadataSummaryBanner report={report} />

                  {/* GPS Card (if coordinates detected) */}
                  {report.gps && <GpsPrivacyCard gps={report.gps} />}

                  {/* Categorized Fields List */}
                  <MetadataCategoryList categories={report.categories} />

                  {/* Collapsible Advanced Raw View */}
                  <MetadataAdvancedView rawTags={report.rawTags} />
                </div>
              )}
            </div>
          )}
        </div>
      </ToolWorkspace>

      {/* SEO & Educational Content */}
      <EducationalContent />
    </>
  );
};

export default ImageMetadataCleaner;
