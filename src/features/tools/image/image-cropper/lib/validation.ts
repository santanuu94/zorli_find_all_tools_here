import { SupportedFormat } from '../types';

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

export const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export interface ValidationResult {
  valid: boolean;
  error?: string;
  detectedFormat?: SupportedFormat;
}

/**
 * Detects the image format from its MIME type and file extension.
 */
export function detectFormat(file: File): SupportedFormat | null {
  const type = (file.type || '').toLowerCase();
  const name = (file.name || '').toLowerCase();

  if (
    type === 'image/jpeg' ||
    type === 'image/jpg' ||
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg')
  ) {
    return 'jpg';
  }
  if (type === 'image/png' || name.endsWith('.png')) {
    return 'png';
  }
  if (type === 'image/webp' || name.endsWith('.webp')) {
    return 'webp';
  }
  return null;
}

/**
 * Validates whether an uploaded file is a supported image within limits.
 */
export function validateImageFile(file: File): ValidationResult {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  const detected = detectFormat(file);
  if (!detected) {
    return {
      valid: false,
      error: "This file type isn't supported. Please upload JPG, PNG, or WebP.",
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'File size exceeds the 50 MB limit. Please choose a smaller image.',
      detectedFormat: detected,
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'The selected file is empty (0 bytes).',
      detectedFormat: detected,
    };
  }

  return { valid: true, detectedFormat: detected };
}
