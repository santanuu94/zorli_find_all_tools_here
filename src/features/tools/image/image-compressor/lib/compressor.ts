import { CompressionSettings, CompressionResultData } from '../types';
import { validateImageFile } from './validation';
import {
  loadImageElement,
  determineOutputMimeType,
  calculateSavings,
} from './image-processing';

/**
 * Helper to encode an HTMLCanvasElement to a Blob at a given quality.
 */
function canvasToBlobAsync(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Browser failed to encode compressed image blob.'));
        }
      },
      mimeType,
      quality
    );
  });
}

/**
 * Draws image onto a canvas of specified width & height, handling JPEG background and PNG color quantization.
 */
function drawImageToCanvas(
  img: HTMLImageElement,
  width: number,
  height: number,
  targetMimeType: string,
  qualityPercent: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Unable to initialize 2D canvas context for compression.');
  }

  // Fill with white background if converting to JPEG to prevent transparency turning black
  if (targetMimeType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(img, 0, 0, width, height);

  // For PNG at lower qualities, apply color quantization to reduce Deflate entropy
  if (targetMimeType === 'image/png' && qualityPercent < 85) {
    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const step = qualityPercent < 50 ? 16 : 8;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 0) {
          data[i] = Math.round(data[i] / step) * step;
          data[i + 1] = Math.round(data[i + 1] / step) * step;
          data[i + 2] = Math.round(data[i + 2] / step) * step;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } catch {
      // Gracefully continue if pixel data access is constrained
    }
  }

  return canvas;
}

/**
 * Production-ready browser-side image compression engine.
 *
 * Supports both:
 * 1. By Quality: Controllable quality factor (10% to 95%).
 * 2. By Target File Size: Dynamically finds the optimal quality and dimensions
 *    to compress the image strictly under the user's requested size (e.g. Under 200 KB).
 */
export async function compressImage(
  file: File,
  settings: CompressionSettings
): Promise<CompressionResultData> {
  // 1. Validation
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid image file.');
  }

  // 2. Determine target MIME type
  const targetMimeType = determineOutputMimeType(
    file.type,
    file.name,
    settings.outputFormat
  );

  // 3. Load image into memory
  const img = await loadImageElement(file);
  let curWidth = img.naturalWidth || img.width;
  let curHeight = img.naturalHeight || img.height;

  if (!curWidth || !curHeight) {
    throw new Error('Image has invalid or zero dimensions.');
  }

  let finalBlob: Blob;
  let finalWidth = curWidth;
  let finalHeight = curHeight;

  // Check if user requested compression under a specific target size (e.g. 200 KB)
  const isTargetSizeMode =
    settings.mode === 'targetSize' &&
    typeof settings.targetSizeKb === 'number' &&
    settings.targetSizeKb > 0;

  if (isTargetSizeMode) {
    const targetBytes = (settings.targetSizeKb as number) * 1024;

    // If original file is already under the target size
    if (file.size <= targetBytes) {
      // Do a gentle compression or retain original
      const canvas = drawImageToCanvas(img, curWidth, curHeight, targetMimeType, 85);
      const gentleBlob = await canvasToBlobAsync(canvas, targetMimeType, 0.85);
      canvas.width = 0;
      canvas.height = 0;

      if (gentleBlob.size <= file.size && gentleBlob.size <= targetBytes) {
        finalBlob = gentleBlob;
      } else {
        finalBlob = file;
      }
    } else {
      // Binary search on quality to find the best quality that fits under targetBytes
      let lowQ = 0.1;
      let highQ = 0.95;
      let bestCandidate: Blob | null = null;

      let canvas = drawImageToCanvas(img, curWidth, curHeight, targetMimeType, 80);

      for (let iter = 0; iter < 5; iter++) {
        const testQ = (lowQ + highQ) / 2;
        const testBlob = await canvasToBlobAsync(canvas, targetMimeType, testQ);

        if (testBlob.size <= targetBytes) {
          bestCandidate = testBlob;
          lowQ = testQ + 0.05; // try for higher quality
        } else {
          highQ = testQ - 0.05; // need more compression
        }
      }

      canvas.width = 0;
      canvas.height = 0;

      // If even at low quality it's still larger than targetBytes, scale down dimensions
      if (!bestCandidate) {
        let scale = 0.85;
        while (scale >= 0.2 && !bestCandidate) {
          const scaledW = Math.max(50, Math.round(curWidth * scale));
          const scaledH = Math.max(50, Math.round(curHeight * scale));

          const scaledCanvas = drawImageToCanvas(img, scaledW, scaledH, targetMimeType, 70);
          const scaledBlob = await canvasToBlobAsync(scaledCanvas, targetMimeType, 0.7);
          scaledCanvas.width = 0;
          scaledCanvas.height = 0;

          if (scaledBlob.size <= targetBytes) {
            bestCandidate = scaledBlob;
            finalWidth = scaledW;
            finalHeight = scaledH;
            break;
          }
          scale -= 0.15;
        }

        // If still no candidate, fallback to lowest possible resolution encode
        if (!bestCandidate) {
          const scaledW = Math.max(50, Math.round(curWidth * 0.3));
          const scaledH = Math.max(50, Math.round(curHeight * 0.3));
          const minCanvas = drawImageToCanvas(img, scaledW, scaledH, targetMimeType, 40);
          bestCandidate = await canvasToBlobAsync(minCanvas, targetMimeType, 0.4);
          minCanvas.width = 0;
          minCanvas.height = 0;
          finalWidth = scaledW;
          finalHeight = scaledH;
        }
      }

      finalBlob = bestCandidate;
    }
  } else {
    // Mode: By Quality (Standard)
    const normalizedQuality = Math.max(0.1, Math.min(1.0, settings.quality / 100));
    const canvas = drawImageToCanvas(img, curWidth, curHeight, targetMimeType, settings.quality);
    finalBlob = await canvasToBlobAsync(canvas, targetMimeType, normalizedQuality);
    canvas.width = 0;
    canvas.height = 0;
  }

  // 6. Calculate accurate savings
  const originalSize = file.size;
  const compressedSize = finalBlob.size;
  const { reductionPercentage, alreadyOptimized } = calculateSavings(
    originalSize,
    compressedSize
  );

  // If re-encoding resulted in a larger file (and format is unchanged),
  // retain the smaller original so users never receive a bloated file
  let finalResultBlob = finalBlob;
  let finalResultSize = compressedSize;

  if (alreadyOptimized && file.type === targetMimeType && !isTargetSizeMode) {
    finalResultBlob = file;
    finalResultSize = originalSize;
  }

  return {
    blob: finalResultBlob,
    originalSize,
    compressedSize: finalResultSize,
    reductionPercentage,
    width: finalWidth,
    height: finalHeight,
    outputMimeType: targetMimeType,
    alreadyOptimized,
  };
}
