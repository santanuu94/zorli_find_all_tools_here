import exifr from 'exifr';
import {
  GpsCoordinates,
  MetadataCategory,
  MetadataField,
  ParsedMetadataReport,
  SupportedMetadataFormat,
} from '../types';

/**
 * Detects image format from binary magic bytes.
 */
export function detectFormatFromBuffer(bytes: Uint8Array): SupportedMetadataFormat {
  if (bytes.length < 12) return 'unknown';

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return 'png';
  }

  // WebP: RIFF .... WEBP
  const riff = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
  const webp = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
  if (riff === 'RIFF' && webp === 'WEBP') {
    return 'webp';
  }

  return 'unknown';
}

/**
 * Checks for Content Credentials (C2PA / JUMBF) metadata markers in binary data.
 */
export function detectC2paMarkers(bytes: Uint8Array): boolean {
  try {
    // Scan for C2PA signatures: 'JUMBF', 'c2pa', 'caPA'
    const len = Math.min(bytes.length, 65536); // Inspect first 64KB where headers typically reside
    for (let i = 0; i < len - 4; i++) {
      if (
        (bytes[i] === 0x4a && bytes[i + 1] === 0x55 && bytes[i + 2] === 0x4d && bytes[i + 3] === 0x42) || // JUMB
        (bytes[i] === 0x63 && bytes[i + 1] === 0x32 && bytes[i + 2] === 0x70 && bytes[i + 3] === 0x61) || // c2pa
        (bytes[i] === 0x63 && bytes[i + 1] === 0x61 && bytes[i + 2] === 0x50 && bytes[i + 3] === 0x41)    // caPA
      ) {
        return true;
      }
    }
  } catch (err) {
    // Fall through
  }
  return false;
}

/**
 * Formats GPS coordinate into readable degrees with direction.
 */
export function formatCoordinate(val: number, isLatitude: boolean): string {
  if (typeof val !== 'number' || isNaN(val)) return 'N/A';
  const dir = isLatitude ? (val >= 0 ? 'N' : 'S') : (val >= 0 ? 'E' : 'W');
  const abs = Math.abs(val);
  return `${abs.toFixed(5)}° ${dir}`;
}

/**
 * Formats exposure time (e.g. 0.004 -> 1/250s).
 */
function formatExposureTime(val: any): string {
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) return String(val);
  if (num >= 1) return `${num.toFixed(1)}s`;
  if (num > 0) {
    const denom = Math.round(1 / num);
    return `1/${denom}s`;
  }
  return `${num}s`;
}

/**
 * Formats date values into human readable string.
 */
function formatDateValue(val: any): string {
  if (val instanceof Date) {
    return val.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
  if (typeof val === 'string') {
    // EXIF dates often format as "YYYY:MM:DD HH:MM:SS"
    const exifMatch = val.match(/^(\d{4}):(\d{2}):(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);
    if (exifMatch) {
      const [, y, m, d, hh, mm, ss] = exifMatch;
      const parsed = new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss));
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
      }
    }
    return val;
  }
  return String(val);
}

/**
 * Parses image metadata from a File, Blob, Uint8Array, or ArrayBuffer.
 */
