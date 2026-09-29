import { Tool } from '../../../../types';

export interface EducationalGuideSection {
  title: string;
  description: string;
  items?: { title: string; text: string }[];
}

export interface ImageCropperConfig extends Tool {
  supportedFormats: string[];
  maxFileSizeMb: number;
  guides?: EducationalGuideSection[];
}

export const imageCropperConfig: ImageCropperConfig = {
  slug: 'image-cropper',
  name: 'Image Cropper',
  description:
    'Crop JPG, PNG and WebP images online directly in your browser. Choose custom or social-media aspect ratios, adjust your crop area, and download cropped images with Zorli.',
  category: 'images',
  iconName: 'Crop',
  iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  iconColor: '#FBBF24',
  status: 'available', // Shipped Tool #4!
  featured: true,
  popular: true,
  filterType: 'edit',
  tags: [
    'crop',
    'image cropper',
    'crop image',
    'aspect ratio',
    'square',
    'instagram crop',
    'youtube crop',
    'social media crop',
    'rotate',
    'flip',
    'client side',
  ],
  supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSizeMb: 50,
  features: [
    '100% in-browser processing — your images never touch an external server',
    'Interactive freeform crop box with 8 boundary drag handles',
    'One-click aspect ratio presets: 1:1 Square, 4:5 Portrait, 3:4, 16:9 Widescreen, and 9:16 Vertical',
    'Dedicated social media presets for Instagram, YouTube, Facebook, X, TikTok, and LinkedIn',
    'Smooth rotation (90° left & right) and horizontal/vertical flipping',
    'Preserves alpha transparency on PNG and WebP crops without flattening',
    'Queue multiple photos and download individually or combined as a single ZIP file',
    'Completely free with no watermarks, no account registration, and no limits',
  ],
  howItWorks: [
    {
      step: 1,
      title: 'Upload Images',
      description:
        'Drag and drop JPG, PNG, or WebP files into the workspace or browse files from your computer or phone.',
    },
    {
      step: 2,
      title: 'Adjust Crop & Composition',
      description:
        'Select an aspect ratio (or crop freely), position and resize the crop box, and optionally rotate or flip.',
    },
    {
      step: 3,
      title: 'Crop & Download',
      description:
        'Click "Crop Image" to render the cropped photo directly in your browser and download the high-resolution file.',
    },
  ],
  guides: [
    {
      title: 'Understanding Common Aspect Ratios',
      description:
        'Choosing the right aspect ratio ensures your photos look intentional and fit destination screens without unwanted cropping:',
      items: [
        {
          title: '1:1 Square',
          text: 'Equal width and height. Standard for Instagram feed photos, profile avatars, and e-commerce product grids.',
        },
        {
          title: '4:5 Vertical Portrait',
          text: 'The optimal vertical format for Instagram and Facebook feeds, maximizing screen real estate on mobile devices without letterboxing.',
        },
        {
          title: '16:9 Widescreen',
          text: 'The universal landscape video standard. Ideal for YouTube thumbnails, desktop presentations, website headers, and X (Twitter) in-stream photos.',
        },
        {
          title: '9:16 Vertical Story & Reel',
          text: 'Full-screen mobile vertical orientation used for Instagram Reels, Stories, YouTube Shorts, and TikTok videos.',
        },
      ],
    },
    {
      title: 'Cropping vs. Resizing: What Is the Difference?',
      description:
        'Cropping and resizing serve different purposes in visual design:',
      items: [
        {
          title: 'Cropping',
          text: 'Trims away unwanted outer areas of an image to reframe the subject, adjust the composition, or change the aspect ratio without distorting proportions.',
        },
        {
          title: 'Resizing',
          text: 'Scales the overall dimensions (pixel count) of the entire image up or down while keeping the existing composition intact.',
        },
      ],
    },
    {
      title: 'Preserving Transparency in PNG and WebP',
      description:
        'Transparent graphics require specialized handling during image manipulation:',
      items: [
        {
          title: 'Alpha Channel Preservation',
          text: 'Zorli automatically preserves transparent backgrounds when cropping PNG and WebP images, preventing white or black background artifacts.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'How do I crop an image online with Zorli?',
      answer:
        'Upload your image by dragging it into the workspace or clicking "Select Images". Choose an aspect ratio preset or adjust the crop box freely, then click "Crop Image" to immediately download your cropped result.',
    },
    {
      question: 'Can I crop an image to a specific aspect ratio?',
      answer:
        'Yes. Zorli provides instant presets for 1:1, 4:5, 3:4, 16:9, and 9:16, as well as a completely unconstrained Free mode.',
    },
    {
      question: 'Can I crop images for Instagram and YouTube?',
      answer:
        'Yes! Under "Crop for Social Media", select Instagram or YouTube to choose from formats like Instagram Post (Square or Portrait), Instagram Story, YouTube Thumbnail, Shorts, and Banners.',
    },
    {
      question: 'Does cropping reduce image quality?',
      answer:
        'No. Cropping extracts the exact pixel data within your selected boundary without applying lossy downscaling. Your cropped image retains native pixel clarity.',
    },
    {
      question: 'Can I rotate or flip my image before cropping?',
      answer:
        'Yes. You can rotate 90° clockwise or counter-clockwise, and flip horizontally or vertically. The crop box adapts automatically to your new orientation.',
    },
    {
      question: 'Can I crop multiple images?',
      answer:
        'Yes. You can upload multiple photos at once. Click on any thumbnail in the queue to crop it, and download your cropped images individually or as a combined ZIP archive.',
    },
    {
      question: 'Are my images uploaded to an external server?',
      answer:
        'No. All cropping and canvas rendering happen 100% locally inside your browser using hardware-accelerated Canvas APIs. Your files never leave your device.',
    },
    {
      question: 'Is Zorli’s Image Cropper free?',
      answer:
        'Yes. Zorli is completely free with no watermarks, no registration, and no usage limits.',
    },
  ],
};

export const metadata = imageCropperConfig;
