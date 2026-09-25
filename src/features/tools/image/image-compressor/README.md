# Image Compressor

Isolated feature module for image compression in Zorli.

## Purpose
Compress JPG, PNG, WebP, and AVIF image formats client-side to minimize file sizes for websites, forms, and email attachments without perceptual loss in quality.

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
