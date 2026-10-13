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
  const formatted = parseFloat(value.toFixed(2));
  return `${formatted} ${sizes[idx]}`;
}

/**
 * Check if the given buffer contains the PDF magic signature
 */
export function hasPdfMagicBytes(buffer: Uint8Array): boolean {
  if (!buffer || buffer.length < 5) return false;
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
 * Robust helper to read File or Blob as Uint8Array across browsers and jsdom/test environments
 */
export async function readFileAsUint8Array(file: File | Blob): Promise<Uint8Array> {
  if (typeof (file as any).arrayBuffer === 'function') {
    try {
      const buf = await (file as any).arrayBuffer();
      return new Uint8Array(buf);
    } catch {
      // Fall through to FileReader / Node fallback
    }
  }

  if (typeof FileReader !== 'undefined') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
      reader.onerror = () => reject(reader.error || new Error('FileReader failed'));
      reader.readAsArrayBuffer(file);
    });
  }

  throw new Error('Unable to read file contents');
}

/**
 * Sanitize user-provided filename and guarantee .pdf extension
 */
export function sanitizePdfFilename(input: string): string {
  let cleaned = (input || '').trim();
  // Strip control and invalid file path characters (<>:"/\|?*)
  cleaned = cleaned.replace(/[<>:"/\\|?*\x00-\x1F]/g, '');

  if (!cleaned) {
    return 'merged-document.pdf';
  }

  if (!cleaned.toLowerCase().endsWith('.pdf')) {
    return `${cleaned}.pdf`;
  }

  return cleaned;
}
