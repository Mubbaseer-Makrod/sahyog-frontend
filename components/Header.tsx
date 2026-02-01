"use client";

import React, { useState } from "react";
import { FaWhatsapp, FaBars, FaTimes } from "react-icons/fa";
import { getWhatsAppLink, contactConfig } from "@/config/contact";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    
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
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('top')} 
            className="text-gray-700 hover:text-green-600 transition font-medium"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('products')} 
            className="text-gray-700 hover:text-green-600 transition font-medium"
          >
            Catalog
          </button>
          <button 
            onClick={() => scrollToSection('contact')} 
            className="text-gray-700 hover:text-green-600 transition font-medium"
          >
            Contact
          </button>
        </nav>

        {/* Desktop WhatsApp Button */}
        <a
          href={getWhatsAppLink(contactConfig.whatsappMessages.general)}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex bg-green-600 text-white px-5 py-2.5 rounded-lg items-center gap-2 hover:bg-green-700 transition font-semibold shadow-sm hover:shadow-md"
        >
          <FaWhatsapp size={20} />
          <span>WhatsApp</span>
        </a>

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
          <button
            onClick={() => scrollToSection('top')}
            className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition font-medium"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('products')}
            className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition font-medium"
          >
            Catalog
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition font-medium"
          >
            Contact
          </button>
          <a
            href={getWhatsAppLink(contactConfig.whatsappMessages.general)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition font-semibold mt-2"
          >
            <FaWhatsapp size={20} />
            <span>Contact on WhatsApp</span>
          </a>
        </nav>
      )}
    </header>
  );
}