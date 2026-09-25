import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { ZorliSparkle } from '../brand/ZorliSparkle';

interface CTASectionProps {
  onStartExploring: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onStartExploring }) => {
  return (
    <section className="cv-auto relative py-28 md:py-36 bg-gradient-to-b from-slate-100 via-indigo-50/50 to-slate-50 dark:from-[#070B24] dark:via-[#070B24] dark:to-[#0A0F35] overflow-hidden select-none transition-colors duration-300">
      {/* Planetary Horizon Glow & Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep starry specks */}
        <div className="absolute top-12 left-1/4 w-1.5 h-1.5 bg-indigo-400/50 dark:bg-white/70 rounded-full blur-[0.5px]" />
        <div className="absolute top-24 right-1/3 w-1 h-1 bg-indigo-500/60 dark:bg-indigo-300/80 rounded-full" />
        <div className="absolute top-40 left-16 w-1.5 h-1.5 bg-cyan-500/50 dark:bg-cyan-300/60 rounded-full blur-[0.5px]" />
        <div className="absolute bottom-28 right-20 w-2 h-2 bg-violet-400/40 dark:bg-violet-300/50 rounded-full blur-[1px]" />

        {/* Ambient Floating Brand Stars (CSS-only) */}
        <div
          className="absolute top-16 left-[12%] opacity-60 anim-drift"
        >
          <ZorliSparkle size={36} variant="cyan" />
        </div>

        <div
          className="absolute top-20 right-[14%] opacity-70 anim-float-xy"
          style={{ animationDelay: '1s', animationDuration: '7s' }}
        >
          <ZorliSparkle size={44} variant="primary" />
        </div>

        {/* Giant Watermark Star */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-[0.03] dark:opacity-[0.035] scale-[4] blur-[1px]">
          <ZorliSparkle size={140} variant="primary" glow={false} />
        </div>

        {/* Planet Horizon Rim Arc */}
        <div className="absolute -bottom-[320px] left-1/2 -translate-x-1/2 w-[1600px] h-[550px] rounded-[50%] bg-[#E0E7FF] dark:bg-[#0A1245] border-t-2 border-[#6657FF]/30 dark:border-[#4F8CFF]/60 shadow-[0_-25px_90px_rgba(102,87,255,0.2)] dark:shadow-[0_-25px_90px_rgba(79,140,255,0.4)] transition-colors duration-300" />
        <div className="absolute -bottom-[280px] left-1/2 -translate-x-1/2 w-[1400px] h-[450px] rounded-[50%] bg-radial from-[#6657FF]/25 dark:from-[#6657FF]/35 to-transparent blur-3xl" />
      </div>

      <Container className="relative z-10">
        <div className="relative max-w-3xl mx-auto text-center flex flex-col items-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-white/10 border border-slate-200/90 dark:border-white/15 text-xs font-semibold text-indigo-700 dark:text-indigo-200 tracking-wider uppercase mb-5 backdrop-blur-md shadow-sm">
            <ZorliSparkle size={14} glow={false} variant="cyan" />
            <span>Start Using Zorli Today</span>
          </div>

          {/* Main Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-display text-slate-900 dark:text-white tracking-tight leading-tight mb-5">
            Ready to make life simpler?
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-xl mb-10 leading-relaxed">
            Explore our universe of tools and discover a faster, easier way to get things done right in your browser.
          </p>

          {/* CTA Button */}
          <Button
            variant="primary"
            size="lg"
            onClick={onStartExploring}
            className="!px-8 !py-4 text-base md:text-lg shadow-xl shadow-[#6657FF]/30 dark:shadow-2xl dark:shadow-[#6657FF]/50 hover:scale-105"
          >
            Start Exploring
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          {/* Handwritten Annotation */}
          <div className="hidden sm:block absolute -right-4 md:right-4 bottom-2 text-right pointer-events-none">
            <div className="font-hand text-2xl md:text-3xl text-indigo-800 dark:text-indigo-200/90 rotate-[-8deg] tracking-wide">
              Small Tools.
              <br />
              Big Possibilities.
            </div>
            {/* Sketch underline */}
            <svg
              className="w-28 h-6 ml-auto text-indigo-600 dark:text-indigo-300/80 -rotate-3"
              viewBox="0 0 100 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M 5 12 Q 50 18 95 8" />
            </svg>
          </div>
        </div>
      </Container>
    </section>
  );
};
