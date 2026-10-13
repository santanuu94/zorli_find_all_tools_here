import React from 'react';
import { SlidersHorizontal, FileCheck, Grid3X3 } from 'lucide-react';
import { SplitMode } from '../types';

interface SplitModeSelectorProps {
  currentMode: SplitMode;
  onSelectMode: (mode: SplitMode) => void;
  disabled?: boolean;
}

export const SplitModeSelector: React.FC<SplitModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  disabled = false,
}) => {
  const modes: {
    id: SplitMode;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'range',
      title: 'Page Ranges',
      description: 'Divide document into custom page segments',
      icon: SlidersHorizontal,
    },
    {
      id: 'extract',
      title: 'Extract Pages',
      description: 'Extract specific pages into standalone files',
      icon: FileCheck,
    },
    {
      id: 'equal',
      title: 'Equal Groups',
      description: 'Divide evenly by a fixed page count per file',
      icon: Grid3X3,
    },
  ];

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
        Choose Splitting Method
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {modes.map((m) => {
          const isSelected = currentMode === m.id;
          const Icon = m.icon;

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMode(m.id)}
              disabled={disabled}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/15 shadow-md shadow-indigo-500/15 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#070B24] hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/[0.02]'
              } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-600'
                      : 'border-slate-300 dark:border-white/20'
                  }`}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {m.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {m.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
