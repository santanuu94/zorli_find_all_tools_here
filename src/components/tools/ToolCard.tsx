import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Tool } from '../../types';
import { IconHelper } from '../ui/IconHelper';
import { Badge } from '../ui/Badge';

interface ToolCardProps {
  tool: Tool;
  onClick?: () => void;
  className?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick, className = '' }) => {
  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-[#0D1438] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1 hover:border-[#6657FF]/30 transition-all duration-300 cursor-pointer select-none ${className}`}
    >
      <div>
        {/* Header with Icon and optional Popular badge */}
        <div className="flex items-center justify-between mb-5">
          <div
            className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${tool.iconBg}`}
            style={{ color: tool.iconColor }}
          >
            <IconHelper name={tool.iconName} className="w-6 h-6" />
          </div>

          {tool.status === 'coming-soon' && (
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400">
              Coming soon
            </span>
          )}

          {tool.status === 'available' && tool.popular && (
            <Badge variant="popular" size="sm">
              Popular
            </Badge>
          )}
        </div>

        {/* Title */}
        <h4 className="text-lg font-bold font-display text-slate-900 dark:text-white group-hover:text-[#6657FF] transition-colors mb-2">
          {tool.name}
        </h4>

        {/* Description */}
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
          {tool.description}
        </p>
      </div>

      {/* Footer / Action */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 group-hover:text-[#6657FF] transition-colors flex items-center gap-1">
          {tool.status === 'coming-soon' ? 'Preview tool' : 'Open tool'}
        </span>
        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 group-hover:bg-[#6657FF] group-hover:text-white flex items-center justify-center transition-all duration-300">
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </div>
  );
};
