import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  FileSearch,
  Lock,
  Camera,
  MapPin,
  Calendar,
  Layers,
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'What is EXIF metadata?',
    answer:
      'EXIF (Exchangeable Image File Format) is a standard specification for storing technical metadata directly inside image files like JPEG, PNG, and WebP. Whenever you take a photo with a smartphone or digital camera, the device writes details such as camera brand, lens type, focal length, aperture, shutter speed, ISO, and date/time into the EXIF header.',
  },
  {
    question: 'Can image metadata reveal my private location?',
    answer:
      'Yes. If your phone or camera has GPS location tagging enabled, high-precision latitude and longitude coordinates are embedded directly in the photo. Anyone with access to the raw image file can extract these coordinates and pinpoint where the photo was taken down to a few meters.',
  },
  {
    question: 'Does removing metadata change the visual quality of my image?',
    answer:
      'No. Zorli uses lossless binary segment stripping whenever possible. This isolates and deletes the metadata headers (EXIF, XMP, IPTC, ICC, Comments) while leaving the actual image pixel bitstream (DCT coefficients and IDAT compressed pixel data) completely untouched. Your photo maintains 100% of its visual quality without recompression artifacts.',
  },
  {
    question: 'Can I remove metadata from multiple images at once?',
    answer:
      'Yes. You can drag and drop multiple JPG, PNG, and WebP images into Zorli simultaneously. You can inspect each photo individually or click "Clean All Pending" to sanitize your entire batch, then download the sanitized images individually or combined into a single ZIP archive.',
  },
  {
    question: 'Does Zorli Image Metadata Cleaner remove ALL metadata?',
    answer:
      'Technically and honestly: Zorli removes all supported ancillary metadata segments including EXIF, GPS coordinates, XMP packets, IPTC/Photoshop headers, ICC color profiles, user comments, and C2PA markers. Zorli intentionally preserves the fundamental structural headers required for image decoders to display the photo (such as PNG IHDR dimensions, palette tables, and JPEG SOF dimensions), and verifies the clean copy with a secondary scan to confirm that zero supported metadata fields remain.',
  },
  {
    question: 'Are my images ever uploaded to a server?',
    answer:
      'Never. Zorli processes 100% of your images locally in your web browser using client-side JavaScript, WebAssembly, and Canvas APIs. Your photos never leave your device, ensuring complete confidentiality.',
  },
  {
    question: 'What image formats does Zorli Metadata Cleaner support?',
    answer:
      'Zorli fully supports JPEG / JPG, PNG, and WebP image formats for both metadata inspection and lossless sanitization.',
  },
];

export const EducationalContent: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="mt-16 space-y-16 max-w-5xl mx-auto px-4 text-slate-800 dark:text-slate-200">
      {/* 1. What is Image Metadata? */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs font-bold uppercase tracking-wider">
          <FileSearch className="w-3.5 h-3.5" />
          <span>Understanding Photo Data</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
          What is image metadata?
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Image metadata is hidden digital information embedded directly into photo files by cameras, smartphones, and editing software. Whenever a picture is captured, your device records not just the visual pixels, but also dozens of contextual attributes—such as the exact geographical GPS coordinates of the camera, the hardware make and model, the date and time, the aperture and shutter speed, and any editing applications used to modify the picture.
        </p>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          While metadata can be immensely helpful for professional photographers organizing catalogs in software like Lightroom, sharing uncleaned images on social media, discussion forums, or classified listings can inadvertently expose sensitive personal details.
        </p>
      </section>

      {/* 2. What Information Can an Image Contain? */}
      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
          What information can an image contain?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              GPS Location & Elevation
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Exact latitude, longitude, and altitude coordinates recording where the photo was taken, frequently accurate enough to identify home or work locations.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Camera & Hardware Profile
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Make, model, lens model, serial numbers, focal length, exposure time, aperture (f-number), ISO sensitivity, and flash status.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Exact Timestamps
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Original capture date and time down to the second (DateTimeOriginal), creation timestamp, and file modification history.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Software, Author & Provenance
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Editing application name, photographer attribution, copyright notices, custom user comments, and Content Credentials (C2PA) manifests.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Why Remove Metadata? */}
      <section className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
          Why remove image metadata before sharing?
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Sanitizing photos before public distribution is an essential modern privacy practice:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed pl-2">
          <li>
            <strong className="text-slate-900 dark:text-white">Protecting personal safety:</strong> Stripping GPS location prevents stalkers, strangers, or advertisers from tracing where you, your children, or your friends live and work.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Anonymous marketplace listings:</strong> Selling items on Craigslist, Facebook Marketplace, or eBay with sanitized photos prevents buyers from knowing your home address before an agreed meetup.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Reducing unnecessary overhead:</strong> Stripping bloated XMP packets, ICC profiles, and embedded thumbnails can save substantial kilobytes per image on web assets.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Professional client handoff:</strong> Removing internal editing tool histories, serial numbers, and client notes ensures clean deliverables.
          </li>
        </ul>
      </section>

      {/* 4. How to Remove Metadata */}
      <section className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
          How to remove image metadata
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {[
            { step: '1', title: 'Upload', desc: 'Select or drag your JPG, PNG, or WebP photo into Zorli.' },
            { step: '2', title: 'Inspect', desc: 'Review detected metadata fields and sensitive GPS coordinates.' },
            { step: '3', title: 'Clean', desc: 'Click "Create Clean Copy" to losslessly strip metadata headers.' },
            { step: '4', title: 'Verify', desc: 'Confirm verified 0-field status with Zorli’s automated re-scan.' },
            { step: '5', title: 'Download', desc: 'Save your sanitized photo copy with complete peace of mind.' },
          ].map((item) => (
            <div
              key={item.step}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-1.5"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-500 text-white font-bold text-xs flex items-center justify-center">
                {item.step}
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Frequently Asked Questions */}
      <section className="space-y-6 pt-4">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Common questions about image metadata inspection and privacy.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0D1438] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {faq.question}
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 text-slate-500">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
