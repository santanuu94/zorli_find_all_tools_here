import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/navigation/Navbar';
import { MobileBottomBar } from './components/navigation/MobileBottomBar';
import { Footer } from './components/footer/Footer';
import { Hero } from './components/hero/Hero';
import { CategoryPreview } from './components/sections/CategoryPreview';
import { WhyZorli } from './components/sections/WhyZorli';
import { Ecosystem } from './components/sections/Ecosystem';
import { CTASection } from './components/sections/CTASection';
// Route-level code splitting: below-the-fold / non-home routes load on demand.
// Home (Hero + sections) stays in the initial bundle for fast LCP; every other
// route — and the search palette — is a separate chunk. Future tool families
// MUST follow this pattern: keep the home bundle lean, lazy-load the family
// components via src/features/tools registry loaders (see registry.ts).
const SearchModal = lazy(() =>
  import('./components/tools/SearchModal').then((m) => ({ default: m.SearchModal })),
);
const CategoryPage = lazy(() =>
  import('./components/pages/CategoryPage').then((m) => ({ default: m.CategoryPage })),
);
const ToolPageShell = lazy(() =>
  import('./components/pages/ToolPageShell').then((m) => ({ default: m.ToolPageShell })),
);
const AllToolsPage = lazy(() =>
  import('./components/pages/AllToolsPage').then((m) => ({ default: m.AllToolsPage })),
);
const CategoriesPage = lazy(() =>
  import('./components/pages/CategoriesPage').then((m) => ({ default: m.CategoriesPage })),
);
const StaticAboutPage = lazy(() =>
  import('./components/pages/StaticPages').then((m) => ({ default: m.AboutPage })),
);
const StaticBlogPage = lazy(() =>
  import('./components/pages/StaticPages').then((m) => ({ default: m.BlogPage })),
);
const StaticContactPage = lazy(() =>
  import('./components/pages/StaticPages').then((m) => ({ default: m.ContactPage })),
);
const StaticPrivacyPage = lazy(() =>
  import('./components/pages/StaticPages').then((m) => ({ default: m.PrivacyPage })),
);
const StaticTermsPage = lazy(() =>
  import('./components/pages/StaticPages').then((m) => ({ default: m.TermsPage })),
);
const StaticNotFoundPage = lazy(() =>
  import('./components/pages/StaticPages').then((m) => ({ default: m.NotFoundPage })),
);
import { CATEGORIES } from './data/categories';
import { TOOLS, getToolBySlug } from './data/tools';
import { Tool } from './types';

