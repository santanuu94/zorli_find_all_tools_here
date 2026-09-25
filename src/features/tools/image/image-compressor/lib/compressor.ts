import { CompressionSettings } from '../types';

/**
 * NOT IMPLEMENTED — intentionally.
 *
 * This function used to return the original, uncompressed `File` unchanged while
 * reporting a fabricated `reduction` percentage derived from the quality slider.
 * The UI then showed a green check and "-55%", so the tool appeared to work when
 * it did nothing at all.
 *
 * There is no placeholder implementation any more. Until a real client-side
 * compression engine (canvas + `toBlob`, or a WASM codec) replaces this
 * function, the Image Compressor ships as `coming-soon` and is NOT registered as
 * an active tool — see `src/features/tools/image/registry.ts` for the documented
 * three-step wiring that makes it live again, and
 * `src/features/tools/image/image-compressor/README.md` for the engine contract.
 *
 * @throws Always. Implementing the engine means replacing this throw.
 */
export async function compressImage(
  file: File,
  settings: CompressionSettings
): Promise<never> {
  throw new Error(
    `Image compression is not implemented yet, so "${file.name}" was not processed. ` +
      `The Image Compressor is marked "coming soon" and is not shipped. ` +
      `(requested quality: ${settings.quality})`
  );
}

