import { CompressionSettings, CompressedFileItem } from '../types';

/**
 * Image processing helpers for browser canvas operations
 */
export async function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to parse image element'));
    };
    img.src = url;
  });
}
