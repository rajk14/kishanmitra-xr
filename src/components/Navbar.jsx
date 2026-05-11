import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { translations } from '../i18n/translations';
import LanguageToggle from './LanguageToggle';
import SettingsModal from './SettingsModal';
import PricingModal from './PricingModal';
import { Menu, X, Leaf, Scan, Settings, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav_home || 'Home', path: '/' },
    { name: t.nav_history || 'History', path: '/history' },
    { name: t.nav_about || 'About', path: '/about' },
  ];

  return (
    <>
      <nav className={clsx(
        "fixed top-0 left-0 w-full z-[150] transition-all duration-500 border-b",
        isScrolled 
          ? "bg-background/80 backdrop-blur-xl py-3 border-border shadow-lg" 
          : "bg-transparent py-6 border-transparent"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <img 
                src="/logo.png" 
                alt="KisanMitra XR" 
                className="relative w-12 h-12 rounded-full object-cover border-2 border-primary/20 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-primary/10"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-2xl tracking-tighter text-text leading-none">
                Kisan<span className="text-primary italic">Mitra</span>
              </span>
              <span className="text-[10px] font-bold text-secondary tracking-[0.2em] uppercase mt-1">XR Intelligence</span>
            </div>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-8 mr-4">
              {navLinks.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className={clsx(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === link.path ? "text-primary" : "text-muted"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="hidden sm:block">
              <LanguageToggle />
            </div>

            {/* History Shortcut */}
            <Link 
              to="/history"
              className="p-2.5 bg-secondary/20 text-secondary rounded-xl hover:bg-secondary hover:text-background transition-all duration-300 shadow-lg shadow-secondary/10 border border-secondary/30"
              title={language === 'hi' ? 'इतिहास देखें' : 'View History'}
            >
              <Clock size={20} />
            </Link>

            {/* Settings Gear - ALWAYS VISIBLE */}
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 bg-primary/20 text-primary rounded-xl hover:bg-primary hover:text-background transition-all duration-300 shadow-lg shadow-primary/10 border border-primary/30"
              title="AI Settings"
            >
              <Settings size={20} className="animate-spin-slow" />
            </button>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-sm font-bold text-muted hover:text-primary transition-colors">Login</button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>

            {/* Scan Button (Desktop) */}
            <Link to="/diagnose" className="hidden sm:flex btn-primary py-2 px-6 text-sm">
              <Scan size={18} />
              <span className="ml-2">{t.scan_title}</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-text"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden bg-surface/95 backdrop-blur-xl border-b border-border absolute top-full left-0 w-full overflow-hidden shadow-2xl"
            >
              <div className="flex flex-col p-6 gap-6">
                {navLinks.map(link => (
                  <Link 
                    key={link.path} 
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={clsx(
                      "text-lg font-medium",
                      location.pathname === link.path ? "text-primary" : "text-muted"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <LanguageToggle />
                  <Link 
                    to="/diagnose" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary py-2 px-6 text-sm"
                  >
                    {t.scan_title}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
};

export default Navbar;
