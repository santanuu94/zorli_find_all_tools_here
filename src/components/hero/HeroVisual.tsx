import React from 'react';
import { ZorliSparkle } from '../brand/ZorliSparkle';

export const HeroVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[540px] aspect-square mx-auto flex items-center justify-center select-none">
      {/* Background Radial Ambient Glows */}
      <div className="absolute inset-0 bg-radial from-[#6657FF]/20 dark:from-[#6657FF]/30 via-transparent to-transparent blur-3xl pointer-events-none" />
      <div className="absolute w-80 h-80 rounded-full bg-[#35D9E8]/15 dark:bg-[#35D9E8]/20 blur-3xl pointer-events-none translate-x-12 -translate-y-12" />
      <div className="absolute w-72 h-72 rounded-full bg-[#8B5CF6]/20 dark:bg-[#8B5CF6]/25 blur-3xl pointer-events-none -translate-x-12 translate-y-12" />

      {/* Futuristic Celestial Orbit Rings */}
      <div className="absolute w-[360px] h-[360px] sm:w-[430px] sm:h-[430px] rounded-full border border-indigo-400/40 dark:border-indigo-500/25 pointer-events-none animate-[spin_60s_linear_infinite]" />
      <div className="absolute w-[280px] h-[280px] sm:w-[330px] sm:h-[330px] rounded-full border border-violet-400/45 dark:border-violet-400/30 border-dashed pointer-events-none animate-[spin_45s_linear_infinite_reverse]" />

      {/* Orbiting Sparkle Star (CSS-only orbit) */}
      <div className="absolute w-[360px] h-[360px] sm:w-[430px] sm:h-[430px] pointer-events-none anim-orbit">
        <div className="absolute top-2 left-1/2 -translate-x-1/2">
          <ZorliSparkle size={18} variant="cyan" />
        </div>
      </div>

      {/* Handwritten Annotation with Arrow (CSS-only entrance) */}
      <div className="absolute -right-2 top-28 sm:right-2 sm:top-24 z-20 pointer-events-none text-right anim-fade-scale-in" style={{ animationDelay: '0.5s' }}>
        <div className="font-hand text-2xl sm:text-3xl text-indigo-900 dark:text-indigo-200 rotate-6 tracking-wide drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] font-semibold">
          All your tools.
          <br />
          One place.
        </div>
        {/* Curved arrow SVG */}
        <svg
          className="w-12 h-12 ml-auto text-indigo-600 dark:text-indigo-300 -rotate-12 mt-0.5 opacity-90 dark:opacity-85"
          viewBox="0 0 50 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M 40 10 Q 25 35 10 32" />
          <path d="M 16 26 L 10 32 L 17 38" />
        </svg>
      </div>

      {/* =========================================================================
          FREE-FLOATING 3D GLASS TOOL LOGOS (CLEAN SVG CUTOUTS WITH DROP SHADOWS)
          ========================================================================= */}

      {/* 1. PDF Glass Logo (Top Left) */}
      <div className="absolute top-6 left-8 sm:left-12 z-20 cursor-pointer group anim-float-xy">
        <img
          loading="lazy"
          decoding="async"
          width="80"
          height="80"
          src="/tool-assets/glass/glass-pdf.svg"
          alt="PDF Tool Logo"
          className="w-14 sm:w-18 h-auto select-none pointer-events-auto filter drop-shadow-[0_12px_24px_rgba(225,29,72,0.45)] group-hover:scale-115 group-hover:drop-shadow-[0_18px_36px_rgba(225,29,72,0.8)] transition-all duration-300 transform-gpu"
        />
      </div>

      {/* 2. Image Glass Logo (Top Center/Right) */}
      <div className="absolute top-2 right-24 sm:right-32 z-20 cursor-pointer group anim-float-y">
        <img
          loading="lazy"
          decoding="async"
          width="80"
          height="80"
          src="/tool-assets/glass/glass-image.svg"
          alt="Image Tool Logo"
          className="w-16 sm:w-20 h-auto select-none pointer-events-auto filter drop-shadow-[0_12px_24px_rgba(2,132,199,0.45)] group-hover:scale-115 group-hover:drop-shadow-[0_18px_36px_rgba(2,132,199,0.8)] transition-all duration-300 transform-gpu"
        />
      </div>

      {/* 3. Calculator Glass Logo (Top Far Right) */}
      <div className="absolute top-8 right-6 sm:right-10 z-20 cursor-pointer group anim-float-y">
        <img
          loading="lazy"
          decoding="async"
          width="80"
          height="80"
          src="/tool-assets/glass/glass-calculator.svg"
          alt="Calculator Tool Logo"
          className="w-14 sm:w-17 h-auto select-none pointer-events-auto filter drop-shadow-[0_12px_24px_rgba(5,150,105,0.45)] group-hover:scale-115 group-hover:drop-shadow-[0_18px_36px_rgba(5,150,105,0.8)] transition-all duration-300 transform-gpu"
        />
      </div>

      {/* 4. Code Glass Logo (Middle Right) */}
      <div className="absolute top-40 right-1 sm:right-4 z-20 cursor-pointer group anim-float-y">
        <img
          loading="lazy"
          decoding="async"
          width="80"
          height="80"
          src="/tool-assets/glass/glass-code.svg"
          alt="Developer Code Tool Logo"
          className="w-16 sm:w-20 h-auto select-none pointer-events-auto filter drop-shadow-[0_12px_24px_rgba(139,92,246,0.45)] group-hover:scale-115 group-hover:drop-shadow-[0_18px_36px_rgba(139,92,246,0.8)] transition-all duration-300 transform-gpu"
        />
      </div>

      {/* 5. Text 'T' Glass Logo (Bottom Right) */}
      <div className="absolute bottom-14 right-12 sm:right-18 z-20 cursor-pointer group anim-drift">
        <img
          loading="lazy"
          decoding="async"
          width="80"
          height="80"
          src="/tool-assets/glass/glass-text.svg"
          alt="Text Tool Logo"
          className="w-14 sm:w-17 h-auto select-none pointer-events-auto filter drop-shadow-[0_12px_24px_rgba(217,119,6,0.45)] group-hover:scale-115 group-hover:drop-shadow-[0_18px_36px_rgba(217,119,6,0.8)] transition-all duration-300 transform-gpu"
        />
      </div>

      {/* 6. Cloud Glass Logo (Bottom Left) */}
      <div className="absolute bottom-12 left-12 sm:left-18 z-20 cursor-pointer group anim-float-xy">
        <img
          loading="lazy"
          decoding="async"
          width="80"
          height="80"
          src="/tool-assets/glass/glass-cloud.svg"
          alt="Cloud Tool Logo"
          className="w-16 sm:w-20 h-auto select-none pointer-events-auto filter drop-shadow-[0_12px_24px_rgba(2,132,199,0.45)] group-hover:scale-115 group-hover:drop-shadow-[0_18px_36px_rgba(2,132,199,0.8)] transition-all duration-300 transform-gpu"
        />
      </div>

      {/* =========================================================================
          CENTRAL HERO FREE-FLOATING 3D GLASS ZORLI LOGO
          ========================================================================= */}
      <div className="relative z-10 flex flex-col items-center justify-center cursor-pointer group select-none anim-float-y">
        {/* Ambient radial glow behind the glass logo */}
        <div className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-r from-[#6657FF]/20 via-[#8B5CF6]/20 to-[#35D9E8]/20 blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

        {/* Floating Glass Zorli Logo */}
        <img
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width="224"
          height="224"
          src="/tool-assets/glass/glass-zorli.svg"
          alt="Zorli Logo"
          className="w-44 sm:w-56 h-auto select-none pointer-events-auto filter drop-shadow-[0_16px_36px_rgba(99,102,241,0.5)] group-hover:scale-108 group-hover:drop-shadow-[0_22px_45px_rgba(99,102,241,0.75)] transition-all duration-300 transform-gpu"
        />
      </div>
    </div>
  );
};
