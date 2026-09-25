import React from 'react';
import { Container } from '../ui/Container';
import { CATEGORIES } from '../../data/categories';
import { IconHelper } from '../ui/IconHelper';

interface CategoryPreviewProps {
  onSelectCategory: (categorySlug: string) => void;
}

export const CategoryPreview: React.FC<CategoryPreviewProps> = ({ onSelectCategory }) => {
  return (
    <section className="relative py-12 md:py-16 bg-[#F7F8FC] dark:bg-[#0A0F2D] border-y border-slate-200/80 dark:border-white/10 transition-colors">
      <Container>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {CATEGORIES.map((category) => (
            <div
              key={category.slug}
              onClick={() => onSelectCategory(category.slug)}
              className="group flex flex-col items-center text-center p-5 rounded-2xl bg-white dark:bg-[#0D1438] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1 hover:border-[#6657FF]/40 transition-all duration-300 cursor-pointer select-none"
            >
              {/* Category Icon */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3.5 transition-transform duration-300 group-hover:scale-110 shadow-sm ${category.iconBg}`}
                style={{ color: category.iconColor }}
              >
                <IconHelper name={category.iconName} className="w-7 h-7" />
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-base font-bold font-display text-slate-900 dark:text-white group-hover:text-[#6657FF] transition-colors mb-1">
                {category.name}
              </h3>

              {/* Description */}
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
