import { PDFDocument, PDFName, PDFNumber } from 'pdf-lib';
import {
  CompressionProgress,
  CompressionResult,
  CompressionSettings,
  PdfFileInfo,
  TargetResultState,
} from '../types';
import {
  calculateReductionPercentage,
  calculateTargetBytes,
  hasPdfMagicBytes,
  safeCreateObjectURL,
} from './format-utils';

export { hasPdfMagicBytes };

/**
 * Robust helper to read File or Blob as Uint8Array across browsers and jsdom/test environments
 */
export async function readFileAsUint8Array(file: File | Blob): Promise<Uint8Array> {
  if (typeof (file as any).arrayBuffer === 'function') {
    try {
      const buf = await (file as any).arrayBuffer();
      return new Uint8Array(buf);
    } catch {
      // Fall through to FileReader / Node fallback
    }
  }

  if (typeof FileReader !== 'undefined') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
      reader.onerror = () => reject(reader.error || new Error('FileReader failed'));
      reader.readAsArrayBuffer(file);
    });
  }

  throw new Error('Unable to read file contents');
}

/**
 * Validate and inspect an uploaded PDF file
 */
export async function inspectPdf(file: File): Promise<PdfFileInfo> {
  if (!file) {
    throw new Error('Please upload a valid PDF file.');
  }

  // Reject files over 150MB to protect browser memory
  const maxBytes = 150 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error('This PDF is too large to safely process on this device (maximum 150 MB).');
  }

  const bytes = await readFileAsUint8Array(file);

  if (!hasPdfMagicBytes(bytes)) {
    throw new Error('Please upload a valid PDF file.');
  }

  try {
    const pdfDoc = await PDFDocument.load(bytes, {
      ignoreEncryption: false,
      updateMetadata: false,
    });

    const pageCount = pdfDoc.getPageCount();
    let imageCount = 0;

    for (const [, obj] of pdfDoc.context.enumerateIndirectObjects()) {
      const anyObj = obj as any;
      if (anyObj.dict && anyObj.dict.get(PDFName.of('Subtype')) === PDFName.of('Image')) {
        imageCount++;
      }
    }

    return {
      file,
      name: file.name,
      originalSize: file.size,
      pageCount,
      imageCount,
      isEncrypted: false,
    };
  } catch (err: any) {
    const message = err?.message || '';
    if (
      message.toLowerCase().includes('encrypt') ||
      message.toLowerCase().includes('password') ||
      message.toLowerCase().includes('decrypt')
    ) {
      throw new Error(
        'This PDF is password-protected or encrypted and cannot be compressed by this tool.'
      );
    }
    throw new Error('The uploaded PDF appears to be corrupted or invalid.');
  }
}

/**
 * Helper to recompress raw JPEG bytes using browser Image + Canvas
 */
