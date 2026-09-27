/**
 * File and dimension validation for Image Resizer
 */

export const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
export const MIN_DIMENSION_PX = 1;
export const MAX_DIMENSION_PX = 16384; // Safe modern canvas ceiling

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates file MIME type, extension, and file size.
 */
export function validateImageFile(file: File): FileValidationResult {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  // Check file size
  if (file.size <= 0) {
    return { valid: false, error: 'File is empty (0 bytes).' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File exceeds maximum allowed size of 50 MB.`,
    };
  }

  // Check MIME type or fallback to file extension
  const type = (file.type || '').toLowerCase();
  const name = (file.name || '').toLowerCase();

  const isSupportedMime = SUPPORTED_MIME_TYPES.includes(type);
  const hasSupportedExt =
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg') ||
    name.endsWith('.png') ||
    name.endsWith('.webp');

  if (!isSupportedMime && !hasSupportedExt) {
    return {
      valid: false,
      error: 'Unsupported image format. Please upload JPG, PNG, or WebP.',
    };
  }

  return { valid: true };
}

/**
 * Sanitizes and validates a dimension input (width or height in pixels).
 */
export function validateDimensionInput(value: number): {
  valid: boolean;
  sanitized: number;
  error?: string;
} {
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return { valid: false, sanitized: 100, error: 'Invalid dimension number.' };
  }

  const rounded = Math.round(value);

  if (rounded < MIN_DIMENSION_PX) {
    return {
      valid: false,
      sanitized: MIN_DIMENSION_PX,
      error: `Dimensions must be at least ${MIN_DIMENSION_PX}px.`,
    };
  }

  if (rounded > MAX_DIMENSION_PX) {
    return {
      valid: false,
      sanitized: MAX_DIMENSION_PX,
      error: `Dimensions cannot exceed ${MAX_DIMENSION_PX}px.`,
    };
  }

  return { valid: true, sanitized: rounded };
}
