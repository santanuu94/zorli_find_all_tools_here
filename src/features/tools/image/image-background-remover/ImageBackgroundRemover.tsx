import React from 'react';
import { useImageBackgroundRemover } from './hooks/useImageBackgroundRemover';
import { RemoverUploadArea } from './components/RemoverUploadArea';
import { RemoverProcessingBar } from './components/RemoverProcessingBar';
import { RemoverComparisonView } from './components/RemoverComparisonView';
import { RemoverBackgroundSelector } from './components/RemoverBackgroundSelector';
import { RemoverResultDetails } from './components/RemoverResultDetails';
import { RemoverQueueBar } from './components/RemoverQueueBar';
import { EducationalContent } from './components/EducationalContent';
import { Sparkles, Shield, Cpu } from 'lucide-react';

export const ImageBackgroundRemover: React.FC = () => {
  const {
    items,
    activeItem,
    activeId,
    setActiveId,
    addFiles,
    processItem,
    processAll,
    removeItem,
    clearAll,
    updateBackground,
    updateCleanlinessThreshold,
    updateModelChoice,
    downloadResult,
    downloadAllZip,
    isProcessingQueue,
    isZipping,
  } = useImageBackgroundRemover();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            AI-POWERED
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Shield className="w-3 h-3" />
            100% Client-Side Privacy
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
            <Cpu className="w-3 h-3 text-purple-400" />
            BRIA RMBG-1.4 Ultra-Clean
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Image Background Remover
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
          Remove backgrounds from photos cleanly with state-of-the-art on-device AI. Create transparent PNG cutouts, eliminate shadows and dirty patches, or replace backgrounds with zero cloud uploads.
        </p>
      </div>

      {/* Main Studio Area */}
      <div className="space-y-6">
        {items.length === 0 ? (
          <RemoverUploadArea onFilesSelected={addFiles} />
        ) : (
          <div className="space-y-6">
            {/* Multiple files queue bar */}
            <RemoverQueueBar
              items={items}
              activeId={activeId}
              onSelect={setActiveId}
              onRemove={removeItem}
              onProcessAll={processAll}
              onDownloadAllZip={downloadAllZip}
              isProcessingQueue={isProcessingQueue}
              isZipping={isZipping}
            />

            {/* Active item workspace */}
            {activeItem && (
              <div className="space-y-6">
                {/* Processing bar */}
                {activeItem.status === 'processing' && (
                  <RemoverProcessingBar
                    progress={activeItem.progress}
                    fileName={activeItem.file.name}
                  />
                )}

                {/* Comparison view */}
                <RemoverComparisonView
                  originalUrl={activeItem.originalUrl}
                  resultUrl={activeItem.resultUrl}
                  backgroundMode={activeItem.backgroundMode}
                  customColor={activeItem.customColor}
                  isProcessing={activeItem.status === 'processing'}
                />

                {/* Background & Cleanliness selector (when item is done) */}
                {activeItem.status === 'done' && (
                  <RemoverBackgroundSelector
                    currentMode={activeItem.backgroundMode}
                    customColor={activeItem.customColor}
                    onSelectMode={(mode, color) =>
                      updateBackground(activeItem.id, mode, color || activeItem.customColor)
                    }
                    cleanlinessThreshold={activeItem.cleanlinessThreshold ?? 35}
                    onCleanlinessChange={(threshold) =>
                      updateCleanlinessThreshold(activeItem.id, threshold)
                    }
                    currentModel={activeItem.modelChoice}
                    onModelChange={(model, reprocess) =>
                      updateModelChoice(activeItem.id, model, reprocess)
                    }
                    isProcessing={isProcessingQueue}
                  />
                )}

                {/* Result metrics & Download buttons */}
                <RemoverResultDetails
                  item={activeItem}
                  onDownload={() => downloadResult(activeItem)}
                  onReset={clearAll}
                  onRetry={() => processItem(activeItem)}
                  disabled={activeItem.status === 'processing'}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Educational & SEO Content */}
      <EducationalContent />
    </div>
  );
};
