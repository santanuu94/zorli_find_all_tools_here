import { Tool } from '../../../../types';

export interface EducationalGuideSection {
  title: string;
  description: string;
  items?: { title: string; text: string }[];
}

export interface ImageCompressorConfig extends Tool {
  supportedFormats: string[];
  maxFileSizeMb: number;
  defaultQuality: number;
  guides?: EducationalGuideSection[];
}

export const imageCompressorConfig: ImageCompressorConfig = {
  slug: 'image-compressor',
  name: 'Image Compressor',
  description:
    'Compress JPG, PNG and WebP images directly in your browser. Reduce file sizes while preserving visual clarity with Zorli’s free, client-side compressor.',
  category: 'images',
  iconName: 'Image',
  iconBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  iconColor: '#38BDF8',
  status: 'available', // Tool #1 is live and production-ready!
  featured: true,
  popular: true,
  filterType: 'optimize',
  tags: ['compress', 'optimize', 'shrink', 'jpg', 'jpeg', 'png', 'webp', 'image compressor', 'client side'],
  supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSizeMb: 50,
  defaultQuality: 80,
  features: [
    '100% in-browser processing — your images never touch an external server',
    'Intelligent multi-format support for JPG, JPEG, PNG, and WebP',
    'Batch compression queue with real-time before/after previews',
    'One-click individual downloads or single ZIP archive download',
    'Strict size calculations that never report false savings on already-optimized files',
    'Completely free with no account creation, no watermarks, and no usage limits',
  ],
  howItWorks: [
    {
      step: 1,
      title: 'Select or Drop Images',
      description:
        'Drag and drop your JPG, PNG, or WebP files into the workspace, or click to choose files from your device.',
    },
    {
      step: 2,
      title: 'Choose Compression Level',
      description:
        'Adjust the quality slider or click presets like Balanced (80%), Smaller File (60%), or Best Quality (90%). Changes update in real-time.',
    },
    {
      step: 3,
      title: 'Instant Download',
      description:
        'Download individual compressed images with preserved filenames, or download all completed images bundled in a clean ZIP file.',
    },
  ],
  guides: [
    {
      title: 'Supported Image Formats',
      description:
        'Zorli’s Image Compressor natively supports the most common web and photography formats:',
      items: [
        {
          title: 'JPEG / JPG',
          text: 'Uses discrete cosine transform re-encoding with controllable quality factors. Strips unnecessary camera metadata and EXIF tags for substantial file size reduction.',
        },
        {
          title: 'PNG',
          text: 'Preserves full alpha transparency while stripping extraneous chunks. For lower quality presets, intelligent color quantization reduces Deflate entropy for real size gains.',
        },
        {
          title: 'WebP',
          text: 'Modern web image format supporting both lossy and lossless modes. Offers superior compression efficiency for website speed and mobile optimization.',
        },
      ],
    },
    {
      title: 'How Browser-Side Image Compression Works',
      description:
        'Unlike traditional online tools that require you to upload your personal photos to a remote cloud server, Zorli processes images directly inside your web browser:',
      items: [
        {
          title: 'Client-Side Canvas Re-encoding',
          text: 'Your browser decodes the image into an offscreen canvas and re-encodes the pixel matrix using hardware acceleration on your local device.',
        },
        {
          title: 'Metadata Stripping',
          text: 'Digital cameras and graphic editors embed GPS coordinates, timestamps, and thumbnail buffers. Re-encoding strips this bloat, saving up to 20-30% without any visual loss.',
        },
        {
          title: 'Perceptual Quality Optimization',
          text: 'Subtle high-frequency color variations that the human eye cannot discern are consolidated, dramatically reducing the byte count while keeping the image crisp.',
        },
      ],
    },
    {
      title: 'Balancing File Size and Quality',
      description:
        'Compression involves a deliberate tradeoff between byte savings and visual fidelity:',
      items: [
        {
          title: 'Balanced (80% - Recommended)',
          text: 'The sweet spot for websites, email attachments, and online forms. Typically reduces file size by 50% to 75% with zero perceptible distortion on standard screens.',
        },
        {
          title: 'Smaller File (60%)',
          text: 'Ideal when you must meet strict upload limits (e.g. government portals, school portals, or fast mobile websites) where file size is the top priority.',
        },
        {
          title: 'Best Quality (90-95%)',
          text: 'Gentle compression designed for portfolios, print drafts, and photography showcases where maximum detail preservation is paramount.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'How do I compress an image?',
      answer:
        'Simply drag and drop your image onto the upload box or click "Select Images". Choose your desired quality preset (such as Balanced 80%), and your image will be compressed immediately in your browser. Then click "Download" to save it to your computer or phone.',
    },
    {
      question: 'Does Zorli upload my images to an external server?',
      answer:
        'No. Zorli’s Image Compressor operates 100% inside your browser using client-side HTML5 Canvas and Blob APIs. Your files are never uploaded, stored, or transferred across any network, guaranteeing privacy.',
    },
    {
      question: 'Which image formats are supported?',
      answer:
        'We support JPG, JPEG, PNG, and WebP images up to 50MB per file. These formats can be reliably decoded and re-encoded by modern browser engines.',
    },
    {
      question: 'Will compression reduce image quality?',
      answer:
        'At our default Balanced (80%) preset, compression uses perceptual optimization that removes unneeded metadata and imperceptible color redundancy. The resulting image looks practically identical to the original to the human eye while being significantly smaller.',
    },
    {
      question: 'Can I compress multiple images at the same time?',
      answer:
        'Yes! You can select multiple images simultaneously. Each file will be queued and compressed in your browser, and you can download them all at once as a convenient ZIP file.',
    },
    {
      question: 'Is Zorli’s image compressor completely free?',
      answer:
        'Yes. Zorli is free to use with no account registration, no subscriptions, no watermarks added to your images, and no artificial limits.',
    },
    {
      question: 'What happens if compressing an image makes it larger?',
      answer:
        'Some images (such as tiny, already-optimized PNG icons) cannot be compressed further without quality loss. If re-encoding would yield a larger file, Zorli flags the file as "Already optimized" and preserves the original file so you never receive a bloated output.',
    },
  ],
};

export const metadata = imageCompressorConfig;
