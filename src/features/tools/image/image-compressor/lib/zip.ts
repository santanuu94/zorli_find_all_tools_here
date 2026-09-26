/**
 * Lightweight, zero-dependency browser-compatible ZIP writer.
 *
 * Implements the standard PKZip format (PK\x03\x04 Local File Header +
 * PK\x01\x02 Central Directory + PK\x05\x06 End of Central Directory Record)
 * using standard Uint8Array and DataView without external npm packages.
 */

export interface ZipFileInput {
  name: string;
  data: Uint8Array | Blob;
}

// CRC32 calculation table
const CRC32_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC32_TABLE[i] = c;
}

function computeCRC32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC32_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Creates a standard ZIP archive from a list of files.
 */
export async function createZipBlob(files: ZipFileInput[]): Promise<Blob> {
  const fileEntries: {
    nameBytes: Uint8Array;
    dataBytes: Uint8Array;
    crc: number;
    offset: number;
  }[] = [];

  const localHeaders: Uint8Array[] = [];
  let currentOffset = 0;

  const encodeText = (str: string): Uint8Array => {
    if (typeof TextEncoder !== 'undefined') {
      return new TextEncoder().encode(str);
    }
    const bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      bytes[i] = str.charCodeAt(i) & 0xff;
    }
    return bytes;
  };

  for (const file of files) {
    const nameBytes = encodeText(file.name);
    let dataBytes: Uint8Array;

    if (file.data instanceof Blob) {
      if (typeof file.data.arrayBuffer === 'function') {
        const buffer = await file.data.arrayBuffer();
        dataBytes = new Uint8Array(buffer);
      } else {
        dataBytes = await new Promise<Uint8Array>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
          reader.onerror = () => reject(reader.error);
          reader.readAsArrayBuffer(file.data as Blob);
        });
      }
    } else {
      dataBytes = file.data;
    }

    const crc = computeCRC32(dataBytes);
    const offset = currentOffset;

    // Local file header: 30 bytes + name length + data length
    const localHeader = new Uint8Array(30 + nameBytes.length + dataBytes.length);
    const view = new DataView(localHeader.buffer);

    view.setUint32(0, 0x04034b50, true); // Local file header signature (PK\x03\x04)
    view.setUint16(4, 20, true); // Version needed to extract (2.0)
    view.setUint16(6, 0, true); // General purpose bit flag
    view.setUint16(8, 0, true); // Compression method (0 = STORE, uncompressed)
    view.setUint16(10, 0, true); // File last mod time
    view.setUint16(12, 0, true); // File last mod date
    view.setUint32(14, crc, true); // CRC-32
    view.setUint32(18, dataBytes.length, true); // Compressed size
    view.setUint32(22, dataBytes.length, true); // Uncompressed size
    view.setUint16(26, nameBytes.length, true); // File name length
    view.setUint16(28, 0, true); // Extra field length

    localHeader.set(nameBytes, 30);
    localHeader.set(dataBytes, 30 + nameBytes.length);

    localHeaders.push(localHeader);
    currentOffset += localHeader.length;

    fileEntries.push({
      nameBytes,
      dataBytes,
      crc,
      offset,
    });
  }

  // Build Central Directory
  const centralDirStartOffset = currentOffset;
  const centralHeaders: Uint8Array[] = [];

  for (const entry of fileEntries) {
    // Central directory header: 46 bytes + name length
    const centralHeader = new Uint8Array(46 + entry.nameBytes.length);
    const view = new DataView(centralHeader.buffer);

    view.setUint32(0, 0x02014b50, true); // Central directory header signature (PK\x01\x02)
    view.setUint16(4, 20, true); // Version made by
    view.setUint16(6, 20, true); // Version needed to extract
    view.setUint16(8, 0, true); // General purpose bit flag
    view.setUint16(10, 0, true); // Compression method (STORE)
    view.setUint16(12, 0, true); // File last mod time
    view.setUint16(14, 0, true); // File last mod date
    view.setUint32(16, entry.crc, true); // CRC-32
    view.setUint32(20, entry.dataBytes.length, true); // Compressed size
    view.setUint32(24, entry.dataBytes.length, true); // Uncompressed size
    view.setUint16(28, entry.nameBytes.length, true); // File name length
    view.setUint16(30, 0, true); // Extra field length
    view.setUint16(32, 0, true); // File comment length
    view.setUint16(34, 0, true); // Disk number start
    view.setUint16(36, 0, true); // Internal file attributes
    view.setUint32(38, 0, true); // External file attributes
    view.setUint32(42, entry.offset, true); // Relative offset of local header

    centralHeader.set(entry.nameBytes, 46);
    centralHeaders.push(centralHeader);
    currentOffset += centralHeader.length;
  }

  const centralDirSize = currentOffset - centralDirStartOffset;

  // End of central directory record (22 bytes)
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);

  eocdView.setUint32(0, 0x06054b50, true); // EOCD signature (PK\x05\x06)
  eocdView.setUint16(4, 0, true); // Number of this disk
  eocdView.setUint16(6, 0, true); // Disk with central directory
  eocdView.setUint16(8, fileEntries.length, true); // Total entries on this disk
  eocdView.setUint16(10, fileEntries.length, true); // Total entries in central directory
  eocdView.setUint32(12, centralDirSize, true); // Size of central directory
  eocdView.setUint32(16, centralDirStartOffset, true); // Offset of start of central directory
  eocdView.setUint16(20, 0, true); // ZIP comment length

  const finalBuffer = new Uint8Array(currentOffset + 22);
  let pos = 0;
  for (const h of localHeaders) {
    finalBuffer.set(h, pos);
    pos += h.length;
  }
  for (const h of centralHeaders) {
    finalBuffer.set(h, pos);
    pos += h.length;
  }
  finalBuffer.set(eocd, pos);

  return new Blob([finalBuffer.buffer as ArrayBuffer], {
    type: 'application/zip',
  });
}
