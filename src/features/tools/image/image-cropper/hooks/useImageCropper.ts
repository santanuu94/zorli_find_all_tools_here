import { useState, useEffect, useCallback, useRef } from 'react';
import { Crop } from 'react-image-crop';
import {
  CroppedImageItem,
  CropTransformSettings,
  PixelCrop,
  SupportedFormat,
} from '../types';
import {
  ASPECT_RATIO_PRESETS,
  cropImageToBlob,
  generateCroppedFilename,
  getSocialPresetRatio,
  SOCIAL_PLATFORMS,
} from '../lib/cropper';
import { validateImageFile } from '../lib/validation';
import { createZipBlob } from '../../image-compressor/lib/zip';

const DEFAULT_SETTINGS: CropTransformSettings = {
  aspectRatioId: 'free',
  aspectRatio: undefined,
  zoom: 1,
  rotation: 0,
  flipH: false,
  flipV: false,
};

export function useImageCropper() {
  const [files, setFiles] = useState<CroppedImageItem[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [settings, setSettings] = useState<CropTransformSettings>(DEFAULT_SETTINGS);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  // Track created object URLs for memory safety
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
        // ignore
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
          // ignore
        }
      });
      urls.clear();
    };
  }, []);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0] || null;

  const addFiles = useCallback(
    async (newFiles: File[]) => {
      if (!newFiles || newFiles.length === 0) return;

      const itemsToAdd: CroppedImageItem[] = [];

      for (const file of newFiles) {
        const validation = validateImageFile(file);
        const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        if (!validation.valid) {
          itemsToAdd.push({
            id,
            file,
            originalName: file.name,
            originalSize: file.size,
            originalWidth: 0,
            originalHeight: 0,
            originalFormat: 'unknown',
            previewUrl: '',
            status: 'error',
            errorMessage: validation.error || 'Invalid file format.',
          });
          continue;
        }

        const previewUrl = registerUrl(URL.createObjectURL(file));

        // Read natural image dimensions
        const { width, height } = await new Promise<{ width: number; height: number }>(
          (resolve) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
            img.onerror = () => resolve({ width: 0, height: 0 });
            img.src = previewUrl;
          }
        );

        itemsToAdd.push({
          id,
          file,
          originalName: file.name,
          originalSize: file.size,
          originalWidth: width,
          originalHeight: height,
          originalFormat: validation.detectedFormat || 'jpg',
          previewUrl,
          status: 'idle',
        });
      }

      setFiles((prev) => {
        const updated = [...prev, ...itemsToAdd];
        if (!activeFileId && updated.length > 0) {
          const firstValid = updated.find((f) => f.status !== 'error') || updated[0];
          setActiveFileId(firstValid.id);
        }
        return updated;
      });
    },
    [activeFileId, registerUrl]
  );

  const selectActiveFile = useCallback((id: string) => {
    setActiveFileId(id);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const removeFile = useCallback(
    (id: string) => {
      setFiles((prev) => {
        const target = prev.find((f) => f.id === id);
        if (target) {
          releaseUrl(target.previewUrl);
          releaseUrl(target.outputUrl);
        }
        const remaining = prev.filter((f) => f.id !== id);
        if (activeFileId === id) {
          const next = remaining.find((f) => f.status !== 'error') || remaining[0];
          setActiveFileId(next ? next.id : null);
          setCrop(undefined);
          setCompletedCrop(undefined);
          setSettings(DEFAULT_SETTINGS);
        }
        return remaining;
      });
    },
    [activeFileId, releaseUrl]
  );

  const clearFiles = useCallback(() => {
    files.forEach((f) => {
      releaseUrl(f.previewUrl);
      releaseUrl(f.outputUrl);
    });
    setFiles([]);
    setActiveFileId(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setSettings(DEFAULT_SETTINGS);
  }, [files, releaseUrl]);

  const setAspectRatioPreset = useCallback((presetId: string) => {
    if (presetId === 'free') {
      setSettings((prev) => ({
        ...prev,
        aspectRatioId: 'free',
        aspectRatio: undefined,
        socialPlatformId: undefined,
        socialPresetId: undefined,
      }));
      return;
    }

    const preset = ASPECT_RATIO_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSettings((prev) => ({
        ...prev,
        aspectRatioId: preset.id,
        aspectRatio: preset.ratio,
        socialPlatformId: undefined,
        socialPresetId: undefined,
      }));
    }
  }, []);

  const setSocialPreset = useCallback((platformId: string, presetId: string) => {
    const platform = SOCIAL_PLATFORMS.find((p) => p.id === platformId);
    if (!platform) return;

    const preset = platform.presets.find((pr) => pr.id === presetId);
    if (!preset) return;

    const ratio = getSocialPresetRatio(preset);

    setSettings((prev) => ({
      ...prev,
      aspectRatioId: 'social',
      socialPlatformId: platformId,
      socialPresetId: presetId,
      aspectRatio: ratio,
    }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    const clamped = Math.max(1, Math.min(3, zoom));
    setSettings((prev) => ({ ...prev, zoom: clamped }));
  }, []);

  const rotateLeft = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      rotation: (prev.rotation - 90 + 360) % 360,
    }));
    setCrop(undefined);
    setCompletedCrop(undefined);
  }, []);

  const rotateRight = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }));
    setCrop(undefined);
    setCompletedCrop(undefined);
  }, []);

  const flipHorizontal = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      flipH: !prev.flipH,
    }));
  }, []);

  const flipVertical = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      flipV: !prev.flipV,
    }));
  }, []);

  const resetTransforms = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setCrop(undefined);
    setCompletedCrop(undefined);
  }, []);

  const cropActiveImage = useCallback(
    async (imageElement: HTMLImageElement | null): Promise<CroppedImageItem | null> => {
      if (!activeFile || !imageElement || isProcessing) return null;

      setIsProcessing(true);

      try {
        const baseWidth = imageElement.naturalWidth || imageElement.width;
        const baseHeight = imageElement.naturalHeight || imageElement.height;

        // If no crop was explicitly dragged, default to full image bounds
        const targetCrop: PixelCrop =
          completedCrop && completedCrop.width > 0 && completedCrop.height > 0
            ? completedCrop
            : {
                unit: 'px',
                x: 0,
                y: 0,
                width: baseWidth,
                height: baseHeight,
              };

        const format: SupportedFormat =
          activeFile.originalFormat !== 'unknown'
            ? activeFile.originalFormat
            : 'jpg';

        // imageElement's source already has any rotation/flip applied from CropCanvas editorSrc
        const result = await cropImageToBlob(
          imageElement,
          targetCrop,
          0,
          false,
          false,
          format,
          0.92
        );

        registerUrl(result.url);

        const updatedItem: CroppedImageItem = {
          ...activeFile,
          status: 'done',
          outputBlob: result.blob,
          outputUrl: result.url,
          outputWidth: result.width,
          outputHeight: result.height,
          outputSize: result.size,
          cropCoordinates: targetCrop,
        };

        setFiles((prev) =>
          prev.map((item) => (item.id === activeFile.id ? updatedItem : item))
        );

        return updatedItem;
      } catch (err: any) {
        setFiles((prev) =>
          prev.map((item) =>
            item.id === activeFile.id
              ? {
                  ...item,
                  status: 'error',
                  errorMessage: err?.message || 'We could not crop this image. Please try again.',
                }
              : item
          )
        );
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    [activeFile, completedCrop, isProcessing, registerUrl, settings]
  );

  const downloadFile = useCallback((item: CroppedImageItem) => {
    if (!item.outputUrl) return;

    const filename = generateCroppedFilename(item.originalName);
    const anchor = document.createElement('a');
    anchor.href = item.outputUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }, []);

  const downloadAllZip = useCallback(async () => {
    const doneItems = files.filter((f) => f.status === 'done' && f.outputBlob);
    if (doneItems.length === 0) return;

    if (doneItems.length === 1) {
      downloadFile(doneItems[0]);
      return;
    }

    setIsZipping(true);
    try {
      const zipInputs = doneItems.map((item) => ({
        name: generateCroppedFilename(item.originalName),
        data: item.outputBlob!,
      }));

      const zipBlob = await createZipBlob(zipInputs);
      const zipUrl = URL.createObjectURL(zipBlob);

      const anchor = document.createElement('a');
      anchor.href = zipUrl;
      anchor.download = 'zorli-cropped-images.zip';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      setTimeout(() => URL.revokeObjectURL(zipUrl), 30000);
    } catch (e) {
      doneItems.forEach((item) => downloadFile(item));
    } finally {
      setIsZipping(false);
    }
  }, [downloadFile, files]);

  return {
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
  };
}
