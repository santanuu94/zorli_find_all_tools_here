import {
  ParsedMetadataReport,
  SupportedMetadataFormat,
  VerificationResult,
} from '../types';
import { parseImageMetadata } from './metadata-parser';

/**
 * Generates cleaned filename while preventing repeated "-clean-clean" suffixes.
 * e.g. "photo.jpg" -> "photo-clean.jpg"
 * e.g. "photo-clean.jpg" -> "photo-clean.jpg"
 */
export function generateCleanFilename(originalName: string): string {
  const cleanName = (originalName || 'image').trim();
  const lastDot = cleanName.lastIndexOf('.');

  if (lastDot > 0) {
    const base = cleanName.substring(0, lastDot);
    const ext = cleanName.substring(lastDot);
    // If base already ends with -clean or _clean, avoid duplicate
    if (base.toLowerCase().endsWith('-clean') || base.toLowerCase().endsWith('_clean')) {
      return `${base}${ext}`;
    }
    return `${base}-clean${ext}`;
  }

  if (cleanName.toLowerCase().endsWith('-clean') || cleanName.toLowerCase().endsWith('_clean')) {
    return cleanName;
  }
  return `${cleanName}-clean`;
}

/**
 * Losslessly strips JPEG metadata segments (APP1-APP15, COM) while keeping DCT data untouched.
 */
export function stripJpegMetadata(bytes: Uint8Array): Uint8Array {
  // Check SOI marker FF D8
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    return bytes;
  }

  const chunks: Uint8Array[] = [];
  chunks.push(bytes.subarray(0, 2)); // Keep SOI

  let offset = 2;
  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) break;

    const marker = bytes[offset + 1];

    // End of Image (EOI)
    if (marker === 0xd9) {
      chunks.push(bytes.subarray(offset, offset + 2));
      break;
    }

    // Start of Scan (SOS) - Image data begins here until EOI
    if (marker === 0xda) {
      chunks.push(bytes.subarray(offset));
      break;
    }

    // Restart markers (D0 - D7) have no payload length
    if (marker >= 0xd0 && marker <= 0xd7) {
      chunks.push(bytes.subarray(offset, offset + 2));
      offset += 2;
      continue;
    }

    if (offset + 4 > bytes.length) break;
    const segmentLen = (bytes[offset + 2] << 8) | bytes[offset + 3];
    const totalSegmentLen = 2 + segmentLen;

    if (offset + totalSegmentLen > bytes.length) break;

    // Filter out:
    // APP1 (0xE1): EXIF / XMP
    // APP2 (0xE2): ICC Profiles / FlashPix
    // APP3 - APP15 (0xE3 - 0xEF): IPTC, Photoshop IRB, C2PA JUMBF, etc.
    // COM (0xFE): User comments
    // Keep:
    // APP0 (0xE0): Standard JFIF pixel aspect header if present
    // DQT (0xDB), SOF0-SOF2 (0xC0-0xC2), DHT (0xC4)
    const isMetadataSegment =
      (marker >= 0xe1 && marker <= 0xef) || marker === 0xfe;

    if (!isMetadataSegment) {
      chunks.push(bytes.subarray(offset, offset + totalSegmentLen));
    }

    offset += totalSegmentLen;
  }

  const totalLen = chunks.reduce((acc, c) => acc + c.length, 0);
  const result = new Uint8Array(totalLen);
  let pos = 0;
  for (const c of chunks) {
    result.set(c, pos);
    pos += c.length;
  }
  return result;
}

/**
 * Losslessly strips PNG ancillary metadata chunks (eXIf, tEXt, zTXt, iTXt, iCCP, tIME, caPA, jumb).
 */
