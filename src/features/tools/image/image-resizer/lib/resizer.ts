import {
  CanvasBackground,
  PresetDimension,
  PresetFitMode,
  ResizeSettings,
  SocialPlatform,
} from '../types';

import { SOCIAL_PLATFORMS } from '../../common/social-presets';
export { SOCIAL_PLATFORMS };

export const WEB_PRESETS: PresetDimension[] = [
  {
    id: 'web-hero',
    name: 'Website Hero',
    label: '1600 × 900',
    category: 'web',
    width: 1600,
    height: 900,
    aspectRatioLabel: '16:9',
    description: 'Desktop Website Hero Banner',
  },
  {
    id: 'web-banner',
    name: 'Web Banner',
    label: '1200 × 675',
    category: 'web',
    width: 1200,
    height: 675,
    aspectRatioLabel: '16:9',
    description: 'Standard 16:9 Web Content Banner',
  },
  {
    id: 'web-blog-image',
    name: 'Blog Image',
    label: '1200 × 630',
    category: 'web',
    width: 1200,
    height: 630,
    aspectRatioLabel: '1.91:1',
    description: 'Featured Article & Blog Body Image',
  },
  {
    id: 'web-blog-thumb',
    name: 'Blog Thumbnail',
    label: '600 × 400',
    category: 'web',
    width: 600,
    height: 400,
    aspectRatioLabel: '3:2',
    description: 'Article Listing Thumbnail & Preview Card',
  },
  {
    id: 'common-1080p',
    name: 'Full HD 1080p',
    label: '1920 × 1080',
    category: 'common',
    width: 1920,
    height: 1080,
    aspectRatioLabel: '16:9',
    description: 'Standard Full HD 16:9 Display',
  },
  {
    id: 'common-720p',
    name: 'Standard HD 720p',
    label: '1280 × 720',
    category: 'common',
    width: 1280,
    height: 720,
    aspectRatioLabel: '16:9',
    description: 'Compact HD 16:9 Display',
  },
  {
    id: 'common-1200x630',
    name: 'Wide Display',
    label: '1200 × 630',
    category: 'common',
    width: 1200,
    height: 630,
    aspectRatioLabel: '1.91:1',
    description: 'Standard Wide Share & Display Format',
  },
  {
    id: 'common-1080x1080',
    name: 'Square Display',
    label: '1080 × 1080',
    category: 'common',
    width: 1080,
    height: 1080,
    aspectRatioLabel: '1:1',
    description: 'Square 1:1 Standard Format',
  },
];

// Flat list of all presets including social & web for lookup
export const PRESET_DIMENSIONS: PresetDimension[] = [
  ...SOCIAL_PLATFORMS.flatMap((platform) =>
    platform.presets.map((p) => ({
      id: p.id,
      name: p.name,
      label: `${p.width} × ${p.height}`,
      category: 'social' as const,
      width: p.width,
      height: p.height,
      aspectRatioLabel: p.aspectRatioLabel,
      description: p.description,
      platform: platform.id,
    }))
  ),
  ...WEB_PRESETS,
  // Aliases for backwards compatibility with tests and links
  {
    id: 'social-ig-post',
    name: 'Instagram Post',
    label: '1080 × 1080',
    category: 'social',
    width: 1080,
    height: 1080,
    aspectRatioLabel: '1:1',
    description: 'Instagram Feed Square Post',
  },
  {
    id: 'social-ig-story',
    name: 'Instagram Story',
    label: '1080 × 1920',
    category: 'social',
    width: 1080,
    height: 1920,
    aspectRatioLabel: '9:16',
    description: 'Stories, Reels, Shorts & TikTok',
  },
  {
    id: 'social-yt-thumb',
    name: 'YouTube Thumbnail',
    label: '1280 × 720',
    category: 'social',
    width: 1280,
    height: 720,
    aspectRatioLabel: '16:9',
    description: 'Standard YouTube Video Thumbnail',
  },
  {
    id: 'social-fb-cover',
    name: 'Facebook Cover',
    label: '820 × 312',
    category: 'social',
    width: 820,
    height: 312,
    aspectRatioLabel: '2.63:1',
    description: 'Facebook Page & Profile Header Banner',
  },
  {
    id: 'social-li-post',
    name: 'LinkedIn Post',
    label: '1200 × 627',
    category: 'social',
    width: 1200,
    height: 627,
    aspectRatioLabel: '1.91:1',
    description: 'LinkedIn Feed Landscape Image',
  },
];

