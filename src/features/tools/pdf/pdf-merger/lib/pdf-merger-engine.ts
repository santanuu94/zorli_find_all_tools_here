import { PDFDocument } from 'pdf-lib';
import { MergerProgress, MergerResult } from '../types';
import {
  hasPdfMagicBytes,
  readFileAsUint8Array,
  safeCreateObjectURL,
} from './format-utils';

export interface InspectedPdfInfo {
  pageCount: number;
  size: number;
}

/**
 * Validates and inspects an uploaded PDF file for the merger queue
 */
export async function inspectPdfFile(file: File): Promise<InspectedPdfInfo> {
  if (!file) {
    throw new Error('Please select a valid PDF file.');
  }

  // Guard against files exceeding 150MB to protect device browser memory
  const maxBytes = 150 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(
      `File "${file.name}" exceeds the 150 MB device safety limit.`
    );
  }

  const bytes = await readFileAsUint8Array(file);

  if (!hasPdfMagicBytes(bytes)) {
    throw new Error(`"${file.name}" is not a valid PDF file.`);
  }

  try {
    const doc = await PDFDocument.load(bytes, {
      ignoreEncryption: false,
      updateMetadata: false,
    });
    const pageCount = doc.getPageCount();
    return {
      pageCount,
      size: file.size,
    };
  } catch (err: any) {
    const msg = (err?.message || '').toLowerCase();
    if (
      msg.includes('encrypt') ||
      msg.includes('password') ||
      msg.includes('decrypt')
    ) {
      throw new Error(
        `We couldn't merge "${file.name}" because it is encrypted or password-protected.`
      );
    }
    throw new Error(
      `"${file.name}" appears to be corrupted and cannot be merged.`
    );
  }
}

/**
 * Merges multiple PDF files into one combined PDF document
 */
export async function mergePdfs(
  files: File[],
  onProgress?: (progress: MergerProgress) => void
): Promise<MergerResult> {
  if (!files || files.length < 2) {
    throw new Error('Add at least two PDF files to merge.');
  }

  onProgress?.({
    stage: 'reading',
    message: `Preparing ${files.length} PDF documents...`,
    percentage: 10,
  });

  const mergedDoc = await PDFDocument.create();
  mergedDoc.setProducer('Zorli PDF Merger');
  mergedDoc.setCreator('Zorli');

  let expectedTotalPages = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    onProgress?.({
      stage: 'merging',
      message: `Merging document ${i + 1} of ${files.length}: ${file.name}...`,
      currentFileIndex: i + 1,
      totalFiles: files.length,
      percentage: Math.round(15 + ((i + 1) / files.length) * 60),
    });

    const bytes = await readFileAsUint8Array(file);

    if (!hasPdfMagicBytes(bytes)) {
      throw new Error(`"${file.name}" is not a valid PDF file.`);
    }

    let sourceDoc: PDFDocument;
    let pageCount = 0;
    try {
      sourceDoc = await PDFDocument.load(bytes, {
        ignoreEncryption: false,
        updateMetadata: false,
      });
      pageCount = sourceDoc.getPageCount();
    } catch (err: any) {
      const msg = (err?.message || '').toLowerCase();
      if (
        msg.includes('encrypt') ||
        msg.includes('password') ||
        msg.includes('decrypt')
      ) {
        throw new Error(
          `We couldn't merge "${file.name}" because it is encrypted or password-protected.`
        );
      }
      throw new Error(
        `"${file.name}" appears to be corrupted or invalid and cannot be merged.`
      );
    }

    expectedTotalPages += pageCount;

    // Copy all pages from this document in exact page order
    const copiedPages = await mergedDoc.copyPages(
      sourceDoc,
      sourceDoc.getPageIndices()
    );

    for (const page of copiedPages) {
      mergedDoc.addPage(page);
    }
  }

  onProgress?.({
    stage: 'saving',
    message: 'Compiling combined PDF document...',
    percentage: 85,
  });

  const mergedBytes = await mergedDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  onProgress?.({
    stage: 'verifying',
    message: 'Validating output integrity...',
    percentage: 95,
  });

  // Output validation
  if (!hasPdfMagicBytes(mergedBytes)) {
    throw new Error('PDF merge operation failed to generate a valid PDF format.');
  }

  // Reload to verify document structure and confirm page count
  const verifiedDoc = await PDFDocument.load(mergedBytes, {
    ignoreEncryption: false,
  });

  const actualPageCount = verifiedDoc.getPageCount();
  if (actualPageCount !== expectedTotalPages) {
    throw new Error(
      `Merged PDF verification failed: expected ${expectedTotalPages} pages, but generated ${actualPageCount}.`
    );
  }

  const mergedBlob = new Blob([mergedBytes as any], {
    type: 'application/pdf',
  });
  const downloadUrl = safeCreateObjectURL(mergedBlob);

  onProgress?.({
    stage: 'done',
    message: 'PDFs merged successfully!',
    percentage: 100,
  });

  return {
    mergedBlob,
    mergedSize: mergedBytes.length,
    pageCount: actualPageCount,
    filesCount: files.length,
    downloadUrl,
    defaultFilename: 'merged-document.pdf',
  };
}
