import React, { useState } from 'react';
import { Sliders, ChevronDown, ChevronUp, ShieldCheck, Zap } from 'lucide-react';
import { CompressionQuality } from '../types';

interface CompressionControlsProps {
  quality: CompressionQuality;
  removeMetadata: boolean;
  onQualityChange: (quality: CompressionQuality) => void;
  onRemoveMetadataChange: (remove: boolean) => void;
  disabled?: boolean;
}

export const CompressionControls: React.FC<CompressionControlsProps> = ({
  quality,
  removeMetadata,
  onQualityChange,
  onRemoveMetadataChange,
  disabled = false,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-4 pt-2 border-t border-slate-200/80 dark:border-white/10">
      {/* Quality Level Selector */}
      <div>
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
          Image Compression Profile
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'high', label: 'High Quality', desc: 'Crisp images, milder reduction' },
            { id: 'balanced', label: 'Balanced', desc: 'Recommended balance' },
            { id: 'low', label: 'Smaller File', desc: 'Maximum byte savings' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={disabled}
              onClick={() => onQualityChange(item.id as CompressionQuality)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                quality === item.id
                  ? 'bg-rose-500/10 border-rose-500 text-slate-900 dark:text-white ring-1 ring-rose-500'
                  : 'bg-white dark:bg-[#070B24] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="text-xs font-bold">{item.label}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {item.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Settings Accordion */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer py-1"
        >
          <Sliders className="w-3.5 h-3.5 text-rose-500" />
          <span>Advanced Options</span>
          {showAdvanced ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3 animate-in fade-in">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={removeMetadata}
                disabled={disabled}
                onChange={(e) => onRemoveMetadataChange(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-rose-500 focus:ring-rose-500 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Strip Metadata & Redundant Tags
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed block mt-0.5">
                  Removes author details, editing history, and XML metadata streams. Preserves all document pages and content.
                </span>
              </div>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};