export default function App() {
  // Seed the router from the real URL so deep links, refreshes and shared links
  // land on the right page. Cloudflare Pages serves index.html for any path
  // (see public/_redirects), so the pathname is the single source of truth.
  const readPathname = (): string => {
    if (typeof window === 'undefined') return '/';
    const { pathname } = window.location;
    if (!pathname || pathname === '/') return '/';
    // Treat /tools/ and /tools as the same route.
    return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  };

  const [currentPath, setCurrentPath] = useState<string>(readPathname);
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

  // Keep the document title in step with the client-side route, so browser
  // history, bookmarks and shared links are meaningful. The app has no SSR or
  // meta-framework, so this is the only place titles can be set.
  useEffect(() => {
    const base = 'Zorli — Simple Tools for a Smarter You';
    let title = base;

    if (currentPath === '/tools') {
      title = 'All Tools — Zorli';
    } else if (currentPath === '/categories') {
      title = 'Categories — Zorli';
    } else if (currentPath.startsWith('/categories/')) {
      const category = CATEGORIES.find((c) => c.slug === currentPath.replace('/categories/', ''));
      if (category) title = `${category.name} — Zorli`;
    } else if (currentPath.startsWith('/tools/')) {
      const parts = currentPath.replace('/tools/', '').split('/').filter(Boolean);
      const tool = getToolBySlug(parts.length > 1 ? parts[1] : parts[0]);
      if (tool) {
        title = `${tool.name}${tool.status === 'coming-soon' ? ' (Coming Soon)' : ''} — Zorli`;
      }
    } else if (currentPath !== '/') {
      title = `${currentPath.replace('/', '').replace(/^\w/, (c) => c.toUpperCase())} — Zorli`;
    }

    document.title = title;
  }, [currentPath]);

  // Support browser back/forward.
  useEffect(() => {
    const handlePopState = () => setCurrentPath(readPathname());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
    // readPathname is a pure function of window.location, safe to omit here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to top whenever route changes
  const handleNavigate = (path: string) => {
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
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

  // Lightweight route fallback — no spinner lib, no layout shift.
  const RouteFallback = (
    <div className="min-h-[50vh] flex items-center justify-center" aria-busy="true" aria-label="Loading page">
      <div className="w-10 h-10 rounded-full border-2 border-[#6657FF]/25 border-t-[#6657FF] animate-spin" />
    </div>
  );

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
        <Suspense fallback={RouteFallback}>
          <AllToolsPage
            onNavigateHome={() => handleNavigate('/')}
            onSelectTool={handleSelectTool}
            onSelectCategory={handleSelectCategory}
          />
        </Suspense>
      );
    }

    // 3. Categories Hub
    if (currentPath === '/categories') {
      return (
        <Suspense fallback={RouteFallback}>
          <CategoriesPage
            onNavigateHome={() => handleNavigate('/')}
            onSelectCategory={handleSelectCategory}
          />
        </Suspense>
      );
    }

    // 4. Specific Category Page: /categories/:slug
    if (currentPath.startsWith('/categories/')) {
      const categorySlug = currentPath.replace('/categories/', '');
      const category = CATEGORIES.find((c) => c.slug === categorySlug);
      if (category) {
        return (
          <Suspense fallback={RouteFallback}>
            <CategoryPage
              category={category}
              onNavigateHome={() => handleNavigate('/')}
              onSelectTool={handleSelectTool}
              onNavigateCategory={handleSelectCategory}
            />
          </Suspense>
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
          <Suspense fallback={RouteFallback}>
            <ToolPageShell
              tool={tool}
              onNavigateHome={() => handleNavigate('/')}
              onNavigateCategory={handleSelectCategory}
              onSelectTool={handleSelectTool}
            />
          </Suspense>
        );
      }
    }

    // 6. Static Pages
    if (currentPath === '/about') {
      return (
        <Suspense fallback={RouteFallback}>
          <StaticAboutPage
            onNavigateHome={() => handleNavigate('/')}
            onNavigateTools={() => handleNavigate('/tools')}
          />
        </Suspense>
      );
    }

    if (currentPath === '/blog') {
      return (
        <Suspense fallback={RouteFallback}>
          <StaticBlogPage
            onNavigateHome={() => handleNavigate('/')}
            onNavigateTools={() => handleNavigate('/tools')}
          />
        </Suspense>
      );
    }

    if (currentPath === '/contact') {
      return (
        <Suspense fallback={RouteFallback}>
          <StaticContactPage
            onNavigateHome={() => handleNavigate('/')}
            onNavigateTools={() => handleNavigate('/tools')}
          />
        </Suspense>
      );
    }

    if (currentPath === '/privacy') {
      return (
        <Suspense fallback={RouteFallback}>
          <StaticPrivacyPage
            onNavigateHome={() => handleNavigate('/')}
            onNavigateTools={() => handleNavigate('/tools')}
          />
        </Suspense>
      );
    }

    if (currentPath === '/terms') {
      return (
        <Suspense fallback={RouteFallback}>
          <StaticTermsPage
            onNavigateHome={() => handleNavigate('/')}
            onNavigateTools={() => handleNavigate('/tools')}
          />
        </Suspense>
      );
    }

    // 7. Not Found
    return (
      <Suspense fallback={RouteFallback}>
        <StaticNotFoundPage
          onNavigateHome={() => handleNavigate('/')}
          onNavigateTools={() => handleNavigate('/tools')}
        />
      </Suspense>
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

      {/* Global Command Palette / Search Modal (lazy: only loads when opened) */}
      {isSearchOpen && (
        <Suspense fallback={null}>
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectTool={handleSelectTool}
            onSelectCategory={handleSelectCategory}
          />
        </Suspense>
      )}
    </div>
  );
}
