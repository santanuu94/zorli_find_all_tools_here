import { Tool } from '../../../../types';

export interface PdfSplitterConfig extends Tool {
  supportedFormats?: string[];
  maxFileSizeMb?: number;
}

export const config: PdfSplitterConfig = {
  slug: 'pdf-splitter',
  name: 'PDF Splitter',
  description:
    'Split a PDF into separate files by page range, individual pages, or equal page groups.',
  category: 'pdf',
  iconName: 'Scissors',
  iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  iconColor: '#A855F7',
  status: 'available',
  filterType: 'edit',
  featured: true,
  popular: true,
  tags: [
    'pdf',
    'split',
    'extract',
    'pages',
    'separator',
    'cut',
    'range',
    'divide',
    'pdf splitter',
  ],
  features: [
    'Three splitting methods: Page Ranges, Extract Single Pages, or Equal Groups',
    '100% browser-side processing — your confidential documents never leave your computer',
    'Interactive output plan preview before starting the split',
    'Real-time uncovered page warnings so no pages are silently missed',
    'Download generated PDFs individually or combined into a single ZIP archive',
    'Preserves original vector paths, selectable text, fonts, and embedded images',
  ],
  maxFileSizeMb: 150,
  supportedFormats: ['application/pdf'],
  howItWorks: [
    {
      step: 1,
      title: 'Upload Your PDF File',
      description:
        'Drag and drop your PDF into the upload workspace or browse from your device. Zorli immediately checks and reports the genuine page count.',
    },
    {
      step: 2,
      title: 'Choose a Splitting Method',
      description:
        'Select Page Ranges to create custom segments, Extract Pages to isolate specific pages, or Equal Groups to divide evenly.',
    },
    {
      step: 3,
      title: 'Configure Your Pages',
      description:
        'Enter page intervals, click interactive page badges, or adjust the pages-per-file counter. Uncovered pages are automatically highlighted.',
    },
    {
      step: 4,
      title: 'Review Plan & Click Split',
      description:
        'Check the real-time output preview showing planned filenames and page counts, then click Split PDF to extract the pages.',
    },
    {
      step: 5,
      title: 'Preview and Download',
      description:
        'Inspect any output file with the built-in PDF viewer, download files individually, or grab all generated PDFs in a single ZIP.',
    },
  ],
  guides: [
    {
      title: 'How to Split a PDF into Separate Files',
      description:
        'Splitting documents into organized sections or single chapters is fast and straightforward with Zorli:',
      items: [
        {
          title: 'Custom Page Ranges',
          text: 'Define exact ranges like Pages 1–5, Pages 6–12, and Pages 13–20 to extract distinct chapters or sections into dedicated files.',
        },
        {
          title: 'Extract Single Pages',
          text: 'Pick specific page numbers such as 1, 3, 5 to save each selected page as an independent single-page document.',
        },
        {
          title: 'Equal Page Groups',
          text: 'Split long manuals or books into manageable batches (e.g. 10 pages per document). Partial final groups are automatically handled.',
        },
      ],
    },
    {
      title: 'Output Preview & Excluded Page Detection',
      description:
        'Stay confident in what your final output contains before downloading:',
      items: [
        {
          title: 'Real-Time Output Plan',
          text: 'Preview planned file counts, part names, and page assignments dynamically as you configure your split.',
        },
        {
          title: 'No Silently Lost Pages',
          text: 'Zorli flags any pages outside your defined ranges, clearly alerting you so nothing is unintentionally omitted.',
        },
      ],
    },
    {
      title: 'Are My Files Uploaded to a Server?',
      description:
        'No. Zorli executes 100% client-side inside your browser engine:',
      items: [
        {
          title: 'Browser Memory Execution',
          text: 'PDF trees and byte streams are decoded, split, and serialized entirely within your device’s local RAM. Files are never transmitted over the internet.',
        },
        {
          title: 'Zero Tracking or Logging',
          text: 'Document contents, filenames, and sensitive records are never logged, analyzed, or stored.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'How do I split a PDF into separate files?',
      answer:
        'Upload your PDF to Zorli, choose whether you want to split by custom page ranges, extract individual pages, or divide into equal groups, verify the output plan preview, and click Split PDF.',
    },
    {
      question: 'Can I extract individual pages?',
      answer:
        'Yes. Choose the "Extract Pages" method and click the page numbers you want, or type a list like "1, 3, 5". Each selected page will be generated as its own individual PDF document.',
    },
    {
      question: 'Can I split a PDF into equal page groups?',
      answer:
        'Yes. Choose the "Equal Groups" method and specify how many pages you want per file (for example, 5 pages per PDF). Zorli divides the entire document evenly, and correctly preserves the final partial group.',
    },
    {
      question: "Will splitting reduce the PDF's file size?",
      answer:
        'Splitting divides pages into separate files. While each individual part will naturally be smaller in size than the whole original document, splitting is not compression. To compress PDF files, use Zorli PDF Compressor.',
    },
    {
      question: 'Are my files uploaded to a server?',
      answer:
        'No. All file reading, page copying, and ZIP archiving take place locally in your web browser. Your private documents are never uploaded to any remote server.',
    },
    {
      question: 'What happens if my PDF is password-protected?',
      answer:
        'If a PDF is encrypted or password-protected, browser engines cannot read its page contents without the password. Zorli will notify you with a clear message rather than failing silently.',
    },
    {
      question: 'Can I download all split files at once?',
      answer:
        'Yes. Once the split completes, click the "Download All as ZIP" button to download all generated PDFs in a single convenient archive, or download files one by one.',
    },
  ],
};
