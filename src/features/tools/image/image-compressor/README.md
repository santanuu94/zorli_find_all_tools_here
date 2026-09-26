# Image Compressor

Isolated feature module for image compression in Zorli.

## ✅ Status: PRODUCTION READY (`available`)

The Image Compressor is the first fully functional, production-quality tool on Zorli. It performs 100% browser-side image compression with zero external server dependencies, full privacy, and real Canvas/Blob re-encoding.

### Architecture & Engine Highlights

- **Native Canvas Re-encoding**: Decodes images into an offscreen canvas and re-encodes via `canvas.toBlob` at the requested quality level.
- **Accurate Savings Engine**: Percentage savings are strictly calculated as `((originalSize - compressedSize) / originalSize) * 100`.
- **"Already Optimized" Guard**: When compression would yield a larger file (such as on tiny already-optimized PNGs), the tool marks the file as "Already optimized" and preserves the smaller original file without making false savings claims.
- **Batch Processing & ZIP Download**: Multi-file queue with sequential async yielding so the UI never blocks. Includes a zero-dependency standard PKZip generator (`lib/zip.ts`) to download all completed files in a single archive.
- **Memory Safety**: Object URLs are tracked and automatically revoked on remove, queue clear, and component unmount.
- **Code-Splitting**: Lazily imported via `IMAGE_TOOL_LOADERS` so it contributes 0 bytes to the initial homepage bundle.

## Directory Structure
```
image-compressor/
├── index.ts
├── config.ts
├── types.ts
├── components/
│   ├── ImageCompressor.tsx
│   ├── UploadArea.tsx
│   ├── CompressionSettings.tsx
│   ├── CompressionProgress.tsx
│   ├── CompressionResult.tsx
│   ├── PreviewModal.tsx
│   └── DownloadButton.tsx
├── lib/
│   ├── compressor.ts
│   ├── image-processing.ts
│   ├── validation.ts
│   └── zip.ts
├── hooks/
│   └── useImageCompressor.ts
├── utils/
│   └── format-file-size.ts
├── tests/
│   ├── compressor.test.ts
│   └── validation.test.ts
└── README.md
```

## Supported Inputs
- `image/jpeg` (.jpg, .jpeg)
- `image/png` (.png)
- `image/webp` (.webp)
- Max file size: 50MB per file

## Privacy Behavior
Files are kept strictly inside the user's browser runtime. Zero images are transferred to remote servers.

## Testing Instructions
Run tests with `npm test`.
Run typecheck with `npm run lint`.
Run production build with `npm run build`.
