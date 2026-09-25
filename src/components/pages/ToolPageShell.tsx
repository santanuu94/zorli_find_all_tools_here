import React, { useState, useEffect } from 'react';
import {
  Upload,
  Sparkles,
  Shield,
  Zap,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Clock,
  Lock,
} from 'lucide-react';
import { Tool, ToolCategory } from '../../types';
import { getToolsByCategory, getToolModuleBySlug } from '../../features/tools';
import { CATEGORIES } from '../../data/categories';
import { Container } from '../ui/Container';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Badge } from '../ui/Badge';
import { ToolCard } from '../tools/ToolCard';
import { IconHelper } from '../ui/IconHelper';
import { ZorliSparkle } from '../brand/ZorliSparkle';

interface ToolPageShellProps {
  tool: Tool;
  onNavigateHome: () => void;
  onNavigateCategory: (categorySlug: string) => void;
  onSelectTool: (tool: Tool) => void;
}

export const ToolPageShell: React.FC<ToolPageShellProps> = ({
  tool,
  onNavigateHome,
  onNavigateCategory,
  onSelectTool,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ToolComponent, setToolComponent] = useState<React.ComponentType<any> | null>(null);

  // Load the tool component dynamically when the tool changes
  useEffect(() => {
    // Cancel previous load if there's a cleanup function (not implemented here for simplicity)
    getToolModuleBySlug(tool.slug).then(module => {
      setToolComponent(module?.Component ?? null);
    });
  }, [tool.slug]);

  const category = CATEGORIES.find((c) => c.slug === tool.category) || CATEGORIES[0];
  const relatedTools = getToolsByCategory(tool.category)
    .filter((t) => t.slug !== tool.slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F7F8FC] dark:bg-[#070B24] transition-colors pb-20">
      {/* 1. Tool Page Hero Header */}
      <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 bg-gradient-to-b from-indigo-50/70 via-slate-100/50 to-slate-50 dark:from-[#070B24] dark:via-[#070B24] dark:to-[#0A0F35] text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-white/10 overflow-hidden transition-colors duration-300">
        {/* Ambient cosmic glow and brand star watermark */}
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-gradient-to-bl from-[#6657FF]/15 via-[#8B5CF6]/10 to-transparent dark:from-[#6657FF]/20 dark:via-[#8B5CF6]/10 dark:to-transparent blur-[120px] pointer-events-none" />
        <div className="absolute top-8 right-12 opacity-[0.035] dark:opacity-[0.05] pointer-events-none scale-125 hidden md:block">
          <ZorliSparkle size={150} glow={false} variant="primary" />
        </div>

        <Container className="relative z-10">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: 'Home', onClick: onNavigateHome },
                { label: category.name, onClick: () => onNavigateCategory(category.slug) },
                { label: tool.name },
              ]}
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${tool.iconBg}`}
                  style={{ color: tool.iconColor }}
                >
                  <IconHelper name={tool.iconName} className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-slate-900 dark:text-white">
                    {tool.name}
                  </h1>
                </div>
              </div>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {tool.description}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center">
              {tool.status === 'coming-soon' && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/25">
                  Coming soon
                </span>
              )}
              {tool.status === 'available' && tool.popular && (
                <Badge variant="popular" size="md">
                  Most Popular
                </Badge>
              )}
              <span className="text-xs px-3 py-1 rounded-full bg-white/90 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 shadow-sm dark:shadow-none">
                100% Free
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Privacy-first
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Tool Architecture Canvas (Modular Component Shell) */}
      <section className="py-10">
        <Container>
          {ToolComponent ? (
            <ToolComponent metadata={tool} />
          ) : (
            <div className="rounded-3xl bg-white dark:bg-[#0D1438] border border-slate-200/80 dark:border-white/10 shadow-xl overflow-hidden p-6 sm:p-10 md:p-12">
              {/* Status notification banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-800 dark:text-slate-100 mb-8">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold">Tool Architecture Ready</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Platform operating system & UI shell loaded. Modular tool engine connects in the next release step.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300">
                  Phase 1: Architecture
                </span>
              </div>

              {/* Drag & Drop Canvas Dropzone Placeholder */}
              <div className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl p-10 md:p-16 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-white/5 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6657FF] to-[#8B5CF6] text-white flex items-center justify-center mb-4 shadow-lg shadow-[#6657FF]/30">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
                  {tool.name} is not available yet
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
                  The processing engine for this tool has not been built, so it is deliberately
                  locked. Nothing is uploaded, read or processed while it is in this state.
                </p>
                <button
                  disabled
                  className="px-6 py-3 rounded-full bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500 text-sm font-semibold cursor-not-allowed flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Tool Processing Logic Coming in Next Phase
                </button>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* 3. How It Works (3 Steps) */}
      <section className="py-12">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B5CF6] mb-2 block">
              Step-by-step
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">
              {tool.status === 'coming-soon' ? `How ${tool.name} will work` : `How ${tool.name} Works`}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(
              tool.howItWorks || [
                {
                  step: 1,
                  title: 'Upload or Select',
                  description: 'Choose your files from your computer, phone, or drag them directly into the canvas.',
                },
                {
                  step: 2,
                  title: 'Configure Settings',
                  description: 'Customize quality, dimensions, or parameters with instant real-time previews.',
                },
                {
                  step: 3,
                  title: 'Instant Download',
                  description: 'Get your finalized, processed files in one click with no watermarks.',
                },
              ]
            ).map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-2xl bg-white dark:bg-[#0D1438] border border-slate-200/80 dark:border-white/10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
              >
                <div className="w-9 h-9 rounded-xl bg-[#6657FF]/15 text-[#8B5CF6] font-display font-black flex items-center justify-center mb-4 text-base">
                  {step.step}
                </div>
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Features & Privacy Info */}
      <section className="py-12 bg-white dark:bg-[#0A0F2D] border-y border-slate-200/80 dark:border-white/10 transition-colors">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8B5CF6] mb-2 block">
                Features & Benefits
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight mb-5">
                {tool.status === 'coming-soon'
                  ? `What's planned for ${tool.name}`
                  : `Why use Zorli for ${tool.name}?`}
              </h2>
              <div className="space-y-3.5">
                {(
                  tool.features || [
                    'Lightning-fast execution without cumbersome software installations',
                    'Zero quality degradation or unwanted watermarks',
                    'Clean minimalist UI designed for instant results',
                    'High cross-device compatibility across desktop, mobile and tablet',
                  ]
                ).map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Box */}
            <div className="lg:col-span-6">
              <div className="p-8 rounded-3xl bg-[#0D1438] text-white border border-white/10 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-2">Privacy-First Architecture</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Zorli is committed to user safety. Supported tools process information locally in your client environment, meaning your sensitive documents or personal photos don’t need to linger on remote servers.
                </p>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <Zap className="w-4 h-4" />
                  <span>No login required • No hidden analytics • Zero cost</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. FAQs Section */}
      <section className="py-14">
        <Container size="md">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {(
              tool.faqs || [
                {
                  question: `Is ${tool.name} completely free to use?`,
                  answer:
                    'Yes, Zorli tools are built to be accessible, free to use, and without intrusive subscriptions or arbitrary limits.',
                },
                {
                  question: 'Does this tool work on mobile devices?',
                  answer:
                    'Absolutely! All Zorli utilities are responsive and optimized for smartphones, tablets, laptops, and wide screens.',
                },
                {
                  question: 'How do I add or suggest a new tool?',
                  answer:
                    'Zorli features an extensible tool registry. You can contact our team anytime to request custom calculators or converters.',
                },
              ]
            ).map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-[#0D1438] border border-slate-200/80 dark:border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between font-bold font-display text-slate-900 dark:text-white text-base hover:text-[#6657FF] transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-[#6657FF]' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. Related Tools */}
      {relatedTools.length > 0 && (
        <section className="py-12 border-t border-slate-200/80 dark:border-white/10">
          <Container>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                  Related {category.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Explore other everyday utilities in this collection
                </p>
              </div>
              <button
                onClick={() => onNavigateCategory(category.slug)}
                className="text-xs sm:text-sm font-semibold text-[#6657FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View all in {category.shortName} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedTools.map((relTool) => (
                <ToolCard
                  key={relTool.slug}
                  tool={relTool}
                  onClick={() => onSelectTool(relTool)}
                />
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
};