import React, { useRef, useState } from 'react';
import { ToolComponentProps } from '../../types';
import { ToolWorkspace } from '../../common/ToolWorkspace';
import { useImageCropper } from './hooks/useImageCropper';
import { CropperUploadArea } from './components/CropperUploadArea';
import { CropCanvas } from './components/CropCanvas';
import { CropControls } from './components/CropControls';
import { CropResultView } from './components/CropResultView';
import { CropQueueBar } from './components/CropQueueBar';
import { CropperPreviewModal } from './components/CropperPreviewModal';
import { CroppedImageItem } from './types';
import { Upload, Sparkles, FolderArchive, ArrowLeft } from 'lucide-react';
import { formatFileSize } from './utils/format-file-size';

export const ImageCropper: React.FC<ToolComponentProps> = () => {
  const {
    files,
    activeFile,
    activeFileId,
    settings,
    crop,
    completedCrop,
    isProcessing,
    isZipping,
    setCrop,
    setCompletedCrop,
    addFiles,
    selectActiveFile,
    removeFile,
    clearFiles,
    setAspectRatioPreset,
    setSocialPreset,
    setZoom,
    rotateLeft,
    rotateRight,
    flipHorizontal,
    flipVertical,
    resetTransforms,
    cropActiveImage,
    downloadFile,
    downloadAllZip,
  } = useImageCropper();

  const [activeImgElement, setActiveImgElement] = useState<HTMLImageElement | null>(null);
  const [previewModalItem, setPreviewModalItem] = useState<CroppedImageItem | null>(null);
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  const completedFiles = files.filter((f) => f.status === 'done' && f.outputBlob);

  const handleRecrop = () => {
    if (!activeFile) return;
    activeFile.status = 'idle';
    activeFile.outputBlob = undefined;
    activeFile.outputUrl = undefined;
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  const handleSeeOutput = async () => {
    if (activeFile?.status === 'done' && activeFile.outputUrl) {
      setPreviewModalItem(activeFile);
    } else {
      const cropped = await cropActiveImage(activeImgElement);
      if (cropped) {
        setPreviewModalItem(cropped);
      }
    }
  };

  return (
    <>
      <ToolWorkspace
        title="In-Browser Image Cropping Studio"
        badge="100% Free & Private"
        statusText="Precision aspect ratios, freeform cropping, and social presets. Zero server uploads."
        sidebar={
          activeFile ? (
            <div className="space-y-4">
              <CropControls
                item={activeFile}
                settings={settings}
                completedCrop={completedCrop}
                onSetAspectRatio={setAspectRatioPreset}
                onSetSocialPreset={setSocialPreset}
                onSetZoom={setZoom}
                onRotateLeft={rotateLeft}
                onRotateRight={rotateRight}
                onFlipHorizontal={flipHorizontal}
                onFlipVertical={flipVertical}
                onReset={resetTransforms}
                onCropClick={() => cropActiveImage(activeImgElement)}
                onSeeOutputClick={handleSeeOutput}
                isProcessing={isProcessing}
                disabled={isProcessing}
              />

              {/* Completed Files Summary Card */}
              {completedFiles.length > 0 && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/20 text-slate-800 dark:text-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Cropping Summary
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                        Cropped Photos
                      </span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        {completedFiles.length} of {files.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                        Total Cropped Size
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
                      disabled={isZipping}
                      onClick={downloadAllZip}
                      className="w-full mt-4 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <FolderArchive className="w-4 h-4" />
                      <span>Download All ({completedFiles.length} Images as ZIP)</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : undefined
        }
      >
        <div className="space-y-6">
          {/* Hidden file input for queue additions */}
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
            <CropperUploadArea onFilesSelected={addFiles} disabled={isProcessing} />
          )}

          {/* Active Editor State */}
          {files.length > 0 && activeFile && (
            <div className="space-y-4">
              {/* Multi-image Queue Bar */}
              <CropQueueBar
                files={files}
                activeFileId={activeFileId}
                onSelect={selectActiveFile}
                onRemove={removeFile}
                onClearAll={clearFiles}
                onDownloadAllZip={downloadAllZip}
                isZipping={isZipping}
                onAddMoreClick={() => hiddenFileInputRef.current?.click()}
                onPreview={(item) => setPreviewModalItem(item)}
                disabled={isProcessing}
              />

              {/* View toggle: If active image is cropped, show CropResultView; else show CropCanvas */}
              {activeFile.status === 'done' && activeFile.outputUrl ? (
                <CropResultView
                  item={activeFile}
                  onDownload={downloadFile}
                  onRecrop={handleRecrop}
                  onPreview={(item) => setPreviewModalItem(item)}
                />
              ) : (
                <CropCanvas
                  item={activeFile}
                  settings={settings}
                  crop={crop}
                  completedCrop={completedCrop}
                  onCropChange={setCrop}
                  onCropComplete={setCompletedCrop}
                  onImageLoaded={(img) => setActiveImgElement(img)}
                  onSeeOutput={handleSeeOutput}
                  disabled={isProcessing}
                />
              )}
            </div>
          )}
        </div>
      </ToolWorkspace>

      {/* Output Preview & Direct Download Modal */}
      <CropperPreviewModal
        item={previewModalItem}
        onClose={() => setPreviewModalItem(null)}
        onDownload={downloadFile}
        onRecrop={() => {
          setPreviewModalItem(null);
          handleRecrop();
        }}
      />
    </>
  );
};

export default ImageCropper;
