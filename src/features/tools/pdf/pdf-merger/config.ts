import { Tool } from '../../../../types';

export interface EducationalGuideSection {
  title: string;
  description: string;
  items?: { title: string; text: string }[];
}

export interface PdfMergerConfig extends Tool {
  supportedFormats: string[];
  maxFileSizeMb: number;
  guides?: EducationalGuideSection[];
}

export const pdfMergerConfig: PdfMergerConfig = {
  slug: 'pdf-merger',
  name: 'PDF Merger',
  description:
    'Combine multiple PDF files into one clean document in seconds. Upload your PDFs, arrange their order, and download the merged file with Zorli’s free, client-side merger.',
  category: 'pdf',
  iconName: 'Layers',
  iconBg: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  iconColor: '#6366F1',
  status: 'available', // Active production tool
  featured: true,
  popular: true,
  filterType: 'edit',
  tags: ['pdf', 'merge', 'combine', 'join', 'stitch', 'concatenate', 'pdf merger', 'client side'],
  supportedFormats: ['application/pdf'],
  maxFileSizeMb: 150,
  features: [
    '100% in-browser processing — your confidential PDF documents never leave your computer',
    'Interactive drag-and-drop reordering with accessible arrow button alternatives for touch & keyboard',
    'Preserves exact page order, vector paths, selectable text, and embedded media',
    'Customizable output filename with automatic .pdf sanitization',
    'Automatic page count calculation with strict pre- and post-merge integrity checks',
    'Completely free with no file limits, no registration, and no added watermarks',
  ],
  howItWorks: [
    {
      step: 1,
      title: 'Upload Your PDF Files',
      description:
        'Drag and drop two or more PDF documents into the workspace or click to select them from your device. Additional files can be added at any time.',
    },
    {
      step: 2,
      title: 'Arrange Them in the Desired Order',
      description:
        'Drag items into your preferred sequence or use the accessible Move Up and Move Down buttons. The final merged PDF will match this exact order.',
    },
    {
      step: 3,
      title: 'Remove Any Unwanted Files',
      description:
        'Check the page count and file size of each document. Delete any unnecessary files before combining.',
    },
    {
      step: 4,
      title: 'Click Merge PDFs',
      description:
        'Click the Merge PDFs button. Zorli combines the pages sequentially in memory and compiles a clean, optimized output stream.',
    },
    {
      step: 5,
      title: 'Download the Combined Document',
      description:
        'Optionally customize the output filename and click Download Merged PDF. Click Merge More PDFs to start another task anytime.',
    },
  ],
  guides: [
    {
      title: 'How to Merge PDF Files',
      description:
        'Combining multiple documents into a single cohesive portfolio or report is simple with Zorli:',
      items: [
        {
          title: 'Select Multiple Documents',
          text: 'Choose reports, contracts, receipts, or presentation slides. You can select multiple files at once or append additional documents to your queue.',
        },
        {
          title: 'Review Page Counts & Sizes',
          text: 'Zorli immediately analyzes each uploaded PDF and displays its individual page count and byte size so you know exactly what is going into the final document.',
        },
        {
          title: 'Stitch Without Watermarks',
          text: 'The generated document is 100% clean and free of watermarks, headers, footers, or foreign branding.',
        },
      ],
    },
    {
      title: 'Can I Change the Order of PDFs?',
      description:
        'Yes. Document sequence is entirely under your control:',
      items: [
        {
          title: 'Visual Sequence',
          text: 'Numbered badges show the exact order in which documents will appear (e.g. 1. Cover, 2. Summary, 3. Appendix).',
        },
        {
          title: 'Drag and Drop or Arrow Controls',
          text: 'Reorder using intuitive drag-and-drop on desktop, or use the accessible Up and Down arrows on mobile devices and keyboard navigation.',
        },
        {
          title: 'Strict Order Preservation',
          text: 'Zorli never sorts files alphabetically or by date. The output preserves the exact order configured on your screen.',
        },
      ],
    },
    {
      title: 'Are My PDFs Uploaded?',
      description:
        'No. Zorli executes 100% client-side inside your browser engine:',
      items: [
        {
          title: 'Browser Memory Execution',
          text: 'PDF structures are decoded, merged, and assembled entirely within your device’s local RAM. Your documents never touch a third-party server or cloud database.',
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
      question: 'How do I combine PDF files?',
      answer:
        'Upload your PDF documents into the upload area, arrange them in your preferred sequence using drag-and-drop or the arrow buttons, and click Merge PDFs. Once processing finishes, click Download Merged PDF.',
    },
    {
      question: 'Can I merge multiple PDFs?',
      answer:
        'Yes. You can combine 2, 5, 10, or more PDF files at once. You can also click Add More PDF Files at any point before clicking Merge.',
    },
    {
      question: 'Can I change the order before merging?',
      answer:
        'Yes. The file list is fully interactive. Drag any card to a new position, or use the Move Up and Move Down buttons. The merged PDF strictly follows this sequence.',
    },
    {
      question: 'Does merging reduce PDF file size?',
      answer:
        'Merging combines all pages into one document. The resulting size is roughly the sum of the input documents. If you need to make the merged PDF smaller, use Zorli’s companion tool, PDF Compressor.',
    },
    {
      question: 'Can I merge password-protected PDFs?',
      answer:
        'No. Encrypted or password-protected PDFs cannot be safely read in the browser without authorization. If an uploaded PDF is password-protected, Zorli alerts you and identifies the specific file so you can remove or unlock it.',
    },
    {
      question: 'Are my files processed in my browser?',
      answer:
        'Yes. Zorli uses WebAssembly and client-side JavaScript to assemble PDF streams locally. Your documents are never uploaded to any remote server.',
    },
    {
      question: 'Why did a PDF fail to merge?',
      answer:
        'A PDF may fail to merge if it is corrupted, password-protected, or exceeds device memory limits. Zorli highlights the exact file responsible so you can replace it without losing your other uploaded documents.',
    },
  ],
};