async function recompressJpegBytes(
  jpegBytes: Uint8Array,
  quality: number,
  maxDimension?: number
): Promise<{ bytes: Uint8Array; width?: number; height?: number } | null> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  return new Promise((resolve) => {
    try {
      const blob = new Blob([jpegBytes as any], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        URL.revokeObjectURL(url);
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (maxDimension && (width > maxDimension || height > maxDimension)) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          async (compressedBlob) => {
            if (!compressedBlob) {
              resolve(null);
              return;
            }
            const buf = await compressedBlob.arrayBuffer();
            const recompressed = new Uint8Array(buf);
            // Only use the new image if it actually saved space
            if (recompressed.length < jpegBytes.length) {
              resolve({ bytes: recompressed, width, height });
            } else {
              resolve(null);
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };

      img.src = url;
    } catch {
      resolve(null);
    }
  });
}

/**
 * Main compression engine
 */
export async function compressPdf(
  file: File,
  settings: CompressionSettings,
  onProgress?: (p: CompressionProgress) => void,
  forceCompress = false
): Promise<CompressionResult> {
  const targetBytes = calculateTargetBytes(settings);

  // If already smaller than target and not forced
  if (file.size <= targetBytes && !forceCompress) {
    const downloadUrl = safeCreateObjectURL(file);
    return {
      compressedBlob: file,
      compressedSize: file.size,
      savedBytes: 0,
      reductionPercentage: 0,
      targetBytes,
      targetResultState: 'already_smaller',
      pageCount: 1,
      downloadUrl,
      message: 'This PDF is already smaller than your target.',
    };
  }

  onProgress?.({
    stage: 'reading',
    message: 'Analyzing PDF structure...',
    percentage: 15,
  });

  const rawBytes = await readFileAsUint8Array(file);

  if (!hasPdfMagicBytes(rawBytes)) {
    throw new Error('Please upload a valid PDF file.');
  }

  let pdfDoc: PDFDocument;
  try {
    pdfDoc = await PDFDocument.load(rawBytes, {
      ignoreEncryption: false,
      updateMetadata: false,
    });
  } catch (err: any) {
    const msg = err?.message || '';
    if (
      msg.toLowerCase().includes('encrypt') ||
      msg.toLowerCase().includes('password') ||
      msg.toLowerCase().includes('decrypt')
    ) {
      throw new Error(
        'This PDF is password-protected or encrypted and cannot be compressed by this tool.'
      );
    }
    throw new Error('The uploaded PDF appears to be corrupted or invalid.');
  }

  const initialPageCount = pdfDoc.getPageCount();

  onProgress?.({
    stage: 'optimizing',
    message: 'Optimizing internal objects and metadata...',
    percentage: 35,
  });

  // Strip unneeded metadata streams when requested
  if (settings.removeMetadata) {
    try {
      pdfDoc.catalog.delete(PDFName.of('Metadata'));
      pdfDoc.catalog.delete(PDFName.of('PieceInfo'));
      pdfDoc.catalog.delete(PDFName.of('SpiderInfo'));
      pdfDoc.setProducer('Zorli PDF Compressor');
      pdfDoc.setCreator('Zorli');
    } catch {
      // Non-critical optimization
    }
  }

  onProgress?.({
    stage: 'recompressing',
    message: 'Evaluating embedded images...',
    percentage: 55,
  });

  // Determine image compression aggressiveness based on target ratio and user quality setting
  const targetRatio = targetBytes / file.size;
  let imageQuality = 0.7;
  let maxDimension: number | undefined = undefined;

  if (settings.quality === 'low' || targetRatio < 0.35) {
    imageQuality = 0.45;
    maxDimension = 1400;
  } else if (settings.quality === 'high' && targetRatio > 0.75) {
    imageQuality = 0.85;
    maxDimension = 2800;
  } else {
    // Balanced
    imageQuality = 0.65;
    maxDimension = 1920;
  }

  // Scan and recompress embedded JPEG images if available
  const indirectObjects = pdfDoc.context.enumerateIndirectObjects();
  let processedImages = 0;

  for (const [ref, obj] of indirectObjects) {
    const anyObj = obj as any;
    if (
      anyObj.dict &&
      anyObj.dict.get(PDFName.of('Subtype')) === PDFName.of('Image') &&
      typeof anyObj.getContents === 'function'
    ) {
      const filter = anyObj.dict.get(PDFName.of('Filter'));
      const isJpeg = filter === PDFName.of('DCTDecode');

      if (isJpeg) {
        try {
          const contents = anyObj.getContents();
          if (contents && contents.length > 5000) {
            // Only recompress images larger than 5KB
            const recompressed = await recompressJpegBytes(
              contents,
              imageQuality,
              maxDimension
            );

            if (recompressed && recompressed.bytes.length < contents.length) {
              const newDict = anyObj.dict.clone();
              newDict.set(PDFName.of('Filter'), PDFName.of('DCTDecode'));
              newDict.set(
                PDFName.of('Length'),
                PDFNumber.of(recompressed.bytes.length)
              );
              if (recompressed.width && recompressed.height) {
                newDict.set(
                  PDFName.of('Width'),
                  PDFNumber.of(recompressed.width)
                );
                newDict.set(
                  PDFName.of('Height'),
                  PDFNumber.of(recompressed.height)
                );
              }
              const newStream = pdfDoc.context.stream(
                recompressed.bytes,
                newDict
              );
              pdfDoc.context.assign(ref, newStream);
              processedImages++;
            }
          }
        } catch {
          // If an individual image fails to recompress, keep original stream
        }
      }
    }
  }

  onProgress?.({
    stage: 'saving',
    message: 'Compiling optimized binary PDF stream...',
    percentage: 85,
  });

  // Save with cross-reference Object Streams (PDF 1.5+ stream compression)
  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  // Validate output
  if (!hasPdfMagicBytes(compressedBytes)) {
    throw new Error('PDF compression failed to generate a valid output format.');
  }

  // Double-check output integrity by attempting to reload
  const reloaded = await PDFDocument.load(compressedBytes, {
    ignoreEncryption: false,
  });
  const finalPageCount = reloaded.getPageCount();
  if (finalPageCount !== initialPageCount) {
    throw new Error('PDF page structure verification failed during compression.');
  }

  const finalSize = compressedBytes.length;
  let targetResultState: TargetResultState;
  let message: string | undefined = undefined;
  let warning: string | undefined = undefined;

  // Genuine check: did we actually save bytes?
  if (finalSize < file.size) {
    const saved = file.size - finalSize;
    const reduction = calculateReductionPercentage(file.size, finalSize);

    if (finalSize <= targetBytes) {
      targetResultState = 'target_achieved';
      message = 'Target achieved';
    } else {
      targetResultState = 'target_not_achieved';
      message =
        'PDF compressed successfully, but the requested target could not be reached without excessive quality loss.';
    }

    if (targetRatio < 0.4 && processedImages > 0) {
      warning = 'Significant image compression was applied to approach the target size.';
    }

    const compressedBlob = new Blob([compressedBytes as any], {
      type: 'application/pdf',
    });
    const downloadUrl = safeCreateObjectURL(compressedBlob);

    onProgress?.({
      stage: 'done',
      message: 'Compression complete!',
      percentage: 100,
    });

    return {
      compressedBlob,
      compressedSize: finalSize,
      savedBytes: saved,
      reductionPercentage: reduction,
      targetBytes,
      targetResultState,
      pageCount: finalPageCount,
      downloadUrl,
      message,
      warning,
    };
  } else {
    // If the PDF is already hyper-optimized and further compression did not yield savings
    targetResultState = 'already_minimal';
    message =
      'This PDF is already heavily optimized. Further compression would not reduce file size.';

    const downloadUrl = safeCreateObjectURL(file);
    return {
      compressedBlob: file,
      compressedSize: file.size,
      savedBytes: 0,
      reductionPercentage: 0,
      targetBytes,
      targetResultState,
      pageCount: finalPageCount,
      downloadUrl,
      message,
    };
  }
}
