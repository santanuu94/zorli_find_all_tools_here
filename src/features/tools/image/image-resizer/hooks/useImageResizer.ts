import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ResizedImageItem,
  ResizeSettings,
  ResizeMode,
  PresetFitMode,
  CanvasBackground,
} from '../types';
import {
  calculateTargetDimensions,
  generateResizedFilename,
  loadImageElement,
  resizeImageFile,
  SOCIAL_PLATFORMS,
  PRESET_DIMENSIONS,
} from '../lib/resizer';
import { validateImageFile } from '../lib/validation';
import { createZipBlob } from '../../image-compressor/lib/zip';

export function useImageResizer() {
  const [settings, setSettings] = useState<ResizeSettings>({
    mode: 'custom',
    customWidth: 1200,
    customHeight: 900,
    lockAspectRatio: true,
    primaryDimension: 'width',
    percentage: 50,
    presetId: 'youtube-thumbnail',
    socialPlatformId: 'youtube',
    presetFitMode: 'fit',
    canvasBackground: 'blur',
    dontEnlarge: false,
    quality: 90,
  });

  const [files, setFiles] = useState<ResizedImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewItem, setPreviewItem] = useState<ResizedImageItem | null>(null);

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

  // Re-calculate target dimensions for all files whenever settings change
  useEffect(() => {
    setFiles((prevFiles) =>
      prevFiles.map((item) => {
        if (item.status === 'error') {
          return item;
        }
        const { targetWidth, targetHeight } = calculateTargetDimensions(
          item.originalWidth,
          item.originalHeight,
          settings
        );
        return {
          ...item,
          targetWidth,
          targetHeight,
        };
      })
    );
  }, [settings]);

  const addFiles = useCallback(
    async (incomingFiles: File[]) => {
      if (!incomingFiles || incomingFiles.length === 0) return;

      const newItems: ResizedImageItem[] = [];

      for (const file of incomingFiles) {
        const validation = validateImageFile(file);
        const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        if (!validation.valid) {
          newItems.push({
            id,
            file,
            originalName: file.name,
            originalSize: file.size,
            originalWidth: 0,
            originalHeight: 0,
            aspectRatio: 1,
            targetWidth: 0,
            targetHeight: 0,
            previewUrl: '',
            status: 'error',
            errorMessage: validation.error || 'Invalid file format.',
          });
          continue;
        }

        try {
          const previewUrl = registerUrl(URL.createObjectURL(file));
          const img = await loadImageElement(file);
          const origW = img.naturalWidth || img.width || 1;
          const origH = img.naturalHeight || img.height || 1;
          const aspectRatio = origW / origH;

          // If this is the very first valid file added and settings are still default,
          // adapt initial custom dimensions to the first file's dimensions
          if (files.length === 0 && newItems.length === 0) {
            setSettings((s) => ({
              ...s,
              customWidth: origW,
              customHeight: origH,
            }));
          }

          const { targetWidth, targetHeight } = calculateTargetDimensions(
            origW,
            origH,
            settings
          );

          newItems.push({
            id,
            file,
            originalName: file.name,
            originalSize: file.size,
            originalWidth: origW,
            originalHeight: origH,
            aspectRatio,
            targetWidth,
            targetHeight,
            previewUrl,
            status: 'pending',
          });
        } catch (err: any) {
          newItems.push({
            id,
            file,
            originalName: file.name,
            originalSize: file.size,
            originalWidth: 0,
            originalHeight: 0,
            aspectRatio: 1,
            targetWidth: 0,
            targetHeight: 0,
            previewUrl: '',
            status: 'error',
            errorMessage: err?.message || 'Could not decode image.',
          });
        }
      }

      setFiles((prev) => [...prev, ...newItems]);
    },
    [files.length, registerUrl, settings]
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

  // Setting handlers
  const updateMode = useCallback((mode: ResizeMode) => {
    setSettings((s) => {
      let nextPresetId = s.presetId;
      let nextPlatformId = s.socialPlatformId || 'youtube';

      if (mode === 'social') {
        const platform =
          SOCIAL_PLATFORMS.find((p) => p.id === nextPlatformId) || SOCIAL_PLATFORMS[0];
        nextPlatformId = platform.id;
        const matchingPreset = platform.presets.find((p) => p.id === s.presetId);
        const presetObj = matchingPreset || platform.presets[0];
        nextPresetId = presetObj.id;
        return {
          ...s,
          mode,
          socialPlatformId: nextPlatformId,
          presetId: nextPresetId,
          customWidth: presetObj.width,
          customHeight: presetObj.height,
        };
      } else if (mode === 'web') {
        if (!s.presetId.startsWith('web-') && !s.presetId.startsWith('common-')) {
          nextPresetId = 'web-hero';
        }
        const presetObj = PRESET_DIMENSIONS.find((p) => p.id === nextPresetId);
        return {
          ...s,
          mode,
          presetId: nextPresetId,
          customWidth: presetObj ? presetObj.width : s.customWidth,
          customHeight: presetObj ? presetObj.height : s.customHeight,
        };
      } else if (mode === 'preset') {
        if (!s.presetId.startsWith('common-')) {
          nextPresetId = 'common-1080p';
        }
        const presetObj = PRESET_DIMENSIONS.find((p) => p.id === nextPresetId);
        return {
          ...s,
          mode,
          presetId: nextPresetId,
          customWidth: presetObj ? presetObj.width : s.customWidth,
          customHeight: presetObj ? presetObj.height : s.customHeight,
        };
      } else if (mode === 'custom') {
        const defaultW = files[0]?.originalWidth || s.customWidth || 1200;
        const defaultH = files[0]?.originalHeight || s.customHeight || 900;
        return {
          ...s,
          mode,
          customWidth: s.manualOverride ? s.customWidth : defaultW,
          customHeight: s.manualOverride ? s.customHeight : defaultH,
        };
      }
      return { ...s, mode };
    });
  }, [files]);

  const updateSocialPlatform = useCallback((platformId: string) => {
    const platform =
      SOCIAL_PLATFORMS.find((p) => p.id === platformId) || SOCIAL_PLATFORMS[0];
    const defaultPreset = platform.presets[0];
    setSettings((s) => ({
      ...s,
      socialPlatformId: platform.id,
      presetId: defaultPreset.id,
      manualOverride: false,
      customWidth: defaultPreset.width,
      customHeight: defaultPreset.height,
    }));
  }, []);

  const updatePresetFitMode = useCallback((fitMode: PresetFitMode) => {
    setSettings((s) => ({ ...s, presetFitMode: fitMode }));
  }, []);

  const updateCanvasBackground = useCallback((canvasBackground: CanvasBackground) => {
    setSettings((s) => ({ ...s, canvasBackground }));
  }, []);

  const updateCustomWidth = useCallback((val: number) => {
    if (isNaN(val) || val <= 0) return;
    const w = Math.round(val);
    setSettings((s) => {
      let ratio = files[0]?.aspectRatio;
      if (!ratio || isNaN(ratio)) {
        ratio = s.customWidth && s.customHeight ? s.customWidth / s.customHeight : 4 / 3;
      }
      return {
        ...s,
        customWidth: w,
        manualOverride: true,
        primaryDimension: 'width',
        customHeight: s.lockAspectRatio
          ? Math.max(1, Math.round(w / ratio))
          : s.customHeight,
      };
    });
  }, [files]);

  const updateCustomHeight = useCallback((val: number) => {
    if (isNaN(val) || val <= 0) return;
    const h = Math.round(val);
    setSettings((s) => {
      let ratio = files[0]?.aspectRatio;
      if (!ratio || isNaN(ratio)) {
        ratio = s.customWidth && s.customHeight ? s.customWidth / s.customHeight : 4 / 3;
      }
      return {
        ...s,
        customHeight: h,
        manualOverride: true,
        primaryDimension: 'height',
        customWidth: s.lockAspectRatio
          ? Math.max(1, Math.round(h * ratio))
          : s.customWidth,
      };
    });
  }, [files]);

  const toggleLockRatio = useCallback(() => {
    setSettings((s) => {
      const nextLock = !s.lockAspectRatio;
      if (nextLock) {
        const ratio = files[0]?.aspectRatio || (s.customWidth / (s.customHeight || 1));
        return {
          ...s,
          lockAspectRatio: nextLock,
          customHeight: Math.max(1, Math.round(s.customWidth / ratio)),
        };
      }
      return { ...s, lockAspectRatio: nextLock };
    });
  }, [files]);

  const updatePercentage = useCallback((percentage: number) => {
    setSettings((s) => ({ ...s, percentage }));
  }, []);

  const updatePreset = useCallback((presetId: string) => {
    const foundPreset = PRESET_DIMENSIONS.find((p) => p.id === presetId);
    let platformId = '';
    for (const plat of SOCIAL_PLATFORMS) {
      if (plat.presets.some((p) => p.id === presetId)) {
        platformId = plat.id;
        break;
      }
    }
    setSettings((s) => ({
      ...s,
      presetId,
      manualOverride: false,
      ...(platformId ? { socialPlatformId: platformId } : {}),
      customWidth: foundPreset ? foundPreset.width : s.customWidth,
      customHeight: foundPreset ? foundPreset.height : s.customHeight,
    }));
  }, []);

  const toggleDontEnlarge = useCallback(() => {
    setSettings((s) => ({ ...s, dontEnlarge: !s.dontEnlarge }));
  }, []);

  const updateQuality = useCallback((quality: number) => {
    setSettings((s) => ({ ...s, quality }));
  }, []);

  // Process all files in queue sequentially
  const startResizing = useCallback(async () => {
    const itemsToProcess = files.filter(
      (f) => f.status === 'pending' || f.status === 'done'
    );
    if (itemsToProcess.length === 0 || isProcessing) return;

    setIsProcessing(true);

    const fitModeToUse: PresetFitMode =
      settings.mode === 'social' || settings.mode === 'web'
        ? settings.presetFitMode
        : 'stretch';

    for (const item of itemsToProcess) {
      // Mark as processing
      setFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: 'processing' } : f))
      );

      try {
        const { targetWidth, targetHeight } = calculateTargetDimensions(
          item.originalWidth,
          item.originalHeight,
          settings
        );

        const result = await resizeImageFile(
          item.file,
          targetWidth,
          targetHeight,
          settings.quality,
          fitModeToUse,
          settings.canvasBackground || 'blur'
        );

        // Revoke previous output URL if re-resizing
        releaseUrl(item.outputUrl);
        const outputUrl = registerUrl(URL.createObjectURL(result.blob));

        setFiles((prev) =>
          prev.map((f) => {
            if (f.id !== item.id) return f;
            return {
              ...f,
              status: 'done',
              targetWidth,
              targetHeight,
              outputBlob: result.blob,
              outputUrl,
              outputSize: result.blob.size,
              outputWidth: result.width,
              outputHeight: result.height,
              outputMimeType: result.mimeType,
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
                  errorMessage: err?.message || 'Failed to resize image.',
                }
              : f
          )
        );
      }
    }

    setIsProcessing(false);
  }, [files, isProcessing, registerUrl, releaseUrl, settings]);

  const downloadFile = useCallback((item: ResizedImageItem) => {
    if (!item.outputUrl && !item.outputBlob) return;

    const url = item.outputUrl || URL.createObjectURL(item.outputBlob!);
    const filename = generateResizedFilename(
      item.originalName,
      item.outputMimeType || 'image/jpeg'
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
        name: generateResizedFilename(
          item.originalName,
          item.outputMimeType || 'image/jpeg'
        ),
        data: item.outputBlob!,
      }));

      const zipBlob = await createZipBlob(zipInputs);
      const zipUrl = URL.createObjectURL(zipBlob);

      const anchor = document.createElement('a');
      anchor.href = zipUrl;
      anchor.download = 'zorli-resized-images.zip';
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
    settings,
    updateMode,
    updateSocialPlatform,
    updateCustomWidth,
    updateCustomHeight,
    toggleLockRatio,
    updatePercentage,
    updatePreset,
    updatePresetFitMode,
    updateCanvasBackground,
    toggleDontEnlarge,
    updateQuality,
    files,
    addFiles,
    removeFile,
    clearFiles,
    startResizing,
    downloadFile,
    downloadAll,
    isProcessing,
    previewItem,
    setPreviewItem,
  };
}
