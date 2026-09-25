import React, { useState } from 'react';
import { Container } from '../ui/Container';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Button } from '../ui/Button';
import { ZorliLogo } from '../brand/ZorliLogo';
import { Sparkles, Shield, Zap, Heart, CheckCircle2, Send, ArrowRight } from 'lucide-react';

interface StaticPageProps {
  onNavigateHome: () => void;
  onNavigateTools: () => void;
}

export const AboutPage: React.FC<StaticPageProps> = ({ onNavigateHome, onNavigateTools }) => (
  <div className="min-h-screen bg-[#F7F8FC] dark:bg-[#070B24] transition-colors pb-20">
    <section className="pt-28 pb-14 md:pt-36 md:pb-20 bg-gradient-to-b from-indigo-50/70 via-slate-100/60 to-slate-50 dark:from-[#070B24] dark:via-[#070B24] dark:to-[#0A0F35] text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-white/10 transition-colors duration-300">
      <Container>
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'Home', onClick: onNavigateHome }, { label: 'About Zorli' }]} />
        </div>
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6657FF] dark:text-[#8B5CF6] mb-3 block">
            Our Mission & Philosophy
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-slate-900 dark:text-white mb-4">
            Simple Tools.{' '}
            <span className="bg-gradient-to-r from-[#6657FF] via-[#8B5CF6] to-[#35D9E8] bg-clip-text text-transparent">
              A Smarter You.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Zorli is built around a single premise: everyday web tools should be fast, private, and frictionless.
          </p>
        </div>
      </Container>
    </section>

    <section className="py-14">
      <Container size="md">
        <div className="space-y-12">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0D1438] border border-slate-200/80 dark:border-white/10 shadow-lg">
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-4">
              Why Zorli Exists
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Modern online tool directories are often overloaded with intrusive popups, dark patterns, fake download buttons, and cumbersome subscription walls. We believe users deserve better.
            </p>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Zorli is an operating system for browser-based utilities — designed with minimal latency, respectful privacy safeguards, and a polished visual identity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1438] border border-slate-200/80 dark:border-white/10 shadow-sm">
              <Zap className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Frictionless</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No compulsory registrations, email gates, or delayed queues.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1438] border border-slate-200/80 dark:border-white/10 shadow-sm">
              <Shield className="w-8 h-8 text-emerald-500 mb-3" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Private by Nature</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your data stays right on your device. We don't store your documents.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1438] border border-slate-200/80 dark:border-white/10 shadow-sm">
              <Heart className="w-8 h-8 text-rose-500 mb-3" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Free Forever</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Built to be universally accessible for students, creators, and professionals.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#0D1438] border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
            <div>
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
                Ready to explore the toolkit?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Browse our catalog of utilities and streamline your daily workflows.
              </p>
            </div>
            <Button variant="primary" size="lg" onClick={onNavigateTools}>
              Explore Tools
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  </div>
);

export const ContactPage: React.FC<StaticPageProps> = ({ onNavigateHome }) => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F8FC] dark:bg-[#070B24] transition-colors pb-20">
      <section className="pt-28 pb-14 md:pt-36 md:pb-20 bg-gradient-to-b from-indigo-50/70 via-slate-100/60 to-slate-50 dark:from-[#070B24] dark:via-[#070B24] dark:to-[#0A0F35] text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-white/10 transition-colors duration-300">
        <Container>
          <div className="mb-6">
            <Breadcrumbs items={[{ label: 'Home', onClick: onNavigateHome }, { label: 'Contact & Suggestions' }]} />
          </div>
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-slate-900 dark:text-white mb-3">
              Get in Touch
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Have a tool you would like to see on Zorli? Want to report feedback or collaborate?
            </p>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container size="sm">
          <div className="p-8 md:p-10 rounded-3xl bg-white dark:bg-[#0D1438] border border-slate-200/80 dark:border-white/10 shadow-xl">
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-2">
                  Thank You for Your Note!
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-6">
                  We review tool requests and suggestions regularly as we expand the platform.
                </p>
                <Button variant="primary" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    Your Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6657FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="jane@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6657FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    Message or Tool Request
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Suggest a tool (e.g. SVG to PNG converter, color palette generator, etc.)..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6657FF]"
                  />
                </div>

                <Button variant="primary" size="lg" fullWidth type="submit">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Suggestion
                </Button>
              </form>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
};

