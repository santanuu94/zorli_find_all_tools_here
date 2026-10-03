import React, { useState } from 'react';
import {
  Zap,
  Shield,
  Heart,
  Smartphone,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
} from 'lucide-react';
import { Tool, ToolCategory } from '../../types';
import { getToolsByCategory, isToolActive } from '../../data/tools';
import { Container } from '../ui/Container';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { EmptyState } from '../ui/EmptyState';
import { ToolCard } from '../tools/ToolCard';
import { ToolSearch } from '../tools/ToolSearch';
import { IconHelper } from '../ui/IconHelper';
import { Button } from '../ui/Button';

interface CategoryPageProps {
  category: ToolCategory;
  onNavigateHome: () => void;
  onSelectTool: (tool: Tool) => void;
  onNavigateCategory?: (slug: string) => void;
  onNavigateTools?: () => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  onNavigateHome,
  onSelectTool,
  onNavigateTools,
}) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get tools in category — only active tools are shown as available on the landing page
  const allCategoryTools = getToolsByCategory(category.slug);
  const availableTools = allCategoryTools.filter((t) => t.status === 'available');

  // Filter tools based on active tab and search
  const filteredTools = availableTools.filter((tool) => {
    const matchesFilter =
      activeFilter === 'all'
        ? true
        : activeFilter === 'popular'
        ? tool.popular
        : tool.filterType === activeFilter;

    const matchesSearch = searchQuery.trim()
      ? tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    return matchesFilter && matchesSearch;
  });

  const isPdf = category.slug === 'pdf';

  return (
    <div className="min-h-screen bg-[#F7F8FC] dark:bg-[#070B24] transition-colors pb-16">
      {/* 1. Category Hero (Adaptive Light & Dark) */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-indigo-50/70 via-slate-100/50 to-slate-50 dark:from-[#070B24] dark:via-[#070B24] dark:to-[#0A0F35] overflow-hidden transition-colors duration-300">
        {/* Ambient radial glow */}
        <div
          className={`absolute top-0 right-1/4 w-[600px] h-[500px] blur-[120px] pointer-events-none -z-10 ${
            isPdf
              ? 'bg-gradient-to-b from-rose-500/15 via-[#8B5CF6]/10 to-transparent dark:from-rose-500/20 dark:via-[#8B5CF6]/10'
              : 'bg-gradient-to-b from-[#6657FF]/15 via-[#35D9E8]/10 to-transparent dark:from-[#6657FF]/20 dark:via-[#35D9E8]/10'
          }`}
        />

        <Container>
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs
              items={[
                { label: 'Home', onClick: onNavigateHome },
                { label: 'Tools', onClick: onNavigateTools || onNavigateHome },
                { label: category.shortName },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Details */}
            <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
              {/* Category pill badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-white/10 border text-[11px] font-bold tracking-wider uppercase mb-4 backdrop-blur-md shadow-sm ${
                  isPdf
                    ? 'border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-300'
                    : 'border-slate-200/90 dark:border-white/15 text-indigo-700 dark:text-indigo-300'
                }`}
              >
                {category.heroBadge || category.name}
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-display text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-5">
                {category.shortName}{' '}
                <span
                  className={
                    isPdf
                      ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-[#8B5CF6] bg-clip-text text-transparent'
                      : 'bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] bg-clip-text text-transparent'
                  }
                >
                  Tools
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed mb-8">
                {category.heroDescription || category.description}
              </p>

              {/* Trust & Quality Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 text-xs sm:text-sm text-slate-700 dark:text-slate-300 backdrop-blur-md shadow-sm dark:shadow-none">
                  <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  <span>Fast</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 text-xs sm:text-sm text-slate-700 dark:text-slate-300 backdrop-blur-md shadow-sm dark:shadow-none">
                  <Shield className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                  <span>100% Private</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 text-xs sm:text-sm text-slate-700 dark:text-slate-300 backdrop-blur-md shadow-sm dark:shadow-none">
                  <Heart className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                  <span>Free to Use</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 text-xs sm:text-sm text-slate-700 dark:text-slate-300 backdrop-blur-md shadow-sm dark:shadow-none">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  <span>Works on All Devices</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end z-10">
              <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center select-none">
                {/* Background Glow */}
                <div
                  className={`absolute inset-0 bg-radial blur-3xl pointer-events-none ${
                    isPdf ? 'from-rose-500/25 to-transparent' : 'from-[#6657FF]/30 to-transparent'
                  }`}
                />

                {/* Handwritten Annotation with Arrow */}
                <div
                  className="absolute -right-2 top-8 sm:right-2 z-20 pointer-events-none text-right anim-fade-scale-in"
                  style={{ animationDelay: '0.3s' }}
                >
                  <div className="font-handwriting text-2xl sm:text-3xl text-indigo-200 rotate-6 tracking-wide drop-shadow-md">
                    Do more
                    <br />
                    with your {isPdf ? 'PDFs' : `${category.shortName.toLowerCase()}s`}
                  </div>
                  <svg
                    className="w-10 h-10 ml-auto text-indigo-300 -rotate-12 mt-1 opacity-80"
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

                {/* Central layered cards */}
                <div className="relative z-10 w-52 h-64 sm:w-60 sm:h-72 rounded-3xl bg-gradient-to-br from-white/90 to-white/40 p-[1.5px] shadow-2xl backdrop-blur-xl anim-drift">
                  <div className="w-full h-full bg-[#EBF0FF]/90 dark:bg-[#0D1438]/90 rounded-[22px] p-6 flex flex-col justify-between border border-white/80 dark:border-white/10 shadow-inner">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                          isPdf
                            ? 'bg-rose-500/20 text-rose-500 border border-rose-500/20'
                            : 'bg-blue-500/20 text-blue-600'
                        }`}
                      >
                        {category.shortName[0]}
                      </div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-blue-200/80 dark:bg-white/10 rounded-md w-3/4" />
                      <div className="h-3 bg-blue-100 dark:bg-white/5 rounded-md w-1/2" />
                    </div>
                    <div className="h-28 rounded-2xl bg-gradient-to-tr from-blue-400/20 to-violet-400/20 border border-white/60 dark:border-white/10 flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-indigo-500/60" />
                    </div>
                  </div>
                </div>

                {/* Dynamic Floating Badges */}
                {category.floatingBadges &&
                  category.floatingBadges.map((badge, idx) => (
                    <div
                      key={idx}
                      className={`absolute z-20 ${badge.positionClass} ${badge.animClass}`}
                    >
                      <div
                        className={`px-3.5 py-1.5 rounded-2xl ${badge.bgClass} text-white font-bold text-xs sm:text-sm shadow-xl border border-white/20 flex items-center gap-1.5`}
                      >
                        {badge.iconName && (
                          <IconHelper name={badge.iconName} className="w-3.5 h-3.5" />
                        )}
                        {badge.label}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Search & Guide Banner Row */}
      <section className="py-8 bg-white dark:bg-[#0A0F2D] border-b border-slate-200/80 dark:border-white/10 transition-colors">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Search Tools */}
            <div className={availableTools.length > 0 ? 'lg:col-span-7' : 'lg:col-span-12'}>
              <ToolSearch
                placeholder={`Search ${category.shortName.toLowerCase()} tools (e.g. compress, merge, split...)`}
                categoryFilter={category.slug}
                onSelectTool={onSelectTool}
              />
            </div>

            {/* "New here? Find the perfect tool" Guide Banner (only when tools are available) */}
            {availableTools.length > 0 && (
              <div className="lg:col-span-5 flex items-center justify-between p-3.5 px-5 rounded-full bg-amber-500/10 border border-amber-500/20 text-slate-800 dark:text-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">💡</span>
                  <div>
                    <span className="text-xs sm:text-sm font-bold block">New here?</span>
                    <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                      Find the perfect tool for your {category.shortName.toLowerCase()} task.
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const firstPopular = availableTools.find((t) => t.popular) || availableTools[0];
                    if (firstPopular) onSelectTool(firstPopular);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-[#6657FF] text-white text-xs font-semibold hover:brightness-110 transition-all shrink-0 cursor-pointer shadow-sm shadow-[#6657FF]/30"
                >
                  View Guide →
                </button>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* 3. All Category Tools Title & Filter Tabs */}
      <section className="pt-12 pb-6">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">
                All {category.shortName}{' '}
                <span className="bg-gradient-to-r from-[#6657FF] to-[#8B5CF6] bg-clip-text text-transparent">
                  Tools
                </span>
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {availableTools.length === 0
                  ? `We're building useful ${category.shortName} utilities for Zorli. More tools coming soon.`
                  : `${availableTools.length} ${availableTools.length === 1 ? 'tool' : 'tools'} available.`}
              </p>
            </div>

            {/* Filter Tabs — only exposed when multiple active tools exist */}
            {availableTools.length > 2 && category.filterTabs && (
              <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-white/5 p-1.5 rounded-full border border-slate-200 dark:border-white/10 self-start md:self-auto">
                {category.filterTabs.map((tab) => {
                  const isActive = activeFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilter(tab.id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#6657FF] text-white shadow-md shadow-[#6657FF]/30'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tools Grid or Coming Soon Empty State */}
          {availableTools.length === 0 ? (
            /* Polished Coming Soon State when category has zero active tools */
            <div className="py-16 px-6 rounded-3xl bg-white dark:bg-[#0D1438] border border-slate-200/80 dark:border-white/10 text-center max-w-xl mx-auto shadow-sm">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border ${category.iconBg}`}
                style={{ color: category.iconColor }}
              >
                <IconHelper name={category.iconName} className="w-8 h-8" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold mb-3">
                <Clock className="w-3.5 h-3.5" />
                Coming Soon
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-2">
                {category.name}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                We're building useful {category.shortName} utilities for Zorli. Fast, simple tools for everyday tasks.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                More {category.shortName} tools are coming soon. Tools will automatically appear here as they are released.
              </p>
            </div>
          ) : filteredTools.length === 0 ? (
            /* Search / Filter Empty State when tools exist but search has no match */
            <EmptyState
              title="No tools match your search"
              description="Try adjusting your keywords or clearing the filter to see all available tools."
              actionText="Clear filters"
              onAction={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
            />
          ) : (
            /* Active Tools Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.slug}
                  tool={tool}
                  onClick={() => onSelectTool(tool)}
                />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* 4. Category "Why Zorli" Dark Banner */}
      {category.whyBanner && (
        <section className="py-12">
          <Container>
            <div className="rounded-3xl bg-[#0D1438] p-8 md:p-12 text-white border border-white/10 shadow-2xl overflow-hidden relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left side text */}
                <div className="lg:col-span-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#8B5CF6] mb-3 block">
                    Why Zorli?
                  </span>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight leading-tight mb-4">
                    {category.whyBanner.headline}{' '}
                    <span className="bg-gradient-to-r from-[#6657FF] to-[#8B5CF6] bg-clip-text text-transparent">
                      {category.whyBanner.highlightWord}
                    </span>
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {category.whyBanner.subtitle}
                  </p>
                </div>

                {/* Right side points */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {category.whyBanner.points.map((pt, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#6657FF]/20 text-[#8B5CF6] flex items-center justify-center shrink-0">
                        {pt.iconName === 'Zap' && <Zap className="w-5 h-5 text-amber-400" />}
                        {pt.iconName === 'Shield' && <Shield className="w-5 h-5 text-emerald-400" />}
                        {pt.iconName === 'Heart' && <Heart className="w-5 h-5 text-rose-400" />}
                        {pt.iconName === 'Smartphone' && (
                          <Smartphone className="w-5 h-5 text-indigo-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold font-display text-white mb-0.5">
                          {pt.title}
                        </h4>
                        <p className="text-xs text-slate-400">{pt.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 5. Pro Tip Banner (only when referenced tool is active) */}
      {category.proTip && isToolActive(category.proTip.toolSlug) && (
        <section className="py-6">
          <Container>
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0D1438] border border-slate-200/80 dark:border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <Layers className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#6657FF] uppercase tracking-wider block mb-1">
                    {category.proTip.title}
                  </span>
                  <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200">
                    {category.proTip.description}
                  </p>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  const targetTool = availableTools.find(
                    (t) => t.slug === category.proTip?.toolSlug
                  );
                  if (targetTool) onSelectTool(targetTool);
                }}
                className="shrink-0 whitespace-nowrap shadow-lg shadow-[#6657FF]/30"
              >
                Try {category.proTip.toolName}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Container>
        </section>
      )}

      {/* 6. Concise SEO Content Section (Requirement 21) */}
      <section className="py-12 border-t border-slate-200/80 dark:border-white/10">
        <Container>
          <div className="max-w-3xl space-y-8 text-slate-700 dark:text-slate-300">
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                {category.seoContent?.sectionTitle || `${category.name}`}
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {category.seoContent?.sectionBody || category.description}
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                {category.seoContent?.chooseTitle || `Choose the ${category.shortName} tool you need`}
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {category.seoContent?.chooseBody ||
                  `Select a dedicated tool tailored to your workflow and process your files securely on your device.`}
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