/**
 * Calculates target pixel dimensions based on the original image dimensions and settings.
 *
 * Guaranteed invariants:
 * - Always returns integers >= 1.
 * - Never returns NaN, Infinity, or negative numbers.
 * - Strictly respects lockAspectRatio, percentage, presets, and dontEnlarge.
 */
export function calculateTargetDimensions(
  originalWidth: number,
  originalHeight: number,
  settings: ResizeSettings
): { targetWidth: number; targetHeight: number } {
  const origW = Math.max(1, Math.round(originalWidth || 1));
  const origH = Math.max(1, Math.round(originalHeight || 1));
  const ratio = origW / origH;

  let targetWidth = origW;
  let targetHeight = origH;

  if (settings.mode === 'percentage') {
    const scale = Math.max(1, Math.min(1000, Number(settings.percentage) || 100)) / 100;
    targetWidth = Math.max(1, Math.round(origW * scale));
    targetHeight = Math.max(1, Math.round(origH * scale));

    if (settings.dontEnlarge && scale > 1) {
      targetWidth = origW;
      targetHeight = origH;
    }
  } else if (
    settings.mode === 'preset' ||
    settings.mode === 'social' ||
    settings.mode === 'web'
  ) {
    const preset =
      PRESET_DIMENSIONS.find((p) => p.id === settings.presetId) ||
      PRESET_DIMENSIONS.find((p) => {
        if (settings.mode === 'social') return p.category === 'social';
        if (settings.mode === 'web') return p.category === 'web';
        return p.category === 'common';
      }) ||
      PRESET_DIMENSIONS[0];

    const boundsW =
      settings.manualOverride && settings.customWidth ? settings.customWidth : preset.width;
    const boundsH =
      settings.manualOverride && settings.customHeight ? settings.customHeight : preset.height;

    if (settings.mode === 'social' || settings.mode === 'web') {
      // Social & Web formats are explicit target canvas dimensions (e.g. 1080x1920 for 9:16 Reel)
      targetWidth = boundsW;
      targetHeight = boundsH;
    } else if (settings.mode === 'preset' && settings.lockAspectRatio && settings.presetFitMode === 'fit') {
      // Proportional box fitting for generic display presets
      const scaleW = boundsW / origW;
      const scaleH = boundsH / origH;
      const fitScale = Math.min(scaleW, scaleH);

      targetWidth = Math.max(1, Math.round(origW * fitScale));
      targetHeight = Math.max(1, Math.round(origH * fitScale));
    } else {
      targetWidth = boundsW;
      targetHeight = boundsH;
    }

    if (settings.dontEnlarge && (targetWidth > origW || targetHeight > origH)) {
      targetWidth = Math.min(targetWidth, origW);
      targetHeight = Math.min(targetHeight, origH);
    }
  } else {
    // Mode: 'custom'
    const customW = Math.max(1, Math.round(Number(settings.customWidth) || origW));
    const customH = Math.max(1, Math.round(Number(settings.customHeight) || origH));

    if (settings.lockAspectRatio) {
      if (settings.primaryDimension === 'height') {
        targetHeight = customH;
        targetWidth = Math.max(1, Math.round(customH * ratio));
      } else {
        // Default primary dimension is width
        targetWidth = customW;
        targetHeight = Math.max(1, Math.round(customW / ratio));
      }

      if (settings.dontEnlarge && (targetWidth > origW || targetHeight > origH)) {
        const scale = Math.min(1, origW / targetWidth, origH / targetHeight);
        targetWidth = Math.max(1, Math.round(targetWidth * scale));
        targetHeight = Math.max(1, Math.round(targetHeight * scale));
      }
    } else {
      targetWidth = customW;
      targetHeight = customH;

      if (settings.dontEnlarge) {
        targetWidth = Math.min(targetWidth, origW);
        targetHeight = Math.min(targetHeight, origH);
      }
    }
  }

  return {
    targetWidth: Math.max(1, Math.round(targetWidth)),
    targetHeight: Math.max(1, Math.round(targetHeight)),
  };
}

/**
 * Generates an appropriate download filename: e.g. "photo.jpg" -> "photo-resized.jpg".
 */
