import { useState, useCallback, useEffect } from 'react';
import { MergerFileItem, MergerProgress, MergerResult } from '../types';
import { inspectPdfFile, mergePdfs } from '../lib/pdf-merger-engine';
import { sanitizePdfFilename } from '../lib/format-utils';

export function usePdfMerger() {
  const [files, setFiles] = useState<MergerFileItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [progress, setProgress] = useState<MergerProgress | null>(null);
  const [result, setResult] = useState<MergerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [outputFilename, setOutputFilename] = useState('merged-document.pdf');

  // Clean up object URLs when result changes or unmounts
  useEffect(() => {
    return () => {
      if (result?.downloadUrl) {
        URL.revokeObjectURL(result.downloadUrl);
      }
    };
  }, [result]);

  const addFiles = useCallback(async (selectedFiles: File[]) => {
    setError(null);
    setResult(null);

    const newItems: MergerFileItem[] = [];
    const errors: string[] = [];

    for (const file of selectedFiles) {
      const id = `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      try {
        const info = await inspectPdfFile(file);
        newItems.push({
          id,
          file,
          name: file.name,
          size: file.size,
          pageCount: info.pageCount,
          status: 'ready',
        });
      } catch (err: any) {
        errors.push(err?.message || `Failed to read "${file.name}".`);
      }
    }

    if (errors.length > 0) {
      setError(errors.join(' '));
    }

    if (newItems.length > 0) {
      setFiles((prev) => [...prev, ...newItems]);
    }
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setResult(null);
    setError(null);
  }, []);

  const clearFiles = useCallback(() => {
    if (result?.downloadUrl) {
      URL.revokeObjectURL(result.downloadUrl);
    }
    setFiles([]);
    setResult(null);
    setError(null);
    setProgress(null);
    setIsMerging(false);
  }, [result]);

  const moveUp = useCallback((index: number) => {
    if (index <= 0) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setResult(null);
  }, []);

  const moveDown = useCallback((index: number) => {
    setFiles((prev) => {
      if (index >= prev.length - 1) return prev;
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setResult(null);
  }, []);

  const reorderFiles = useCallback((startIndex: number, endIndex: number) => {
    if (startIndex === endIndex) return;
    setFiles((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(startIndex, 1);
      copy.splice(endIndex, 0, removed);
      return copy;
    });
    setResult(null);
  }, []);

  const startMerge = useCallback(async () => {
    if (files.length < 2) {
      setError('Add at least two PDF files to merge.');
      return;
    }

    setError(null);
    setIsMerging(true);
    setProgress({
      stage: 'reading',
      message: `Preparing ${files.length} PDF documents...`,
      percentage: 10,
    });

    try {
      const rawFiles = files.map((item) => item.file);
      const mergeResult = await mergePdfs(rawFiles, (p) => setProgress(p));
      setResult(mergeResult);
    } catch (err: any) {
      setError(err?.message || 'Merge operation failed.');
    } finally {
      setIsMerging(false);
    }
  }, [files]);

  const downloadMergedPdf = useCallback(() => {
    if (!result) return;

    const safeName = sanitizePdfFilename(outputFilename);
    const link = document.createElement('a');
    link.href = result.downloadUrl;
    link.download = safeName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [result, outputFilename]);

  const totalInputSize = files.reduce((acc, f) => acc + f.size, 0);
  const totalInputPages = files.reduce((acc, f) => acc + f.pageCount, 0);

  return {
    files,
    isMerging,
    progress,
    result,
    error,
    outputFilename,
    setOutputFilename,
    totalInputSize,
    totalInputPages,
    addFiles,
    removeFile,
    clearFiles,
    moveUp,
    moveDown,
    reorderFiles,
    startMerge,
    reset: clearFiles,
    downloadMergedPdf,
  };
}
