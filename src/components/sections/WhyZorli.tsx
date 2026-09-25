import React from 'react';
import { ArrowRight, Zap, Shield, Heart, Laptop } from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { ZorliSparkle } from '../brand/ZorliSparkle';

interface WhyZorliProps {
  onExploreTools: () => void;
}

export const WhyZorli: React.FC<WhyZorliProps> = ({ onExploreTools }) => {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      iconBg: 'bg-blue-500/10 border-blue-500/20',
      title: 'Fast & Lightweight',
      description: 'Get results instantly, processed right inside your browser without queue delays.',
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-500" />,
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
      title: 'Your Privacy, Our Priority',
      description: "Your files stay strictly on your local device. We never upload or store your media.",
    },
    {
      icon: <Heart className="w-6 h-6 text-rose-500" />,
      iconBg: 'bg-rose-500/10 border-rose-500/20',
      title: '100% Free Forever',
      description: 'No hidden paywalls, no subscriptions, and no account registrations required.',
    },
    {
      icon: <Laptop className="w-6 h-6 text-indigo-500" />,
      iconBg: 'bg-indigo-500/10 border-indigo-500/20',
      title: 'Works Everywhere',
      description: 'Responsive, progressive web experience engineered for mobile, tablet, and desktop.',
    },
  ];

  return (
    <section className="relative py-20 md:py-28 bg-[#F7F8FC] dark:bg-[#070B24] transition-colors overflow-hidden">
      {/* Background Subtle Sparkle Asset */}
      <div className="absolute -top-16 -left-16 opacity-[0.04] dark:opacity-[0.06] pointer-events-none -z-0">
        <ZorliSparkle size={240} glow={false} variant="secondary" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading and CTA */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-xs md:text-sm font-bold tracking-widest text-[#8B5CF6] uppercase mb-4">
              <ZorliSparkle size={14} glow={false} variant="primary" />
              <span>Why Zorli</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-5">
              Built for Real People, <br />
              <span className="bg-gradient-to-r from-[#6657FF] to-[#8B5CF6] bg-clip-text text-transparent">
                Everyday Tasks
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              Zorli brings together lightweight browser utilities into one seamless, elegant workspace — so you can get things done without friction.
            </p>

            <Button
              variant="primary"
              size="md"
              onClick={onExploreTools}
              className="!px-6 shadow-lg shadow-[#6657FF]/30"
            >
              Explore All Tools
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Right Column: 2x2 Feature Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-[#0D1438] border border-slate-200/70 dark:border-white/10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-[#6657FF]/30 transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-4 transition-transform group-hover:scale-110 ${feature.iconBg}`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
