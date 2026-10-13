import { createZipBlob, ZipFileInput } from '../../../image/image-compressor/lib/zip';
import { SplitOutputItem } from '../types';

/**
 * Compiles a list of generated split PDFs into a single ZIP archive.
 */
export async function createSplitZipBlob(outputs: SplitOutputItem[]): Promise<Blob> {
  const zipInputs: ZipFileInput[] = outputs.map((out) => ({
    name: out.filename,
    data: out.blob,
  }));

  return createZipBlob(zipInputs);
}

/**
 * Triggers a native browser download for a given URL and filename.
 */
export function triggerDownload(url: string, filename: string): void {
  if (typeof document === 'undefined') return;
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
