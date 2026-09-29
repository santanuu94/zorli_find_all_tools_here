import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ImageMetadataItem,
  SupportedMetadataFormat,
} from '../types';
import { parseImageMetadata } from '../lib/metadata-parser';
import { cleanImageMetadata, generateCleanFilename, verifyCleanCopy } from '../lib/metadata-cleaner';
import { createZipBlob } from '../../image-compressor/lib/zip';

export function useImageMetadataCleaner() {
  const [files, setFiles] = useState<ImageMetadataItem[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const objectUrlsRef = useRef<Set<string>>(new Set());

  const registerUrl = useCallback((url: string) => {
    objectUrlsRef.current.add(url);
    return url;
  }, []);

  const releaseUrl = useCallback((url?: string) => {
    if (url && objectUrlsRef.current.has(url)) {
      URL.revokeObjectURL(url);
      objectUrlsRef.current.delete(url);
    }
  }, []);

  // Cleanup all object URLs when unmounting
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    };
  }, []);

  const activeFile = files.find((f) => f.id === activeFileId) || null;

  // Add and scan files
  const addFiles = useCallback(
    async (incomingFiles: File[]) => {
      const validFiles = incomingFiles.filter((file) => {
        const type = file.type.toLowerCase();
        const name = file.name.toLowerCase();
        return (
          type === 'image/jpeg' ||
          type === 'image/png' ||
          type === 'image/webp' ||
          name.endsWith('.jpg') ||
          name.endsWith('.jpeg') ||
          name.endsWith('.png') ||
          name.endsWith('.webp')
        );
      });

      if (validFiles.length === 0) return;

      const newItems: ImageMetadataItem[] = validFiles.map((file) => {
        const previewUrl = registerUrl(URL.createObjectURL(file));
        const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        let format: SupportedMetadataFormat = 'unknown';
        const type = file.type.toLowerCase();
        const name = file.name.toLowerCase();
        if (type.includes('jpeg') || name.endsWith('.jpg') || name.endsWith('.jpeg')) {
          format = 'jpeg';
        } else if (type.includes('png') || name.endsWith('.png')) {
          format = 'png';
        } else if (type.includes('webp') || name.endsWith('.webp')) {
          format = 'webp';
        }

        return {
          id,
          file,
          originalName: file.name,
          originalSize: file.size,
          format,
          previewUrl,
          status: 'scanning',
        };
      });

      setFiles((prev) => [...prev, ...newItems]);
      if (!activeFileId && newItems.length > 0) {
        setActiveFileId(newItems[0].id);
      }

      // Asynchronously scan metadata for each item
      for (const item of newItems) {
        try {
          // Read image dimensions
          const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
            img.onerror = () => resolve({ width: 0, height: 0 });
            img.src = item.previewUrl;
          });

          // Parse metadata report
          const report = await parseImageMetadata(item.file);

          setFiles((prev) =>
            prev.map((f) =>
              f.id === item.id
                ? {
                    ...f,
                    format: report.format !== 'unknown' ? report.format : f.format,
                    originalWidth: dimensions.width,
                    originalHeight: dimensions.height,
                    status: 'parsed',
                    metadataReport: report,
                  }
                : f
            )
          );
        } catch (err: any) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === item.id
                ? {
                    ...f,
                    status: 'error',
                    errorMessage: err?.message || 'We could not read the metadata of this file.',
                  }
                : f
            )
          );
        }
      }
    },
    [activeFileId, registerUrl]
  );

  // Clean active file
  const cleanActiveFile = useCallback(async () => {
    if (!activeFile || !activeFile.metadataReport || isProcessing) return;

    setIsProcessing(true);
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFile.id ? { ...f, status: 'cleaning' } : f))
    );

    try {
      // Execute cleaning pipeline
      const cleanResult = await cleanImageMetadata(activeFile.file, activeFile.format);

      // Verify the generated copy
      const verification = await verifyCleanCopy(
        cleanResult.blob,
        activeFile.metadataReport,
        cleanResult.method
      );

      const cleanedUrl = registerUrl(URL.createObjectURL(cleanResult.blob));
      const cleanedName = generateCleanFilename(activeFile.originalName);

      setFiles((prev) =>
        prev.map((f) =>
          f.id === activeFile.id
            ? {
                ...f,
                status: 'cleaned',
                cleanedBlob: cleanResult.blob,
                cleanedUrl,
                cleanedSize: cleanResult.blob.size,
                cleanedName,
                verificationResult: verification,
              }
            : f
        )
      );
    } catch (err: any) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === activeFile.id
            ? {
                ...f,
                status: 'error',
                errorMessage: err?.message || 'Failed to create clean image copy.',
              }
            : f
        )
      );
    } finally {
      setIsProcessing(false);
    }
  }, [activeFile, isProcessing, registerUrl]);

  // Clean all files in batch
  const cleanAllFiles = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const pending = files.filter((f) => f.status === 'parsed');

    for (const item of pending) {
      if (!item.metadataReport) continue;
      try {
        setFiles((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: 'cleaning' } : f))
        );

        const cleanResult = await cleanImageMetadata(item.file, item.format);
        const verification = await verifyCleanCopy(
          cleanResult.blob,
          item.metadataReport,
          cleanResult.method
        );

        const cleanedUrl = registerUrl(URL.createObjectURL(cleanResult.blob));
        const cleanedName = generateCleanFilename(item.originalName);

        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? {
                  ...f,
                  status: 'cleaned',
                  cleanedBlob: cleanResult.blob,
                  cleanedUrl,
                  cleanedSize: cleanResult.blob.size,
                  cleanedName,
                  verificationResult: verification,
                }
              : f
          )
        );
      } catch (err: any) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? {
                  ...f,
                  status: 'error',
                  errorMessage: err?.message || 'Failed to clean metadata.',
                }
              : f
          )
        );
      }
    }

    setIsProcessing(false);
  }, [files, isProcessing, registerUrl]);

  // Download a single cleaned image
  const downloadFile = useCallback((item: ImageMetadataItem) => {
    const url = item.cleanedUrl || item.previewUrl;
    const name = item.cleanedName || item.originalName;
    if (!url) return;

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = name;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }, []);

  // Download all cleaned images as a ZIP
  const downloadAllZip = useCallback(async () => {
    const cleanedItems = files.filter((f) => f.status === 'cleaned' && f.cleanedBlob);
    if (cleanedItems.length === 0) return;

    if (cleanedItems.length === 1) {
      downloadFile(cleanedItems[0]);
      return;
    }

    setIsZipping(true);
    try {
      const zipInputs = cleanedItems.map((item) => ({
        name: item.cleanedName || generateCleanFilename(item.originalName),
        data: item.cleanedBlob!,
      }));

      const zipBlob = await createZipBlob(zipInputs);
      const zipUrl = URL.createObjectURL(zipBlob);

      const anchor = document.createElement('a');
      anchor.href = zipUrl;
      anchor.download = 'zorli-cleaned-images.zip';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      setTimeout(() => URL.revokeObjectURL(zipUrl), 30000);
    } catch (err) {
      cleanedItems.forEach((item) => downloadFile(item));
    } finally {
      setIsZipping(false);
    }
  }, [downloadFile, files]);

  // Select active file
  const selectActiveFile = useCallback((id: string) => {
    setActiveFileId(id);
  }, []);

  // Remove a file
  const removeFile = useCallback(
    (id: string) => {
      setFiles((prev) => {
        const target = prev.find((f) => f.id === id);
        if (target) {
          releaseUrl(target.previewUrl);
          releaseUrl(target.cleanedUrl);
        }
        const remaining = prev.filter((f) => f.id !== id);
        if (activeFileId === id) {
          const next = remaining.find((f) => f.status !== 'error') || remaining[0];
          setActiveFileId(next ? next.id : null);
        }
        return remaining;
      });
    },
    [activeFileId, releaseUrl]
  );

  // Clear all files
  const clearFiles = useCallback(() => {
    files.forEach((f) => {
      releaseUrl(f.previewUrl);
      releaseUrl(f.cleanedUrl);
    });
    setFiles([]);
    setActiveFileId(null);
  }, [files, releaseUrl]);

  return {
    files,
    activeFile,
    activeFileId,
    isProcessing,
    isZipping,
    addFiles,
    cleanActiveFile,
    cleanAllFiles,
    downloadFile,
    downloadAllZip,
    selectActiveFile,
    removeFile,
    clearFiles,
  };
}
