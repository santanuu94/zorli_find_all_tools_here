import { useState, useCallback } from 'react';
import { CompressionSettings, CompressedFileItem } from '../types';
import { imageCompressorConfig } from '../config';
import { validateImageFile } from '../lib/validation';

export function useImageCompressor() {
  const [settings, setSettings] = useState<CompressionSettings>({
    quality: imageCompressorConfig.defaultQuality,
    outputFormat: 'original',
    preserveMetadata: false,
  });

  const [files, setFiles] = useState<CompressedFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const updateQuality = useCallback((quality: number) => {
    setSettings((prev) => ({ ...prev, quality }));
  }, []);

  const addFiles = useCallback((incomingFiles: File[]) => {
    const validItems: CompressedFileItem[] = incomingFiles
      .filter((file) => validateImageFile(file).valid)
      .map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        originalSize: file.size,
        status: 'pending',
      }));

    setFiles((prev) => [...prev, ...validItems]);
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  return {
    settings,
    updateQuality,
    files,
    addFiles,
    clearFiles,
    isProcessing,
  };
}
