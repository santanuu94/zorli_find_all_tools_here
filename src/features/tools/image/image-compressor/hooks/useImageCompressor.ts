import { useState, useCallback, useRef, useEffect } from 'react';
import {
  CompressionSettings,
  CompressedFileItem,
  CompressionMode,
} from '../types';
import { imageCompressorConfig } from '../config';
import { validateImageFile } from '../lib/validation';
import { compressImage } from '../lib/compressor';
import { generateCompressedFilename } from '../lib/image-processing';
import { createZipBlob } from '../lib/zip';

export function useImageCompressor() {
  const [settings, setSettings] = useState<CompressionSettings>({
    mode: 'quality',
    quality: imageCompressorConfig.defaultQuality || 80,
    targetSizeKb: 200,
    outputFormat: 'original',
    preserveMetadata: false,
  });

  const [files, setFiles] = useState<CompressedFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewItem, setPreviewItem] = useState<CompressedFileItem | null>(null);

  // Keep a ref to all active object URLs for memory management & cleanup
  const activeUrlsRef = useRef<Set<string>>(new Set());

  const registerUrl = useCallback((url: string | undefined) => {
    if (url) {
      activeUrlsRef.current.add(url);
    }
  }, []);

  const revokeUrl = useCallback((url: string | undefined) => {
    if (url && activeUrlsRef.current.has(url)) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // Ignore cleanup errors
      }
      activeUrlsRef.current.delete(url);
    }
  }, []);

  // Cleanup all allocated object URLs on unmount
  useEffect(() => {
    return () => {
      activeUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // Ignore cleanup errors
        }
      });
      activeUrlsRef.current.clear();
    };
  }, []);

  // Process a single file item with the current settings
  const processItem = useCallback(
    async (
      item: CompressedFileItem,
      currentSettings: CompressionSettings
    ): Promise<CompressedFileItem> => {
      try {
        const result = await compressImage(item.file, currentSettings);

        // Revoke previous compressed URL if re-compressing
        if (item.compressedPreviewUrl) {
          revokeUrl(item.compressedPreviewUrl);
        }

        const compressedPreviewUrl = URL.createObjectURL(result.blob);
        registerUrl(compressedPreviewUrl);

        return {
          ...item,
          status: 'done',
          compressedBlob: result.blob,
          compressedPreviewUrl,
          compressedSize: result.compressedSize,
          reductionPercentage: result.reductionPercentage,
          width: result.width,
          height: result.height,
          outputMimeType: result.outputMimeType,
          alreadyOptimized: result.alreadyOptimized,
          errorMessage: undefined,
        };
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Compression failed for this image.';
        return {
          ...item,
          status: 'error',
          errorMessage: message,
        };
      }
    },
    [registerUrl, revokeUrl]
  );

  // Start compression process on all eligible files in the queue
  const startCompression = useCallback(
    async (overrideSettings?: CompressionSettings) => {
      const activeSettings = overrideSettings || settings;

      // Find files that are ready to compress (pending or already completed for re-compression)
      const targetItems = files.filter(
        (f) => f.file && f.status !== 'error'
      );

      if (targetItems.length === 0) return;

      setIsProcessing(true);

      for (const item of targetItems) {
        // Mark as processing
        setFiles((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: 'processing' } : f))
        );

        // Yield to browser event loop so UI updates smoothly
        await new Promise((resolve) => setTimeout(resolve, 30));

        const updated = await processItem(item, activeSettings);

        setFiles((prev) =>
          prev.map((f) => (f.id === item.id ? updated : f))
        );
      }

      setIsProcessing(false);
    },
    [files, processItem, settings]
  );

  // Add new files from file picker or drag & drop (queues them as pending)
  const addFiles = useCallback(
    (incomingFiles: File[]) => {
      if (!incomingFiles || incomingFiles.length === 0) return;

      const newItems: CompressedFileItem[] = [];

      for (const file of incomingFiles) {
        const id = Math.random().toString(36).substring(2, 10);
        const validation = validateImageFile(file);

        if (!validation.valid) {
          newItems.push({
            id,
            file,
            name: file.name,
            originalSize: file.size,
            status: 'error',
            errorMessage: validation.error,
          });
        } else {
          let previewUrl: string | undefined;
          try {
            previewUrl = URL.createObjectURL(file);
            registerUrl(previewUrl);
          } catch {
            // Ignore preview failure
          }

          newItems.push({
            id,
            file,
            name: file.name,
            originalSize: file.size,
            status: 'pending',
            previewUrl,
          });
        }
      }

      setFiles((prev) => [...prev, ...newItems]);
    },
    [registerUrl]
  );

  // Update mode: 'quality' vs 'targetSize'
  const updateMode = useCallback((mode: CompressionMode) => {
    setSettings((prev) => ({ ...prev, mode }));
  }, []);

  // Update quality
  const updateQuality = useCallback((quality: number) => {
    setSettings((prev) => ({ ...prev, quality }));
  }, []);

  // Update target file size in KB
  const updateTargetSizeKb = useCallback((targetSizeKb: number) => {
    setSettings((prev) => ({ ...prev, targetSizeKb }));
  }, []);

  // Update output format
  const updateOutputFormat = useCallback(
    (outputFormat: 'original' | 'jpeg' | 'png' | 'webp') => {
      setSettings((prev) => ({ ...prev, outputFormat }));
    },
    []
  );

  // Remove a single file
  const removeFile = useCallback(
    (id: string) => {
      setFiles((prev) => {
        const itemToRemove = prev.find((f) => f.id === id);
        if (itemToRemove) {
          revokeUrl(itemToRemove.previewUrl);
          revokeUrl(itemToRemove.compressedPreviewUrl);
        }
        return prev.filter((f) => f.id !== id);
      });

      if (previewItem?.id === id) {
        setPreviewItem(null);
      }
    },
    [previewItem, revokeUrl]
  );

  // Clear all files
  const clearFiles = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((item) => {
        revokeUrl(item.previewUrl);
        revokeUrl(item.compressedPreviewUrl);
      });
      return [];
    });
    setPreviewItem(null);
  }, [revokeUrl]);

  // Download a single compressed file
  const downloadFile = useCallback((id: string) => {
    setFiles((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item && item.compressedBlob) {
        const downloadName = generateCompressedFilename(
          item.name,
          item.outputMimeType || 'image/jpeg'
        );
        const url = URL.createObjectURL(item.compressedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1500);
      }
      return prev;
    });
  }, []);

  // Download all completed compressed files
  const downloadAll = useCallback(async () => {
    const completedItems = files.filter(
      (f) => f.status === 'done' && f.compressedBlob
    );

    if (completedItems.length === 0) return;

    if (completedItems.length === 1) {
      downloadFile(completedItems[0].id);
      return;
    }

    try {
      const zipEntries = completedItems.map((item) => ({
        name: generateCompressedFilename(item.name, item.outputMimeType || 'image/jpeg'),
        data: item.compressedBlob!,
      }));

      const zipBlob = await createZipBlob(zipEntries);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'zorli-compressed-images.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch {
      completedItems.forEach((item, index) => {
        setTimeout(() => downloadFile(item.id), index * 300);
      });
    }
  }, [downloadFile, files]);

  return {
    settings,
    updateMode,
    updateQuality,
    updateTargetSizeKb,
    updateOutputFormat,
    startCompression,
    files,
    addFiles,
    removeFile,
    clearFiles,
    downloadFile,
    downloadAll,
    isProcessing,
    previewItem,
    setPreviewItem,
  };
}
