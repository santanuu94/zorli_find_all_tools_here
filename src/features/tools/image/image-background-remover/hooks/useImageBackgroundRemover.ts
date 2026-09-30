import { useState, useCallback, useEffect, useRef } from 'react';
import { BackgroundMode, ModelChoice, RemovalItem } from '../types';
import {
  loadImageElement,
  removeBackground,
  composeResult,
  checkHasTransparency,
  applyAlphaMask,
} from '../lib/remover-engine';
import { getCleanRemovalFilename } from '../lib/filename';
import { createZipBlob } from '../../image-compressor/lib/zip';

export function useImageBackgroundRemover() {
  const [items, setItems] = useState<RemovalItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  // References to keep track of blob URLs for cleanup
  const urlsToRevokeRef = useRef<Set<string>>(new Set());

  const registerUrl = useCallback((url: string) => {
    urlsToRevokeRef.current.add(url);
    return url;
  }, []);

  const cleanupUrl = useCallback((url?: string) => {
    if (url && urlsToRevokeRef.current.has(url)) {
      URL.revokeObjectURL(url);
      urlsToRevokeRef.current.delete(url);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      urlsToRevokeRef.current.forEach((url) => URL.revokeObjectURL(url));
      urlsToRevokeRef.current.clear();
    };
  }, []);

  const activeItem = items.find((i) => i.id === activeId) || items[0] || null;

  /**
   * Processes a single item through the background remover engine.
   */
  const processItem = useCallback(
    async (itemToProcess: RemovalItem) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemToProcess.id
            ? {
                ...item,
                status: 'processing',
                errorMessage: undefined,
                progress: { stage: 'Initializing...', percent: 10 },
              }
            : item
        )
      );

      try {
        const img = await loadImageElement(itemToProcess.file);
        const originalWidth = img.naturalWidth || img.width;
        const originalHeight = img.naturalHeight || img.height;

        const foregroundData = await removeBackground(
          img,
          itemToProcess.modelChoice || 'rmbg',
          itemToProcess.cleanlinessThreshold ?? 35,
          (progress) => {
            setItems((prev) =>
              prev.map((item) =>
                item.id === itemToProcess.id ? { ...item, progress } : item
              )
            );
          }
        );

        const hasAlpha = checkHasTransparency(foregroundData);

        const resultBlob = await composeResult(
          foregroundData,
          originalWidth,
          originalHeight,
          itemToProcess.backgroundMode,
          itemToProcess.customColor
        );

        const resultUrl = registerUrl(URL.createObjectURL(resultBlob));

        setItems((prev) =>
          prev.map((item) => {
            if (item.id !== itemToProcess.id) return item;
            cleanupUrl(item.resultUrl);
            return {
              ...item,
              status: 'done',
              progress: { stage: 'Done', percent: 100 },
              originalWidth,
              originalHeight,
              resultBlob,
              resultUrl,
              resultWidth: originalWidth,
              resultHeight: originalHeight,
              resultSize: resultBlob.size,
              hasTransparency: hasAlpha,
              foregroundImageData: foregroundData,
              rawMaskData: foregroundData.rawMaskData,
              originalImageData: foregroundData.originalImageData,
            };
          })
        );
      } catch (err: any) {
        console.error('Background removal error:', err);
        const message =
          err?.message ||
          'Failed to remove background. Please try another image or format.';
        setItems((prev) =>
          prev.map((item) =>
            item.id === itemToProcess.id
              ? {
                  ...item,
                  status: 'error',
                  errorMessage: message,
                  progress: undefined,
                }
              : item
          )
        );
      }
    },
    [cleanupUrl, registerUrl]
  );

  /**
   * Adds new files to the processing queue.
   */
  const addFiles = useCallback(
    async (files: File[]) => {
      const validFiles = files.filter((f) =>
        ['image/jpeg', 'image/png', 'image/webp'].includes(f.type)
      );

      if (validFiles.length === 0) return;

      const newItems: RemovalItem[] = await Promise.all(
        validFiles.map(async (file) => {
          const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
          const originalUrl = registerUrl(URL.createObjectURL(file));

          let originalWidth = 0;
          let originalHeight = 0;
          try {
            const img = await loadImageElement(file);
            originalWidth = img.naturalWidth || img.width;
            originalHeight = img.naturalHeight || img.height;
          } catch {
            // will handle in processItem
          }

          return {
            id,
            file,
            originalUrl,
            originalWidth,
            originalHeight,
            originalSize: file.size,
            status: 'idle' as const,
            backgroundMode: 'transparent' as const,
            customColor: '#3B82F6',
            modelChoice: 'rmbg' as const,
            cleanlinessThreshold: 35,
          };
        })
      );

      setItems((prev) => {
        const next = [...prev, ...newItems];
        if (!activeId && next.length > 0) {
          setActiveId(next[0].id);
        }
        return next;
      });

      // Auto-process first item if queue was empty
      if (items.length === 0 && newItems.length > 0) {
        setActiveId(newItems[0].id);
        processItem(newItems[0]);
      }
    },
    [activeId, items.length, processItem, registerUrl]
  );

  /**
   * Re-composites the active item when background mode or color changes
   * without re-running the AI segmentation model.
   */
  const updateBackground = useCallback(
    async (
      itemId: string,
      mode: BackgroundMode,
      customColor: string = '#3B82F6'
    ) => {
      const item = items.find((i) => i.id === itemId);
      if (!item) return;

      if (item.foregroundImageData && item.status === 'done') {
        try {
          const newBlob = await composeResult(
            item.foregroundImageData,
            item.resultWidth || item.originalWidth,
            item.resultHeight || item.originalHeight,
            mode,
            customColor
          );

          const newUrl = registerUrl(URL.createObjectURL(newBlob));
          cleanupUrl(item.resultUrl);

          setItems((prev) =>
            prev.map((i) =>
              i.id === itemId
                ? {
                    ...i,
                    backgroundMode: mode,
                    customColor,
                    resultBlob: newBlob,
                    resultUrl: newUrl,
                    resultSize: newBlob.size,
                  }
                : i
            )
          );
          return;
        } catch (err) {
          console.error('Failed to recompose background:', err);
        }
      }

      // If not yet processed or no cached foreground data, just update the settings
      setItems((prev) =>
        prev.map((i) =>
          i.id === itemId
            ? { ...i, backgroundMode: mode, customColor }
            : i
        )
      );
    },
    [cleanupUrl, items, registerUrl]
  );

  /**
   * Real-time zero-latency update of the cleanliness / edge refinement threshold.
   * If cached mask and image data are available, recomputes the cutout in <15ms.
   */
  const updateCleanlinessThreshold = useCallback(
    async (itemId: string, threshold: number) => {
      const clamped = Math.max(0, Math.min(100, Math.round(threshold)));
      const item = items.find((i) => i.id === itemId);
      if (!item) return;

      if (item.rawMaskData && item.originalImageData && item.status === 'done') {
        try {
          const newForeground = applyAlphaMask(
            item.originalImageData,
            item.rawMaskData,
            clamped
          );
          const hasAlpha = checkHasTransparency(newForeground);
          const newBlob = await composeResult(
            newForeground,
            item.resultWidth || item.originalWidth,
            item.resultHeight || item.originalHeight,
            item.backgroundMode,
            item.customColor
          );
          const newUrl = registerUrl(URL.createObjectURL(newBlob));
          cleanupUrl(item.resultUrl);

          setItems((prev) =>
            prev.map((i) =>
              i.id === itemId
                ? {
                    ...i,
                    cleanlinessThreshold: clamped,
                    foregroundImageData: newForeground,
                    resultBlob: newBlob,
                    resultUrl: newUrl,
                    resultSize: newBlob.size,
                    hasTransparency: hasAlpha,
                  }
                : i
            )
          );
          return;
        } catch (err) {
          console.error('Failed to update cleanliness threshold:', err);
        }
      }

      // If not yet processed, store setting
      setItems((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, cleanlinessThreshold: clamped } : i
        )
      );
    },
    [cleanupUrl, items, registerUrl]
  );

  /**
   * Changes the model choice for an item and optionally re-processes.
   */
  const updateModelChoice = useCallback(
    async (itemId: string, modelChoice: ModelChoice, reprocess: boolean = true) => {
      const item = items.find((i) => i.id === itemId);
      if (!item) return;

      const updated = { ...item, modelChoice };
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? updated : i))
      );

      if (reprocess && (item.status === 'done' || item.status === 'error')) {
        await processItem(updated);
      }
    },
    [items, processItem]
  );

  /**
   * Removes an individual item.
   */
  const removeItem = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id);
      if (item) {
        cleanupUrl(item.originalUrl);
        cleanupUrl(item.resultUrl);
      }

      setItems((prev) => {
        const next = prev.filter((i) => i.id !== id);
        if (activeId === id) {
          setActiveId(next.length > 0 ? next[0].id : null);
        }
        return next;
      });
    },
    [activeId, cleanupUrl, items]
  );

  /**
   * Clears all items from the queue.
   */
  const clearAll = useCallback(() => {
    items.forEach((item) => {
      cleanupUrl(item.originalUrl);
      cleanupUrl(item.resultUrl);
    });
    setItems([]);
    setActiveId(null);
  }, [cleanupUrl, items]);

  /**
   * Processes all pending/idle or error items sequentially.
   */
  const processAll = useCallback(async () => {
    if (isProcessingQueue) return;
    setIsProcessingQueue(true);

    const pending = items.filter(
      (item) => item.status === 'idle' || item.status === 'error'
    );

    for (const item of pending) {
      await processItem(item);
    }

    setIsProcessingQueue(false);
  }, [isProcessingQueue, items, processItem]);

  /**
   * Downloads a single processed item.
   */
  const downloadResult = useCallback((item: RemovalItem) => {
    if (!item.resultBlob && !item.resultUrl) return;

    const filename = getCleanRemovalFilename(item.file.name, item.backgroundMode);
    const link = document.createElement('a');
    link.href = item.resultUrl || URL.createObjectURL(item.resultBlob!);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  /**
   * Downloads all processed items packaged into a single ZIP archive.
   */
  const downloadAllZip = useCallback(async () => {
    const doneItems = items.filter(
      (i) => i.status === 'done' && (i.resultBlob || i.resultUrl)
    );
    if (doneItems.length === 0 || isZipping) return;

    setIsZipping(true);
    try {
      const zipInputs = await Promise.all(
        doneItems.map(async (item) => {
          let blob = item.resultBlob;
          if (!blob && item.resultUrl) {
            const resp = await fetch(item.resultUrl);
            blob = await resp.blob();
          }
          const name = getCleanRemovalFilename(
            item.file.name,
            item.backgroundMode
          );
          return { name, data: blob! };
        })
      );

      const zipBlob = await createZipBlob(zipInputs);
      const zipUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `zorli-background-removed-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);
    } catch (err) {
      console.error('Failed to create ZIP download:', err);
    } finally {
      setIsZipping(false);
    }
  }, [isZipping, items]);

  return {
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
  };
}
