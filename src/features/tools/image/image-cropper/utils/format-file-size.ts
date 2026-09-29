/**
 * Format bytes into readable human string (e.g. 2.4 MB, 450 KB).
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (!bytes || bytes < 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  if (i === 0) return `${bytes} B`;

  const val = bytes / Math.pow(k, i);
  return `${val.toFixed(val >= 10 || i === 1 ? 1 : 2)} ${sizes[i]}`;
}
