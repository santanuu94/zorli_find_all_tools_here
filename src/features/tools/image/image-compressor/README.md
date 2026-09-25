# Image Compressor

Isolated feature module for image compression in Zorli.

## ⚠️ Status: NOT SHIPPED (`coming-soon`)

The UI shell (upload, quality slider, results list, download button) exists, but
**the processing engine does not**. `lib/compressor.ts` exports a `compressImage`
that throws, because it previously returned the *original, uncompressed* file
while reporting a fabricated reduction percentage.

Consequences, by design:

- The tool is **not** in the active registry, so it is never presented as available.
- It has **no dynamic loader**, so its component is not bundled at all.
- Opening its route shows the shared "not available yet" shell.
- The route is excluded in `public/robots.txt`.

### Engine contract — what "done" looks like

`compressImage(file, settings)` must return `{ blob, reduction }` where:

- `blob` is the genuinely re-encoded image (canvas + `toBlob`, or a WASM codec),
- `reduction` is measured as `100 - (compressedBytes / originalBytes) * 100`, not derived
  from the requested quality.

Until that is true, the tool must stay out of
`ACTIVE_IMAGE_TOOL_SLUGS` and `IMAGE_TOOL_LOADERS`
(`src/features/tools/image/registry.ts` documents the three-step wiring).

## Purpose
Compress JPG, PNG, WebP, and AVIF image formats client-side to minimize file sizes for websites, forms, and email attachments.

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
│   └── DownloadButton.tsx
├── lib/
│   ├── compressor.ts
│   ├── image-processing.ts
│   └── validation.ts
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
- `image/jpeg`
- `image/png`
- `image/webp`
- `image/avif`
- Max file size: 50MB per file

## Privacy Behavior
Files are kept strictly inside the user's browser runtime. Zero images are transferred to remote servers.

## Testing Instructions
Run tests with `npm test -- image-compressor`.
