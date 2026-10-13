/**
 * Formats a byte size into a human-readable string (KB, MB, GB) on 1024 basis.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 0) return '0 B';
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

/**
 * Checks for standard `%PDF-` (0x25, 0x50, 0x44, 0x46, 0x2D) header within the first 1024 bytes.
 */
export function hasPdfMagicBytes(bytes: Uint8Array): boolean {
  if (bytes.length < 5) return false;
  const limit = Math.min(bytes.length - 4, 1024);
  for (let i = 0; i < limit; i++) {
    if (
      bytes[i] === 0x25 && // %
      bytes[i + 1] === 0x50 && // P
      bytes[i + 2] === 0x44 && // D
      bytes[i + 3] === 0x46 && // F
      bytes[i + 4] === 0x2d // -
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Safely reads a File or Blob as Uint8Array across all browser and test environments.
 */
export async function readFileAsUint8Array(file: File | Blob): Promise<Uint8Array> {
  if (typeof file.arrayBuffer === 'function') {
    try {
      const buffer = await file.arrayBuffer();
      return new Uint8Array(buffer);
    } catch {
      // Fallback to FileReader below
    }
  }

  return new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result));
      } else {
        reject(new Error('Failed to read file as ArrayBuffer.'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('FileReader failed'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Strips invalid characters and guarantees a clean .pdf extension.
 */
export function sanitizePdfFilename(rawName: string, fallback: string = 'split_document.pdf'): string {
  if (!rawName || !rawName.trim()) return fallback;
  const cleaned = rawName
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
    .replace(/\s+/g, '_');

  const withoutExt = cleaned.replace(/\.pdf$/i, '');
  const base = withoutExt.length > 0 ? withoutExt : fallback.replace(/\.pdf$/i, '');
  return `${base}.pdf`;
}

/**
 * Creates an object URL safely.
 */
export function safeCreateObjectURL(blob: Blob): string {
  if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
    return URL.createObjectURL(blob);
  }
  return '';
}

/**
 * Revokes an object URL safely.
 */
export function safeRevokeObjectURL(url: string): void {
  if (url && typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // Ignore
    }
  }
}