export function stripPngMetadata(bytes: Uint8Array): Uint8Array {
  // Check PNG signature 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes.length < 8 ||
    bytes[0] !== 0x89 ||
    bytes[1] !== 0x50 ||
    bytes[2] !== 0x4e ||
    bytes[3] !== 0x47 ||
    bytes[4] !== 0x0d ||
    bytes[5] !== 0x0a ||
    bytes[6] !== 0x1a ||
    bytes[7] !== 0x0a
  ) {
    return bytes;
  }

  const chunks: Uint8Array[] = [];
  chunks.push(bytes.subarray(0, 8)); // Keep 8-byte PNG header

  let offset = 8;
  const strippedChunks = new Set([
    'eXIf',
    'tEXt',
    'zTXt',
    'iTXt',
    'iCCP',
    'tIME',
    'cHRM',
    'gAMA',
    'sRGB',
    'pHYs',
    'caPA',
    'jumb',
  ]);

  while (offset + 8 <= bytes.length) {
    const dataLen =
      (bytes[offset] << 24) |
      (bytes[offset + 1] << 16) |
      (bytes[offset + 2] << 8) |
      bytes[offset + 3];

    const chunkType = String.fromCharCode(
      bytes[offset + 4],
      bytes[offset + 5],
      bytes[offset + 6],
      bytes[offset + 7]
    );

    const chunkTotalLen = 4 + 4 + dataLen + 4; // length + type + data + crc
    if (offset + chunkTotalLen > bytes.length) break;

    if (!strippedChunks.has(chunkType)) {
      chunks.push(bytes.subarray(offset, offset + chunkTotalLen));
    }

    offset += chunkTotalLen;
    if (chunkType === 'IEND') break;
  }

  const totalLen = chunks.reduce((acc, c) => acc + c.length, 0);
  const result = new Uint8Array(totalLen);
  let pos = 0;
  for (const c of chunks) {
    result.set(c, pos);
    pos += c.length;
  }
  return result;
}

/**
 * Losslessly strips WebP metadata chunks (EXIF, XMP , ICCP) and adjusts VP8X flags.
 */
export function stripWebpMetadata(bytes: Uint8Array): Uint8Array {
  if (bytes.length < 12) return bytes;
  const riff = String.fromCharCode(...bytes.subarray(0, 4));
  const webp = String.fromCharCode(...bytes.subarray(8, 12));
  if (riff !== 'RIFF' || webp !== 'WEBP') return bytes;

  const chunks: Uint8Array[] = [];
  let offset = 12;
  const strippedChunks = new Set(['EXIF', 'XMP ', 'ICCP']);

  while (offset + 8 <= bytes.length) {
    const chunkType = String.fromCharCode(...bytes.subarray(offset, offset + 4));
    const chunkLen =
      bytes[offset + 4] |
      (bytes[offset + 5] << 8) |
      (bytes[offset + 6] << 16) |
      (bytes[offset + 7] << 24);

    const paddedLen = chunkLen + (chunkLen % 2);
    const chunkTotal = 8 + paddedLen;
    if (offset + chunkTotal > bytes.length) break;

    if (chunkType === 'VP8X' && chunkTotal >= 18) {
      // Copy VP8X chunk and clear ICC (0x20), EXIF (0x08), XMP (0x04) flags
      const vp8xCopy = new Uint8Array(bytes.subarray(offset, offset + chunkTotal));
      vp8xCopy[8] = vp8xCopy[8] & ~0x2c;
      chunks.push(vp8xCopy);
    } else if (!strippedChunks.has(chunkType)) {
      chunks.push(bytes.subarray(offset, offset + chunkTotal));
    }

    offset += chunkTotal;
  }

  const payloadLen = chunks.reduce((acc, c) => acc + c.length, 0);
  const totalFileLen = 12 + payloadLen;
  const result = new Uint8Array(totalFileLen);

  // Write 'RIFF'
  result.set(bytes.subarray(0, 4), 0);
  // Write file size (total - 8)
  const riffSize = totalFileLen - 8;
  result[4] = riffSize & 0xff;
  result[5] = (riffSize >> 8) & 0xff;
  result[6] = (riffSize >> 16) & 0xff;
  result[7] = (riffSize >> 24) & 0xff;
  // Write 'WEBP'
  result.set(bytes.subarray(8, 12), 8);

  let pos = 12;
  for (const c of chunks) {
    result.set(c, pos);
    pos += c.length;
  }
  return result;
}

