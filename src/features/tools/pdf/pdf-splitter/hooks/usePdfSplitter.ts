import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  PdfSourceInfo,
  RangeRow,
  SplitMode,
  SplitOutputItem,
  SplitPlan,
  SplitProgress,
} from '../types';
import {
  inspectPdfSource,
  splitPdf,
} from '../lib/pdf-splitter-engine';
import {
  buildEqualPlan,
  buildExtractPlan,
  buildRangePlan,
} from '../lib/split-plan-generator';
import { readFileAsUint8Array, safeRevokeObjectURL } from '../lib/format-utils';
import { createSplitZipBlob, triggerDownload } from '../lib/zip-utils';

export function usePdfSplitter() {
  const [sourceInfo, setSourceInfo] = useState<PdfSourceInfo | null>(null);
  const [sourceBytes, setSourceBytes] = useState<Uint8Array | null>(null);
  const [isInspecting, setIsInspecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Splitting mode selection
  const [mode, setMode] = useState<SplitMode>('range');

  // Mode A: Range rows
  const [rangeRows, setRangeRows] = useState<RangeRow[]>([]);

  // Mode B: Extract individual pages
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [extractText, setExtractText] = useState<string>('');

  // Mode C: Equal groups
  const [pagesPerGroup, setPagesPerGroup] = useState<number>(5);

  // Execution & Results
  const [isSplitting, setIsSplitting] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [progress, setProgress] = useState<SplitProgress>({
    stage: 'idle',
    currentPart: 0,
    totalParts: 0,
    message: '',
  });
  const [outputs, setOutputs] = useState<SplitOutputItem[] | null>(null);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (outputs) {
        outputs.forEach((out) => safeRevokeObjectURL(out.downloadUrl));
      }
    };
  }, [outputs]);

  // Handle uploaded source file
  const handleSelectFile = useCallback(async (file: File) => {
    setIsInspecting(true);
    setError(null);
    setOutputs(null);

    try {
      const bytes = await readFileAsUint8Array(file);
      const info = await inspectPdfSource(file);

      setSourceBytes(bytes);
      setSourceInfo(info);

      // Initialize sensible defaults for the 3 modes based on actual page count
      const totalPages = info.pageCount;

      // Mode A default
      if (totalPages === 1) {
        setRangeRows([{ id: '1', start: 1, end: 1 }]);
      } else {
        const mid = Math.min(5, Math.ceil(totalPages / 2));
        setRangeRows([
          { id: '1', start: 1, end: mid },
          { id: '2', start: mid + 1, end: totalPages },
        ]);
      }

      // Mode B default
      setSelectedPages([1]);
      setExtractText('1');

      // Mode C default
      const defaultEqual = totalPages > 15 ? 5 : totalPages > 4 ? 2 : 1;
      setPagesPerGroup(defaultEqual);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to inspect PDF document.';
      setError(msg);
      setSourceInfo(null);
      setSourceBytes(null);
    } finally {
      setIsInspecting(false);
    }
  }, []);

  // Mode A Range Handlers
  const addRangeRow = useCallback(() => {
    if (!sourceInfo) return;
    setRangeRows((prev) => {
      const last = prev[prev.length - 1];
      let nextStart = 1;
      if (last && typeof last.end === 'number' && last.end < sourceInfo.pageCount) {
        nextStart = last.end + 1;
      }
      const nextEnd = Math.min(nextStart + 4, sourceInfo.pageCount);
      return [
        ...prev,
        {
          id: String(Date.now() + Math.random()),
          start: nextStart,
          end: nextEnd,
        },
      ];
    });
  }, [sourceInfo]);

  const removeRangeRow = useCallback((id: string) => {
    setRangeRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateRangeRow = useCallback((id: string, updates: Partial<RangeRow>) => {
    setRangeRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  }, []);

  // Mode B Extract Handlers
  const togglePage = useCallback(
    (page: number) => {
      setSelectedPages((prev) => {
        const next = prev.includes(page)
          ? prev.filter((p) => p !== page)
          : [...prev, page].sort((a, b) => a - b);
        setExtractText(next.join(', '));
        return next;
      });
    },
    []
  );

  const handleExtractTextChange = useCallback(
    (text: string) => {
      setExtractText(text);
      if (!sourceInfo) return;

      // Parse comma-separated or space-separated numbers and ranges (e.g. 1, 3, 5-7)
      const parts = text.split(/[\s,]+/).filter(Boolean);
      const pagesSet = new Set<number>();

      for (const part of parts) {
        if (/^\d+$/.test(part)) {
          const num = parseInt(part, 10);
          if (num >= 1 && num <= sourceInfo.pageCount) {
            pagesSet.add(num);
          }
        } else if (/^\d+-\d+$/.test(part)) {
          const [s, e] = part.split('-').map((v) => parseInt(v, 10));
          if (s <= e) {
            for (let i = s; i <= e; i++) {
              if (i >= 1 && i <= sourceInfo.pageCount) {
                pagesSet.add(i);
              }
            }
          }
        }
      }

      setSelectedPages(Array.from(pagesSet).sort((a, b) => a - b));
    },
    [sourceInfo]
  );

  const selectOddPages = useCallback(() => {
    if (!sourceInfo) return;
    const odds: number[] = [];
    for (let i = 1; i <= sourceInfo.pageCount; i += 2) {
      odds.push(i);
    }
    setSelectedPages(odds);
    setExtractText(odds.join(', '));
  }, [sourceInfo]);

  const selectEvenPages = useCallback(() => {
    if (!sourceInfo) return;
    const evens: number[] = [];
    for (let i = 2; i <= sourceInfo.pageCount; i += 2) {
      evens.push(i);
    }
    setSelectedPages(evens);
    setExtractText(evens.join(', '));
  }, [sourceInfo]);

  const selectAllPages = useCallback(() => {
    if (!sourceInfo) return;
    const all = Array.from({ length: sourceInfo.pageCount }, (_, i) => i + 1);
    setSelectedPages(all);
    setExtractText(all.join(', '));
  }, [sourceInfo]);

  const clearSelectedPages = useCallback(() => {
    setSelectedPages([]);
    setExtractText('');
  }, []);

  // Compute the current SplitPlan reactively
  const plan: SplitPlan = useMemo(() => {
    if (!sourceInfo) {
      return {
        mode,
        items: [],
        totalPages: 0,
        coveredPages: [],
        uncoveredPages: [],
        hasOverlaps: false,
        isValid: false,
      };
    }

    if (mode === 'range') {
      return buildRangePlan(sourceInfo.pageCount, rangeRows, sourceInfo.name);
    }
    if (mode === 'extract') {
      return buildExtractPlan(sourceInfo.pageCount, selectedPages, sourceInfo.name);
    }
    return buildEqualPlan(sourceInfo.pageCount, pagesPerGroup, sourceInfo.name);
  }, [mode, sourceInfo, rangeRows, selectedPages, pagesPerGroup]);

  // Execute Split
  const startSplit = useCallback(async () => {
    if (!sourceBytes || !plan.isValid || plan.items.length === 0) return;

    setIsSplitting(true);
    setError(null);
    setProgress({
      stage: 'splitting',
      currentPart: 1,
      totalParts: plan.items.length,
      message: `Splitting document into ${plan.items.length} parts...`,
    });

    try {
      const results = await splitPdf(sourceBytes, plan, (current, total) => {
        setProgress({
          stage: 'splitting',
          currentPart: current,
          totalParts: total,
          message: `Creating part ${current} of ${total}...`,
        });
      });

      setOutputs(results);
      setProgress({
        stage: 'done',
        currentPart: plan.items.length,
        totalParts: plan.items.length,
        message: 'PDF split completed successfully!',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Splitting operation failed.';
      setError(msg);
      setProgress({
        stage: 'error',
        currentPart: 0,
        totalParts: plan.items.length,
        message: msg,
      });
    } finally {
      setIsSplitting(false);
    }
  }, [sourceBytes, plan]);

  // Download Individual Output
  const downloadSingleOutput = useCallback((output: SplitOutputItem) => {
    triggerDownload(output.downloadUrl, output.filename);
  }, []);

  // Download All as ZIP
  const downloadAllZip = useCallback(async () => {
    if (!outputs || outputs.length === 0) return;

    if (outputs.length === 1) {
      downloadSingleOutput(outputs[0]);
      return;
    }

    setIsZipping(true);
    try {
      const zipBlob = await createSplitZipBlob(outputs);
      const zipUrl = URL.createObjectURL(zipBlob);
      const zipName = `${(sourceInfo?.name || 'document')
        .replace(/\.pdf$/i, '')
        .trim()}_split.zip`;

      triggerDownload(zipUrl, zipName);
      setTimeout(() => URL.revokeObjectURL(zipUrl), 30000);
    } catch (err: unknown) {
      // Fallback: download individually if ZIP fails
      outputs.forEach((out) => downloadSingleOutput(out));
    } finally {
      setIsZipping(false);
    }
  }, [outputs, sourceInfo, downloadSingleOutput]);

  // Reset tool
  const reset = useCallback(() => {
    if (outputs) {
      outputs.forEach((out) => safeRevokeObjectURL(out.downloadUrl));
    }
    setSourceInfo(null);
    setSourceBytes(null);
    setOutputs(null);
    setError(null);
    setRangeRows([]);
    setSelectedPages([]);
    setExtractText('');
    setProgress({
      stage: 'idle',
      currentPart: 0,
      totalParts: 0,
      message: '',
    });
  }, [outputs]);

  return {
    sourceInfo,
    isInspecting,
    error,
    mode,
    setMode,
    rangeRows,
    addRangeRow,
    removeRangeRow,
    updateRangeRow,
    selectedPages,
    extractText,
    togglePage,
    handleExtractTextChange,
    selectOddPages,
    selectEvenPages,
    selectAllPages,
    clearSelectedPages,
    pagesPerGroup,
    setPagesPerGroup,
    plan,
    isSplitting,
    isZipping,
    progress,
    outputs,
    handleSelectFile,
    startSplit,
    downloadSingleOutput,
    downloadAllZip,
    reset,
  };
}
