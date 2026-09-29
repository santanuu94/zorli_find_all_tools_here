import { Tool } from '../../../../types';

export interface EducationalGuideSection {
  title: string;
  description: string;
  items?: { title: string; text: string }[];
}

export interface ImageMetadataCleanerConfig extends Tool {
  supportedFormats: string[];
  maxFileSizeMb: number;
  guides?: EducationalGuideSection[];
}

export const imageMetadataCleanerConfig: ImageMetadataCleanerConfig = {
  slug: 'image-metadata-cleaner',
  name: 'Image Metadata Cleaner',
  description:
    'View image metadata and create a cleaner copy of your JPG, PNG, or WebP image. Check EXIF, GPS location, camera data, and other supported metadata before sharing.',
  category: 'images',
  iconName: 'ShieldAlert',
  iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  iconColor: '#818CF8',
  status: 'available', // Shipped Tool #5!
  featured: true,
  popular: true,
  filterType: 'edit',
  tags: [
    'metadata',
    'metadata cleaner',
    'exif',
    'exif remover',
    'remove exif',
    'gps',
    'remove metadata',
    'privacy',
    'clean photo',
    'client side',
  ],
  supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSizeMb: 60,
  features: [
    '100% in-browser processing — your images never leave your computer or upload to external servers',
    'Deep metadata inspection: parses EXIF, GPS coordinates, camera hardware, timestamps, and IPTC/XMP tags',
    'Privacy-sensitive data highlighting: flags exact GPS coordinates and device owner details',
    'Lossless binary metadata stripping for JPG, PNG, and WebP — preserves pristine image quality',
    'Before / After verification engine: automatically re-scans the clean copy to objectively verify metadata removal',
    'Content Credentials / C2PA detection: identifies provenance manifests without mislabeling',
    'Batch cleaning: inspect and clean multiple photos with individual or batch ZIP downloads',
  ],
  guides: [
    {
      title: 'What is image metadata?',
      description:
        'Image metadata is invisible hidden data embedded directly inside photo files by smartphones, digital cameras, and editing applications. Whenever you snap a photo, your device automatically records technical details such as your geographical GPS coordinates, camera brand and model, lens settings, date and time, and sometimes software editing history. While useful for organizing photography libraries, this information is unintentionally shared whenever you post photos online or message friends.',
    },
    {
      title: 'What information can an image contain?',
      description:
        'Modern digital photos frequently carry dozens of hidden metadata fields organized into distinct structures:',
      items: [
        {
          title: 'Geographic Location (GPS)',
          text: 'Precise latitude, longitude, and elevation coordinates that can reveal your home address, workplace, or travel locations down to a few feet.',
        },
        {
          title: 'Camera & Hardware Details',
          text: 'Camera make, exact model, serial number, lens model, focal length, aperture (f-stop), ISO speed, and flash configuration.',
        },
        {
          title: 'Timestamps',
          text: 'Exact date and time when the shutter clicked (DateTimeOriginal), creation timestamp, and subsequent file modification dates.',
        },
        {
          title: 'Software & Author Attribution',
          text: 'Editing tools used (e.g. Photoshop, Lightroom), photographer name, copyright notices, and custom user comments.',
        },
        {
          title: 'Color & Technical Profiles',
          text: 'Embedded ICC profiles, color space specifications, and thumbnail previews.',
        },
      ],
    },
    {
      title: 'Why remove image metadata before sharing?',
      description:
        'Protecting your privacy is the primary reason to sanitize photos. Selling items on classifieds, posting on community forums, or uploading pictures of your family can inadvertently disclose where you live or what expensive camera equipment you own. Creating a clean copy strips these unnecessary tracking fields while preserving the full visual quality of your photo.',
    },
    {
      title: 'How to remove image metadata with Zorli',
      description:
        'Zorli provides a transparent, five-step inspection and cleaning workflow:',
      items: [
        {
          title: '1. Select or Drop Your Image',
          text: 'Upload any JPG, PNG, or WebP photo into the private in-browser dropzone.',
        },
        {
          title: '2. Review Detected Metadata',
          text: 'Zorli immediately scans the file structure and displays all detected fields grouped by category, highlighting sensitive location data.',
        },
        {
          title: '3. Create a Clean Copy',
          text: 'Click "Create Clean Copy" to strip supported metadata segments using lossless binary processing.',
        },
        {
          title: '4. Verify the Result',
          text: 'Zorli automatically re-scans the output file and provides an objective Before vs. After field count confirmation.',
        },
        {
          title: '5. Download',
          text: 'Save your sanitized photo with peace of mind. Your original local file remains untouched.',
        },
      ],
    },
  ],
};