export async function parseImageMetadata(
  input: Blob | File | ArrayBuffer | Uint8Array
): Promise<ParsedMetadataReport> {
  let buffer: ArrayBuffer;
  if (input instanceof ArrayBuffer) {
    buffer = input;
  } else if (input instanceof Uint8Array) {
    buffer = input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength) as ArrayBuffer;
  } else if (typeof (input as any).arrayBuffer === 'function') {
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
  const format = detectFormatFromBuffer(bytes);
  const c2paDetected = detectC2paMarkers(bytes);

  let mimeType = 'image/jpeg';
  if (format === 'png') mimeType = 'image/png';
  if (format === 'webp') mimeType = 'image/webp';

  let rawTags: Record<string, any> = {};
  let gpsOutput: { latitude?: number; longitude?: number } | undefined = undefined;

  try {
    // Read raw metadata blocks (excluding standard structural IHDR dimensions)
    const parsed = await exifr.parse(buffer, {
      tiff: true,
      xmp: true,
      icc: true,
      iptc: true,
      jfif: true,
      ihdr: false,
      mergeOutput: true,
      sanitize: true,
    });

    if (parsed && typeof parsed === 'object') {
      rawTags = { ...parsed };
    }

    // Explicitly parse GPS coordinates
    const gps = await exifr.gps(buffer).catch(() => undefined);
    if (gps && typeof gps.latitude === 'number' && typeof gps.longitude === 'number') {
      gpsOutput = gps;
    }
  } catch (err) {
    // Gracefully handle unparseable or corrupt metadata segments
  }

  // Group tags into categorized presentation cards
  const categories: MetadataCategory[] = [];
  let sensitiveCount = 0;

  // 1. Location (GPS) - Highest Privacy Sensitivity
  const locationFields: MetadataField[] = [];
  let gpsCoords: GpsCoordinates | undefined = undefined;

  if (gpsOutput && typeof gpsOutput.latitude === 'number' && typeof gpsOutput.longitude === 'number') {
    const lat = gpsOutput.latitude;
    const lng = gpsOutput.longitude;
    const alt = rawTags.GPSAltitude;

    gpsCoords = {
      latitude: lat,
      longitude: lng,
      altitude: typeof alt === 'number' ? alt : undefined,
      latitudeRef: rawTags.GPSLatitudeRef,
      longitudeRef: rawTags.GPSLongitudeRef,
      formattedLat: formatCoordinate(lat, true),
      formattedLng: formatCoordinate(lng, false),
    };

    locationFields.push({
      key: 'latitude',
      label: 'Latitude',
      value: gpsCoords.formattedLat,
      rawValue: lat,
      isSensitive: true,
      description: 'Geographic latitude coordinate',
    });
    locationFields.push({
      key: 'longitude',
      label: 'Longitude',
      value: gpsCoords.formattedLng,
      rawValue: lng,
      isSensitive: true,
      description: 'Geographic longitude coordinate',
    });
    if (gpsCoords.altitude !== undefined) {
      locationFields.push({
        key: 'altitude',
        label: 'Altitude',
        value: `${Math.round(gpsCoords.altitude)} meters`,
        rawValue: alt,
        isSensitive: true,
      });
    }
    if (rawTags.GPSDateStamp || rawTags.GPSTimeStamp) {
      locationFields.push({
        key: 'gpsTime',
        label: 'GPS Timestamp',
        value: `${rawTags.GPSDateStamp || ''} ${rawTags.GPSTimeStamp || ''}`.trim(),
        isSensitive: true,
      });
    }
    sensitiveCount += locationFields.length;
  }

  if (locationFields.length > 0) {
    categories.push({
      id: 'location',
      title: 'GPS Location',
      iconName: 'MapPin',
      description: 'Exact geographical coordinates stored when capturing this photo.',
      isSensitive: true,
      fields: locationFields,
    });
  }

  // 2. Camera & Exposure
  const cameraFields: MetadataField[] = [];
  if (rawTags.Make) {
    cameraFields.push({ key: 'make', label: 'Camera Make', value: String(rawTags.Make) });
  }
  if (rawTags.Model) {
    cameraFields.push({ key: 'model', label: 'Camera Model', value: String(rawTags.Model) });
  }
  if (rawTags.LensModel || rawTags.Lens) {
    cameraFields.push({ key: 'lens', label: 'Lens Model', value: String(rawTags.LensModel || rawTags.Lens) });
  }
  if (rawTags.ISO) {
    cameraFields.push({ key: 'iso', label: 'ISO Speed', value: `ISO ${rawTags.ISO}` });
  }
  if (rawTags.FNumber) {
    cameraFields.push({ key: 'fNumber', label: 'Aperture', value: `f/${rawTags.FNumber}` });
  }
  if (rawTags.ExposureTime) {
    cameraFields.push({ key: 'exposureTime', label: 'Exposure Time', value: formatExposureTime(rawTags.ExposureTime) });
  }
  if (rawTags.FocalLength) {
    cameraFields.push({ key: 'focalLength', label: 'Focal Length', value: `${rawTags.FocalLength} mm` });
  }
  if (rawTags.Flash) {
    cameraFields.push({ key: 'flash', label: 'Flash', value: String(rawTags.Flash) });
  }
  if (rawTags.WhiteBalance) {
    cameraFields.push({ key: 'whiteBalance', label: 'White Balance', value: String(rawTags.WhiteBalance) });
  }
  if (rawTags.ExposureProgram) {
    cameraFields.push({ key: 'exposureProgram', label: 'Exposure Program', value: String(rawTags.ExposureProgram) });
  }

  if (cameraFields.length > 0) {
    categories.push({
      id: 'camera',
      title: 'Camera & Hardware',
      iconName: 'Camera',
      description: 'Device hardware and photographic exposure settings.',
      fields: cameraFields,
    });
  }

  // 3. Date & Time
  const dateFields: MetadataField[] = [];
  if (rawTags.DateTimeOriginal) {
    dateFields.push({ key: 'dateTimeOriginal', label: 'Date Taken', value: formatDateValue(rawTags.DateTimeOriginal) });
  }
  if (rawTags.CreateDate) {
    dateFields.push({ key: 'createDate', label: 'Date Digitized', value: formatDateValue(rawTags.CreateDate) });
  }
  if (rawTags.ModifyDate) {
    dateFields.push({ key: 'modifyDate', label: 'Date Modified', value: formatDateValue(rawTags.ModifyDate) });
  }

  if (dateFields.length > 0) {
    categories.push({
      id: 'date',
      title: 'Date & Time',
      iconName: 'Calendar',
      description: 'Timestamps recorded during photo capture and editing.',
      fields: dateFields,
    });
  }

  // 4. Software & Creator
  const softwareFields: MetadataField[] = [];
  if (rawTags.Software) {
    softwareFields.push({ key: 'software', label: 'Editing Software', value: String(rawTags.Software) });
  }
  if (rawTags.Artist || rawTags.Creator) {
    softwareFields.push({
      key: 'artist',
      label: 'Author / Artist',
      value: String(rawTags.Artist || rawTags.Creator),
      isSensitive: true,
      description: 'Personal identification of the image creator',
    });
    sensitiveCount++;
  }
  if (rawTags.Copyright) {
    softwareFields.push({ key: 'copyright', label: 'Copyright', value: String(rawTags.Copyright) });
  }
  if (rawTags.ImageDescription || rawTags.description || rawTags.title) {
    softwareFields.push({
      key: 'description',
      label: 'Description / Title',
      value: String(rawTags.ImageDescription || rawTags.description || rawTags.title),
    });
  }
  if (rawTags.UserComment) {
    softwareFields.push({ key: 'userComment', label: 'User Comment', value: String(rawTags.UserComment) });
  }

  if (softwareFields.length > 0) {
    categories.push({
      id: 'software',
      title: 'Software & Creator',
      iconName: 'Laptop',
      description: 'Editing tools, author attribution, and descriptive tags.',
      fields: softwareFields,
    });
  }

  // 5. Color & Profiles
  const colorFields: MetadataField[] = [];
  if (rawTags.ColorSpace) {
    colorFields.push({ key: 'colorSpace', label: 'Color Space', value: String(rawTags.ColorSpace) });
  }
  if (rawTags.ProfileDescription) {
    colorFields.push({ key: 'profileDescription', label: 'ICC Profile', value: String(rawTags.ProfileDescription) });
  }

  if (colorFields.length > 0) {
    categories.push({
      id: 'other',
      title: 'Color Profile',
      iconName: 'Palette',
      description: 'Color calibration profiles and space tags.',
      fields: colorFields,
    });
  }

  // 6. Content Credentials (C2PA)
  if (c2paDetected) {
    categories.push({
      id: 'c2pa',
      title: 'Content Credentials (C2PA)',
      iconName: 'ShieldCheck',
      description: 'Provenance manifest / JUMBF chunk detected in image structure.',
      fields: [
        {
          key: 'c2paManifest',
          label: 'Provenance Manifest',
          value: 'C2PA / JUMBF Content Credentials detected in file stream',
          description: 'Digital signatures asserting origins and edit history.',
        },
      ],
    });
  }

  // Filter out internal/binary keys from raw tags count
  const ignoredKeys = new Set([
    'thumbnail',
    'Thumbnail',
    'errors',
    'warnings',
    'ImageWidth',
    'ImageHeight',
    'BitDepth',
    'ColorType',
    'Compression',
    'Filter',
    'Interlace',
  ]);

  const countedKeys = Object.keys(rawTags).filter((k) => !ignoredKeys.has(k));
  let totalFieldCount = countedKeys.length;
  if (c2paDetected && !countedKeys.includes('c2paManifest')) {
    totalFieldCount += 1;
  }

  const hasSupportedMetadata = totalFieldCount > 0 || categories.length > 0;

  return {
    format,
    mimeType,
    hasSupportedMetadata,
    totalFieldCount: Math.max(totalFieldCount, categories.reduce((acc, c) => acc + c.fields.length, 0)),
    sensitiveFieldCount: sensitiveCount,
    gps: gpsCoords,
    c2paDetected,
    categories,
    rawTags,
    scanTimestamp: Date.now(),
  };
}
