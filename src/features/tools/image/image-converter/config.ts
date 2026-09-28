import { Tool } from '../../../../types';

export interface EducationalGuideSection {
  title: string;
  description: string;
  items?: { title: string; text: string }[];
}

export interface ImageConverterConfig extends Tool {
  supportedFormats: string[];
  maxFileSizeMb: number;
  guides?: EducationalGuideSection[];
}

export const imageConverterConfig: ImageConverterConfig = {
  slug: 'image-converter',
  name: 'Image Converter',
  description:
    'Convert JPG, PNG and WebP images online directly in your browser. Choose your output format, adjust quality when available, and download converted images with Zorli.',
  category: 'images',
  iconName: 'FileCode2',
  iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  iconColor: '#FB7185',
  status: 'available', // Shipped Tool #3!
  featured: true,
  popular: true,
  filterType: 'convert',
  tags: [
    'convert',
    'image converter',
    'jpg to png',
    'png to jpg',
    'png to webp',
    'jpg to webp',
    'webp to jpg',
    'webp to png',
    'format converter',
    'transparency',
    'batch image converter',
    'client side',
  ],
  supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSizeMb: 50,
  features: [
    '100% in-browser processing — your images never touch an external server',
    'Bidirectional conversion between JPG, PNG, and WebP formats',
    'Intelligent transparency detection with customizable background fill for JPG output',
    'Fine-tuned lossy quality control (1–100%) for JPG and WebP files',
    'Lossless PNG output with preserved alpha transparency',
    'Batch conversion: convert multiple images simultaneously with single ZIP download',
    'Same-format safeguard prevents redundant re-encoding of unchanged formats',
    'Zero account creation, no subscription fees, no watermarks, and unlimited conversions',
  ],
  howItWorks: [
    {
      step: 1,
      title: 'Select or Drop Images',
      description:
        'Drag and drop JPG, PNG, or WebP files into the workspace, or browse files directly from your computer, tablet, or phone.',
    },
    {
      step: 2,
      title: 'Choose Target Format',
      description:
        'Select JPG, PNG, or WebP. Adjust quality for lossy formats or pick a background fill color if converting transparent images to JPG.',
    },
    {
      step: 3,
      title: 'Instant Convert & Download',
      description:
        'Images are re-encoded natively in your browser using hardware-accelerated Canvas. Download individual files or grab the entire batch as a ZIP archive.',
    },
  ],
  guides: [
    {
      title: 'Choosing the Right Image Format',
      description:
        'Each image format has unique characteristics optimized for specific web and design requirements:',
      items: [
        {
          title: 'WebP (Modern Standard)',
          text: 'Developed by Google, WebP provides 25–35% smaller file sizes than JPG with identical visual quality. It supports both lossy compression and transparent alpha channels, making it the best choice for fast modern websites.',
        },
        {
          title: 'PNG (Lossless & Transparent)',
          text: 'PNG uses lossless DEFLATE compression and full 8-bit alpha transparency. Ideal for logos, icons, screenshots, and graphics with sharp text or line art that cannot afford compression artifacts.',
        },
        {
          title: 'JPG / JPEG (Universal Photos)',
          text: 'JPG is universally compatible with every browser, operating system, and camera. It produces small file sizes for complex, colorful photographs where subtle loss in pixel precision is imperceptible.',
        },
      ],
    },
    {
      title: 'Preserving Transparency & Flattening to JPG',
      description:
        'Understanding how transparency is handled during format conversions:',
      items: [
        {
          title: 'Converting to PNG or WebP',
          text: 'When converting between PNG and WebP, transparency channels are completely preserved without alteration.',
        },
        {
          title: 'Converting Transparent Images to JPG',
          text: 'Because JPG does not support transparent alpha channels, transparent areas must be filled with a solid background color. Zorli defaults to a clean white background and lets you choose black, light gray, or dark slate.',
        },
      ],
    },
    {
      title: 'Lossy vs Lossless Quality Control',
      description:
        'How Zorli manages quality settings across different image formats:',
      items: [
        {
          title: 'JPG & WebP Quality Slider',
          text: 'For lossy formats, Zorli provides a 1–100% quality slider (defaulting to 85%), allowing you to dial in the ideal balance between high visual fidelity and lightweight file size.',
        },
        {
          title: 'True Lossless PNG',
          text: 'PNG is a lossless format that does not support lossy quality degradation. Zorli explicitly identifies PNG as lossless rather than presenting misleading fake sliders.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'How do I convert an image format with Zorli?',
      answer:
        'Upload your image by dragging and dropping it into the workspace or clicking "Select Images". Choose your target format (JPG, PNG, or WebP), customize quality if desired, and click "Convert Now". Your converted image is ready to download instantly.',
    },
    {
      question: 'How do I convert PNG to JPG without black borders or backgrounds?',
      answer:
        'JPG does not support transparency. When you convert a transparent PNG or WebP to JPG, Zorli automatically fills transparent areas with your chosen background color (defaulting to clean white) instead of rendering dark artifacts.',
    },
    {
      question: 'Why should I convert my JPG and PNG images to WebP?',
      answer:
        'WebP offers significantly better compression than JPG and PNG, reducing page weight by 25–35% without visible loss in quality. Converting to WebP dramatically improves Google Core Web Vitals and website load speeds.',
    },
    {
      question: 'Does converting an image reduce its visual quality?',
      answer:
        'Converting to lossless PNG preserves original pixel data completely. Converting to JPG or WebP uses configurable lossy compression (default 85%), which eliminates imperceptible data to achieve smaller files while maintaining crisp visual quality.',
    },
    {
      question: 'Can I convert multiple images at once?',
      answer:
        'Yes! You can upload multiple files simultaneously. Zorli queues them up, converts each file in your browser, and lets you download individual converted files or a single bundled ZIP archive.',
    },
    {
      question: 'What happens if I select the same format as the original file?',
      answer:
        'Zorli features a same-format safeguard that detects when the source and target formats are identical (for example, converting a PNG to PNG). The tool informs you with "Already PNG" and prevents redundant re-encoding.',
    },
    {
      question: 'Are my images uploaded to an external server?',
      answer:
        'No. Zorli executes all conversions 100% locally inside your browser using hardware-accelerated Canvas APIs. Your files never leave your device and are never transmitted over the internet.',
    },
    {
      question: 'Is Zorli’s Image Converter free to use?',
      answer:
        'Yes. Zorli is completely free with no account registration, no watermarks, and no daily limits.',
    },
  ],
};

export const metadata = imageConverterConfig;
