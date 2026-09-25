import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-2xl bg-white/5 border border-white/10 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#6657FF]/15 border border-[#6657FF]/30 text-[#8B5CF6] flex items-center justify-center mb-4">
        {icon || <Search className="w-7 h-7" />}
      </div>
      <h3 className="text-xl font-bold text-slate-100 font-display mb-2">{title}</h3>
      <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          <Sparkles className="w-4 h-4 mr-2" />
          {actionText}
        </Button>
      )}
    </div>
  );
};
