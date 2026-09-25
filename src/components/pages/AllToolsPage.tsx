import React, { useState } from 'react';
import { Tool, ToolCategorySlug } from '../../types';
import { TOOLS } from '../../data/tools';
import { CATEGORIES } from '../../data/categories';
import { Container } from '../ui/Container';
import { ToolCard } from '../tools/ToolCard';
import { ToolSearch } from '../tools/ToolSearch';
import { Breadcrumbs } from '../ui/Breadcrumbs';

interface AllToolsPageProps {
  onNavigateHome: () => void;
  onSelectTool: (tool: Tool) => void;
  onSelectCategory: (categorySlug: string) => void;
}

export const AllToolsPage: React.FC<AllToolsPageProps> = ({
  onNavigateHome,
  onSelectTool,
  onSelectCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = searchQuery.trim()
      ? tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F7F8FC] dark:bg-[#070B24] transition-colors pb-20">
      {/* Header Banner */}
      <section className="pt-28 pb-14 md:pt-36 md:pb-20 bg-gradient-to-b from-indigo-50/70 via-slate-100/60 to-slate-50 dark:from-[#070B24] dark:via-[#070B24] dark:to-[#0A0F35] text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-white/10 transition-colors duration-300">
        <Container>
          <div className="mb-6">
            <Breadcrumbs
              items={[{ label: 'Home', onClick: onNavigateHome }, { label: 'All Tools' }]}
            />
          </div>

          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6657FF] dark:text-[#8B5CF6] mb-3 block">
              Zorli Catalog
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-slate-900 dark:text-white mb-4">
              Explore All{' '}
              <span className="bg-gradient-to-r from-[#6657FF] via-[#8B5CF6] to-[#35D9E8] bg-clip-text text-transparent">
                Tools
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              Find simple, reliable online utilities for images, PDFs, code, text, calculations, and more.
            </p>

            <ToolSearch
              placeholder="Search across all tools and categories..."
              onSelectTool={onSelectTool}
            />
          </div>
        </Container>
      </section>

      {/* Filter and Tool Grid */}
      <section className="py-12">
        <Container>
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 select-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#6657FF] text-white shadow-md shadow-[#6657FF]/30'
                  : 'bg-white dark:bg-[#0D1438] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-[#6657FF]/40'
              }`}
            >
              All Categories ({TOOLS.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat.slug
                    ? 'bg-[#6657FF] text-white shadow-md shadow-[#6657FF]/30'
                    : 'bg-white dark:bg-[#0D1438] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-[#6657FF]/40'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6 text-sm text-slate-500 dark:text-slate-400">
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{filteredTools.length}</strong>{' '}
              utilities
            </span>
          </div>

          {/* Tool Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.slug}
                tool={tool}
                onClick={() => onSelectTool(tool)}
              />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};
