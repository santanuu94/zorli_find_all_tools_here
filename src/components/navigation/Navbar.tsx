import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Menu, X, ArrowRight } from 'lucide-react';
import { ZorliLogo } from '../brand/ZorliLogo';
import { Button } from '../ui/Button';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  isDarkTheme?: boolean;
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenSearch,
  isDarkTheme = true,
  onToggleTheme,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Tools', path: '/tools' },
    { label: 'Categories', path: '/categories' },
    { label: 'About', path: '/about' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#070B24]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Zorli Logo (Consistent Signature Dark Theme Across Both Modes) */}
        <button
          onClick={() => onNavigate('/')}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6657FF] rounded-lg cursor-pointer"
        >
          <ZorliLogo theme="dark" size="md" />
        </button>

        {/* Center: Desktop Navigation Links (Consistent High-Contrast Styling) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              currentPath === link.path ||
              (link.path === '/categories' && currentPath.startsWith('/categories')) ||
              (link.path === '/tools' && currentPath.startsWith('/tools'));

            return (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
            title="Search tools (Cmd+K)"
            aria-label="Search tools"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button (Toggles Page Mode Without Changing Navbar) */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
              title={`Switch to ${isDarkTheme ? 'light' : 'dark'} mode`}
              aria-label="Toggle theme"
            >
              {isDarkTheme ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-300" />}
            </button>
          )}

          {/* Desktop "Get Started" CTA */}
          <div className="hidden sm:block">
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate('/tools')}
              className="!px-5 !py-2 text-sm shadow-md"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0D1438]/98 backdrop-blur-2xl border-b border-white/15 px-6 py-6 animate-in slide-in-from-top duration-200 shadow-2xl">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  onNavigate(link.path);
                  setIsMobileMenuOpen(false);
                }}
                className="text-left py-2 text-base font-medium text-slate-200 hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => {
                  onNavigate('/tools');
                  setIsMobileMenuOpen(false);
                }}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
