import { FormatOption, SupportedFormat, TargetMimeType } from '../types';

export const FORMAT_OPTIONS: FormatOption[] = [
  {
    format: 'jpg',
    label: 'JPG',
    mimeType: 'image/jpeg',
    extension: '.jpg',
    description: 'Best for photographs and smaller file sizes',
    isLossy: true,
    supportsTransparency: false,
  },
  {
    format: 'png',
    label: 'PNG',
    mimeType: 'image/png',
    extension: '.png',
    description: 'Best for transparency and lossless graphics',
    isLossy: false,
    supportsTransparency: true,
  },
  {
    format: 'webp',
    label: 'WebP',
    mimeType: 'image/webp',
    extension: '.webp',
    description: 'Modern format with efficient compression',
    isLossy: true,
    supportsTransparency: true,
  },
];

export function getFormatOption(format: SupportedFormat): FormatOption {
  const found = FORMAT_OPTIONS.find((f) => f.format === format);
  return found || FORMAT_OPTIONS[0];
}

/**
 * Returns the target MIME type for a given supported format.
 */
export function getMimeTypeForFormat(format: SupportedFormat): TargetMimeType {
  switch (format) {
    case 'jpg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
}

export const getTargetMimeType = getMimeTypeForFormat;

export function isLossyFormat(format: SupportedFormat): boolean {
  return format === 'jpg' || format === 'webp';
}

/**
 * Generates converted download filename by replacing the original extension
 * with the new format extension, sanitizing characters, and preserving the base name.
 * e.g. "vacation-photo.png" -> "vacation-photo.jpg"
 */
export function generateConvertedFilename(
  originalName: string,
  targetFormat: SupportedFormat
): string {
  const cleanName = (originalName || 'image').trim();
  const lastDotIndex = cleanName.lastIndexOf('.');
  const baseName = lastDotIndex > 0 ? cleanName.substring(0, lastDotIndex) : cleanName;

  // Sanitize filename for safe cross-platform file saving
  const sanitizedBase =
    baseName.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').trim() || 'converted-image';

  const ext = targetFormat === 'jpg' ? '.jpg' : targetFormat === 'png' ? '.png' : '.webp';
  return `${sanitizedBase}${ext}`;
}

/**
 * Calculates the exact percentage change in file size between original and converted.
 * e.g. -65.2% (smaller) or +12.4% (larger).
 * Strictly calculated from real byte sizes.
 */
export function calculateSizeDelta(
  originalSize: number,
  outputSize: number
): { deltaPercent: number; isSmaller: boolean } {
  if (!originalSize || originalSize <= 0 || !outputSize || outputSize <= 0) {
    return { deltaPercent: 0, isSmaller: false };
  }

  const diff = outputSize - originalSize;
  const pct = Math.round((diff / originalSize) * 1000) / 10;
  return {
    deltaPercent: pct,
    isSmaller: outputSize < originalSize,
  };
}

/**
 * Decodes an image File or Blob into an HTMLImageElement using Object URL.
 */
export function loadImageElement(file: Blob | File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
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
      reject(new Error("We couldn't read this image. Please try another file."));
    };

    img.src = url;
  });
}

export interface ConvertOptions {
  targetFormat: SupportedFormat;
  quality: number; // 1 to 100
  backgroundColor?: string; // Hex color for flattening transparency in JPG (default: #FFFFFF)
}

export interface ConvertResult {
  blob: Blob;
  mimeType: string;
  width: number;
  height: number;
  size: number;
}

/**
 * Converts an image file to the target format entirely client-side using an HTML5 Canvas.
 * - Handles transparency: when converting to JPG, properly flattens onto the chosen background color.
 * - Handles quality: applies quality to lossy formats (JPG, WebP).
 * - Preserves native dimensions.
 */
export async function convertImageFile(
  file: File | Blob,
  options: ConvertOptions
): Promise<ConvertResult> {
  const img = await loadImageElement(file);

  const width = Math.max(1, img.naturalWidth || img.width || 1);
  const height = Math.max(1, img.naturalHeight || img.height || 1);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('This image couldn’t be processed in your browser.');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const { targetFormat, quality = 85, backgroundColor = '#FFFFFF' } = options;
  const mimeType = getMimeTypeForFormat(targetFormat);

  if (targetFormat === 'jpg') {
    // JPG does not support alpha transparency: flatten onto chosen background
    ctx.fillStyle = backgroundColor || '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
  } else {
    // PNG and WebP support transparency
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
  }

  // Quality parameter for toBlob: 0.01 to 1.0 (only used by lossy formats like jpeg and webp)
  const qualityFactor = Math.max(0.01, Math.min(1.0, quality / 100));

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Conversion failed for this image. Please try again.'));
          return;
        }

        resolve({
          blob,
          mimeType,
          width,
          height,
          size: blob.size,
        });
      },
      mimeType,
      targetFormat === 'png' ? undefined : qualityFactor
    );
  });
}
