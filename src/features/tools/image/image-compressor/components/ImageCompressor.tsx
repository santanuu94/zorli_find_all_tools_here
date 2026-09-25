import React from 'react';
import { ToolComponentProps } from '../../../types';
import { ToolWorkspace } from '../../../common/ToolWorkspace';
import { useImageCompressor } from '../hooks/useImageCompressor';
import { UploadArea } from './UploadArea';
import { CompressionSettingsComponent } from './CompressionSettings';
import { CompressionResult } from './CompressionResult';
import { DownloadButton } from './DownloadButton';
import { Trash2 } from 'lucide-react';

export const ImageCompressor: React.FC<ToolComponentProps> = () => {
  const {
    settings,
    updateQuality,
    files,
    addFiles,
    clearFiles,
  } = useImageCompressor();

  return (
    <ToolWorkspace
      title="Lossless & Lossy Image Compression Studio"
      sidebar={
        <div className="space-y-4">
          <CompressionSettingsComponent
            settings={settings}
            onQualityChange={updateQuality}
          />
        </div>
      }
    >
      <div className="space-y-6">
        <UploadArea onFilesSelected={addFiles} />

        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Uploaded Images ({files.length})
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearFiles}
                  className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
                <DownloadButton />
              </div>
            </div>

            <CompressionResult files={files} />
          </div>
        )}
      </div>
    </ToolWorkspace>
  );
};
