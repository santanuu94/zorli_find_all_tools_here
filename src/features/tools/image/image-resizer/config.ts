import { Tool } from '../../../../types';

export interface EducationalGuideSection {
  title: string;
  description: string;
  items?: { title: string; text: string }[];
}

export interface ImageResizerConfig extends Tool {
  supportedFormats: string[];
  maxFileSizeMb: number;
  guides?: EducationalGuideSection[];
}

export const imageResizerConfig: ImageResizerConfig = {
  slug: 'image-resizer',
  name: 'Image Resizer',
  description:
    'Resize JPG, PNG and WebP images online directly in your browser. Change image dimensions, preserve aspect ratio, and download resized images with Zorli.',
  category: 'images',
  iconName: 'Maximize2',
  iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  iconColor: '#10B981',
  status: 'available', // Shipped Tool #2!
  featured: true,
  popular: true,
  filterType: 'edit',
  tags: [
    'resize',
    'image resizer',
    'dimensions',
    'scale',
    'aspect ratio',
    'width',
    'height',
    'percentage',
    'presets',
    'jpg',
    'png',
    'webp',
    'client side',
  ],
  supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSizeMb: 50,
  features: [
    '100% in-browser processing — your images never touch an external server',
    'Pixel-precise custom dimensions with smart aspect ratio preservation',
    'Instant percentage scaling (25%, 50%, 75%, 150%) or custom scale factors',
    'Built-in standard presets for social media, video (1080p, 720p), and web banners',
    '“Don’t enlarge” safeguard to prevent accidental upscaling and pixelation',
    'One-click individual downloads or single ZIP archive download for batch queues',
    'Completely free with no account creation, no watermarks, and no limits',
  ],
  howItWorks: [
    {
      step: 1,
      title: 'Select or Drop Images',
      description:
        'Drag and drop JPG, PNG, or WebP files into the workspace, or browse files directly from your computer or phone.',
    },
    {
      step: 2,
      title: 'Configure Dimensions or Presets',
      description:
        'Enter exact pixel width/height with aspect ratio locked, choose a scaling percentage, or pick a popular web preset.',
    },
    {
      step: 3,
      title: 'Instant Resize & Download',
      description:
        'Images are re-rendered at exact pixel dimensions directly in your browser. Download single images or grab everything as a ZIP file.',
    },
  ],
  guides: [
    {
      title: 'Resize Without Losing Aspect Ratio',
      description:
        'Maintaining the original proportions of your image is essential to prevent stretching or unnatural distortion:',
      items: [
        {
          title: 'Locked Aspect Ratio',
          text: 'When enabled by default, changing either the width or the height automatically calculates the other dimension using the formula: newHeight = newWidth / (origWidth / origHeight).',
        },
        {
          title: 'Freeform Stretch',
          text: 'Unlock the ratio constraint whenever you deliberately need to force an image into exact custom boundaries, regardless of original orientation.',
        },
        {
          title: 'Multi-Image Batch Scaling',
          text: 'When resizing images with different aspect ratios simultaneously, locked mode preserves each individual photo’s natural geometry while aligning to your target constraint.',
        },
      ],
    },
    {
      title: 'Resize by Pixels, Percentage, or Presets',
      description:
        'Zorli provides three flexible scaling modes tailored to different workflows:',
      items: [
        {
          title: 'Custom Pixels (Mode A)',
          text: 'Specify exact pixel values for forms, product catalogs, profile avatars, or strict layout slots (e.g. 1200 × 630 for OpenGraph social preview tags).',
        },
        {
          title: 'Percentage Scaling (Mode B)',
          text: 'Scale images relative to their original canvas. For example, 50% halves both width and height, reducing pixel count to 25% of the original without doing manual math.',
        },
        {
          title: 'Display & Social Presets (Mode C)',
          text: 'Select one-click standards including Full HD 1080p (1920×1080), HD 720p (1280×720), Instagram Square (1080×1080), and Vertical 9:16 (1080×1920).',
        },
      ],
    },
    {
      title: '“Don’t Enlarge” Safeguard',
      description:
        'Preventing accidental upscaling keeps your graphics sharp and avoids digital artifacts:',
      items: [
        {
          title: 'Preserves Native Clarity',
          text: 'Raster images cannot gain detail when stretched beyond their native resolution. Upscaling small photos results in blurry edges and pixelation.',
        },
        {
          title: 'Automatic Dimension Clamping',
          text: 'When "Don\'t enlarge smaller images" is active, images smaller than the requested dimensions are safely preserved at their native size rather than artificially magnified.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'How do I resize an image?',
      answer:
        'Drag and drop your image onto the upload box or click "Select Images". Choose your desired width/height, percentage, or preset, and click "Resize Images". Your resized image will be generated instantly in your browser ready for download.',
    },
    {
      question: 'Can I resize multiple images at once?',
      answer:
        'Yes! You can upload multiple photos simultaneously. Zorli queues each file, processes them in your browser, and lets you download individual files or a combined ZIP archive with all resized images.',
    },
    {
      question: 'Can I resize JPG, PNG and WebP images?',
      answer:
        'Yes. We support JPG/JPEG, PNG, and WebP formats up to 50MB each. When resized, images preserve their original format and transparency.',
    },
    {
      question: 'Does resizing reduce image quality?',
      answer:
        'Downscaling reduces pixel count, which makes file sizes lighter while retaining sharpness. Zorli uses high-quality bicubic interpolation on an HTML5 canvas to guarantee smooth, crisp edges.',
    },
    {
      question: 'Can I resize an image without changing its proportions?',
      answer:
        'Yes. "Lock aspect ratio" is enabled by default. When you modify the width, the height calculates automatically to match the original proportions perfectly.',
    },
    {
      question: 'What does the “Don’t enlarge” setting do?',
      answer:
        'If you upload an image smaller than your requested dimensions (for example, an 800×600 photo when your preset is 1920×1080), enabling "Don\'t enlarge" ensures the photo is not upscaled into a blurry image.',
    },
    {
      question: 'Does Zorli upload my images to an external server?',
      answer:
        'No. All resizing happens 100% inside your device\'s browser using hardware-accelerated Canvas APIs. Your files are never uploaded, stored, or sent across the internet.',
    },
    {
      question: 'Is Zorli’s Image Resizer free?',
      answer:
        'Yes. Zorli is free to use with no account registration, no watermarks, and no usage quotas.',
    },
  ],
};

export const metadata = imageResizerConfig;
