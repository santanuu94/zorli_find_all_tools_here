import { BackgroundMode } from '../types';

/**
 * Generates a clean output filename for the background removal result.
 * Prevents duplicate suffixes such as "photo-no-bg-no-bg.png".
 */
export function getCleanRemovalFilename(
  originalName: string,
  backgroundMode: BackgroundMode = 'transparent'
): string {
  const dotIndex = originalName.lastIndexOf('.');
  const baseName = dotIndex !== -1 ? originalName.slice(0, dotIndex) : originalName;

  // Strip existing repetitive suffixes
  const cleanBase = baseName
    .replace(/(-no-bg)+$/i, '')
    .replace(/(_no_bg)+$/i, '')
    .replace(/(-bg-(white|black|custom))+$/i, '')
    .trim();

  const finalBase = cleanBase || 'image';

  if (backgroundMode === 'transparent') {
    return `${finalBase}-no-bg.png`;
  }

  return `${finalBase}-bg-${backgroundMode}.png`;
}
