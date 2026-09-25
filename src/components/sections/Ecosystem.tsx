import React from 'react';
import { RefreshCw, Globe, Star, Heart } from 'lucide-react';
import { Container } from '../ui/Container';
import { ZorliSparkle } from '../brand/ZorliSparkle';

export const Ecosystem: React.FC = () => {
  const metrics = [
    {
      icon: <RefreshCw className="w-6 h-6 text-[#6657FF]" />,
      iconBg: 'bg-[#6657FF]/10 border-[#6657FF]/20',
      value: '100+',
      label: 'Tools (and growing)',
    },
    {
      icon: <Globe className="w-6 h-6 text-sky-500" />,
      iconBg: 'bg-sky-500/10 border-sky-500/20',
      value: '1M+',
      label: 'Happy Users',
    },
    {
      icon: <Star className="w-6 h-6 text-amber-500" />,
      iconBg: 'bg-amber-500/10 border-amber-500/20',
      value: '99.9%',
      label: 'Uptime',
    },
    {
      icon: <Heart className="w-6 h-6 text-rose-500" />,
      iconBg: 'bg-rose-500/10 border-rose-500/20',
      value: 'Made for',
      label: 'Everyone',
    },
  ];

  return (
    <section className="relative py-20 md:py-28 bg-[#F7F8FC] dark:bg-[#0A0F2D] border-t border-slate-200/80 dark:border-white/10 transition-colors overflow-hidden">
      {/* Background Subtle Sparkle Accents */}
      <div className="absolute top-10 right-10 opacity-[0.06] dark:opacity-[0.08] pointer-events-none -z-0 scale-150">
        <ZorliSparkle size={160} glow={false} variant="primary" />
      </div>
      <div className="absolute bottom-6 left-12 opacity-[0.04] dark:opacity-[0.06] pointer-events-none -z-0 scale-125">
        <ZorliSparkle size={120} glow={false} variant="cyan" />
      </div>

      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6657FF]/10 border border-[#6657FF]/20 text-xs md:text-sm font-bold tracking-widest text-[#6657FF] dark:text-[#A78BFA] uppercase mb-4">
            <ZorliSparkle size={14} glow={false} variant="primary" />
            <span>A Growing Universe of Tools</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
            One Platform.{' '}
            <span className="bg-gradient-to-r from-[#6657FF] via-[#8B5CF6] to-[#4F8CFF] bg-clip-text text-transparent">
              Endless Possibilities.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            From everyday image optimizations to developer utilities — Zorli is your all-in-one browser toolkit engineered for speed, privacy, and simplicity.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-6 rounded-2xl bg-white dark:bg-[#0D1438] border border-slate-200/70 dark:border-white/10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-[#6657FF]/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${item.iconBg}`}
              >
                {item.icon}
              </div>
              <div>
                <div className="text-2xl font-black font-display text-slate-900 dark:text-white">
                  {item.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