/**
 * Clean canvas re-encoding fallback for complex images.
 */
export async function cleanImageWithCanvas(
  input: Blob | File,
  format: SupportedMetadataFormat
): Promise<Blob> {
  const url = URL.createObjectURL(input);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image for canvas cleaning.'));
      img.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, img.naturalWidth || img.width);
    canvas.height = Math.max(1, img.naturalHeight || img.height);

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D canvas context.');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    let mimeType = 'image/jpeg';
    if (format === 'png') {
      mimeType = 'image/png';
    } else if (format === 'webp') {
      mimeType = 'image/webp';
    } else {
      // JPEG requires white background to prevent black background on transparent images
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas failed to encode clean image copy.'));
            return;
          }
          resolve(blob);
        },
        mimeType,
        0.95
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Primary cleaning pipeline: Attempts lossless binary stripping first,
 * with canvas re-encoding fallback if needed.
 */
export async function cleanImageMetadata(
  input: Blob | File,
  format: SupportedMetadataFormat
): Promise<{ blob: Blob; method: 'lossless-binary' | 'canvas-reencode' }> {
  try {
    let buffer: ArrayBuffer;
    if (typeof (input as any).arrayBuffer === 'function') {
      buffer = await (input as any).arrayBuffer();
    } else if (typeof FileReader !== 'undefined' && input instanceof Blob) {
      buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(new Error('Failed to read Blob as ArrayBuffer.'));
        reader.readAsArrayBuffer(input);
      });
    } else {
      buffer = new ArrayBuffer(0);
    }
    const bytes = new Uint8Array(buffer);
    let strippedBytes: Uint8Array = bytes;

    if (format === 'jpeg') {
      strippedBytes = stripJpegMetadata(bytes);
    } else if (format === 'png') {
      strippedBytes = stripPngMetadata(bytes);
    } else if (format === 'webp') {
      strippedBytes = stripWebpMetadata(bytes);
    }

    // If bytes were stripped successfully and length decreased or changed
    if (strippedBytes.length > 0 && strippedBytes.length <= bytes.length) {
      let mimeType = 'image/jpeg';
      if (format === 'png') mimeType = 'image/png';
      if (format === 'webp') mimeType = 'image/webp';

      const cleanBuffer = strippedBytes.buffer.slice(
        strippedBytes.byteOffset,
        strippedBytes.byteOffset + strippedBytes.byteLength
      ) as ArrayBuffer;
      const cleanBlob = new Blob([cleanBuffer], { type: mimeType });
      return { blob: cleanBlob, method: 'lossless-binary' };
    }
  } catch (err) {
    // Binary stripping fallback
  }

  // Fallback to Canvas re-encoding
  const canvasBlob = await cleanImageWithCanvas(input, format);
  return { blob: canvasBlob, method: 'canvas-reencode' };
}

/**
 * Before / After Verification Engine (Requirement #13)
 * Scans the generated output file again to objectively verify metadata removal.
 */
export async function verifyCleanCopy(
  cleanBlob: Blob,
  beforeReport: ParsedMetadataReport,
  method: 'lossless-binary' | 'canvas-reencode'
): Promise<VerificationResult> {
  const afterReport = await parseImageMetadata(cleanBlob);

  const beforeCount = beforeReport.totalFieldCount;
  const afterCount = afterReport.totalFieldCount;
  const removedCount = Math.max(0, beforeCount - afterCount);
  const verifiedClean = afterCount === 0;

  const remainingFields: string[] = [];
  afterReport.categories.forEach((cat) => {
    cat.fields.forEach((f) => remainingFields.push(`${cat.title}: ${f.label}`));
  });

  return {
    beforeCount,
    afterCount,
    removedCount,
    verifiedClean,
    remainingFields,
    cleanTimestamp: Date.now(),
    cleaningMethod: method,
  };
}
