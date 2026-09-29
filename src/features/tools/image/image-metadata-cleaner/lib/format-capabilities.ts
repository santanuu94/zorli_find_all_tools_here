import { FormatCapability, SupportedMetadataFormat } from '../types';

export const FORMAT_CAPABILITIES: Record<SupportedMetadataFormat, FormatCapability> = {
  jpeg: {
    format: 'jpeg',
    displayName: 'JPEG / JPG',
    readableMetadata: [
      'EXIF (Camera, Exposure, Lens)',
      'GPS Location (Coordinates, Altitude)',
      'XMP Data (Extended metadata)',
      'IPTC (Copyright, Headline, Keywords)',
      'ICC Color Profile',
      'JFIF Headers',
      'COM (Comments)',
      'C2PA / JUMBF (Content Credentials)',
    ],
    removableMetadata: [
      'EXIF (APP1)',
      'GPS Location (APP1 IFD)',
      'XMP Packets (APP1)',
      'IPTC & Photoshop IRB (APP13)',
      'ICC Profiles (APP2)',
      'User Comments (COM)',
      'C2PA / JUMBF Chunks (APP11)',
    ],
    cleaningMethod: 'Lossless binary segment stripping with fallback to clean raster re-encoding',
    limitations: [
      'Standard SOF (image dimensions) and Huffman/Quantization tables are preserved so the image can still be rendered.',
    ],
  },
  png: {
    format: 'png',
    displayName: 'PNG',
    readableMetadata: [
      'eXIf (Embedded EXIF data)',
      'tEXt / zTXt (Text metadata)',
      'iTXt (International text, XMP packets)',
      'iCCP (Embedded ICC profile)',
      'tIME (Last modification timestamp)',
      'cHRM, gAMA, sRGB (Color calibration)',
      'caPA / jumb (Content Credentials / C2PA)',
    ],
    removableMetadata: [
      'eXIf chunk',
      'tEXt chunks',
      'zTXt chunks',
      'iTXt chunks (XMP)',
      'iCCP chunks',
      'tIME chunks',
      'caPA / jumb chunks',
    ],
    cleaningMethod: 'Lossless ancillary chunk stripping with fallback to clean raster re-encoding',
    limitations: [
      'Critical chunks (IHDR, PLTE, IDAT, IEND) are preserved to retain visual pixel data and alpha transparency.',
    ],
  },
  webp: {
    format: 'webp',
    displayName: 'WebP',
    readableMetadata: [
      'EXIF metadata chunk',
      'XMP metadata chunk',
      'ICCP color profile chunk',
      'VP8X extended features',
    ],
    removableMetadata: [
      'EXIF chunk',
      'XMP chunk',
      'ICCP chunk',
    ],
    cleaningMethod: 'Lossless RIFF chunk stripping with VP8X header update and canvas fallback',
    limitations: [
      'Lossy VP8 and lossless VP8L bitstreams and animation frames are kept intact.',
    ],
  },
  unknown: {
    format: 'unknown',
    displayName: 'Unsupported Format',
    readableMetadata: [],
    removableMetadata: [],
    cleaningMethod: 'None',
    limitations: ['Only JPG, PNG, and WebP formats are supported for local metadata inspection and cleaning.'],
  },
};

export function getFormatCapability(format: SupportedMetadataFormat): FormatCapability {
  return FORMAT_CAPABILITIES[format] || FORMAT_CAPABILITIES.unknown;
}
