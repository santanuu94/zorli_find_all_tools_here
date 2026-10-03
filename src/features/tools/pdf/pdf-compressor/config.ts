import { Tool } from '../../../../types';

export interface EducationalGuideSection {
  title: string;
  description: string;
  items?: { title: string; text: string }[];
}

export interface PdfCompressorConfig extends Tool {
  supportedFormats: string[];
  maxFileSizeMb: number;
  guides?: EducationalGuideSection[];
}

export const pdfCompressorConfig: PdfCompressorConfig = {
  slug: 'pdf-compressor',
  name: 'PDF Compressor',
  description:
    'Compress PDF files online and reduce their file size. Choose target sizes like 1 MB or 2 MB while preserving document text and pages with Zorli’s free, client-side compressor.',
  category: 'pdf',
  iconName: 'FileText',
  iconBg: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  iconColor: '#F43F5E',
  status: 'available', // Active production tool
  featured: true,
  popular: true,
  filterType: 'optimize',
  tags: ['pdf', 'compress', 'reduce', 'shrink', 'document', 'pdf compressor', 'client side', 'target size'],
  supportedFormats: ['application/pdf'],
  maxFileSizeMb: 150,
  features: [
    '100% in-browser processing — your confidential PDF documents never leave your device',
    'Target-size oriented compression: choose 500 KB, 1 MB, 2 MB, 5 MB, or custom target sizes',
    'Preserves page count, text searchability, vector paths, and document integrity',
    'Structural stream optimization and metadata stripping for clean, compact file sizes',
    'Intelligent embedded image recompression and downscaling for scanned or photo-heavy documents',
    'Honest size reporting with before/after comparisons and target-achieved indicators',
  ],
  howItWorks: [
    {
      step: 1,
      title: 'Upload Your PDF',
      description:
        'Drag and drop your PDF document into the workspace or click to select from your device. The document is analyzed instantly in memory.',
    },
    {
      step: 2,
      title: 'Choose a Target Size',
      description:
        'Select convenient goal presets such as 500 KB, 1 MB, 2 MB, or enter a custom target size to meet email attachment or upload portal limits.',
    },
    {
      step: 3,
      title: 'Compress the PDF',
      description:
        'Click Compress PDF. Zorli restructures internal object streams, strips extraneous metadata, and optimizes embedded images to approach your target.',
    },
    {
      step: 4,
      title: 'Check the Result',
      description:
        'Review the before-and-after breakdown, exact reduction percentage, and target status (Target Achieved or Best Effort).',
    },
    {
      step: 5,
      title: 'Download the Compressed File',
      description:
        'Download your optimized PDF with its preserved filename. Reset anytime to compress another file without refreshing the page.',
    },
  ],
  guides: [
    {
      title: 'Compress PDF to a Specific Size',
      description:
        'Unlike traditional compressors that only offer vague low/medium/high sliders, Zorli lets you set an explicit target size:',
      items: [
        {
          title: 'Target Size as a Goal',
          text: 'Target size serves as an optimization objective. The compression engine progressively adjusts object streams and image qualities to come as close to your target as possible without corrupting document layout.',
        },
        {
          title: 'Portal & Email Attachment Limits',
          text: 'Many government websites, job applications, and email services restrict file sizes to under 1 MB, 2 MB, or 5 MB. Target presets give you immediate control over these common cutoffs.',
        },
        {
          title: 'Already-Small Protection',
          text: 'If your uploaded document is already smaller than your chosen target, Zorli alerts you and lets you download the original directly without unnecessary re-processing.',
        },
      ],
    },
    {
      title: 'What Affects PDF Compression?',
      description:
        'The degree of compression achievable depends fundamentally on what is inside your PDF document:',
      items: [
        {
          title: 'Scanned Documents & Raster Photos',
          text: 'PDFs created from desktop scanners or smartphone cameras contain large bitmap images. These documents often see the greatest reduction (up to 70–90%) via JPEG re-encoding and resolution scaling.',
        },
        {
          title: 'Vector Graphics & TrueType Fonts',
          text: 'Documents created in Word or InDesign contain text glyphs, font descriptors, and vector line work. These are already relatively compact and benefit primarily from object-stream consolidation.',
        },
        {
          title: 'Existing Compression',
          text: 'If a PDF has already been exported with Acrobat or another optimizer using aggressive Flate and JPEG settings, further shrinkage may be minimal without sacrificing visual legibility.',
        },
        {
          title: 'Document Metadata & Revisions',
          text: 'Many enterprise PDFs accumulate historical editing revisions, thumbnail buffers, and XMP XML packets. Stripping this overhead cleans up the file without touching visible content.',
        },
      ],
    },
    {
      title: 'Does PDF Compression Reduce Quality?',
      description:
        'Understanding how compression affects visual clarity ensures you choose the right profile for your needs:',
      items: [
        {
          title: 'Selectable Text Stays 100% Crisp',
          text: 'Text strings and mathematical vector formulas are never rasterized into blurry pixels. Text remains sharp, searchable, and zoomable at any magnification.',
        },
        {
          title: 'Images & Photos',
          text: 'Embedded photos are balanced according to your target. Balanced and High profiles preserve excellent clarity for reading, while Smaller File aggressively reduces image bytes to pass strict file limits.',
        },
        {
          title: 'Document Layout & Links',
          text: 'Page dimensions, margins, bookmarks, annotations, and internal links remain intact throughout the compression process.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'How do I compress a PDF?',
      answer:
        'Simply drag and drop your PDF file onto the upload zone, pick your target file size (such as 1 MB or 2 MB), and click Compress PDF. Once processing completes, click Download Compressed PDF.',
    },
    {
      question: 'Can I compress a PDF to 1 MB?',
      answer:
        'Yes. Select the 1 MB preset. If your PDF contains large embedded images or uncompressed streams, Zorli will optimize them to fit under 1 MB. If the document cannot safely reach 1 MB without severe degradation, Zorli gives you the smallest safe output possible.',
    },
    {
      question: 'Can I compress a PDF to 2 MB?',
      answer:
        'Yes. 2 MB is one of the most common upload limits for online application forms. Selecting 2 MB instructs the engine to fit your document into this threshold.',
    },
    {
      question: 'Does compressing a PDF reduce quality?',
      answer:
        'Text and vector graphics remain completely vector-sharp and searchable. Embedded images may experience slight perceptual compression if necessary to meet stringent target sizes.',
    },
    {
      question: 'Can I compress scanned PDFs?',
      answer:
        'Yes. Scanned PDFs are typically composed of high-resolution full-page images. Zorli’s engine detects these image streams and re-encodes them, often producing substantial file size reductions.',
    },
    {
      question: 'Will my PDF remain searchable?',
      answer:
        'Yes. Zorli never converts your entire PDF into a series of flattened pictures. Text layers, font encodings, and selectable words are fully preserved.',
    },
    {
      question: 'Are my PDFs uploaded to a server?',
      answer:
        'No. Zorli executes 100% client-side inside your web browser using WebAssembly and JavaScript. Your confidential documents, legal contracts, and personal records never leave your computer.',
    },
    {
      question: 'Why couldn’t my PDF reach the target size?',
      answer:
        'Some PDFs consist primarily of embedded font sets, vector blueprints, or images that are already compressed to their mathematical limits. Zorli honestly reports the best achieved size rather than faking impossible reduction or destroying legibility.',
    },
  ],
};
