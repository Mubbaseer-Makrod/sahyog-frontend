"use client";

import React from "react";
import Link from "next/link";
import { 
  FaWhatsapp, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaFacebook, 
  FaInstagram, 
  FaTwitter 
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="contact" className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20 relative z-10">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500"></div>
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Company Info */}
          <div className="space-y-5">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              <span className="text-green-400">Sahyog</span>
              <span className="text-white">Farm</span>
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted partner for quality tractors and farm equipment. 
              Empowering farmers with reliable machinery since 2020.
            </p>
            <div className="flex gap-4 mt-6">
              <a 
                href="#" 
                className="bg-gray-700 p-3 rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-110" 
                aria-label="Facebook"
              >
                <FaFacebook size={18} />
              </a>
              <a 
                href="#" 
                className="bg-gray-700 p-3 rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-110" 
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a 
                href="#" 
                className="bg-gray-700 p-3 rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-110" 
                aria-label="Twitter"
              >
                <FaTwitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="text-lg font-bold text-green-400 mb-4 pb-3 border-b-2 border-gray-700">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="text-green-400 group-hover:translate-x-1 transition-transform">›</span> 
                  <span className="group-hover:underline">Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/catalog" 
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="text-green-400 group-hover:translate-x-1 transition-transform">›</span> 
                  <span className="group-hover:underline">Our Catalog</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="text-green-400 group-hover:translate-x-1 transition-transform">›</span> 
                  <span className="group-hover:underline">About Us</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/services" 
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="text-green-400 group-hover:translate-x-1 transition-transform">›</span> 
                  <span className="group-hover:underline">Services</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="text-green-400 group-hover:translate-x-1 transition-transform">›</span> 
                  <span className="group-hover:underline">Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-5">
            <h4 className="text-lg font-bold text-green-400 mb-4 pb-3 border-b-2 border-gray-700">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <FaMapMarkerAlt className="text-green-400 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-300 leading-relaxed">
                  123 Farm Road, Agriculture District,<br />Your City, State 123456
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <FaPhone className="text-green-400 flex-shrink-0" size={18} />
                <a 
                  href="tel:+91XXXXXXXXXX" 
                  className="text-gray-300 hover:text-green-400 transition-colors hover:underline"
                >
                  +91 XXXX-XXX-XXX
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <FaEnvelope className="text-green-400 flex-shrink-0" size={18} />
                <a 
                  href="mailto:info@sahyogfarm.com" 
                  className="text-gray-300 hover:text-green-400 transition-colors hover:underline"
                >
                  info@sahyogfarm.com
                </a>
              </li>
            </ul>
          </div>

          {/* WhatsApp CTA */}
          <div className="space-y-5">
            <h4 className="text-lg font-bold text-green-400 mb-4 pb-3 border-b-2 border-gray-700">
              Get in Touch
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Have questions? Chat with us directly on WhatsApp for instant support!
            </p>
            <a
              href="https://wa.me/91XXXXXXXXXX?text=Hello%20I%20need%20assistance"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-green-700 active:scale-95 transition-all shadow-lg hover:shadow-xl"
            >
              <FaWhatsapp size={24} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} SahyogFarm. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-green-400 transition-colors hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-green-400 transition-colors hover:underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}