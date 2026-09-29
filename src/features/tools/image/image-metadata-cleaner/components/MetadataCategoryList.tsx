import React from 'react';
import {
  Camera,
  Calendar,
  Laptop,
  Palette,
  ShieldCheck,
  Tag,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { MetadataCategory } from '../types';

interface MetadataCategoryListProps {
  categories: MetadataCategory[];
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  camera: <Camera className="w-4 h-4 text-indigo-400" />,
  date: <Calendar className="w-4 h-4 text-amber-400" />,
  software: <Laptop className="w-4 h-4 text-sky-400" />,
  other: <Palette className="w-4 h-4 text-purple-400" />,
  c2pa: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
};

export const MetadataCategoryList: React.FC<MetadataCategoryListProps> = ({ categories }) => {
  // Exclude location from this list if location has its own dedicated card
  const nonLocationCategories = categories.filter((c) => c.id !== 'location');

  if (nonLocationCategories.length === 0) return null;

  return (
    <div className="space-y-4">
      {nonLocationCategories.map((category) => (
        <div
          key={category.id}
          className="rounded-3xl bg-white dark:bg-[#0D1438] border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-sm transition-all"
        >
          {/* Category Header */}
          <div className="flex items-center justify-between p-4 sm:px-5 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-slate-200/80 dark:bg-white/10 flex items-center justify-center shrink-0">
                {CATEGORY_ICONS[category.id] || <Tag className="w-3.5 h-3.5 text-indigo-400" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{category.title}</span>
                  <span className="text-[10px] font-mono font-medium text-slate-400">
                    ({category.fields.length})
                  </span>
                </h4>
              </div>
            </div>

            <span className="text-[11px] text-slate-400 hidden sm:inline">
              {category.description}
            </span>
          </div>

          {/* Fields Grid */}
          <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {category.fields.map((field) => (
              <div
                key={field.key}
                className={`p-3 rounded-2xl border text-xs space-y-1 transition-colors ${
                  field.isSensitive
                    ? 'bg-amber-500/5 border-amber-500/30'
                    : 'bg-slate-50/60 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/5'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-medium">{field.label}</span>
                  {field.isSensitive && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 uppercase">
                      Sensitive
                    </span>
                  )}
                </div>

                <div
                  className="font-mono font-semibold text-slate-800 dark:text-slate-200 truncate"
                  title={String(field.value)}
                >
                  {field.value}
                </div>

                {field.description && (
                  <div className="text-[10px] text-slate-400 truncate">
                    {field.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
