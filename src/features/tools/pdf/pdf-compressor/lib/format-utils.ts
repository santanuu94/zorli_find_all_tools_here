import { CompressionSettings, TargetPreset } from '../types';

export const TARGET_PRESET_BYTES: Record<Exclude<TargetPreset, 'custom'>, number> = {
  '500kb': 500 * 1024,
  '1mb': 1024 * 1024,
  '2mb': 2 * 1024 * 1024,
  '5mb': 5 * 1024 * 1024,
  '10mb': 10 * 1024 * 1024,
};

export const TARGET_PRESET_LABELS: Record<TargetPreset, string> = {
  '500kb': '500 KB',
  '1mb': '1 MB',
  '2mb': '2 MB',
  '5mb': '5 MB',
  '10mb': '10 MB',
  custom: 'Custom',
};

/**
 * Check if the given buffer contains the PDF magic signature
 */
export function hasPdfMagicBytes(buffer: Uint8Array): boolean {
  if (!buffer || buffer.length < 5) return false;
  // Look for '%PDF-' in the first 1024 bytes
  const headerLimit = Math.min(buffer.length - 4, 1024);
  for (let i = 0; i <= headerLimit; i++) {
    if (
      buffer[i] === 0x25 && // %
      buffer[i + 1] === 0x50 && // P
      buffer[i + 2] === 0x44 && // D
      buffer[i + 3] === 0x46 && // F
      buffer[i + 4] === 0x2d // -
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Safe wrapper for URL.createObjectURL for environments like jsdom/Node
 */
export function safeCreateObjectURL(blob: Blob): string {
  if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
    return URL.createObjectURL(blob);
  }
  return 'blob:mock-url';
}

/**
 * Format bytes into standard human-readable units (binary 1024 convention)
 */
export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0 || isNaN(bytes)) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const idx = Math.min(Math.max(i, 0), sizes.length - 1);
  const value = bytes / Math.pow(k, idx);
  // Format with up to 2 decimal places, trimming trailing zeros
  const formatted = parseFloat(value.toFixed(2));
  return `${formatted} ${sizes[idx]}`;
}

/**
 * Calculate the target size in bytes based on settings
 */
export function calculateTargetBytes(settings: CompressionSettings): number {
  if (settings.targetPreset !== 'custom') {
    return TARGET_PRESET_BYTES[settings.targetPreset];
  }

  const multiplier = settings.customTargetUnit === 'MB' ? 1024 * 1024 : 1024;
  const customBytes = Math.round((settings.customTargetValue || 1) * multiplier);
  return Math.max(100, customBytes); // At least 100 bytes
}

/**
 * Calculate exact reduction percentage using prompt formula:
 * ((original size - compressed size) / original size) * 100
 */
export function calculateReductionPercentage(originalSize: number, compressedSize: number): number {
  if (originalSize <= 0 || compressedSize >= originalSize) return 0;
  const reduction = ((originalSize - compressedSize) / originalSize) * 100;
  return Math.round(reduction * 10) / 10;
}

/**
 * Avoid repeated suffixes: document-compressed.pdf should not become document-compressed-compressed.pdf
 */
export function generateCompressedFilename(originalName: string): string {
  const cleanName = originalName.replace(/\.pdf$/i, '');
  if (cleanName.endsWith('-compressed')) {
    return `${cleanName}.pdf`;
  }
  return `${cleanName}-compressed.pdf`;
}
