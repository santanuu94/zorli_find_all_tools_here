import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ConvertedImageItem,
  GlobalConvertSettings,
  SupportedFormat,
} from '../types';
import {
  convertImageFile,
  generateConvertedFilename,
  loadImageElement,
  calculateSizeDelta,
} from '../lib/converter';
import { validateImageFile } from '../lib/validation';
import { createZipBlob } from '../../image-compressor/lib/zip';

export function useImageConverter() {
  const [globalSettings, setGlobalSettings] = useState<GlobalConvertSettings>({
    targetFormat: 'webp',
    quality: 85,
    backgroundColor: '#FFFFFF',
  });

  const [files, setFiles] = useState<ConvertedImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewItem, setPreviewItem] = useState<ConvertedImageItem | null>(null);

  // Keep a ref to all created object URLs to prevent leaks on unmount or resets
  const objectUrlsRef = useRef<Set<string>>(new Set());

  const registerUrl = useCallback((url: string) => {
    if (url && url.startsWith('blob:')) {
      objectUrlsRef.current.add(url);
    }
    return url;
  }, []);

  const releaseUrl = useCallback((url?: string) => {
    if (url && objectUrlsRef.current.has(url)) {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        // Ignore revoke errors
      }
      objectUrlsRef.current.delete(url);
    }
  }, []);

  // Cleanup all object URLs when unmounting
  useEffect(() => {
    const urls = objectUrlsRef.current;
    return () => {
      urls.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          // Ignore
        }
      });
      urls.clear();
    };
  }, []);

  const addFiles = useCallback(
    async (incomingFiles: File[]) => {
      if (!incomingFiles || incomingFiles.length === 0) return;

      const newItems: ConvertedImageItem[] = [];

      for (const file of incomingFiles) {
        const validation = validateImageFile(file);
        const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        if (!validation.valid || !validation.detectedFormat) {
          newItems.push({
            id,
            file,
            originalName: file.name,
            originalSize: file.size,
            originalMimeType: file.type,
            originalFormat: 'unknown',
            originalWidth: 0,
            originalHeight: 0,
            previewUrl: '',
            targetFormat: globalSettings.targetFormat,
            quality: globalSettings.quality,
            backgroundColor: globalSettings.backgroundColor,
            status: 'error',
            errorMessage: validation.error || 'Invalid file format.',
          });
          continue;
        }

        const sourceFormat = validation.detectedFormat;
        let chosenTargetFormat = globalSettings.targetFormat;

        // If this is the only file being added and the user uploaded a file identical to default target format,
        // choose a smart alternate target format so the user doesn't see "Already WebP" right away
        if (files.length === 0 && newItems.length === 0 && sourceFormat === chosenTargetFormat) {
          chosenTargetFormat = sourceFormat === 'png' ? 'webp' : 'png';
          setGlobalSettings((s) => ({ ...s, targetFormat: chosenTargetFormat }));
        }

        const isSame = sourceFormat === chosenTargetFormat;

        try {
          const previewUrl = registerUrl(URL.createObjectURL(file));
          const img = await loadImageElement(file);
          const origW = img.naturalWidth || img.width || 1;
          const origH = img.naturalHeight || img.height || 1;

          newItems.push({
            id,
            file,
            originalName: file.name,
            originalSize: file.size,
            originalMimeType: file.type,
            originalFormat: sourceFormat,
            originalWidth: origW,
            originalHeight: origH,
            previewUrl,
            targetFormat: chosenTargetFormat,
            quality: globalSettings.quality,
            backgroundColor: globalSettings.backgroundColor,
            status: isSame ? 'same-format' : 'pending',
          });
        } catch (err: any) {
          newItems.push({
            id,
            file,
            originalName: file.name,
            originalSize: file.size,
            originalMimeType: file.type,
            originalFormat: sourceFormat,
            originalWidth: 0,
            originalHeight: 0,
            previewUrl: '',
            targetFormat: chosenTargetFormat,
            quality: globalSettings.quality,
            backgroundColor: globalSettings.backgroundColor,
            status: 'error',
            errorMessage: err?.message || 'Could not decode image.',
          });
        }
      }

      setFiles((prev) => [...prev, ...newItems]);
    },
    [files.length, globalSettings, registerUrl]
  );

  const removeFile = useCallback(
    (id: string) => {
      setFiles((prev) => {
        const itemToRemove = prev.find((f) => f.id === id);
        if (itemToRemove) {
          releaseUrl(itemToRemove.previewUrl);
          releaseUrl(itemToRemove.outputUrl);
        }
        return prev.filter((f) => f.id !== id);
      });
      if (previewItem?.id === id) {
        setPreviewItem(null);
      }
    },
    [previewItem?.id, releaseUrl]
  );

  const clearFiles = useCallback(() => {
    files.forEach((f) => {
      releaseUrl(f.previewUrl);
      releaseUrl(f.outputUrl);
    });
    setFiles([]);
    setPreviewItem(null);
  }, [files, releaseUrl]);

  const updateGlobalFormat = useCallback((format: SupportedFormat) => {
    setGlobalSettings((s) => ({ ...s, targetFormat: format }));
    setFiles((prev) =>
      prev.map((item) => {
        if (item.status === 'error') return item;
        const isSame = item.originalFormat === format;
        return {
          ...item,
          targetFormat: format,
          status: isSame ? 'same-format' : 'pending',
        };
      })
    );
  }, []);

  const updateGlobalQuality = useCallback((quality: number) => {
    const q = Math.max(1, Math.min(100, Math.round(quality)));
    setGlobalSettings((s) => ({ ...s, quality: q }));
    setFiles((prev) =>
      prev.map((item) => (item.status === 'error' ? item : { ...item, quality: q }))
    );
  }, []);

  const updateGlobalBackgroundColor = useCallback((backgroundColor: string) => {
    setGlobalSettings((s) => ({ ...s, backgroundColor }));
    setFiles((prev) =>
      prev.map((item) => (item.status === 'error' ? item : { ...item, backgroundColor }))
    );
  }, []);

  const updateItemFormat = useCallback((id: string, format: SupportedFormat) => {
    setFiles((prev) =>
      prev.map((item) => {
        if (item.id !== id || item.status === 'error') return item;
        const isSame = item.originalFormat === format;
        return {
          ...item,
          targetFormat: format,
          status: isSame ? 'same-format' : 'pending',
        };
      })
    );
  }, []);

  const updateItemQuality = useCallback((id: string, quality: number) => {
    const q = Math.max(1, Math.min(100, Math.round(quality)));
    setFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quality: q } : item))
    );
  }, []);

  // Process all pending files in queue sequentially
  const startConversion = useCallback(async () => {
    const itemsToProcess = files.filter(
      (f) => f.status === 'pending' || f.status === 'done'
    );
    if (itemsToProcess.length === 0 || isProcessing) return;

    setIsProcessing(true);

    for (const item of itemsToProcess) {
      if (item.originalFormat === item.targetFormat) {
        setFiles((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: 'same-format' } : f))
        );
        continue;
      }

      setFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: 'converting' } : f))
      );

      try {
        const result = await convertImageFile(item.file, {
          targetFormat: item.targetFormat,
          quality: item.quality,
          backgroundColor: item.backgroundColor,
        });

        // Revoke previous output URL if re-converting
        releaseUrl(item.outputUrl);
        const outputUrl = registerUrl(URL.createObjectURL(result.blob));
        const { deltaPercent } = calculateSizeDelta(item.originalSize, result.size);

        setFiles((prev) =>
          prev.map((f) => {
            if (f.id !== item.id) return f;
            return {
              ...f,
              status: 'done',
              outputBlob: result.blob,
              outputUrl,
              outputSize: result.size,
              outputFormat: item.targetFormat,
              outputMimeType: result.mimeType,
              outputWidth: result.width,
              outputHeight: result.height,
              sizeDeltaPercent: deltaPercent,
            };
          })
        );
      } catch (err: any) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? {
                  ...f,
                  status: 'error',
                  errorMessage: err?.message || 'Failed to convert image.',
                }
              : f
          )
        );
      }
    }

    setIsProcessing(false);
  }, [files, isProcessing, registerUrl, releaseUrl]);

  const downloadFile = useCallback((item: ConvertedImageItem) => {
    if (!item.outputUrl && !item.outputBlob) return;

    const url = item.outputUrl || URL.createObjectURL(item.outputBlob!);
    const filename = generateConvertedFilename(
      item.originalName,
      item.outputFormat || item.targetFormat
    );

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }, []);

  const downloadAll = useCallback(async () => {
    const doneItems = files.filter((f) => f.status === 'done' && f.outputBlob);
    if (doneItems.length === 0) return;

    if (doneItems.length === 1) {
      downloadFile(doneItems[0]);
      return;
    }

    try {
      const zipInputs = doneItems.map((item) => ({
        name: generateConvertedFilename(
          item.originalName,
          item.outputFormat || item.targetFormat
        ),
        data: item.outputBlob!,
      }));

      const zipBlob = await createZipBlob(zipInputs);
      const zipUrl = URL.createObjectURL(zipBlob);

      const anchor = document.createElement('a');
      anchor.href = zipUrl;
      anchor.download = 'zorli-converted-images.zip';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      setTimeout(() => URL.revokeObjectURL(zipUrl), 30000);
    } catch (e) {
      // Fallback: download individually if zip fails
      doneItems.forEach((item) => downloadFile(item));
    }
  }, [downloadFile, files]);

  return {
    globalSettings,
    updateGlobalFormat,
    updateGlobalQuality,
    updateGlobalBackgroundColor,
    updateItemFormat,
    updateItemQuality,
    files,
    addFiles,
    removeFile,
    clearFiles,
    startConversion,
    downloadFile,
    downloadAll,
    isProcessing,
    previewItem,
    setPreviewItem,
  };
}
