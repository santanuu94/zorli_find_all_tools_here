export type SupportedMetadataFormat = 'jpeg' | 'png' | 'webp' | 'unknown';

export interface MetadataField {
  key: string;
  label: string;
  value: string;
  rawValue?: any;
  isSensitive?: boolean;
  description?: string;
}

export interface MetadataCategory {
  id: 'location' | 'camera' | 'date' | 'software' | 'image' | 'c2pa' | 'other';
  title: string;
  iconName: string;
  description: string;
  isSensitive?: boolean;
  fields: MetadataField[];
}

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  latitudeRef?: string;
  longitudeRef?: string;
  formattedLat: string;
  formattedLng: string;
}

export interface ParsedMetadataReport {
  format: SupportedMetadataFormat;
  mimeType: string;
  hasSupportedMetadata: boolean;
  totalFieldCount: number;
  sensitiveFieldCount: number;
  gps?: GpsCoordinates;
  c2paDetected?: boolean;
  categories: MetadataCategory[];
  rawTags: Record<string, any>;
  scanTimestamp: number;
}

export interface VerificationResult {
  beforeCount: number;
  afterCount: number;
  removedCount: number;
  verifiedClean: boolean;
  remainingFields: string[];
  cleanTimestamp: number;
  cleaningMethod: 'lossless-binary' | 'canvas-reencode';
}

export interface ImageMetadataItem {
  id: string;
  file: File;
  originalName: string;
  originalSize: number;
  originalWidth?: number;
  originalHeight?: number;
  format: SupportedMetadataFormat;
  previewUrl: string;
  status: 'scanning' | 'parsed' | 'cleaning' | 'cleaned' | 'error';
  metadataReport?: ParsedMetadataReport;
  cleanedBlob?: Blob;
  cleanedUrl?: string;
  cleanedSize?: number;
  cleanedName?: string;
  verificationResult?: VerificationResult;
  errorMessage?: string;
}

export interface FormatCapability {
  format: SupportedMetadataFormat;
  displayName: string;
  readableMetadata: string[];
  removableMetadata: string[];
  cleaningMethod: string;
  limitations: string[];
}
