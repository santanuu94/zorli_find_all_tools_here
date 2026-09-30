import { Tool } from '../../../../types';

export const imageBackgroundRemoverConfig: Tool = {
  slug: 'image-background-remover',
  name: 'Image Background Remover',
  description:
    'Remove image backgrounds online and create transparent PNG images. Process your image with Zorli’s background remover and download the result.',
  category: 'images',
  iconName: 'Eraser',
  iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  iconColor: '#818CF8',
  status: 'available',
  featured: true,
  popular: true,
  filterType: 'edit',
  tags: [
    'background remover',
    'remove background',
    'transparent png',
    'remove bg',
    'cutout image',
    'photo background remover',
    'product background',
    'isolate subject',
  ],
  features: [
    'AI-powered foreground segmentation for people, pets, products, and objects',
    'True transparent PNG output with clean alpha channel',
    'Instant background color switching (Transparent, White, Black, Custom Color)',
    '100% client-side browser processing with zero image uploads',
    'Preserves source image dimensions and full sharpness',
    'Interactive before & after comparison preview with checkerboard transparency',
    'Batch upload & processing with single-click ZIP export',
  ],
  howItWorks: [
    { step: 1, title: 'Upload Image', description: 'Upload your JPG, PNG, or WebP photo into the dropzone.' },
    { step: 2, title: 'Analyze Subject', description: 'Zorli’s on-device AI automatically analyzes the foreground and segments the subject.' },
    { step: 3, title: 'Preview Cutout', description: 'Preview the segmented cutout against the transparency checkerboard.' },
    { step: 4, title: 'Pick Background', description: 'Optionally choose a solid background color (White, Black, or Custom Color).' },
    { step: 5, title: 'Download PNG', description: 'Click Download PNG to save your clean, high-resolution cutout.' },
  ],
  faqs: [
    {
      question: 'How does background removal work?',
      answer:
        'Zorli utilizes lightweight, on-device neural network models running directly in your web browser via WebAssembly and WebGPU. The model identifies the primary foreground subject—whether a person, product, animal, or object—and creates a smooth alpha transparency mask without uploading your photo anywhere.',
    },
    {
      question: 'Can I make the background transparent?',
      answer:
        'Yes! Transparent PNG is the default output mode. The downloaded PNG contains an authentic alpha channel that seamlessly overlays on websites, presentations, graphic designs, and video editors.',
    },
    {
      question: 'What image formats are supported?',
      answer:
        'Zorli supports standard JPG/JPEG, PNG, and WebP raster images. All processed cutouts are exported as standard high-fidelity PNG files to preserve transparency.',
    },
    {
      question: 'Does background removal reduce image quality?',
      answer:
        'No. Zorli applies the computed alpha mask directly back onto your original source pixels, preserving your photo’s native resolution, sharpness, and color profile rather than downscaling the final file.',
    },
    {
      question: 'Can I use the result for e-commerce and product images?',
      answer:
        'Absolutely. E-commerce platforms like Amazon, Shopify, eBay, and Etsy often require pure white backgrounds or transparent product cutouts. You can choose either pure White (#FFFFFF) or Transparent with a single click.',
    },
    {
      question: 'Are my images uploaded to external servers?',
      answer:
        'No. All machine learning inference and canvas compositing occur entirely on your device inside your web browser. Your private photos never leave your computer or phone.',
    },
    {
      question: 'Does it work on mobile devices?',
      answer:
        'Yes. Zorli is optimized for modern mobile browsers with touch-friendly before/after controls, adaptive memory management, and responsive layouts.',
    },
    {
      question: 'Why might hair, fur, or fine details look imperfect on certain photos?',
      answer:
        'Like all automated segmentation systems, accuracy depends on visual contrast between the subject and the background. Images with strong contrast, clear focus, and clean edges yield the crispest results, while heavily blurred, low-contrast, or semi-transparent subjects (like smoke or glass) may retain subtle edge artifacts.',
    },
  ],
};
