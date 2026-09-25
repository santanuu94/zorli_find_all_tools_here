import { Tool } from '../../../../types';

export interface ImageCompressorConfig extends Tool {
  supportedFormats: string[];
  maxFileSizeMb: number;
  defaultQuality: number;
}

export const imageCompressorConfig: ImageCompressorConfig = {
  slug: 'image-compressor',
  name: 'Image Compressor',
  description: 'Reduce image file size without losing quality.',
  category: 'images',
  iconName: 'Image',
  iconBg: 'bg-sky-500/10',
  iconColor: '#38BDF8',
  status: 'coming-soon',
  featured: true,
  popular: true,
  filterType: 'optimize',
  tags: ['compress', 'optimize', 'shrink', 'jpg', 'png', 'webp'],
  supportedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  maxFileSizeMb: 50,
  defaultQuality: 80,
  features: [
    'Smart lossy and lossless compression algorithm',
    'Batch process multiple images at once',
    'Configurable quality slider with live visual comparison',
    'Supports JPG, PNG, WebP, and AVIF formats',
  ],
  howItWorks: [
    {
      step: 1,
      title: 'Select Images',
      description: 'Drop or select your PNG, JPG, or WebP images.',
    },
    {
      step: 2,
      title: 'Choose Compression Level',
      description: 'Adjust quality settings or use optimal smart compression.',
    },
    {
      step: 3,
      title: 'Download Optimized Files',
      description: 'Instantly download your reduced files individually or as a ZIP.',
    },
  ],
  faqs: [
    {
      question: 'Will image compression degrade visual quality?',
      answer:
        'Zorli is designed with perceptual optimization algorithms to preserve sharp details while trimming unnecessary metadata and color bloat.',
    },
    {
      question: 'Are my files uploaded to an external server?',
      answer:
        'Zorli tools are designed with privacy first, processing supported image conversions directly in your client browser where possible.',
    },
  ],
};

export const metadata = imageCompressorConfig;
