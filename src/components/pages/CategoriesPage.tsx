import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { Container } from '../ui/Container';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { IconHelper } from '../ui/IconHelper';

interface CategoriesPageProps {
  onNavigateHome: () => void;
  onSelectCategory: (categorySlug: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  onNavigateHome,
  onSelectCategory,
}) => {
  return (
    <div className="min-h-screen bg-[#F7F8FC] dark:bg-[#070B24] transition-colors pb-20">
      <section className="pt-28 pb-14 md:pt-36 md:pb-20 bg-gradient-to-b from-indigo-50/70 via-slate-100/60 to-slate-50 dark:from-[#070B24] dark:via-[#070B24] dark:to-[#0A0F35] text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-white/10 transition-colors duration-300">
        <Container>
          <div className="mb-6">
            <Breadcrumbs
              items={[{ label: 'Home', onClick: onNavigateHome }, { label: 'Categories' }]}
            />
          </div>

          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6657FF] dark:text-[#8B5CF6] mb-3 block">
              Organization & Hubs
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-slate-900 dark:text-white mb-4">
              Explore by{' '}
              <span className="bg-gradient-to-r from-[#6657FF] via-[#8B5CF6] to-[#35D9E8] bg-clip-text text-transparent">
                Category
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Browse dedicated hubs for image editing, PDF management, developer formats, text tools, and more.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.slug}
                onClick={() => onSelectCategory(cat.slug)}
                className="group p-8 rounded-3xl bg-white dark:bg-[#0D1438] border border-slate-200/80 dark:border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:-translate-y-1.5 hover:border-[#6657FF]/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm ${cat.iconBg}`}
                      style={{ color: cat.iconColor }}
                    >
                      <IconHelper name={cat.iconName} className="w-7 h-7" />
                    </div>
                    {cat.toolsCount && (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                        {cat.toolsCount} utilities
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white group-hover:text-[#6657FF] transition-colors mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    {cat.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-[#6657FF] group-hover:translate-x-1 transition-transform">
                  <span>Explore category</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};
