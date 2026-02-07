"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/contexts/I18nContext";

type SectionId = 'top' | 'products' | 'contact';
const NAV_SECTIONS: SectionId[] = ['top', 'products', 'contact'];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('top');
  const manualActiveRef = useRef<SectionId | null>(null);
  const manualTimeoutRef = useRef<number | null>(null);
  const { t } = useI18n();

  const scrollToSection = (sectionId: SectionId) => {
    setIsMenuOpen(false);
    setActiveSection(sectionId);
    manualActiveRef.current = sectionId;
    if (manualTimeoutRef.current) {
      window.clearTimeout(manualTimeoutRef.current);
    }
    manualTimeoutRef.current = window.setTimeout(() => {
      manualActiveRef.current = null;
      manualTimeoutRef.current = null;
    }, 900);
    
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const headerOffset = 96;
    let ticking = false;

    const updateActiveSection = () => {
      if (manualActiveRef.current) {
        return;
      }

      const scrollPosition = window.scrollY + headerOffset;
      let current: SectionId = 'top';

      NAV_SECTIONS.forEach((sectionId) => {
        if (sectionId === 'top') {
          return;
        }

        const element = document.getElementById(sectionId);
        if (!element) {
          return;
        }

        const elementTop = element.offsetTop - headerOffset;
        if (scrollPosition >= elementTop) {
          current = sectionId;
        }
      });

      setActiveSection((prev) => (prev === current ? prev : current));
    };

    const handleScroll = () => {
      if (ticking) {
        return;
      }
      ticking = true;
      window.requestAnimationFrame(() => {
        updateActiveSection();
        ticking = false;
      });
    };

    updateActiveSection();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (manualTimeoutRef.current) {
        window.clearTimeout(manualTimeoutRef.current);
      }
    };
  }, []);

  const navLabels: Record<SectionId, string> = {
    top: t('nav.home'),
    products: t('nav.catalog'),
    contact: t('nav.contact'),
  };

  const navItems: Array<{ id: SectionId; label: string; target: SectionId }> = NAV_SECTIONS.map((sectionId) => ({
    id: sectionId,
    label: navLabels[sectionId],
    target: sectionId,
  }));

  return (
    <header className="bg-white border-b-2 border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl sm:text-3xl font-bold">
          <button 
            onClick={() => scrollToSection('top')} 
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-green-600">Sahyog</span>
            <span className="text-gray-800">Farm</span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-12">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.target)}
              className={`relative px-4 py-2 font-semibold transition-colors text-base tracking-wide ${
                activeSection === item.id ? 'text-emerald-600' : 'text-gray-700'
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-emerald-500 transition-all duration-300 ${
                  activeSection === item.id ? 'w-6 opacity-100' : 'w-0 opacity-0'
                }`}
              />
            </button>
          ))}
        </nav>

        {/* Language Switcher */}
        <div className="hidden md:block">
          <LanguageSwitcher />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-2xl text-gray-700 focus:outline-none hover:text-green-600 transition"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-gray-50 border-t border-gray-200 px-4 py-4 space-y-3 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.target)}
              className="block w-full text-left py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-green-50 hover:text-green-600"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2">
            <LanguageSwitcher className="w-full" />
          </div>
        </nav>
      )}
    </header>
  );
}