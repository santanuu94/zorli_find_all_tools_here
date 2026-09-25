import React from 'react';
import { motion } from 'motion/react';
import { ZorliSparkle } from '../brand/ZorliSparkle';

export const HeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none transition-colors duration-300">
      {/* 1. Deep Core Radiant Mesh Gradients */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] h-[750px] bg-gradient-to-b from-[#6657FF]/15 via-[#8B5CF6]/10 to-transparent dark:from-[#6657FF]/25 dark:via-[#8B5CF6]/15 dark:to-transparent blur-[140px]" />
      <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-[#6366F1]/10 dark:bg-[#6366F1]/15 blur-[120px]" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-[#35D9E8]/10 dark:bg-[#35D9E8]/10 blur-[130px]" />

      {/* 2. Delicate Perspective Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.05] bg-[radial-gradient(#6366F1_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]"
      />

      {/* 3. Celestial Starfield Specks */}
      <div className="absolute top-16 left-[15%] w-1.5 h-1.5 rounded-full bg-indigo-500/50 dark:bg-white/70 animate-pulse" />
      <div className="absolute top-32 left-[35%] w-1 h-1 rounded-full bg-indigo-400/60 dark:bg-indigo-300/80" />
      <div className="absolute top-24 right-[25%] w-1.5 h-1.5 rounded-full bg-sky-500/50 dark:bg-sky-200/80 animate-ping [animation-duration:4s]" />
      <div className="absolute top-48 right-[12%] w-1 h-1 rounded-full bg-purple-500/50 dark:bg-purple-300/70" />
      <div className="absolute top-64 left-[8%] w-1.5 h-1.5 rounded-full bg-cyan-500/50 dark:bg-cyan-200/60" />
      <div className="absolute bottom-28 left-[28%] w-1 h-1 rounded-full bg-indigo-500/40 dark:bg-white/60 animate-pulse [animation-duration:3s]" />
      <div className="absolute bottom-40 right-[32%] w-1.5 h-1.5 rounded-full bg-indigo-400/50 dark:bg-indigo-200/70" />

      {/* 4. Giant Watermark Star in Background */}
      <div className="absolute top-12 right-[8%] opacity-[0.035] dark:opacity-[0.04] scale-[3.5] transform rotate-12 blur-[1px]">
        <ZorliSparkle size={180} glow={false} variant="primary" />
      </div>

      {/* 5. Animated Floating Zorli Sparkle Stars */}
      {/* Top Left Sparkle */}
      <motion.div
        animate={{
          y: [-10, 10, -10],
          rotate: [-4, 4, -4],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-20 left-[10%] opacity-70 dark:opacity-80"
      >
        <ZorliSparkle size={32} variant="cyan" />
      </motion.div>

      {/* Mid Left Accent Sparkle */}
      <motion.div
        animate={{
          y: [8, -8, 8],
          opacity: [0.35, 0.75, 0.35],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute top-1/2 left-[4%] hidden sm:block"
      >
        <ZorliSparkle size={26} variant="secondary" />
      </motion.div>

      {/* Top Right Sparkle */}
      <motion.div
        animate={{
          y: [-12, 12, -12],
          scale: [0.95, 1.1, 0.95],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
        className="absolute top-24 right-[18%] opacity-80 dark:opacity-90 hidden md:block"
      >
        <ZorliSparkle size={44} variant="primary" />
      </motion.div>

      {/* Center-Top Ambient Sparkle */}
      <motion.div
        animate={{
          opacity: [0.25, 0.65, 0.25],
          scale: [0.9, 1.05, 0.9],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute top-8 left-[48%] opacity-50 dark:opacity-60"
      >
        <ZorliSparkle size={22} variant="secondary" />
      </motion.div>

      {/* Bottom Right Drifting Sparkle */}
      <motion.div
        animate={{
          y: [10, -10, 10],
          rotate: [6, -6, 6],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
        }}
        className="absolute bottom-20 right-[8%] opacity-65 dark:opacity-75"
      >
        <ZorliSparkle size={36} variant="cyan" />
      </motion.div>
    </div>
  );
};