export const BlogPage: React.FC<StaticPageProps> = ({ onNavigateHome, onNavigateTools }) => (
  <div className="min-h-screen bg-[#F7F8FC] dark:bg-[#070B24] transition-colors pb-20">
    <section className="pt-28 pb-14 md:pt-36 md:pb-20 bg-gradient-to-b from-indigo-50/70 via-slate-100/60 to-slate-50 dark:from-[#070B24] dark:via-[#070B24] dark:to-[#0A0F35] text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-white/10 transition-colors duration-300">
      <Container>
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'Home', onClick: onNavigateHome }, { label: 'Blog & Updates' }]} />
        </div>
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6657FF] dark:text-[#8B5CF6] mb-3 block">
            Updates & Insights
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-slate-900 dark:text-white mb-3">
            Zorli Engineering
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Product release notes, performance optimization notes, and developer guides.
          </p>
        </div>
      </Container>
    </section>

    <section className="py-14">
      <Container size="md">
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0D1438] border border-slate-200/80 dark:border-white/10 shadow-lg">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#6657FF]/15 text-[#6657FF] dark:text-[#8B5CF6] mb-3 inline-block">
              Architecture Preview
            </span>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
              Building the Zorli Operating System: Foundation Release
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              How we structured the Zorli brand, centralized registry, modular category hubs, and responsive design system to accommodate dozens of future tools seamlessly.
            </p>
            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-white/5 pt-4">
              <span>Platform Foundation</span>
              <span>September 2026</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  </div>
);

export const PrivacyPage: React.FC<StaticPageProps> = ({ onNavigateHome }) => (
  <div className="min-h-screen bg-[#F7F8FC] dark:bg-[#070B24] transition-colors pb-20">
    <section className="pt-28 pb-14 md:pt-36 md:pb-20 bg-gradient-to-b from-indigo-50/70 via-slate-100/60 to-slate-50 dark:from-[#070B24] dark:via-[#070B24] dark:to-[#0A0F35] text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-white/10 transition-colors duration-300">
      <Container>
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'Home', onClick: onNavigateHome }, { label: 'Privacy Policy' }]} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-slate-900 dark:text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-slate-500 dark:text-slate-300 text-sm">Last updated: September 2026</p>
      </Container>
    </section>

    <section className="py-14">
      <Container size="md">
        <div className="p-8 md:p-10 rounded-3xl bg-white dark:bg-[#0D1438] border border-slate-200/80 dark:border-white/10 shadow-lg space-y-6 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            1. Our Privacy Commitment
          </h2>
          <p>
            At Zorli, user privacy is not an afterthought — it is a central architectural design pillar. We do not require accounts, we do not monetize user dossiers, and we design tools to process data directly in your browser wherever possible.
          </p>
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            2. File Handling
          </h2>
          <p>
            When utilizing utilities on Zorli, client-side tools execute locally using modern WebAssembly and Canvas APIs. Files remain in your device memory during processing and are discarded upon tab closure.
          </p>
        </div>
      </Container>
    </section>
  </div>
);

export const TermsPage: React.FC<StaticPageProps> = ({ onNavigateHome }) => (
  <div className="min-h-screen bg-[#F7F8FC] dark:bg-[#070B24] transition-colors pb-20">
    <section className="pt-28 pb-14 md:pt-36 md:pb-20 bg-gradient-to-b from-indigo-50/70 via-slate-100/60 to-slate-50 dark:from-[#070B24] dark:via-[#070B24] dark:to-[#0A0F35] text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-white/10 transition-colors duration-300">
      <Container>
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'Home', onClick: onNavigateHome }, { label: 'Terms of Service' }]} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-slate-900 dark:text-white mb-2">
          Terms of Service
        </h1>
        <p className="text-slate-500 dark:text-slate-300 text-sm">Last updated: September 2026</p>
      </Container>
    </section>

    <section className="py-14">
      <Container size="md">
        <div className="p-8 md:p-10 rounded-3xl bg-white dark:bg-[#0D1438] border border-slate-200/80 dark:border-white/10 shadow-lg space-y-6 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing Zorli, you agree to utilize our tools for lawful and constructive purposes. Zorli provides browser utilities on an "as-is" basis.
          </p>
        </div>
      </Container>
    </section>
  </div>
);

export const NotFoundPage: React.FC<StaticPageProps> = ({ onNavigateHome, onNavigateTools }) => (
  <div className="min-h-screen bg-slate-50 dark:bg-[#070B24] flex items-center justify-center py-20 px-4 text-center transition-colors duration-300">
    <div className="max-w-md mx-auto">
      <div className="w-20 h-20 rounded-3xl bg-[#6657FF]/15 border border-[#6657FF]/30 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#6657FF]/10">
        <ZorliLogo size="lg" showWordmark={false} />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-[#6657FF] dark:text-[#8B5CF6] mb-2 block">
        404 — Cosmic Void
      </span>
      <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white mb-4">
        Lost in the Zorli universe?
      </h1>
      <p className="text-slate-600 dark:text-slate-300 text-base mb-8 leading-relaxed">
        The tool or page you're looking for doesn't exist yet or has wandered into deep space.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button variant="primary" size="md" onClick={onNavigateHome}>
          Back Home
        </Button>
        <Button variant="secondary" size="md" onClick={onNavigateTools}>
          Explore Tools
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  </div>
);
