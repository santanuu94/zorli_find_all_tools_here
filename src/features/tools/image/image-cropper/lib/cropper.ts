import { AspectRatioPreset, PixelCrop, SupportedFormat } from '../types';
import { SOCIAL_PLATFORMS, SocialPlatform, SocialPreset } from '../../common/social-presets';

export { SOCIAL_PLATFORMS };
export type { SocialPlatform, SocialPreset };

export const ASPECT_RATIO_PRESETS: AspectRatioPreset[] = [
  {
    id: 'free',
    label: 'Free',
    description: 'Custom unconstrained crop box',
  },
  {
    id: '1:1',
    label: '1:1',
    ratio: 1,
    description: 'Square (Instagram Post, Profile Avatar)',
  },
  {
    id: '4:5',
    label: '4:5',
    ratio: 4 / 5,
    description: 'Vertical Portrait (Instagram Feed)',
  },
  {
    id: '3:4',
    label: '3:4',
    ratio: 3 / 4,
    description: 'Standard Vertical Photo',
  },
  {
    id: '16:9',
    label: '16:9',
    ratio: 16 / 9,
    description: 'Widescreen (YouTube Video, X Header)',
  },
  {
    id: '9:16',
    label: '9:16',
    ratio: 9 / 16,
    description: 'Vertical Full Screen (Shorts, Reels, Stories)',
  },
];

/**
 * Generates cropped download filename preserving the original base name and extension.
 * e.g. "my-vacation.png" -> "cropped-my-vacation.png"
 */
export function generateCroppedFilename(originalName: string): string {
  const cleanName = (originalName || 'image').trim();
  const lastDot = cleanName.lastIndexOf('.');
  if (lastDot > 0) {
    const base = cleanName.substring(0, lastDot);
    const ext = cleanName.substring(lastDot);
    return `cropped-${base}${ext}`;
  }
  return `cropped-${cleanName}`;
}

/**
 * Maps a supported format to its MIME type.
 */
export function getMimeTypeForFormat(format: SupportedFormat): string {
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

/**
 * Calculates numeric aspect ratio for a social preset.
 */
export function getSocialPresetRatio(preset: SocialPreset): number {
  if (!preset || preset.height === 0) return 1;
  return preset.width / preset.height;
}

/**
 * Creates an intermediate rotated and flipped canvas of the source image.
 */
export function createTransformedCanvas(
  image: HTMLImageElement,
  rotation: number,
  flipH: boolean,
  flipV: boolean
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  const rotRad = (rotation * Math.PI) / 180;
  const isPerpendicular = rotation === 90 || rotation === 270;

  const w = isPerpendicular ? image.naturalHeight : image.naturalWidth;
  const h = isPerpendicular ? image.naturalWidth : image.naturalHeight;

  canvas.width = Math.max(1, w);
  canvas.height = Math.max(1, h);

  ctx.save();
  // Move origin to center of canvas
  ctx.translate(canvas.width / 2, canvas.height / 2);
  // Apply rotation
  ctx.rotate(rotRad);
  // Apply scale/flip
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  // Draw image centered
  ctx.drawImage(
    image,
    -image.naturalWidth / 2,
    -image.naturalHeight / 2,
    image.naturalWidth,
    image.naturalHeight
  );
  ctx.restore();

  return canvas;
}

export interface CropResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
}

/**
 * Crops the image using HTML5 Canvas, taking into account rotation, flip, and coordinates.
 */
export async function cropImageToBlob(
  image: HTMLImageElement,
  crop: PixelCrop,
  rotation: number = 0,
  flipH: boolean = false,
  flipV: boolean = false,
  format: SupportedFormat = 'jpg',
  quality: number = 0.92
): Promise<CropResult> {
  const needsTransform = rotation !== 0 || flipH || flipV;
  const source: CanvasImageSource = needsTransform
    ? createTransformedCanvas(image, rotation, flipH, flipV)
    : image;

  const sourceWidth = needsTransform
    ? (source as HTMLCanvasElement).width
    : (image.naturalWidth || image.width);
  const sourceHeight = needsTransform
    ? (source as HTMLCanvasElement).height
    : (image.naturalHeight || image.height);

  // Clamp crop rectangle strictly inside bounds
  const clampedX = Math.max(0, Math.min(crop.x, sourceWidth - 1));
  const clampedY = Math.max(0, Math.min(crop.y, sourceHeight - 1));
  const clampedWidth = Math.max(
    1,
    Math.min(crop.width, sourceWidth - clampedX)
  );
  const clampedHeight = Math.max(
    1,
    Math.min(crop.height, sourceHeight - clampedY)
  );

  const targetWidth = Math.round(clampedWidth);
  const targetHeight = Math.round(clampedHeight);

  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = targetWidth;
  cropCanvas.height = targetHeight;

  const ctx = cropCanvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context for crop');

  // Enable high quality image scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // If output is JPG and source has transparency, flatten onto white background
  if (format === 'jpg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  ctx.drawImage(
    source,
    clampedX,
    clampedY,
    clampedWidth,
    clampedHeight,
    0,
    0,
    targetWidth,
    targetHeight
  );

  const mimeType = getMimeTypeForFormat(format);
  const q = format === 'png' ? undefined : quality;

  return new Promise((resolve, reject) => {
    cropCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to encode cropped image.'));
          return;
        }
        const url = URL.createObjectURL(blob);
        resolve({
          blob,
          url,
          width: targetWidth,
          height: targetHeight,
          size: blob.size,
        });
      },
      mimeType,
      q
    );
  });
}
