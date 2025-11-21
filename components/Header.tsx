
import React, { useState, useEffect } from 'react';
import { NAV_LINKS } from '../constants';
import { Button } from './Button';

interface HeaderProps {
  activeSection: string;
  onNavigate: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Text Only */}
          <div 
            className="flex-shrink-0 cursor-pointer flex items-center gap-3 group"
            onClick={() => onNavigate('hero')}
          >
            <span className={`font-bold text-xl tracking-tight ${scrolled ? 'text-stone-900' : 'text-stone-900'}`}>
              ThinkFirst
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  activeSection === link.id 
                    ? 'text-brand-600' 
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {link.title}
              </button>
            ))}
            <Button 
              size="sm" 
              onClick={() => onNavigate('playground')}
              className="ml-4 shadow-none"
            >
              Start Thinking
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-stone-500 hover:text-stone-900 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium text-stone-600 hover:text-brand-600 hover:bg-brand-50"
              >
                {link.title}
              </button>
            ))}
            <button
              onClick={() => {
                onNavigate('playground');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-3 rounded-lg text-base font-bold text-brand-600 hover:bg-brand-50"
            >
              Start Thinking
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
