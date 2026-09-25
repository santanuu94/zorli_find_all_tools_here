import { imageCompressorConfig } from '../config';

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxBytes = imageCompressorConfig.maxFileSizeMb * 1024 * 1024;
  
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File exceeds maximum size limit of ${imageCompressorConfig.maxFileSizeMb}MB.`,
    };
  }

  if (!imageCompressorConfig.supportedFormats.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported format: ${file.type || 'unknown'}. Allowed formats: JPG, PNG, WebP, AVIF.`,
    };
  }

  return { valid: true };
}
