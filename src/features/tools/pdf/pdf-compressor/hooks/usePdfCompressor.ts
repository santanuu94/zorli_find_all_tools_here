import { useState, useCallback, useEffect } from 'react';
import {
  CompressionProgress,
  CompressionQuality,
  CompressionResult,
  CompressionSettings,
  CustomTargetUnit,
  PdfFileInfo,
  TargetPreset,
} from '../types';
import { compressPdf, inspectPdf } from '../lib/pdf-compressor-engine';
import {
  calculateTargetBytes,
  generateCompressedFilename,
} from '../lib/format-utils';

export function usePdfCompressor() {
  const [fileInfo, setFileInfo] = useState<PdfFileInfo | null>(null);
  const [isInspecting, setIsInspecting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState<CompressionProgress | null>(null);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState<CompressionSettings>({
    targetPreset: '2mb',
    customTargetValue: 2,
    customTargetUnit: 'MB',
    quality: 'balanced',
    removeMetadata: true,
  });

  // Clean up object URLs when result changes or unmounts
  useEffect(() => {
    return () => {
      if (result?.downloadUrl) {
        URL.revokeObjectURL(result.downloadUrl);
      }
    };
  }, [result]);

  const setTargetPreset = useCallback((preset: TargetPreset) => {
    setSettings((prev) => ({ ...prev, targetPreset: preset }));
    // Clear previous result so user can recompress with new target
    setResult(null);
  }, []);

  const setCustomTargetValue = useCallback((value: number) => {
    setSettings((prev) => ({ ...prev, customTargetValue: value }));
    setResult(null);
  }, []);

  const setCustomTargetUnit = useCallback((unit: CustomTargetUnit) => {
    setSettings((prev) => ({ ...prev, customTargetUnit: unit }));
    setResult(null);
  }, []);

  const setQuality = useCallback((quality: CompressionQuality) => {
    setSettings((prev) => ({ ...prev, quality }));
    setResult(null);
  }, []);

  const setRemoveMetadata = useCallback((remove: boolean) => {
    setSettings((prev) => ({ ...prev, removeMetadata: remove }));
    setResult(null);
  }, []);

  const handleSelectFile = useCallback(async (selectedFile: File) => {
    setError(null);
    setResult(null);
    setIsInspecting(true);

    try {
      const info = await inspectPdf(selectedFile);
      setFileInfo(info);

      // Auto-pick a sensible target size below the original file size
      const sizeMb = selectedFile.size / (1024 * 1024);
      let suggestedPreset: TargetPreset = '2mb';
      if (sizeMb > 10) suggestedPreset = '5mb';
      else if (sizeMb > 5) suggestedPreset = '2mb';
      else if (sizeMb > 2) suggestedPreset = '1mb';
      else if (sizeMb > 1) suggestedPreset = '500kb';
      else suggestedPreset = '500kb';

      setSettings((prev) => ({ ...prev, targetPreset: suggestedPreset }));
    } catch (err: any) {
      setError(err?.message || 'Failed to read PDF file.');
      setFileInfo(null);
    } finally {
      setIsInspecting(false);
    }
  }, []);

  const startCompression = useCallback(
    async (force = false) => {
      if (!fileInfo) return;

      setError(null);
      setIsCompressing(true);
      setProgress({
        stage: 'reading',
        message: 'Analyzing PDF document...',
        percentage: 10,
      });

      try {
        const compressionResult = await compressPdf(
          fileInfo.file,
          settings,
          (p) => setProgress(p),
          force
        );
        setResult(compressionResult);
      } catch (err: any) {
        setError(err?.message || 'Compression encountered an error.');
      } finally {
        setIsCompressing(false);
      }
    },
    [fileInfo, settings]
  );

  const reset = useCallback(() => {
    if (result?.downloadUrl) {
      URL.revokeObjectURL(result.downloadUrl);
    }
    setFileInfo(null);
    setResult(null);
    setError(null);
    setProgress(null);
    setIsCompressing(false);
    setIsInspecting(false);
  }, [result]);

  const downloadCompressedPdf = useCallback(() => {
    if (!result || !fileInfo) return;

    const link = document.createElement('a');
    link.href = result.downloadUrl;
    link.download = generateCompressedFilename(fileInfo.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [result, fileInfo]);

  const downloadOriginalPdf = useCallback(() => {
    if (!fileInfo) return;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(fileInfo.file);
    link.download = fileInfo.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [fileInfo]);

  const targetBytes = calculateTargetBytes(settings);
  const isAlreadySmaller = fileInfo ? fileInfo.originalSize <= targetBytes : false;

  return {
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
  };
}
