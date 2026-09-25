import React from 'react';
import { Zap, Shield, Heart, Smartphone } from 'lucide-react';
import { Container } from '../ui/Container';
import { ToolSearch } from '../tools/ToolSearch';
import { HeroVisual } from './HeroVisual';
import { HeroBackground } from './HeroBackground';
import { ZorliSparkle } from '../brand/ZorliSparkle';
import { Tool } from '../../types';

interface HeroProps {
  onSelectTool: (tool: Tool) => void;
  onExploreTools: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectTool }) => {
  const trustBadges = [
    { icon: <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />, label: 'Fast & Instant' },
    { icon: <Shield className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />, label: '100% Private (Local)' },
    { icon: <Heart className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />, label: 'Always Free' },
    { icon: <Smartphone className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />, label: 'Works Everywhere' },
  ];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50 via-indigo-50/40 to-slate-100/70 dark:from-[#070B24] dark:via-[#070B24] dark:to-[#0A0F35] transition-colors duration-300">
      {/* Rich Celestial & Sparkle Background */}
      <HeroBackground />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Search */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Small Zorli Eyebrow with Brand Sparkle */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 border border-slate-200/90 dark:border-white/15 text-xs font-semibold text-indigo-700 dark:text-indigo-200 tracking-wider uppercase mb-6 backdrop-blur-md transition-all shadow-sm shadow-[#6657FF]/10 group">
              <ZorliSparkle size={16} glow={false} variant="cyan" className="group-hover:rotate-45 transition-transform duration-300" />
              <span>Zorli Studio</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#6657FF] dark:bg-[#35D9E8] animate-pulse ml-0.5" />
            </div>

            {/* Large Display Headline */}
            <h1 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-black font-display text-slate-900 dark:text-white tracking-tight leading-[1.08] mb-6">
              Simple Tools <br />
              for a{' '}
              <span className="relative inline-block bg-gradient-to-r from-[#6657FF] via-[#8B5CF6] to-[#2563EB] dark:from-[#818CF8] dark:via-[#A78BFA] dark:to-[#60A5FA] bg-clip-text text-transparent">
                Smarter You
                {/* Subtle companion sparkle atop "Smarter" */}
                <span className="absolute -top-3 -right-6 hidden sm:inline-block">
                  <ZorliSparkle size={24} variant="cyan" />
                </span>
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-xl mb-8">
              Free, fast, and easy-to-use online tools for everyday problems. No sign-up. No hassle. Just results right inside your browser.
            </p>

            {/* Hero Search Bar */}
            <div className="w-full max-w-lg mb-7 shadow-xl shadow-indigo-950/10 dark:shadow-2xl dark:shadow-[#6657FF]/10 rounded-2xl">
              <ToolSearch
                placeholder="Search tools (e.g. compress image, merge PDF, JSON formatter...)"
                onSelectTool={onSelectTool}
              />
            </div>

            {/* Value & Trust Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {trustBadges.map((badge, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 text-xs sm:text-sm text-slate-700 dark:text-slate-300 backdrop-blur-md transition-all hover:bg-white dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-sm dark:shadow-none"
                >
                  {badge.icon}
                  <span className="font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Universe Visual */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end z-10">
            <HeroVisual />
          </div>
        </div>
      </Container>
    </section>
  );
};
