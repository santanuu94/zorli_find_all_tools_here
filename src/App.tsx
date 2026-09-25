import React, { useState, useEffect } from 'react';
import { Navbar } from './components/navigation/Navbar';
import { MobileBottomBar } from './components/navigation/MobileBottomBar';
import { Footer } from './components/footer/Footer';
import { SearchModal } from './components/tools/SearchModal';
import { Hero } from './components/hero/Hero';
import { CategoryPreview } from './components/sections/CategoryPreview';
import { WhyZorli } from './components/sections/WhyZorli';
import { Ecosystem } from './components/sections/Ecosystem';
import { CTASection } from './components/sections/CTASection';
import { CategoryPage } from './components/pages/CategoryPage';
import { ToolPageShell } from './components/pages/ToolPageShell';
import { AllToolsPage } from './components/pages/AllToolsPage';
import { CategoriesPage } from './components/pages/CategoriesPage';
import {
  AboutPage,
  BlogPage,
  ContactPage,
  PrivacyPage,
  TermsPage,
  NotFoundPage,
} from './components/pages/StaticPages';
import { CATEGORIES } from './data/categories';
import { TOOLS, getToolBySlug } from './data/tools';
import { Tool } from './types';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('zorli_theme');
      if (saved) return saved === 'dark';
    }
    return true;
  });

  // Sync theme with html root element
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('zorli_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('zorli_theme', 'light');
    }
  }, [isDarkTheme]);

  // Scroll to top whenever route changes
  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTool = (tool: Tool) => {
    handleNavigate(`/tools/${tool.category}/${tool.slug}`);
  };

  const handleSelectCategory = (categorySlug: string) => {
    handleNavigate(`/categories/${categorySlug}`);
  };

  // Keyboard shortcut Cmd+K / Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Determine active view
  const renderContent = () => {
    // 1. Home Page
    if (currentPath === '/') {
      return (
        <main>
          <Hero
            onSelectTool={handleSelectTool}
            onExploreTools={() => handleNavigate('/tools')}
          />
          <CategoryPreview onSelectCategory={handleSelectCategory} />
          <WhyZorli onExploreTools={() => handleNavigate('/tools')} />
          <Ecosystem />
          <CTASection onStartExploring={() => handleNavigate('/tools')} />
        </main>
      );
    }

    // 2. All Tools Directory
    if (currentPath === '/tools') {
      return (
        <AllToolsPage
          onNavigateHome={() => handleNavigate('/')}
          onSelectTool={handleSelectTool}
          onSelectCategory={handleSelectCategory}
        />
      );
    }

    // 3. Categories Hub
    if (currentPath === '/categories') {
      return (
        <CategoriesPage
          onNavigateHome={() => handleNavigate('/')}
          onSelectCategory={handleSelectCategory}
        />
      );
    }

    // 4. Specific Category Page: /categories/:slug
    if (currentPath.startsWith('/categories/')) {
      const categorySlug = currentPath.replace('/categories/', '');
      const category = CATEGORIES.find((c) => c.slug === categorySlug);
      if (category) {
        return (
          <CategoryPage
            category={category}
            onNavigateHome={() => handleNavigate('/')}
            onSelectTool={handleSelectTool}
            onNavigateCategory={handleSelectCategory}
          />
        );
      }
    }

    // 5. Specific Tool Page Shell: /tools/:category/:slug or /tools/:slug
    if (currentPath.startsWith('/tools/')) {
      const parts = currentPath.replace('/tools/', '').split('/').filter(Boolean);
      const toolSlug = parts.length > 1 ? parts[1] : parts[0];
      const tool = getToolBySlug(toolSlug);
      if (tool) {
        return (
          <ToolPageShell
            tool={tool}
            onNavigateHome={() => handleNavigate('/')}
            onNavigateCategory={handleSelectCategory}
            onSelectTool={handleSelectTool}
          />
        );
      }
    }

    // 6. Static Pages
    if (currentPath === '/about') {
      return (
        <AboutPage
          onNavigateHome={() => handleNavigate('/')}
          onNavigateTools={() => handleNavigate('/tools')}
        />
      );
    }

    if (currentPath === '/blog') {
      return (
        <BlogPage
          onNavigateHome={() => handleNavigate('/')}
          onNavigateTools={() => handleNavigate('/tools')}
        />
      );
    }

    if (currentPath === '/contact') {
      return (
        <ContactPage
          onNavigateHome={() => handleNavigate('/')}
          onNavigateTools={() => handleNavigate('/tools')}
        />
      );
    }

    if (currentPath === '/privacy') {
      return (
        <PrivacyPage
          onNavigateHome={() => handleNavigate('/')}
          onNavigateTools={() => handleNavigate('/tools')}
        />
      );
    }

    if (currentPath === '/terms') {
      return (
        <TermsPage
          onNavigateHome={() => handleNavigate('/')}
          onNavigateTools={() => handleNavigate('/tools')}
        />
      );
    }

    // 7. Not Found
    return (
      <NotFoundPage
        onNavigateHome={() => handleNavigate('/')}
        onNavigateTools={() => handleNavigate('/tools')}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070B24] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#6657FF] selection:text-white pb-14 md:pb-0 transition-colors duration-300">
      {/* Global Navigation Header */}
      <Navbar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        isDarkTheme={isDarkTheme}
        onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
      />

      {/* Main View Router */}
      <div className="flex-1">{renderContent()}</div>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Bottom Navigation Bar for quick thumb reachability */}
      <MobileBottomBar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Global Command Palette / Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={handleSelectTool}
        onSelectCategory={handleSelectCategory}
      />
    </div>
  );
}