export function generateResizedFilename(
  originalName: string,
  outputMimeType: string
): string {
  const cleanName = (originalName || 'image').trim();
  const lastDotIndex = cleanName.lastIndexOf('.');
  const baseName = lastDotIndex > 0 ? cleanName.substring(0, lastDotIndex) : cleanName;

  let ext = '.jpg';
  if (outputMimeType === 'image/png') ext = '.png';
  else if (outputMimeType === 'image/webp') ext = '.webp';
  else if (outputMimeType === 'image/jpeg') ext = '.jpg';
  else if (lastDotIndex > 0) ext = cleanName.substring(lastDotIndex);

  // Sanitize base name to eliminate characters disallowed in Windows/Linux filenames
  const sanitizedBase =
    baseName.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').trim() || 'image';

  return `${sanitizedBase}-resized${ext}`;
}

/**
 * Loads an image File or Blob into an HTMLImageElement using an Object URL.
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
      reject(new Error('Failed to decode image. The file may be corrupt or an unsupported format.'));
    };

    img.src = url;
  });
}

/**
 * Determines output MIME type, preserving the original format.
 */
export function getOutputMimeType(originalType: string, originalName: string): string {
  const type = (originalType || '').toLowerCase();
  const name = (originalName || '').toLowerCase();

  if (type === 'image/png' || name.endsWith('.png')) return 'image/png';
  if (type === 'image/webp' || name.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
}

/**
 * Resizes an image file or blob to the exact target dimensions using an HTML5 Canvas.
 * Supports fit (contain with ambient blur or solid canvas padding), fill (cover/center-crop), and stretch.
 */
export async function resizeImageFile(
  file: File | Blob,
  targetWidth: number,
  targetHeight: number,
  qualityPercentage = 90,
  fitMode: PresetFitMode = 'fit',
  backgroundStyle: CanvasBackground = 'blur'
): Promise<{ blob: Blob; mimeType: string; width: number; height: number }> {
  const img = await loadImageElement(file);

  const origW = img.naturalWidth || img.width || 1;
  const origH = img.naturalHeight || img.height || 1;

  const w = Math.max(1, Math.round(targetWidth));
  const h = Math.max(1, Math.round(targetHeight));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not initialize 2D canvas context for resizing.');
  }

  // High quality interpolation
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const origType = file instanceof File ? file.type : '';
  const origName = file instanceof File ? file.name : '';
  const mimeType = getOutputMimeType(origType, origName);

  if (fitMode === 'fill') {
    // Fill / Cover: crop to fill the entire target canvas
    const scale = Math.max(w / origW, h / origH);
    const renderW = Math.round(origW * scale);
    const renderH = Math.round(origH * scale);
    const offsetX = Math.round((w - renderW) / 2);
    const offsetY = Math.round((h - renderH) / 2);

    if (mimeType === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
    }

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
  } else if (fitMode === 'stretch') {
    // Stretch to exact dimensions
    if (mimeType === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(img, 0, 0, w, h);
  } else {
    // fitMode === 'fit': Fit with canvas padding
    const scale = Math.min(w / origW, h / origH);
    const renderW = Math.round(origW * scale);
    const renderH = Math.round(origH * scale);
    const offsetX = Math.round((w - renderW) / 2);
    const offsetY = Math.round((h - renderH) / 2);

    // If the image doesn't fill the canvas completely, render background
    if (renderW < w || renderH < h) {
      if (backgroundStyle === 'blur') {
        ctx.save();
        // Draw zoomed blurred image in background
        ctx.filter = 'blur(40px) brightness(0.65)';
        const bgScale = Math.max(w / origW, h / origH) * 1.15;
        const bgW = Math.round(origW * bgScale);
        const bgH = Math.round(origH * bgScale);
        const bgX = Math.round((w - bgW) / 2);
        const bgY = Math.round((h - bgH) / 2);
        ctx.drawImage(img, bgX, bgY, bgW, bgH);
        ctx.restore();
      } else if (backgroundStyle === 'black') {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w, h);
      } else if (backgroundStyle === 'white') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, w, h);
      } else {
        // transparent
        if (mimeType === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, w, h);
        }
      }
    } else if (mimeType === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
    }

    // Render centered crisp image
    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
  }

  const quality = Math.max(0.1, Math.min(1.0, qualityPercentage / 100));

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to encode resized image into blob.'));
          return;
        }
        resolve({
          blob,
          mimeType,
          width: w,
          height: h,
        });
      },
      mimeType,
      quality
    );
  });
}
