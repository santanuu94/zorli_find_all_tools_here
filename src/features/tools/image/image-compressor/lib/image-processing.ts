/**
 * Image processing helpers for decoding, MIME detection, filename generation,
 * and percentage savings calculation.
 */

/**
 * Loads an image File or Blob into an HTMLImageElement using an object URL.
 */
export async function loadImageElement(file: Blob | File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    // If running in an environment without document/Image, guard gracefully
    if (typeof window === 'undefined' || typeof Image === 'undefined') {
      return reject(new Error('Browser environment required to decode image.'));
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to decode image. File may be corrupted or unsupported.'));
    };

    img.src = url;
  });
}

/**
 * Determines the target output MIME type based on the original file and requested format.
 */
export function determineOutputMimeType(
  originalType: string,
  originalName: string,
  requestedFormat: 'original' | 'jpeg' | 'png' | 'webp' = 'original'
): string {
  if (requestedFormat === 'jpeg') return 'image/jpeg';
  if (requestedFormat === 'png') return 'image/png';
  if (requestedFormat === 'webp') return 'image/webp';

  const type = (originalType || '').toLowerCase();
  const name = (originalName || '').toLowerCase();

  if (type === 'image/png' || name.endsWith('.png')) return 'image/png';
  if (type === 'image/webp' || name.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
}

/**
 * Generates an appropriate download filename: e.g. "photo.jpg" -> "photo-compressed.jpg".
 */
export function generateCompressedFilename(
  originalName: string,
  outputMimeType: string
): string {
  const cleanName = originalName || 'image';
  const lastDotIndex = cleanName.lastIndexOf('.');
  const baseName = lastDotIndex > 0 ? cleanName.substring(0, lastDotIndex) : cleanName;

  let ext = '.jpg';
  if (outputMimeType === 'image/png') ext = '.png';
  else if (outputMimeType === 'image/webp') ext = '.webp';
  else if (outputMimeType === 'image/jpeg') ext = '.jpg';

  // Sanitize base name to prevent illegal filename characters
  const sanitizedBase = baseName.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').trim() || 'image';
  return `${sanitizedBase}-compressed${ext}`;
}

/**
 * Accurately calculates size reduction without false claims.
 * Formula: ((originalSize - compressedSize) / originalSize) * 100
 */
export function calculateSavings(
  originalSize: number,
  compressedSize: number
): { reductionPercentage: number; alreadyOptimized: boolean } {
  if (originalSize <= 0) {
    return { reductionPercentage: 0, alreadyOptimized: true };
  }

  if (compressedSize >= originalSize) {
    return { reductionPercentage: 0, alreadyOptimized: true };
  }

  const rawPercent = ((originalSize - compressedSize) / originalSize) * 100;
  // Round to 1 decimal place (e.g. 71.7%)
  const reductionPercentage = Math.round(rawPercent * 10) / 10;

  return {
    reductionPercentage,
    alreadyOptimized: false,
  };
}
