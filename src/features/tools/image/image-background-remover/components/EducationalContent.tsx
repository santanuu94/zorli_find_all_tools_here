import React, { useState } from 'react';
import {
  ChevronDown,
  Layers,
  Sparkles,
  Shield,
  ShoppingBag,
  UserCheck,
  Share2,
  FileCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { imageBackgroundRemoverConfig } from '../config';

export const EducationalContent: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="w-full space-y-12 mt-16 text-slate-300">
      {/* SECTION 1: How to remove an image background */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            How to remove an image background
          </h2>
          <p className="text-slate-400 text-sm">
            Isolating a photo’s subject takes just seconds with Zorli’s client-side neural segmentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '1',
              title: 'Upload Image',
              desc: 'Drag & drop any JPG, PNG, or WebP photo into the studio dropzone.',
            },
            {
              step: '2',
              title: 'Detect Subject',
              desc: 'On-device AI automatically segments people, pets, products, or objects.',
            },
            {
              step: '3',
              title: 'Preview Result',
              desc: 'Inspect your cutout against the transparency checkerboard.',
            },
            {
              step: '4',
              title: 'Pick Background',
              desc: 'Keep pure transparent alpha, or switch to solid White, Black, or Custom Color.',
            },
            {
              step: '5',
              title: 'Download PNG',
              desc: 'Save your full-resolution cutout directly to your device.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                {item.step}
              </div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: What can you use it for? */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-indigo-400" />
            What can you use it for?
          </h2>
          <p className="text-slate-400 text-sm">
            Creating transparent cutouts unlocks endless creative and professional possibilities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: ShoppingBag,
              title: 'E-commerce & Product Catalogs',
              desc: 'Prepare clean white or transparent product listings for Amazon, Shopify, eBay, and Etsy without hiring a photo studio.',
            },
            {
              icon: UserCheck,
              title: 'Portraits & Profile Avatars',
              desc: 'Isolate team headshots, LinkedIn photos, and gaming avatars for sleek presentations and resume designs.',
            },
            {
              icon: Share2,
              title: 'Social Media & Thumbnails',
              desc: 'Create captivating YouTube thumbnails, Instagram stickers, and marketing graphics with isolated subjects.',
            },
            {
              icon: Sparkles,
              title: 'Marketing Collateral & Ads',
              desc: 'Drop product photos directly over branded campaign banners, billboards, and landing page hero sections.',
            },
            {
              icon: FileCheck,
              title: 'Presentations & Pitch Decks',
              desc: 'Eliminate awkward boxy image backgrounds to make slides feel tailored, unified, and high-production.',
            },
            {
              icon: Shield,
              title: 'Private & Sensitive Images',
              desc: 'Process confidential prototypes, personal photos, and sensitive receipts without uploading them to third-party cloud servers.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-2.5 hover:border-slate-700 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: Supported Formats & Technical Limitations */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            Supported image formats
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Zorli accepts standard raster photos in <strong>JPG / JPEG</strong>, <strong>PNG</strong>, and <strong>WebP</strong> formats.
            All cutouts are exported as standard 32-bit RGBA <strong>PNG</strong> files to preserve genuine alpha transparency.
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li><strong>JPG / JPEG:</strong> Standard camera and phone photos.</li>
            <li><strong>PNG:</strong> Preserves existing transparency if already present.</li>
            <li><strong>WebP:</strong> Modern web photos with lossless or lossy compression.</li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-3">
          <h2 className="text-lg font-bold text-amber-300 tracking-tight flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            Background removal limitations
          </h2>
          <p className="text-xs text-amber-200/90 leading-relaxed">
            While on-device neural models excel with everyday subjects, automated segmentation has natural edge cases:
          </p>
          <ul className="text-xs text-amber-200/80 space-y-1.5 list-disc list-inside">
            <li><strong>Low Contrast:</strong> Subjects blending into background colors of identical hue.</li>
            <li><strong>Extreme Hair / Fur:</strong> Highly translucent or wispy flyaway strands on busy backgrounds.</li>
            <li><strong>Semi-Transparent Objects:</strong> Smoke, water splashes, or clear glassware.</li>
            <li><strong>Motion Blur:</strong> Fast-moving objects lacking distinct edge boundaries.</li>
          </ul>
        </div>
      </section>

      {/* SECTION 4: Frequently Asked Questions */}
      <section className="space-y-4 pt-4 border-t border-slate-800/80">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-400">
            Answers to common questions about Zorli’s image background remover.
          </p>
        </div>

        <div className="space-y-2">
          {imageBackgroundRemoverConfig.faqs?.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-medium text-sm text-slate-200 hover:text-white transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
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
