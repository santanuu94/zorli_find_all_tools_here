import { imageCompressorConfig } from '../config';

export const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'File is empty (0 bytes).' };
  }

  const maxBytes = imageCompressorConfig.maxFileSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `Image exceeds maximum size limit of ${imageCompressorConfig.maxFileSizeMb}MB.`,
    };
  }

  const fileName = (file.name || '').toLowerCase();
  const fileType = (file.type || '').toLowerCase();

  const hasSupportedMime = SUPPORTED_MIME_TYPES.includes(fileType);
  const hasSupportedExt = SUPPORTED_EXTENSIONS.some((ext) => fileName.endsWith(ext));

  if (!hasSupportedMime && !hasSupportedExt) {
    return {
      valid: false,
      error: `Unsupported format: ${file.type || 'unknown'}. Supported formats: JPG, PNG, WebP.`,
    };
  }

  return { valid: true };
}
