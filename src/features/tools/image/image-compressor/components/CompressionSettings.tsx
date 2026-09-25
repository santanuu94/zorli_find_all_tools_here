import React from 'react';
import { Sliders } from 'lucide-react';
import { CompressionSettings } from '../types';

interface CompressionSettingsProps {
  settings: CompressionSettings;
  onQualityChange: (quality: number) => void;
}

export const CompressionSettingsComponent: React.FC<CompressionSettingsProps> = ({
  settings,
  onQualityChange,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#6657FF]" />
          Compression Quality
        </h3>
        <span className="text-sm font-mono font-bold text-[#6657FF] bg-[#6657FF]/10 px-2.5 py-0.5 rounded-full">
          {settings.quality}%
        </span>
      </div>

      <div>
        <input
          type="range"
          min="10"
          max="95"
          value={settings.quality}
          onChange={(e) => onQualityChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#6657FF]"
        />
        <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
          <span>Max Compression</span>
          <span>Balanced</span>
          <span>Best Quality</span>
        </div>
      </div>
    </div>
  );
};
